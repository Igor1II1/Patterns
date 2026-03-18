// ========== Задание Замыкания #11 — Цепочка вызовов (chaining) ==========
// Уровень: 🔴
//
// Напиши функцию `createCalculator(initial)`, которая возвращает объект с:
// - `add(n)` — прибавляет n, возвращает сам объект (для цепочки)
// - `subtract(n)` — вычитает n, возвращает сам объект
// - `multiply(n)` — умножает на n, возвращает сам объект
// - `getResult()` — возвращает текущее значение
// - `reset()` — сбрасывает к initial, возвращает сам объект
//
// Значение должно быть скрыто в замыкании.
//
// Тесты:
// const calc = createCalculator(10);
// const result = calc.add(5).multiply(2).subtract(3).getResult();
// console.log(result); // 27  ((10 + 5) * 2 - 3)
//
// calc.reset();
// console.log(calc.getResult()); // 10
//
// console.log(calc.add(100).subtract(50).getResult()); // 60
//
// 📖 Раздел учебника: "Практические применения" → notes/js-advanced/02-closures.md
// ================================================

// Пиши код ниже:
