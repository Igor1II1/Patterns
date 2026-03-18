// ========== Задание Fetch #6 — PUT и DELETE ==========
// Уровень: 🟡
//
// Напиши две async-функции:
// 1. обновитьПост(id, данные) — PUT-запрос
// 2. удалитьПост(id) — DELETE-запрос
//
// Шаги:
// 1. Для PUT: method "PUT", headers, body с JSON.stringify
// 2. Для DELETE: method "DELETE", без body
// 3. Проверь response.ok для обоих
// 4. Оберни в try/catch
//
// Тесты:
// обновитьПост(1, { title: "Обновлено" }); // { id: 1, title: "Обновлено" }
// удалитьПост(1); // "Пост 1 удалён"
//
// 📖 Раздел учебника: "HTTP-методы" → notes/js-async/06-fetch.md
// ================================================

// URL: https://jsonplaceholder.typicode.com/posts/

// Пиши код ниже:
