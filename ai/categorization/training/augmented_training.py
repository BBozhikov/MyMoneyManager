import os
import json
import time
import torch
import numpy as np
import pandas as pd
from datasets import Dataset
from sklearn.model_selection import train_test_split
from sklearn.utils import resample
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from training_data import (
    food_items, restaurant_items, household_items,
    healthcare_items, trasportation_items, entertainment_items, education_items
)
from categorization.training.labels import LABEL2ID, ID2LABEL, CATEGORY_NAMES


LOCAL_MODEL_PATH = "./bert-base-bg-cs-pl-ru-cased"
OUTPUT_PATH = "./categorization/models/bert_receipt"


def augment_data(items: list) -> list:
    augmented = []
    for item in items:
        augmented.extend([
            item,
            f"{item} *",
            f"{item}*",
            f"{item} 1БР",
            f"{item} X1",
            item.lower(),
            f" {item} ",
            f"{item} 1",
            f"1X {item}",
        ])
    return list(set(augmented))


def build_balanced_dataset() -> tuple[pd.DataFrame, pd.DataFrame]:
    categories = [
        (food_items, 0), (restaurant_items, 1), (trasportation_items, 2),
        (healthcare_items, 3), (household_items, 4),
        (entertainment_items, 5), (education_items, 6)
    ]

    all_texts, all_labels = [], []
    for items, label in categories:
        augmented = augment_data(items)
        all_texts.extend(augmented)
        all_labels.extend([label] * len(augmented))

    df = pd.DataFrame({'text': all_texts, 'label': all_labels})

    min_samples = df['label'].value_counts().min()
    target_size = max(min_samples, 150)

    balanced = []
    for label in range(7):
        class_df = df[df['label'] == label]
        if len(class_df) < target_size:
            class_df = resample(class_df, n_samples=target_size, replace=True, random_state=42)
        balanced.append(class_df)

    df = pd.concat(balanced, ignore_index=True).sample(frac=1, random_state=42)
    return train_test_split(df, test_size=0.15, stratify=df['label'], random_state=42)


def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, preds, average='weighted', zero_division=0
    )
    return {
        'accuracy': accuracy_score(labels, preds),
        'f1': f1,
        'precision': precision,
        'recall': recall
    }


def train():
    if not torch.cuda.is_available():
        raise RuntimeError("CUDA not available. Install PyTorch with CUDA support.")

    if not os.path.exists(LOCAL_MODEL_PATH):
        raise FileNotFoundError(f"Model not found at {LOCAL_MODEL_PATH}")

    device = torch.device("cuda")

    train_df, val_df = build_balanced_dataset()
    print(f"Train: {len(train_df)} | Validation: {len(val_df)}")

    tokenizer = AutoTokenizer.from_pretrained(LOCAL_MODEL_PATH)
    model = AutoModelForSequenceClassification.from_pretrained(
        LOCAL_MODEL_PATH,
        num_labels=len(LABEL2ID),
        local_files_only=True
    ).to(device)

    def tokenize(examples):
        return tokenizer(examples['text'], padding='max_length', truncation=True, max_length=64)

    train_tokenized = Dataset.from_pandas(train_df).map(tokenize, batched=True)
    val_tokenized = Dataset.from_pandas(val_df).map(tokenize, batched=True)

    training_args = TrainingArguments(
        output_dir='./categorization/models/checkpoints',
        num_train_epochs=20,
        per_device_train_batch_size=48,
        per_device_eval_batch_size=48,
        learning_rate=3e-5,
        warmup_ratio=0.1,
        weight_decay=0.01,
        eval_strategy='epoch',
        save_strategy='epoch',
        load_best_model_at_end=True,
        metric_for_best_model='f1',
        greater_is_better=True,
        logging_steps=10,
        logging_dir='./logs',
        report_to='none',
        fp16=True,
        dataloader_pin_memory=True,
        dataloader_num_workers=6,
        save_total_limit=2,
        seed=42,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_tokenized,
        eval_dataset=val_tokenized,
        compute_metrics=compute_metrics,
    )

    start = time.time()

    trainer.train()
    
    training_time = time.time() - start
    
    print(f"Training complete in {training_time / 60:.2f} minutes")

    eval_results = trainer.evaluate()
    print(f"Accuracy: {eval_results['eval_accuracy']:.4f} | F1: {eval_results['eval_f1']:.4f}")

    os.makedirs(OUTPUT_PATH, exist_ok=True)
    trainer.save_model(OUTPUT_PATH)
    tokenizer.save_pretrained(OUTPUT_PATH)

    with open(f'{OUTPUT_PATH}/label_mappings.json', 'w', encoding='utf-8') as f:
        json.dump({'label2id': LABEL2ID, 'id2label': ID2LABEL}, f, ensure_ascii=False, indent=2)

    with open(f'{OUTPUT_PATH}/training_info.json', 'w', encoding='utf-8') as f:
        json.dump({
            'training_time_seconds': training_time,
            'train_examples': len(train_df),
            'val_examples': len(val_df),
            'eval_accuracy': float(eval_results['eval_accuracy']),
            'eval_f1': float(eval_results['eval_f1']),
            'gpu': torch.cuda.get_device_name(0),
            'categories': CATEGORY_NAMES
        }, f, ensure_ascii=False, indent=2)

    print(f"Model saved to {OUTPUT_PATH}")


if __name__ == "__main__":
    train()
