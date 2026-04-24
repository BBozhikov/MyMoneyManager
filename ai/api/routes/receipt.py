from fastapi import APIRouter, UploadFile, File, Request, HTTPException
from api.schemas import ReceiptResult
from image_processing.preprocessor import process_receipt_image
from ocr.ocr_service import get_receipt_text
from extraction.receipt_text_parser import parse_receipt_text
import io

router = APIRouter()


@router.post("/parse-receipt", response_model=ReceiptResult)
async def handle_parse_receipt(
    request: Request,
    file: UploadFile = File(...),
    categorize: bool = False
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await file.read()
    image_bytes = process_receipt_image(io.BytesIO(contents))

    text = get_receipt_text(image_bytes)
    if not text:
        raise HTTPException(status_code=422, detail="Could not extract text from image")

    parsed = parse_receipt_text(text)

    print(text)

    parsed["total_bgn"] = parsed.pop("total_bgn", None)
    parsed["total_euro"] = parsed.pop("total_eur", None)

    if categorize and parsed.get("items"):
        classifier = request.app.state.classifier
        for item in parsed["items"]:
            result = classifier.predict(item["name"])
            item["category"] = result["category"]

    return ReceiptResult(**parsed)