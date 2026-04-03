const inputField = document.getElementById('ai-input');
const button = document.getElementById('ai-btn');
const outputDiv = document.getElementById('ai-output');

// ВАЖНО: Вставь сюда свой НОВЫЙ ключ (удалив перед этим все старые на сайте)
const MY_API_KEY = "AIzaSyB2LNw071RxvXQhkip8urlaUiOOHrEgcfI";

// Правильный рабочий адрес
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${MY_API_KEY}`;

button.addEventListener('click', async () => {
    const userText = inputField.value;

    if (!userText) {
        alert("Брат, напиши данные для анализа!");
        return;
    }

    // Делаем красивую надпись ожидания курсивом
    outputDiv.innerHTML = "<i>ИИ обрабатывает данные, подожди...</i>";

    // Наш системный промпт для хакатона
    const promptText = `Ты — AI-аналитик системы безопасности города Алматы. 
Тебе поступили следующие данные от оператора: "${userText}".
Проанализируй ситуацию и выдай краткий, четкий ответ для дашборда строго по 3 пунктам:
1. Что происходит: (краткое описание)
2. Насколько критично: (оцени уровень отклика)
3. Какие действия необходимо предпринять: (рекомендации для служб)`;

    try {
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

        // Проверка на ошибку от Гугла
        if (!response.ok) {
            console.error("Детальная ошибка от сервера:", data);
            outputDiv.innerHTML = `<b>Гугл ругается:</b> ${data.error.message}`;
            return;
        }

        const aiResponseText = data.candidates[0].content.parts[0].text;
        
        // ФИНАЛЬНАЯ МАГИЯ ВИЗУАЛА (Делает текст жирным и ставит точки вместо звездочек)
        let formattedText = aiResponseText
            .replace(/\*\*([\s\S]*?)\*\*/g, '<b>$1</b>') 
            .replace(/\n\* /g, '<br>• ')                 
            .replace(/\n/g, '<br>');                     

        outputDiv.innerHTML = formattedText;

    } catch (error) {
        console.error("Ошибка сети:", error);
        outputDiv.innerHTML = `<b>Ошибка сети:</b> ${error.message}`;
    }
});