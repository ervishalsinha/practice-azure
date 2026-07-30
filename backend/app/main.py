from fastapi import FastAPI

app = FastAPI(title="Azure Demo API")


@app.get("/")
def home():
    return {"message": "FastAPI is running successfully"}