// ============================================
// Задание 2.10 — ?? в условиях и switch группировка
// Уровень: 🟡 Средний
// ============================================
//
// 📖 Раздел учебника: "switch" (02-conditions.md), "??" (01-variables.md)
//
// --- Описание ---
// Часть A: ?? (nullish coalescing) проверяет ТОЛЬКО null/undefined.
// Часть B: в switch можно группировать несколько case для одного действия.
//
// --- Что нужно сделать ---
//
// ЧАСТЬ A — ?? vs || (в файл):
// Напиши функцию getConfig(options) которая возвращает объект настроек.
// У каждой настройки есть значение по умолчанию.
// Используй ?? (не ||), чтобы 0, "" и false считались валидными.
//
// function getConfig(options) {
//   return {
//     port: options.port ?? 3000,
//     host: options.host ?? "localhost",
//     debug: options.debug ?? false,
//     timeout: options.timeout ?? 5000,
//   };
// }
//
// Проверь:
// getConfig({ port: 0, debug: false, host: "" })
// → { port: 0, host: "", debug: false, timeout: 5000 }
// (порт 0, пустой хост, debug false — всё сохранилось!)
//
// getConfig({ port: null, host: undefined })
// → { port: 3000, host: "localhost", debug: false, timeout: 5000 }
//
// В комментарии: что бы вернул || вместо ?? для port: 0?
//
// ЧАСТЬ B — switch группировка (в файл):
// Напиши функцию getSeasonByMonth(month) через switch с группировкой:
// - 12, 1, 2 → "зима"
// - 3, 4, 5 → "весна"
// - 6, 7, 8 → "лето"
// - 9, 10, 11 → "осень"
// - иначе → "неизвестный месяц"
//
// --- Тесты ---
// getSeasonByMonth(1)  → "зима"
// getSeasonByMonth(6)  → "лето"
// getSeasonByMonth(12) → "зима"
// getSeasonByMonth(13) → "неизвестный месяц"
//
// --- Ключевая концепция ---
// ?? — проверяет только null/undefined (не 0, "", false)
// switch группировка — несколько case подряд без break
