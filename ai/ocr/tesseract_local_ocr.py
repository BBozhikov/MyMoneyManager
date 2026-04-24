import pytesseract
from PIL import Image
from config import TESSERACT_CMD

pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD


def extract_text_tesseract(image_path: str) -> str | None:
    try:
        img = Image.open(image_path)
        text = pytesseract.image_to_string(img, lang='bul+eng')
        return text if text.strip() else None
    except Exception as e:
        print(f"Tesseract error: {e}")
        return None
