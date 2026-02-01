from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.user_service import UserService


router = APIRouter(prefix="/users", tags=["Users"])


# -----------------------------
# Request models
# -----------------------------
class RegisterRequest(BaseModel):
    email: str
    mdp: str
    name: str
    filepath: str


class LoginRequest(BaseModel):
    email: str
    mdp: str


# -----------------------------
# Routes
# -----------------------------
@router.post("/register")
def register(body: RegisterRequest):
    user_id = UserService.create_user(
        email=body.email,
        mdp=body.mdp,
        name=body.name,
        filepath=body.filepath,
    )

    return {"message": "User created", "user_id": user_id}


@router.post("/login")
def login(body: LoginRequest):
    user = UserService.get_user(body.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.get("mdp") != body.mdp:
        raise HTTPException(status_code=401, detail="Wrong password")

    return {
        "id": user.get("id"),
        "email": user.get("email"),
        "name": user.get("name"),
        "status": user.get("status"),
        "filepath": user.get("filepath"),
        "tasks_completed": user.get("tasks_completed"),
        "birthday": user.get("birthday"),
    }
