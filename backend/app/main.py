from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.user import router as user_router


app = FastAPI(title="Task Manager API")


origins = [
    "http://localhost:5173",
    "https://victorious-coast-095d24d00.7.azurestaticapps.net",
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

