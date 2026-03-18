// ========== Задание JSON #9 — Циклические ссылки ==========
// Уровень: 🔴
//
// 1. Создай два объекта с циклической ссылкой:
//    const parent = { name: "parent" };
//    const child = { name: "child", parent: parent };
//    parent.child = child;
//
// 2. Попробуй JSON.stringify(parent) — получишь TypeError.
//
// 3. Напиши функцию `stringifyCircular(obj)`, которая:
//    - Использует replacer с WeakSet для отслеживания посещённых объектов
//    - При повторной встрече объекта возвращает строку "[Circular]"
//    - Возвращает JSON-строку без ошибок
//
// Тесты:
// const parent = { name: "parent" };
// const child = { name: "child", parent: parent };
// parent.child = child;
//
// try { JSON.stringify(parent); } catch(e) { console.log(e.message); }
// // "Converting circular structure to JSON"
//
// console.log(stringifyCircular(parent));
// // '{"name":"parent","child":{"name":"child","parent":"[Circular]"}}'
//
// 📖 Раздел учебника: "Циклические ссылки" → notes/js-advanced/05-json.md
// ================================================

// Пиши код ниже:
