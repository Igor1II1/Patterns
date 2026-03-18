// ========== Задание JSON #3 — Что теряется при stringify ==========
// Уровень: 🟢
//
// Создай объект со всеми "проблемными" типами:
// - value: undefined
// - fn: стрелочная функция
// - num: NaN
// - inf: Infinity
// - date: new Date("2025-01-01")
// - normal: "обычная строка"
//
// Преврати в JSON и обратно. Что осталось? Что пропало? Что изменилось?
//
// Напиши ответы в комментариях, затем проверь кодом.
//
// Тесты:
// const obj = {
//   value: undefined,
//   fn: () => "hello",
//   num: NaN,
//   inf: Infinity,
//   date: new Date("2025-01-01"),
//   normal: "обычная строка"
// };
//
// const json = JSON.stringify(obj);
// console.log(json);
// const restored = JSON.parse(json);
// console.log(restored);
// // Проверь: какие поля есть? Какие типы?
//
// 📖 Раздел учебника: "Что теряется при сериализации" → notes/js-advanced/05-json.md
// ================================================

// Пиши код ниже:
