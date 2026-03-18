// ========== Задание Map и Set #9 — WeakSet (отслеживание) ==========
// Уровень: 🟡
//
// 1. Создай WeakSet `processed`.
//
// 2. Напиши функцию `processOnce(obj)`:
//    - Если объект уже обработан (есть в processed) — вернуть `"Уже обработан"`
//    - Иначе — добавить в processed и вернуть `"Обработано: [obj.name]"`
//
// Тесты:
// const task1 = { name: "Задача 1" };
// const task2 = { name: "Задача 2" };
//
// console.log(processOnce(task1)); // "Обработано: Задача 1"
// console.log(processOnce(task2)); // "Обработано: Задача 2"
// console.log(processOnce(task1)); // "Уже обработан"
// console.log(processOnce(task1)); // "Уже обработан"
//
// 📖 Раздел учебника: "WeakSet" → notes/js-advanced/06-map-set.md
// ================================================

// Пиши код ниже:
