// ========== Задание Fetch #9 — Универсальная функция запроса ==========
// Уровень: 🔴
//
// Создай функцию `апи(url, options)` — обёртку над fetch, которая:
// 1. Автоматически добавляет Content-Type: application/json
// 2. Автоматически делает JSON.stringify для body
// 3. Автоматически проверяет response.ok
// 4. Автоматически парсит JSON
// 5. Возвращает данные, а не Response
//
// Шаги:
// 1. Создай async-функцию апи(url, options = {})
// 2. Добавь заголовки по умолчанию
// 3. Если есть body — JSON.stringify
// 4. Проверь response.ok
// 5. Верни await response.json()
//
// Тесты:
// const user = await апи("https://jsonplaceholder.typicode.com/users/1");
// console.log(user.name); // "Leanne Graham"
//
// const пост = await апи("https://jsonplaceholder.typicode.com/posts", {
//   method: "POST",
//   body: { title: "Тест", body: "Текст", userId: 1 }
// });
// console.log(пост.id); // 101
//
// 📖 Раздел учебника: "Заголовки (Headers)" + "POST-запрос" → notes/js-async/06-fetch.md
// ================================================

// Пиши код ниже:
