// ========== Задание Колбэки #8 — Асинхронная функция с error-first ==========
// Уровень: 🟡
//
// Напиши функцию `загрузитьПользователя(id, callback)`:
// - Имитирует загрузку через setTimeout (500мс)
// - Если id <= 0, вызывает callback(new Error("Неверный ID"), null)
// - Если id > 0, вызывает callback(null, { id: id, name: "User" + id })
//
// Шаги:
// 1. Создай функцию с setTimeout внутри
// 2. Внутри setTimeout проверяй id
// 3. Вызови с правильным и неправильным id
//
// Тесты:
// загрузитьПользователя(5, (err, user) => {
//   if (err) return console.log("Ошибка:", err.message);
//   console.log(user); // { id: 5, name: "User5" }
// });
//
// загрузитьПользователя(-1, (err, user) => {
//   if (err) return console.log("Ошибка:", err.message);
//   console.log(user);
// }); // "Ошибка: Неверный ID"
//
// 📖 Раздел учебника: "Error-First Callbacks", "Практический пример" → notes/js-async/02-callbacks.md
// ================================================

// Пиши код ниже:
