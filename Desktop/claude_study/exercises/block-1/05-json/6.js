// ========== Задание JSON #6 — Replacer-функция ==========
// Уровень: 🟡
//
// Напиши replacer-функцию для JSON.stringify, которая:
// - Скрывает все поля, содержащие "password" или "secret" в имени ключа
//   (возвращает undefined для них)
// - Числа, превышающие 1000, форматирует как строку с разделителем тысяч
//   (например 15000 → "15 000")
// - Всё остальное оставляет как есть
//
// Тесты:
// const data = {
//   name: "Отчёт",
//   revenue: 1500000,
//   cost: 750000,
//   secretCode: "XYZ",
//   password: "hidden",
//   count: 42
// };
//
// const result = JSON.stringify(data, replacer, 2);
// console.log(result);
// // name: "Отчёт"
// // revenue: "1 500 000"
// // cost: "750 000"
// // count: 42
// // secretCode и password — отсутствуют
//
// 📖 Раздел учебника: "Replacer как функция" → notes/js-advanced/05-json.md
// ================================================

// Пиши код ниже:
