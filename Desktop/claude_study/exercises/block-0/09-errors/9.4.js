// ============================================
// Задание 9.4 — Создание ошибок с дополнительной информацией
// Уровень: 🟡 Средний
// ============================================
//
// 📖 Раздел учебника: "throw: Создание своих типов ошибок" (09-errors.md)
//
// --- Описание ---
// Error — это обычный объект. После создания через new Error()
// можно добавить к нему ЛЮБЫЕ свойства: name, field, code и т.д.
// Это позволяет передавать дополнительную информацию об ошибке
// без использования class и extends.
//
// --- Что нужно сделать ---
//
// 1. Напиши функцию createValidationError(field, message):
//    - Создаёт объект ошибки: const err = new Error(message);
//    - Меняет имя: err.name = "ValidationError";
//    - Добавляет поле: err.field = field;
//    - Возвращает err
//
// 2. Напиши функцию createNotFoundError(resource, id):
//    - Создаёт: const err = new Error(resource + " с id " + id + " не найден");
//    - err.name = "NotFoundError";
//    - err.resource = resource;
//    - err.id = id;
//    - Возвращает err
//
// 3. Напиши функцию validateAge(value):
//    - if (typeof value !== "number") → throw createValidationError("age", "Возраст должен быть числом")
//    - if (value < 0 || value > 150)  → throw createValidationError("age", "Возраст от 0 до 150")
//    - Иначе → return value
//
// 4. Напиши функцию findUser(id):
//    - if (typeof id !== "number") → throw createValidationError("id", "ID должен быть числом")
//    - if (id > 100) → throw createNotFoundError("User", id)
//    - Иначе → return { id: id, name: "Пользователь " + id }
//
// 5. Оберни вызовы в try/catch и проверяй тип ошибки через err.name:
//
//    try {
//      validateAge("abc");
//    } catch (err) {
//      if (err.name === "ValidationError") {
//        console.log("Ошибка валидации поля " + err.field + ": " + err.message);
//      } else {
//        console.log("Неизвестная ошибка: " + err.message);
//      }
//    }
//
//    Сделай то же для:
//    - validateAge(-5)
//    - findUser("abc")
//    - findUser(999)
//    - findUser(42) — успешный вызов, выведи результат
//
// --- Тесты ---
// validateAge(25)          → 25
// validateAge("abc")       → ValidationError: field="age", "Возраст должен быть числом"
// validateAge(-5)          → ValidationError: field="age", "Возраст от 0 до 150"
// findUser(1)              → { id: 1, name: "Пользователь 1" }
// findUser("abc")          → ValidationError: field="id", "ID должен быть числом"
// findUser(999)            → NotFoundError: resource="User", id=999
//
// --- Ключевая концепция ---
// Error — обычный объект, к нему можно добавлять свои свойства (field, resource, id).
// Проверка err.name === "ValidationError" — способ различать ошибки без class/extends.
// Фабричная функция (createValidationError) — создаёт объект нужного вида.
