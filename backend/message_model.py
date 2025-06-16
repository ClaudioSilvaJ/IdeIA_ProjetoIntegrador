from pydantic import BaseModel
from typing import Optional

class MessageModel(BaseModel):
    message: str
    timestamp: Optional[str] = None