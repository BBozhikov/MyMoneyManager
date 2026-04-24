import os
import json
import time
import torch
import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from training_data.dataset import (
    food_items, restaurant_items, household_items,
    healthcare_items, trasportation_items, education_items, entertainment_items
)
from categorization.training.labels import LABEL2ID, ID2LABEL, LABEL2ID_EN, ID2LABEL_EN, CATEGORY_NAMES


LOCAL_MODEL_PATH = "./bert-base-bg-cs-pl-ru-cased"
OUTPUT_PATH = "./categorization/models/bert_receipt"


def build_dataset() -> pd.DataFrame:
    all_texts, all_labels = [], []
    categories = [
        (food_items, 0), (restaurant_items, 1), (trasportation_items, 2),
        (healthcare_items, 3), (household_items, 4),
        (entertainment_items, 5), (education_items, 6)
    ]
    for items, label in categories:
        all_texts.extend(items)
        all_labels.extend([label] * len(items))
    return pd.DataFrame({'text': all_texts, 'label': all_labels})


def train():
    if not torch.cuda.is_available():
        raise RuntimeError("CUDA not available. Install PyTorch with CUDA support.")

    if not os.path.exists(LOCAL_MODEL_PATH):
        raise FileNotFoundError(f"Model not found at {LOCAL_MODEL_PATH}")

    device = torch.device("cuda")

    df = build_dataset()
    print(f"Training examples: {len(df)}")

    tokenizer = AutoTokenizer.from_pretrained(LOCAL_MODEL_PATH)
    model = AutoModelForSequenceClassification.from_pretrained(
        LOCAL_MODEL_PATH,
        num_labels=len(LABEL2ID),
        local_files_only=True
    ).to(device)

    dataset = Dataset.from_pandas(df)
    tokenized = dataset.map(
        lambda x: tokenizer(x['text'], padding='max_length', truncation=True, max_length=64),
        batched=True
    )

    training_args = TrainingArguments(
        output_dir='./categorization/models/checkpoints',
        num_train_epochs=15,
        per_device_train_batch_size=32,
        learning_rate=2e-5,
        logging_steps=20,
        save_strategy='epoch',
        save_total_limit=2,
        fp16=True,
        dataloader_pin_memory=True,
        dataloader_num_workers=4,
        gradient_accumulation_steps=1,
        warmup_steps=100,
        logging_dir='./logs',
    )

    trainer = Trainer(model=model, args=training_args, train_dataset=tokenized)

    start = time.time()

    trainer.train()
 
    print(f"Training complete in {(time.time() - start) / 60:.2f} minutes")

    os.makedirs(OUTPUT_PATH, exist_ok=True)
    trainer.save_model(OUTPUT_PATH)
    tokenizer.save_pretrained(OUTPUT_PATH)

    with open(f'{OUTPUT_PATH}/label_mappings.json', 'w', encoding='utf-8') as f:
        json.dump({
            'label2id': LABEL2ID,
            'id2label': ID2LABEL,
            'label2id_en': LABEL2ID_EN,
            'id2label_en': ID2LABEL_EN
        }, f, ensure_ascii=False, indent=2)

    print(f"Model saved to {OUTPUT_PATH}")


if __name__ == "__main__":
    train()
