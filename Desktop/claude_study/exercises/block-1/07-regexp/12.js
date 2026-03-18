// ========== Задание RegExp #12 — КОМПЛЕКСНАЯ ЗАДАЧА: Текстовый процессор ==========
// Уровень: 🔴
//
// Создай объект `TextProcessor` с методами:
//
// 1. `extractEmails(text)` — находит все email-адреса в тексте (массив)
// 2. `extractUrls(text)` — находит все URL (http:// или https://) в тексте (массив)
// 3. `extractPhones(text)` — находит все телефоны формата +7-XXX-XXX-XX-XX
//    или 8XXXXXXXXXX (массив)
// 4. `highlightWords(text, word)` — оборачивает все вхождения word в **word**
//    (без учёта регистра)
// 5. `countSentences(text)` — считает количество предложений (разделители: . ! ?)
// 6. `removeExtraSpaces(text)` — заменяет множественные пробелы на один
//
// Тесты:
// const text = `Свяжитесь с нами: info@example.com или support@mail.ru.
// Наш сайт: https://example.com и http://old-site.ru
// Телефон: +7-900-123-45-67 или 89001234567.
// JavaScript — лучший язык! Правда? Да.`;
//
// console.log(TextProcessor.extractEmails(text));
// // ["info@example.com", "support@mail.ru"]
//
// console.log(TextProcessor.extractUrls(text));
// // ["https://example.com", "http://old-site.ru"]
//
// console.log(TextProcessor.extractPhones(text));
// // ["+7-900-123-45-67", "89001234567"]
//
// console.log(TextProcessor.highlightWords("Hello world hello", "hello"));
// // "**Hello** world **hello**"
//
// console.log(TextProcessor.countSentences(text)); // 5
//
// console.log(TextProcessor.removeExtraSpaces("too   many    spaces   here"));
// // "too many spaces here"
//
// 📖 Раздел учебника: ВСЕ разделы → notes/js-advanced/07-regexp.md
// ================================================

// Пиши код ниже:
