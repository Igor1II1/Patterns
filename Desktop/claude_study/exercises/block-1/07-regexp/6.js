// ========== Задание RegExp #6 — Группы (capturing) ==========
// Уровень: 🟡
//
// 1. Напиши regexp с группами для разбора даты "2024-03-15":
//    - Группа 1: год
//    - Группа 2: месяц
//    - Группа 3: день
//    Извлеки группы через match.
//
// 2. Используй именованные группы (?<name>...) для того же.
//
// 3. Напиши regexp с незахватывающей группой (?:Mr|Ms|Dr)\. (\w+)
//    для разбора "Dr. Smith" — захвати только фамилию.
//
// Тесты:
// const dateMatch = "2024-03-15".match(/(\d{4})-(\d{2})-(\d{2})/);
// console.log(dateMatch[1]); // "2024"
// console.log(dateMatch[2]); // "03"
// console.log(dateMatch[3]); // "15"
//
// const namedMatch = "2024-03-15".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
// console.log(namedMatch.groups.year);  // "2024"
// console.log(namedMatch.groups.month); // "03"
//
// const titleMatch = "Dr. Smith".match(/(?:Mr|Ms|Dr)\. (\w+)/);
// console.log(titleMatch[1]); // "Smith"
//
// 📖 Раздел учебника: "Группы" → notes/js-advanced/07-regexp.md
// ================================================

// Пиши код ниже:
