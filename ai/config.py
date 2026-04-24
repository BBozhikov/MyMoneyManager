import os
from dotenv import load_dotenv

load_dotenv()

OCR_API_URL   = os.getenv("OCR_API_URL", "https://api.ocr.space/parse/image")
OCR_API_KEY   = os.getenv("OCR_API_KEY")
TESSERACT_CMD = os.getenv("TESSERACT_CMD", "/usr/bin/tesseract")
MODEL_PATH    = os.getenv("MODEL_PATH", "categorization/models/bert_receipt")

if not OCR_API_KEY:
    raise EnvironmentError("Missing required environment variable: OCR_API_KEY")