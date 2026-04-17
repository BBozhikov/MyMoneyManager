import requests
from config import OCR_API_URL, OCR_API_KEY


def extract_text(image_path: str, use_table: bool = True) -> str | None:
    with open(image_path, 'rb') as f:
        payload = {
            'apikey': OCR_API_KEY,
            'language': 'auto',
            'isOverlayRequired': False,
            'detectOrientation': True,
            'scale': True,
            'OCREngine': 2,
            'isTable': use_table,
        }
        response = requests.post(OCR_API_URL, files={'file': f}, data=payload)

    result = response.json()

    if result.get('IsErroredOnProcessing'):
        print(f"OCR Error: {result.get('ErrorMessage')}")
        return None

    if result.get('ParsedResults'):
        return result['ParsedResults'][0]['ParsedText']

    return None
