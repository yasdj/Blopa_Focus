from fastapi import APIRouter, Form, HTTPException, UploadFile, File
from pydantic import BaseModel

from app.services.gemini_service import generate_tasks, validate_task_with_image
from app.services.user_service import UserService


router = APIRouter(prefix="/tasks", tags=["Tasks"])


class GenerateTasksRequest(BaseModel):
    user_id: str
    context: str
    time: int
    mood: str
    energy_level: str


@router.post("/generate")
def generate_tasks_route(body: GenerateTasksRequest):
    tasks = generate_tasks(
        context=body.context,
        time=body.time,
        mood=body.mood,
        energy_level=body.energy_level,
    )

    if not tasks:
        raise HTTPException(status_code=500, detail="Failed to generate tasks")

    UserService.add_tasks(body.user_id, tasks)

    return {"tasks": tasks}


@router.post("/validate")
async def validate_task_route(
    user_id: str = Form(...),
    task: str = Form(...),
    image: UploadFile = File(...),
):
    image_bytes = await image.read()

    result = validate_task_with_image(
        task=task,
        image_bytes=image_bytes,
        mime_type=image.content_type or "image/jpeg",
    )

    if result["valid"]:
        UserService.complete_task(user_id=user_id, task=task)

    return result
