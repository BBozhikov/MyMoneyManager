from ocr.ocr_client import extract_text
from ocr.tesseract_local_ocr import extract_text_tesseract


def get_receipt_text(image_path: str) -> str | None:
    try:
        text = extract_text(image_path)
        if text:
            return text
        print("OCR API returned empty result, falling back to Tesseract")
    except Exception as e:
        print(f"OCR API failed: {e}, falling back to Tesseract")

    return extract_text_tesseract(image_path)
