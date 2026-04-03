const inputField = document.getElementById('ai-input');
const button = document.getElementById('ai-btn');
const outputDiv = document.getElementById('ai-output');

button.addEventListener('click', () => {
    const userText = inputField.value;

    if (!userText) {
        alert("Введите данные для анализа!");
        return;
    }

    // Красивая надпись ожидания
    outputDiv.innerHTML = "<i>ИИ обрабатывает данные, подожди...</i>";

    // Имитируем небольшую задержку для реализма
    setTimeout(() => {
        // Простая локальная заглушка анализа
        const response = `
1. Что происходит: ${userText.slice(0, 50)}...<br>
2. Насколько критично: Средний<br>
3. Какие действия необходимо предпринять: Проверить район патрулями и проанализировать ситуацию
        `;
        outputDiv.innerHTML = response;
    }, 500);
});