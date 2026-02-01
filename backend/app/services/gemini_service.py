from typing import List

from google import genai
from pydantic import BaseModel, Field

from app.core.config import GEMINI_API_KEY, GEMINI_MODEL
from app.api.gemini_setting import SYSTEM_PROMPT


class TasksOut(BaseModel):
    tasks: List[str] = Field(description="A Python list of short, actionable tasks.")


class ValidationOut(BaseModel):
    valid: bool = Field(description="True if the image proves the task was completed.")
    reason: str = Field(description="Short explanation.")
    confidence: float = Field(description="0.0 to 1.0 confidence score.")


def _client() -> genai.Client:
    return genai.Client(api_key=GEMINI_API_KEY)


def _tasks_prompt(context: str, time: int, mood: str, energy_level: str) -> str:
    return f"""
{SYSTEM_PROMPT}

You are a productivity micro-goals assistant.
Generate ONLY tiny tasks that can be completed quickly and are easy to validate with a photo.

Constraints:
- Output must be JSON that matches this schema: {{ "tasks": [string, ...] }}
- Each task must be 2–8 words max
- Exactly 3 to 6 tasks
- Tasks must fit in {time} minutes total
- Mood: {mood}
- Energy level: {energy_level}

Context:
{context}
""".strip()


def _validate_prompt(task: str) -> str:
    return f"""
{SYSTEM_PROMPT}

You are an AI validator.
Your job: decide if the photo is clear evidence the user completed the task.

Task:
{task}

Rules:
- Output ONLY JSON that matches schema: {{ "valid": bool, "reason": string, "confidence": number }}
- If unclear / blurry / not enough proof => valid=false
- Keep reason short (1 sentence).
""".strip()


def generate_tasks(context: str, time: int, mood: str, energy_level: str) -> List[str]:
    """
    Returns a Python list[str] of micro-tasks.
    """
    if not GEMINI_API_KEY:
        return []

    client = _client()
    prompt = _tasks_prompt(context=context, time=time, mood=mood, energy_level=energy_level)

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_json_schema": TasksOut.model_json_schema(),
        },
    )

    text = getattr(response, "text", "") or ""
    try:
        out = TasksOut.model_validate_json(text)
        # extra safety: make sure every item is a string and non-empty
        return [t.strip() for t in out.tasks if isinstance(t, str) and t.strip()]
    except Exception:
        return []


def validate_task_with_image(task: str, image_bytes: bytes, mime_type: str = "image/jpeg") -> dict:
    """
    Returns: { valid: bool, reason: str, confidence: float }
    """
    if not GEMINI_API_KEY:
        return {"valid": False, "reason": "Missing API key", "confidence": 0.0}

    client = _client()
    prompt = _validate_prompt(task)

    from google.genai import types  # import here to keep file simple

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[
            prompt,
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
        ],
        config={
            "response_mime_type": "application/json",
            "response_json_schema": ValidationOut.model_json_schema(),
        },
    )

    text = getattr(response, "text", "") or ""
    try:
        out = ValidationOut.model_validate_json(text)

        conf = float(out.confidence)
        conf = max(0.0, min(1.0, conf))

        return {"valid": bool(out.valid), "reason": out.reason, "confidence": conf}
    except Exception:
        return {"valid": False, "reason": "Failed to parse model output", "confidence": 0.0}
