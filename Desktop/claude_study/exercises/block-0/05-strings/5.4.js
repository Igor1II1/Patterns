// ============================================
// Задание 5.4 — slice и replace
// Уровень: 🟡 Средний
// ============================================
//
// 📖 Раздел учебника: "slice()", "replace() / replaceAll()" (05-strings.md)
//
// --- Описание ---
// slice(start, end) — вырезает часть строки (без мутации).
// replace — заменяет первое вхождение, replaceAll — все.
//
// --- Что нужно сделать ---
//
// 1. Напиши функцию slugify(title):
//    - Убирает пробелы по краям
//    - В нижний регистр
//    - Заменяет пробелы на дефисы (replaceAll)
//    - Убирает все символы кроме букв, цифр и дефисов
//    Подсказка для удаления символов: цикл for...of + проверка
//
// 2. Напиши функцию censorWord(text, word):
//    - Заменяет все вхождения word на звёздочки той же длины
//    Пример: censorWord("hello world hello", "hello") → "***** world *****"
//    Подсказка: "*".repeat(word.length) создаёт нужное количество звёздочек
//
// 3. Напиши функцию extractDomain(url):
//    - Из "https://www.example.com/path" извлекает "example.com"
//    - Убери протокол (всё до "://"), "www." если есть, путь (всё после "/")
//    Используй slice и indexOf.
//
// --- Тесты ---
// slugify("Hello World!!!")        → "hello-world"
// slugify("  Next.js Tutorial  ")  → "nextjs-tutorial"
// slugify("React + TypeScript")    → "react--typescript" или "react-typescript"
//
// censorWord("я люблю кофе, кофе лучше чая", "кофе") → "я люблю *****, ***** лучше чая"
//
// extractDomain("https://www.example.com/path")  → "example.com"
// extractDomain("http://google.com/search")       → "google.com"
//
// --- Ключевая концепция ---
// slice(start, end) — вырезает [start, end), отрицательные = с конца.
// replaceAll — заменяет ВСЕ вхождения, replace — только первое.
