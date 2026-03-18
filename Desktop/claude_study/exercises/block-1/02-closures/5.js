// ========== Задание Замыкания #5 — Фабрика валидаторов ==========
// Уровень: 🟡
//
// Напиши фабрику `makeRangeValidator(min, max)`, которая возвращает функцию.
// Возвращённая функция принимает `value` и:
// - если value < min → возвращает `"Слишком мало, минимум [min]"`
// - если value > max → возвращает `"Слишком много, максимум [max]"`
// - иначе → возвращает `"OK"`
//
// Тесты:
// const validateAge = makeRangeValidator(0, 120);
// const validateScore = makeRangeValidator(0, 100);
//
// console.log(validateAge(25));    // "OK"
// console.log(validateAge(-5));    // "Слишком мало, минимум 0"
// console.log(validateAge(150));   // "Слишком много, максимум 120"
// console.log(validateScore(105)); // "Слишком много, максимум 100"
//
// 📖 Раздел учебника: "Фабричные функции" → notes/js-advanced/02-closures.md
// ================================================

// Пиши код ниже:
