// ============================================
// Задание 10.5 — Barrel файл (index.js)
// Уровень: 🟡 Средний
// ============================================
//
// 📖 Раздел учебника: "index.js — barrel файл", "Re-export" (10-modules.md)
//
// --- Описание ---
// Barrel файл (index.js) — реэкспортирует всё из папки.
// Позволяет импортировать из папки вместо конкретных файлов.
//
// --- Что нужно сделать ---
//
// Используя файлы из задания 10.4 (utils/format.js, utils/validate.js):
//
// 1. Создай файл utils/index.js (barrel) который реэкспортирует:
//    export { formatName, formatPrice } from "./format.js";
//    export { validateEmail, validateAge } from "./validate.js";
//
// 2. Теперь в main.js можно импортировать из одного места:
//    import { formatName, validateEmail } from "./utils/index.js";
//    // Вместо:
//    // import { formatName } from "./utils/format.js";
//    // import { validateEmail } from "./utils/validate.js";
//
// 3. Покажи оба варианта импорта и объясни:
//    - Когда barrel файл удобен?
//    - Когда лучше импортировать из конкретного файла?
//
// 4. (Накопительное: объекты + массивы + функции + строки + циклы)
//    Создай файл utils/string-helpers.js с функциями:
//    - capitalize(str) — первая буква заглавная, остальные строчные
//      Если str не строка (typeof !== "string") — приведи через String(str) ?? ""
//      capitalize("привет") → "Привет"
//      capitalize(123) → "123" (Number → String, нечего капитализировать — цифра)
//    - countWords(str) — считает количество слов в строке (разделитель — пробел)
//      Если str falsy (!str) — верни 0
//      countWords("привет мир тест") → 3
//      countWords("") → 0
//    - truncate(str, maxLen) — обрезает строку до maxLen символов, добавляет "..."
//      maxLen по умолчанию 50 (если не передан — используй ?? 50)
//      Верни результат тернарным оператором: str.length > maxLen ? обрезанная : str
//      truncate("Длинная строка", 8) → "Длинная..."
//      Если строка короче maxLen — возвращает как есть
//
//    Добавь реэкспорт в utils/index.js:
//    export { capitalize, countWords, truncate } from "./string-helpers.js";
//
//    В main.js — импортируй ВСЁ из utils/index.js и протестируй:
//    - Создай массив пользователей: [{ name: "  игорь  ", bio: "Люблю программирование и JavaScript" }, ...]
//    - Пройди циклом по массиву
//    - Для каждого: formatName(name), capitalize(formatName(name)), countWords(bio), truncate(bio, 15)
//    - Результат сохрани в новый массив объектов и выведи
//
// --- Тесты задания 1-3 ---
// import { formatName, formatPrice, validateEmail, validateAge }
//   from "./utils/index.js";
// Все функции должны работать.
//
// --- Тесты задания 4 ---
// capitalize("привет")              → "Привет"
// countWords("привет мир тест")     → 3
// truncate("Длинная строка", 8)     → "Длинная..."
// truncate("Ок", 10)                → "Ок"
//
// Обработка массива пользователей через barrel import — все утилиты из одного места.
//
// --- Ключевая концепция ---
// Barrel = "единая точка входа" для папки.
// re-export: export { x } from "./file.js" (не импортирует в текущий файл).
// Barrel удобен когда утилит становится много — один import вместо пяти.
