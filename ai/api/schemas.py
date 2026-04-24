from pydantic import BaseModel
from typing import Optional, List


class ReceiptItem(BaseModel):

    name: str
    price: Optional[float] = None
    category: Optional[str] = None


class ReceiptResult(BaseModel):

    store_name: Optional[str] = None
    date: Optional[str] = None
    items: List[ReceiptItem] = []
    total_bgn: Optional[float] = None
    total_euro: Optional[float] = None
