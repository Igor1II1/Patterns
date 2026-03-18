// ========== Задание Date и Math #5 — Создание Date ==========
// Уровень: 🟢
//
// Создай объекты Date разными способами:
// 1. Текущая дата: new Date()
// 2. Из строки: new Date("2024-06-15")
// 3. Из компонентов: new Date(2024, 5, 15) — ВНИМАНИЕ: месяц 5 = июнь!
// 4. Из timestamp: new Date(0) — начало Unix-эпохи
//
// Выведи каждую дату и проверь, что понимаешь нумерацию месяцев.
//
// Тесты:
// const now = new Date();
// console.log(now); // текущая дата и время
//
// const fromStr = new Date("2024-06-15");
// console.log(fromStr.getMonth()); // 5 (июнь = 5, потому что 0 = январь!)
//
// const fromParts = new Date(2024, 0, 1); // 1 января 2024
// console.log(fromParts.getMonth()); // 0 (январь)
// console.log(fromParts.getDate());  // 1
//
// const epoch = new Date(0);
// console.log(epoch); // 1970-01-01T00:00:00.000Z
//
// 📖 Раздел учебника: "Создание объекта Date" → notes/js-advanced/08-date-math.md
// ================================================

// Пиши код ниже:
