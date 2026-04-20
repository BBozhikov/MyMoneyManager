import cv2
import numpy as np
from PIL import Image, ImageOps, ImageEnhance, ImageFilter
import io


def process_receipt_image(image_path, max_size_mb: float = 0.95) -> io.BytesIO:
    if isinstance(image_path, str):
        img_bgr = cv2.imread(image_path)
    else:
        img_bgr = cv2.cvtColor(np.array(image_path), cv2.COLOR_RGB2BGR)

    if img_bgr is None:
        raise ValueError("Could not read image")

    original = img_bgr.copy()
    oh, ow = original.shape[:2]
    gray = cv2.cvtColor(original, cv2.COLOR_BGR2GRAY)

    left, right, top, bottom = _find_receipt_bounds(gray, oh, ow)

    crop_w = right - left
    crop_h = bottom - top
    if crop_w < ow * 0.25 or crop_h < oh * 0.25 or crop_w > ow * 0.98 or crop_h > oh * 0.98:
        left, right = int(ow * 0.03), int(ow * 0.97)
        top, bottom = int(oh * 0.02), int(oh * 0.98)

    pad = 15
    left   = max(0, left - pad)
    right  = min(ow, right + pad)
    top    = max(0, top - pad)
    bottom = min(oh, bottom + pad)

    cropped_bgr = original[top:bottom, left:right]
    img_pil = Image.fromarray(cv2.cvtColor(cropped_bgr, cv2.COLOR_BGR2RGB))
    img_pil = ImageOps.exif_transpose(img_pil)
    img_pil = img_pil.convert('L')
    img_pil = ImageEnhance.Contrast(img_pil).enhance(1.3)
    img_pil = img_pil.filter(ImageFilter.SHARPEN)

    quality = 85
    scale = 1.0
    while scale > 0.3:
        working = img_pil.resize(
            (int(img_pil.width * scale), int(img_pil.height * scale)),
            Image.Resampling.LANCZOS
        ) if scale < 1.0 else img_pil

        output = io.BytesIO()
        working.save(output, format='JPEG', quality=quality, optimize=True)
        size_mb = output.tell() / (1024 * 1024)

        if size_mb <= max_size_mb:
            output.seek(0)
            return output

        if quality > 50:
            quality -= 10
        else:
            scale -= 0.1
            quality = 85

    output.seek(0)
    return output


def _find_receipt_bounds(gray, oh, ow):
    bright_mask = (gray > 180).astype(np.uint8)
    col_counts = np.sum(bright_mask, axis=0)
    row_counts = np.sum(bright_mask, axis=1)

    receipt_cols = np.where(col_counts > oh * 0.08)[0]
    receipt_rows = np.where(row_counts > ow * 0.05)[0]

    if len(receipt_cols) > 20 and len(receipt_rows) > 20:
        left, right = _largest_block(receipt_cols)
        top, bottom = _largest_block(receipt_rows)
        if right - left > ow * 0.2 and bottom - top > oh * 0.2:
            return left, right, top, bottom

    img_p95 = float(np.percentile(gray, 95))
    adaptive_thresh = max(100, img_p95 * 0.65)

    col_means = np.mean(gray, axis=0)
    bright_cols = np.where(col_means > adaptive_thresh)[0]

    if len(bright_cols) > 20:
        left  = int(bright_cols[0])
        right = int(bright_cols[-1])
        strip_means = np.mean(gray[:, left:right], axis=1)
        bright_rows = np.where(strip_means > adaptive_thresh * 0.8)[0]
        if len(bright_rows) > 20:
            top, bottom = _largest_block(bright_rows)
            if right - left > ow * 0.2 and bottom - top > oh * 0.2:
                return left, right, top, bottom

    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, otsu = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (20, 20))
    cleaned = cv2.morphologyEx(otsu, cv2.MORPH_CLOSE, kernel)
    cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_OPEN, kernel)

    contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        biggest = max(contours, key=cv2.contourArea)
        if cv2.contourArea(biggest) > oh * ow * 0.05:
            x, y, w, h = cv2.boundingRect(biggest)
            if w > ow * 0.2 and h > oh * 0.2:
                return x, x + w, y, y + h

    return int(ow * 0.03), int(ow * 0.97), int(oh * 0.02), int(oh * 0.98)


def _largest_block(indices):
    if len(indices) == 0:
        return 0, 0
    best_start = best_end = cur_start = indices[0]
    max_len = 1
    for i in range(1, len(indices)):
        if indices[i] <= indices[i - 1] + 5:
            cur_len = indices[i] - cur_start
            if cur_len > max_len:
                max_len = cur_len
                best_start = cur_start
                best_end = indices[i]
        else:
            cur_start = indices[i]
    return int(best_start), int(best_end)
