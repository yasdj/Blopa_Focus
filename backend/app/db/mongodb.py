from pymongo import MongoClient
from pymongo.database import Database

from app.core.config import settings


class MongoDB:
    """MongoDB connection manager."""

    client: MongoClient | None = None
    database: Database | None = None

    def connect(self) -> None:
        """Connect to MongoDB."""
        self.client = MongoClient(settings.mongodb_url)
        self.database = self.client[settings.database_name]
        print(f"Connected to MongoDB at {settings.mongodb_url}")

    def disconnect(self) -> None:
        """Disconnect from MongoDB."""
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB")

    def get_database(self) -> Database:
        """Get database instance."""
        if self.database is None:
            raise RuntimeError("Database not initialized. Call connect() first.")
        return self.database


mongodb = MongoDB()


def get_db() -> Database:
    """Dependency to get database instance."""
    return mongodb.get_database()
