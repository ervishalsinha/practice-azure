# from fastapi import FastAPI

# from app.db.database import Base
# from app.db.database import engine

# from app.api.routes.user import router as user_router

# import app.models

# Base.metadata.create_all(bind=engine)

# app = FastAPI(title="Azure Demo API")

# app.include_router(user_router)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import _IncludedRouter

from app.api.routes.user import router as user_router

if not hasattr(_IncludedRouter, "path"):
    @property
    def _included_router_path(self) -> str:
        return self.include_context.prefix or ""

    _IncludedRouter.path = _included_router_path

app = FastAPI(title="Task Manager API")

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to Task Manager API 🚀"
    }

