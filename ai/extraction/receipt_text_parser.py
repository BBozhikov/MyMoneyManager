import re
import json


def parse_receipt_text(ocr_text: str) -> dict:
    ocr_text = ocr_text.replace('\t', '  ')  # problem with hardcodes tabs
    lines = [l.strip() for l in ocr_text.splitlines() if l.strip()]

    result = {
        "store_name": None,
        "date": None,
        "time": None,
        "total_bgn": None,
        "total_eur": None,
        "items": []
    }

    result["store_name"] = extract_store_name(ocr_text)

    date_pattern = re.compile(r'\b(\d{2}[./\-]\d{2}[./\-]\d{4})\b')
    time_pattern = re.compile(r'\b(\d{2}:\d{2}:\d{2})\b')
    for line in lines:
        if not result["date"]:
            m = date_pattern.search(line)
            if m: result["date"] = m.group(1)
        if not result["time"]:
            m = time_pattern.search(line)
            if m: result["time"] = m.group(1)

    p_bgn = re.compile(r'ОБЩА СУМА\s+(?:В\s+)?(?:ЛВ\.?|ЛЕВА)\s+([\d.,]+)', re.IGNORECASE)
    p_eur = re.compile(r'ОБЩА СУМА\s+ЕВРО\s+([\d.,]+)', re.IGNORECASE)
    for line in lines:
        m = p_bgn.search(line)
        if m: result["total_bgn"] = float(m.group(1).replace(',', '.'))
        m = p_eur.search(line)
        if m: result["total_eur"] = float(m.group(1).replace(',', '.'))

    result["items"] = extract_items(lines)
    return result


def extract_store_name(text: str) -> str:
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    if not lines:
        return "Unknown Store"

    for line in lines[:3]:
        m = re.search(r'"([^"]+)"\s*(ЕООД|ООД|АД)\b', line)
        if m:
            return f'"{m.group(1)}" {m.group(2)}'

    text_upper = text.upper()
    known_stores = [
        r'\b(КАУФЛАНД|KAUFLAND)\b', r'\b(ЛИДЛ|LIDL)\b',
        r'\b(БИЛЛА|BILLA)\b',       r'\b(ФАНТАСТИКО|FANTASTICO)\b',
        r'\b(МЕТРО|METRO)\b',       r'\b(ЦБА|CBA)\b',
        r'\b(ТЕХНОМАРКЕТ|TECHNOMARKET)\b', r'\b(ТЕХНОПОЛИС|TECHNOPOLIS)\b',
        r'\b(ДМ|DM)\b',             r'\b(ЕКО|ЕКО)\b',
        r'\b(ЛУКОЙЛ|LUKOIL)\b',     r'\b(ШЕЛ|SHELL)\b',
        r'\b(Т-МАРКЕТ|T-MARKET)\b', r'\b(МАКДОНАЛДС|MCDONALDS|MC DONALDS)\b',
        r'\b(КФС|KFC)\b',           r'\b(АПТЕКИ МАРЕШКИ|MARESHKI)\b',
    ]
    for pattern in known_stores:
        m = re.search(pattern, text_upper)
        if m:
            return m.group(1)

    for line in lines[:3]:
        m = re.search(r'\b(ЕООД|ООД|АД)\b', line)
        if m:
            company = line[:m.start()].strip().strip('"\'')
            if company and len(company) > 2 and not re.search(
                r'(БУЛ\.|УЛ\.|ПЛ\.|ЕИК|ЗДДС|АДРЕС|СОФИЯ|ВАРНА|ПЛОВДИВ)', company.upper()):
                return f'{company} {m.group(1)}'

    for line in lines[:3]:
        if len(line) > 3 and not re.search(r'(БУЛ\.|УЛ\.|ПЛ\.|ЕИК|ЗДДС)', line.upper()):
            return line

    return "Unknown Store"


def extract_items(lines: list) -> list:
    items = []

    p_standard = re.compile(
        r'^(?!#)(.+?)\s{2,}(-?[\d]+(?:[\s]+|[.,])[\d]{2})\s*[Б5бBb]?\s*$'
    )
    p_billa = re.compile(
        r'^(?!#)(.+?)\s+\*[Б5бBb]\s+(-?[\d]+[.,][\d]{2})\s*$'
    )
    p_suma_neto = re.compile(
        r'^СУМА НЕТО:\s+(-?[\d]+[.,][\d]{2})\s*[Б5бBb]?\s*$', re.IGNORECASE
    )
    skip_patterns = re.compile(
        r'(ОБЩА СУМА|ОБМЕНЕН КУРС|ОБМ\. КУРС|ПЛАТЕНО|КРЕДИТНА|ДЕБИТНА|'
        r'УНП|ЕИК|ЗДДС|ОПЕРАТОР|КАСА|БОН|НУЛ|ПОКУПКА|КУРС|АРТИКУЛ|'
        r'БЛАГОДАРИМ|ЗАПАЗЕТЕ|КАСИЕР)',
        re.IGNORECASE
    )
    section_start = re.compile(r'(КАСИЕР|ИД\.?\s*NO|УНП:|ПРОДАЖБА)', re.IGNORECASE)
    section_end   = re.compile(r'ОБЩА СУМА', re.IGNORECASE)

    in_section = False
    pending_pharmacy_name = None

    for line in lines:
        if section_start.search(line):
            in_section = True
            continue
        if section_end.search(line):
            in_section = False
            pending_pharmacy_name = None
            continue

        if not in_section or skip_patterns.search(line):
            continue

        if line.startswith('#') and len(line) > 2:
            pending_pharmacy_name = line.lstrip('#').strip()
            continue

        m = p_suma_neto.match(line)
        if m and pending_pharmacy_name:
            items.append({"name": pending_pharmacy_name, "price": float(m.group(1).replace(',', '.'))})
            pending_pharmacy_name = None
            continue

        pending_pharmacy_name = None

        m = p_billa.match(line)
        if m:
            items.append({"name": m.group(1).strip(), "price": float(m.group(2).replace(',', '.'))})
            continue

        m = p_standard.match(line)
        if m:
            raw = re.sub(r'\s+', '.', m.group(2).strip()).replace(',', '.')
            try:
                items.append({"name": m.group(1).strip(), "price": float(raw)})
            except ValueError:
                pass

    return items
