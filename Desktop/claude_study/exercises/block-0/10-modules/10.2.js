// ============================================
// Задание 10.2 — Default export + mixed export
// Уровень: 🟢 Базовый
// ============================================
//
// 📖 Раздел учебника: "Default export", "Mixed export" (10-modules.md)
//
// --- Описание ---
// Default export — один "главный" экспорт из файла (без фигурных скобок).
// Можно сочетать default и named экспорты в одном файле.
//
// --- Что нужно сделать ---
//
// 1. Создай файл user.js:
//    - default export: функция createUser(name, email)
//      Возвращает объект { name, email, getInfo() { return name + " (" + email + ")"; } }
//    - named export: function validateUser(user)
//      Проверяет что user.name непустое и user.email содержит @
//      Возвращает { valid: true } или { valid: false, errors: [...] }
//
// 2. Создай файл main.js:
//    import createUser, { validateUser } from "./user.js";
//    - Создай пользователя: createUser("Игорь", "i@mail.ru")
//    - Провалидируй его
//    - Создай невалидного и покажи ошибки
//
// 3. Покажи что default import можно назвать КАК УГОДНО:
//    import makeUser from "./user.js";   // makeUser = createUser
//    import Foo from "./user.js";        // Foo = createUser
//    (Объясни почему так, в комментарии)
//
// --- Тесты ---
// const u = createUser("Игорь", "i@mail.ru");
// u.getInfo() → "Игорь (i@mail.ru)"
//
// validateUser(u) → { valid: true }
// validateUser(createUser("", "bad")) → { valid: false, errors: [...] }
//
// --- Ключевая концепция ---
// default = один на файл, импортируется БЕЗ { }.
// named = сколько угодно, импортируется В { }.
// Можно комбинировать: import Default, { named } from "...".
