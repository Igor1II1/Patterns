// ========== Задание Колбэки #7 — Error-First Callback ==========
// Уровень: 🟡
//
// Напиши функцию `разделить(a, b, callback)` в стиле error-first:
// - Если b === 0, вызови callback с ошибкой: callback(new Error("Деление на ноль"), null)
// - Иначе вызови callback с результатом: callback(null, a / b)
//
// Шаги:
// 1. Создай функцию разделить(a, b, callback)
// 2. Проверь: если b === 0, вызови callback с ошибкой
// 3. Иначе вызови callback с результатом
// 4. При вызове ВСЕГДА проверяй ошибку первым делом
//
// Тесты:
// разделить(10, 2, (err, result) => {
//   if (err) return console.log("Ошибка:", err.message);
//   console.log("Результат:", result);
// }); // "Результат: 5"
//
// разделить(10, 0, (err, result) => {
//   if (err) return console.log("Ошибка:", err.message);
//   console.log("Результат:", result);
// }); // "Ошибка: Деление на ноль"
//
// 📖 Раздел учебника: "Error-First Callbacks" → notes/js-async/02-callbacks.md
// ================================================

// Пиши код ниже:
