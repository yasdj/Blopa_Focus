from pydantic import BaseModel
from typing import Any, Dict, Optional, List


class AnalyzeBody(BaseModel):
    user_message: str
    user_settings: Dict[str, Any] = {}
    task_id: Optional[str] = None


class AnalyzeResult(BaseModel):
    tasks: List[str]
    time: str
    mood: str
