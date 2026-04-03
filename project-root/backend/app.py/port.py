from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Разрешаем фронту подключаться
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # для хакатона можно так
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend работает"}

@app.post("/api/analyze")
async def analyze(data: dict):
    text = data.get("text", "")

    # пока без AI, просто проверка
    return {
        "result": f"Сервер получил: {text}"
    }