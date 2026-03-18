// ========== Задание JSON #7 — Reviver (преобразование при парсинге) ==========
// Уровень: 🟡
//
// Дана JSON-строка с событием (даты — строки в формате ISO).
// Напиши reviver-функцию, которая превращает строки дат обратно в объекты Date.
//
// Определение даты: строка, соответствующая формату ГГГГ-ММ-ДДTчч:мм:сс
//
// Тесты:
// const json = '{"title":"Встреча","start":"2025-06-15T10:00:00.000Z","end":"2025-06-15T11:30:00.000Z","room":5}';
//
// const event = JSON.parse(json, reviver);
//
// console.log(event.start instanceof Date); // true
// console.log(event.end instanceof Date);   // true
// console.log(event.room);                  // 5 (число, не дата)
// console.log(event.title);                 // "Встреча" (строка, не дата)
// console.log(event.start.getHours());      // 10 (или ваш часовой пояс)
//
// 📖 Раздел учебника: "Reviver в parse" → notes/js-advanced/05-json.md
// ================================================

// Пиши код ниже:
