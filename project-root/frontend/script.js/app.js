const inputField = document.getElementById('ai-input');
const button = document.getElementById('ai-btn');
const outputDiv = document.getElementById('ai-output');

// ВАЖНО: Вставь сюда свой скопированный ключ!
const MY_API_KEY = "AIzaSyBvwoiX_mi13-Nw7SxdLH9fSUDgL1uxj8Q";

// Это правильный адрес (URL) для подключения к Gemini (модель 1.5 Flash - она очень быстрая)
// Новый, рабочий адрес
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${MY_API_KEY}`;

button.addEventListener('click', async () => {
    const userText = inputField.value;

    if (!userText) {
        alert("Брат, напиши данные для анализа!");
        return;
    }

    outputDiv.innerText = "ИИ обрабатывает данные, подожди...";

    // Вот здесь мы формируем системный промпт для хакатона
    const promptText = `Ты — AI-аналитик системы безопасности города Алматы. 
Тебе поступили следующие данные от оператора: "${userText}".
Проанализируй ситуацию и выдай краткий, четкий ответ для дашборда строго по 3 пунктам:
1. Что происходит: (краткое описание)
2. Насколько критично: (оцени уровень отклика)
3. Какие действия необходимо предпринять: (рекомендации для служб)`;

    try {
        // Отправляем запрос
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptText }]
                }]
            })
        });

        const data = await response.json();

        // СУПЕР-ПРОВЕРКА: Если Гугл ответил ошибкой, выводим её прямо на сайт!
        if (!response.ok) {
            console.error("Детальная ошибка от сервера:", data);
            outputDiv.innerText = `Гугл ругается: ${data.error.message}`;
            return;
        }

        // Вытаскиваем готовый текст ответа
        const aiResponseText = data.candidates[0].content.parts[0].text;
        outputDiv.innerText = aiResponseText;

    } catch (error) {
        // Если ошибка самой сети (например, нет интернета или блочит браузер)
        console.error("Ой, ошибка сети:", error);
        outputDiv.innerText = `Ошибка сети: ${error.message}. Если написано "Failed to fetch", значит точно нужен Live Server или VPN.`;
    }
});