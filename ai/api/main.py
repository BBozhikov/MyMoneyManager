from fastapi import FastAPI
from api.routes.receipt import router
from categorization.model_wrapper import ReceiptClassifier

app = FastAPI(title="MyMoneyManager OCR API", version="1.0.0")
app.include_router(router=router, prefix="/api/v2")

@app.on_event("startup")
async def startup():
    app.state.classifier = ReceiptClassifier()
    print("Classifier model load successfully and ready")

@app.get("/health")
def health():
    return {"status": "ok"}