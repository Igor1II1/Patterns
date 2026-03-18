// ========== Задание Замыкания #7 — Частичное применение ==========
// Уровень: 🟡
//
// 1. Напиши функцию `partial(fn, ...presetArgs)`, которая:
//    - Возвращает новую функцию
//    - Новая функция при вызове передаёт в fn сначала presetArgs, потом свои аргументы
//
// 2. Используй partial для создания:
//    - `logInfo` — вызывает `log("INFO", message)`
//    - `logError` — вызывает `log("ERROR", message)`
//
// Тесты:
// function log(level, message) {
//   return `[${level}] ${message}`;
// }
//
// const logInfo = partial(log, "INFO");
// const logError = partial(log, "ERROR");
//
// console.log(logInfo("Сервер запущен"));   // "[INFO] Сервер запущен"
// console.log(logError("Файл не найден")); // "[ERROR] Файл не найден"
//
// function sum(a, b, c) { return a + b + c; }
// const add10 = partial(sum, 10);
// console.log(add10(5, 3)); // 18
//
// 📖 Раздел учебника: "Частичное применение" → notes/js-advanced/02-closures.md
// ================================================

// Пиши код ниже:
