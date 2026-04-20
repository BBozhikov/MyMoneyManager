from image_processing.preprocessor import process_receipt_image
from ocr.ocr_service import get_receipt_text
from extraction.receipt_text_parser import parse_receipt_text

IMAGE_PATH = "tests/assets/test_image.jpg"

image_bytes = process_receipt_image(IMAGE_PATH)
text = get_receipt_text(image_bytes)
parsed = parse_receipt_text(text)

print(parsed)