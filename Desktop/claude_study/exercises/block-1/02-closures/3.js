// ========== Задание Замыкания #3 — Счётчик ==========
// Уровень: 🟢
//
// Напиши функцию `makeCounter()`, которая возвращает объект с тремя методами:
// - `increment()` — увеличивает счётчик на 1
// - `decrement()` — уменьшает счётчик на 1
// - `getCount()` — возвращает текущее значение
//
// Переменная count должна быть скрыта (замыкание), недоступна снаружи.
//
// Тесты:
// const counter = makeCounter();
// counter.increment();
// counter.increment();
// counter.increment();
// counter.decrement();
// console.log(counter.getCount()); // 2
//
// const counter2 = makeCounter();
// counter2.increment();
// console.log(counter2.getCount()); // 1
// console.log(counter.getCount());  // 2 (независимый!)
//
// 📖 Раздел учебника: "Как работает замыкание: пошаговый пример" → notes/js-advanced/02-closures.md
// ================================================

// Пиши код ниже:
