// ============================================
// Задание 9.1 — try/catch базовый
// Уровень: 🟢 Базовый
// ============================================
//
// 📖 Раздел учебника: "try/catch", "Объект ошибки" (09-errors.md)
//
// --- Описание ---
// try/catch позволяет "поймать" ошибку и обработать её
// вместо падения программы. error.name, error.message, error.stack.
//
// --- Что нужно сделать ---
//
// 1. Напиши функцию safeParse(jsonStr):
//    - Пытается распарсить JSON через JSON.parse
//    - Если строка валидна — возвращает результат
//    - Если ошибка — возвращает null
//    - В catch выведи: error.name и error.message
//
// 2. Напиши функцию getName(obj):
//    - Пытается обратиться к obj.name
//    - Если obj = null/undefined — вернёт "Неизвестно"
//    - Обработай ошибку через try/catch
//
// 3. Исследуй объект ошибки:
//    try {
//      null.toString();
//    } catch (error) {
//      // Выведи: error.name, error.message, typeof error.stack
//      // Что такое stack trace? Зачем он нужен?
//    }
//
// --- Тесты ---
// safeParse('{"name": "Игорь"}')  → { name: "Игорь" }
// safeParse("не JSON")             → null
// safeParse("")                     → null
//
// getName({ name: "Игорь" })  → "Игорь"
// getName(null)                → "Неизвестно"
// getName(undefined)           → "Неизвестно"
//
// --- Ключевая концепция ---
// try/catch = "попробуй, а если упадёт — обработай".
// error.name = тип ошибки, error.message = описание, error.stack = путь.
