LABEL2ID = {
    'храна': 0,
    'ресторант': 1,
    'транспорт': 2,
    'здравеопазване': 3,
    'домакинство': 4,
    'забавление': 5,
    'образование': 6
}

ID2LABEL = {v: k for k, v in LABEL2ID.items()}

LABEL2ID_EN = {
    'food': 0,
    'restaurant': 1,
    'transportation': 2,
    'healthcare': 3,
    'household': 4,
    'entertainment': 5,
    'education': 6
}

ID2LABEL_EN = {v: k for k, v in LABEL2ID_EN.items()}

CATEGORY_NAMES = list(LABEL2ID.keys())