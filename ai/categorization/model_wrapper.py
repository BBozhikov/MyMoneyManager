import os
import json
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from config import MODEL_PATH


class ReceiptClassifier:

    def __init__(self):
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Trained model not found at {MODEL_PATH}")
        
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        self.model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH).to(self.device)
        self.model.eval()

        with open(os.path.join(MODEL_PATH, 'label_mappings.json'), encoding='utf-8') as f:
            mappings = json.load(f)

        self.id2label = {int(k): v for k, v in mappings["id2label"].items()}
        self.label2id = {v: int(k) for k, v in mappings["id2label"].items()}

    def predict(self, item_name: str) -> dict:
        inputs = self.tokenizer(
            item_name,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=64
        )
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        with torch.no_grad():
            probs = torch.nn.functional.softmax(
                self.model(**inputs).logits, dim=-1
            )[0]

        predicted_id = torch.argmax(probs).item()

        return {
            "category": self.id2label[predicted_id],
            "confidence": round(probs[predicted_id].item(), 4),
            "label_id": predicted_id
        }

