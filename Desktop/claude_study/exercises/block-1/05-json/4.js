// ========== Задание JSON #4 — Безопасный парсинг (try/catch) ==========
// Уровень: 🟡
//
// Напиши функцию `safeParse(jsonStr, fallback)`:
// - Пытается разобрать jsonStr через JSON.parse
// - Если строка невалидная — возвращает fallback (по умолчанию null)
// - Если валидная — возвращает результат парсинга
//
// Тесты:
// console.log(safeParse('{"a": 1}'));          // { a: 1 }
// console.log(safeParse('not json'));           // null
// console.log(safeParse('not json', {}));       // {}
// console.log(safeParse('{"a": 1,}', []));     // [] (trailing comma — невалидный JSON)
// console.log(safeParse("{'a': 1}", "error")); // "error" (одинарные кавычки)
//
// 📖 Раздел учебника: "Что бросает ошибку" → notes/js-advanced/05-json.md
// ================================================

// Пиши код ниже:
