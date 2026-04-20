import requests
import io
from config import OCR_API_URL, OCR_API_KEY


def extract_text(image_source: io.BytesIO, use_table: bool = True) -> str | None:
    image_source.seek(0)

    payload = {
        'apikey': OCR_API_KEY,
        'language': 'auto',
        'isOverlayRequired': False,
        'detectOrientation': True,
        'scale': True,
        'OCREngine': 2,
        'isTable': use_table,
    }

    response = requests.post(
        OCR_API_URL,
        files={'file': ('receipt.jpg', image_source, 'image/jpeg')},
        data=payload
    )
    result = response.json()

    if result.get('IsErroredOnProcessing'):
        print(f"OCR Error: {result.get('ErrorMessage')}")
        return None

    if result.get('ParsedResults'):
        return result['ParsedResults'][0]['ParsedText']

    return None
