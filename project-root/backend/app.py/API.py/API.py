from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
from config import GOOGLE_API_KEY, ALLOWED_ORIGINS

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze")
async def analyze(request: Request):
    data = await request.json()
    user_text = data.get("text", "")

    # Промпт
    prompt = f"""
Ты — AI-аналитик городской безопасности Алматы.

Данные: {user_text}

Ответь строго:
1. Что происходит
2. Насколько это опасно
3. Что делать
"""

    # Запрос к Google AI
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GOOGLE_API_KEY}"

    response = requests.post(
        url,
        json={
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ]
        }
    )

    result = response.json()

    try:
        text = result["candidates"][0]["content"]["parts"][0]["text"]
    except:
        text = "Ошибка AI или лимит. Попробуй позже."

    return {"result": text}