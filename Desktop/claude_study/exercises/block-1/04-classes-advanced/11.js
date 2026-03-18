// ========== Задание Продвинутые классы #11 — Приватный static + генератор ID ==========
// Уровень: 🟡
//
// Создай класс `IdGenerator` с:
// - Приватным статическим полем `static #nextId = 1`
// - Приватным статическим методом `static #format(id)` —
//   форматирует id как "ID-00001" (5 цифр с ведущими нулями, используй padStart)
// - Публичным статическим методом `static generate()` —
//   возвращает отформатированный ID и увеличивает #nextId
// - Публичным статическим методом `static reset()` — сбрасывает #nextId в 1
//
// Тесты:
// console.log(IdGenerator.generate()); // "ID-00001"
// console.log(IdGenerator.generate()); // "ID-00002"
// console.log(IdGenerator.generate()); // "ID-00003"
// IdGenerator.reset();
// console.log(IdGenerator.generate()); // "ID-00001"
//
// 📖 Раздел учебника: "Приватные static поля и методы" → notes/js-advanced/04-classes-advanced.md
// ================================================

// Пиши код ниже:
