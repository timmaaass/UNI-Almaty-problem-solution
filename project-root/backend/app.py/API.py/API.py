from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/api/incidents")
def get_incidents():
    conn = get_db_connection()
    incidents = conn.execute('SELECT * FROM incidents_almaty ORDER BY time DESC').fetchall()
    conn.close()
    return [dict(ix) for ix in incidents]

# Для простоты AI можно заглушить, чтобы он работал без ключа
@app.post("/api/analyze")
async def analyze(request: Request):
    data = await request.json()
    user_text = data.get("text", "")
    # Заглушка вместо реального AI
    return {"result": f"1. Что происходит: {user_text[:50]}...\n2. Насколько критично: Средний\n3. Рекомендации: патрули проверить район"}