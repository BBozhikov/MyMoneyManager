import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'trained_receipt_classifier2')
# you can execute this script from everywhere in the project now
# exit()

CATEGORIES = {
    0: 'храна (food)',
    1: 'ресторант (restaurant)',
    2: 'транспорт (transportation)',
    3: 'здравеопазване (healthcare)',
    4: 'домакинство (household)',
    5: 'забавление (entertainment)',
    6: 'образование (education)',
}

def load_model():
    if not os.path.exists(MODEL_PATH):
        print(f"ERROR: Trained model not found at '{MODEL_PATH}'")
        print("Run training.py or augmented_training.py first to train the model.")
        exit(1)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}\n")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
    model = model.to(device)
    model.eval()
    return tokenizer, model, device


def predict(text, tokenizer, model, device):
    inputs = tokenizer(
        text,
        return_tensors='pt',
        padding=True,
        truncation=True,
        max_length=64
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)[0]
        predicted_class = torch.argmax(probs).item()
        confidence = probs[predicted_class].item()

    return predicted_class, confidence, probs


def print_result(text, predicted_class, confidence, probs):
    category = CATEGORIES[predicted_class]
    print(f"\nInput:      {text}")
    print(f"Predicted:  {category}  ({confidence:.1%} confidence)")
    print("All scores:")
    for idx, prob in enumerate(probs):
        bar = '█' * int(prob.item() * 20)
        print(f"  {CATEGORIES[idx]:<35} {prob.item():.1%}  {bar}")


def main():
    print("=" * 55)
    print("  RECEIPT ITEM CLASSIFIER - INTERACTIVE CONSOLE SCRIPT")
    print("=" * 55)

    tokenizer, model, device = load_model()

    test_items = [
        'КРИЛЦА ПАНИРАНИ КРИСПИ',
        # 'КАФЕ ЕСПРЕСО',
        # 'ТАКСИ',
        # 'АСПИРИН',
        # 'ПРАХ ЗА ПРАНЕ',
        # 'КИНО БИЛЕТ',
        # 'УЧЕБНИК',
    ]

    print("--- Batch test ---")
    for item in test_items:
        predicted_class, confidence, probs = predict(item, tokenizer, model, device)
        print_result(item, predicted_class, confidence, probs)

    # Interactive mode
    print("\n" + "=" * 55)
    print("  INTERACTIVE MODE  (type 'quit' to exit)")
    print("=" * 55)

    while True:
        word = input("\nEnter item to classify: ").strip()
        if word.lower() in ('quit', 'exit', 'q'):
            break
        if not word:
            continue
        predicted_class, confidence, probs = predict(word, tokenizer, model, device)
        print_result(word, predicted_class, confidence, probs)


if __name__ == "__main__":
    main()
