// ========== Задание RegExp #11 — Извлечение данных из лога ==========
// Уровень: 🔴
//
// Дана строка лога:
// const logLine = "[2024-03-15 14:30:22] ERROR: Connection timeout (attempt 3)";
//
// 1. Напиши regexp с именованными группами для извлечения:
//    - date (дата: ГГГГ-ММ-ДД)
//    - time (время: ЧЧ:ММ:СС)
//    - level (уровень: слово после ])
//    - message (сообщение: всё после двоеточия)
//
// 2. Напиши функцию `parseLog(line)`, которая возвращает объект
//    { date, time, level, message } или null если формат не совпал.
//
// Тесты:
// const result = parseLog("[2024-03-15 14:30:22] ERROR: Connection timeout (attempt 3)");
// console.log(result.date);    // "2024-03-15"
// console.log(result.time);    // "14:30:22"
// console.log(result.level);   // "ERROR"
// console.log(result.message); // "Connection timeout (attempt 3)"
//
// const result2 = parseLog("[2024-01-01 00:00:00] INFO: Server started");
// console.log(result2.level); // "INFO"
//
// console.log(parseLog("не лог")); // null
//
// 📖 Раздел учебника: "Извлечение данных из строки" → notes/js-advanced/07-regexp.md
// ================================================

// Пиши код ниже:
