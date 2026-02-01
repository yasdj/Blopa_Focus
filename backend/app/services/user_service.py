from typing import Optional, List
from datetime import datetime
from app.db.mongodb import get_db
from uuid import uuid4


class UserService:
    """Service for managing user operations"""

    @staticmethod
    def create_user(
        email: str,
        mdp: str,
        name: str,
        filepath: str,
    ) -> dict:
        """Create a new user"""
        db = get_db()
        user_data = {
            "id": uuid4().hex,
            "mdp": mdp,
            "email": email,
            "tasks": [],
            "tasks_completed": 0,
            "name": name,
            "birthday": datetime.utcnow(),
            "status": "happy",
            "filepath": filepath,
            "evo_caps": {"1": "bb", "5": "adult", "15": "old"},
        }
        db.users.insert_one(user_data)
        return user_data["id"]

    @staticmethod
    def get_user(email: str) -> Optional[dict]:
        db = get_db()
        user = db.users.find_one({"email": email})
        eof = '_' + user['status'] + '.png' if 'oeuf' not in user.get('filepath', '') else ''
        user['filepath'] = user.get('filepath', '') + eof
        
        return user

    @staticmethod
    def add_tasks(user_id: str, tasks: List[str]) -> Optional[dict]:
        """Add tasks to user's task list"""
        db = get_db()
        db.users.find_one_and_update(
            {"id": user_id},
            {
                "$set": {"tasks": tasks}
            },
        )

    @staticmethod
    def complete_task(user_id: str, task: str) -> Optional[dict]:
        db = get_db()
        user = db.users.find_one({"id": user_id})
        filepath = user.get("filepath", "")
        new_path = ""
        if filepath:
            new_path = user["evo_caps"].get(str(user["tasks_completed"] + 1), filepath[:-1]) + filepath[-1] 
        db.users.find_one_and_update(
            {"id": user_id},
            {
                "$pull": {"tasks": task},
                "$inc": {"tasks_completed": 1},
                "$set": {"filepath": new_path}
            },
        )
