// ============================================
// Задание 9.7 — Валидатор формы (объект с методами)
// Уровень: 🔴 Продвинутый
// ============================================
//
// 📖 Раздел учебника: все разделы главы 09-errors.md
//
// --- Описание ---
// Реальная задача из веб-разработки: валидация формы.
// Валидатор — объект с методами, который собирает ВСЕ ошибки
// (а не останавливается на первой). Использует this для доступа
// к массиву ошибок внутри методов.
//
// --- Что нужно сделать ---
//
// 1. Создай объект validator с методами:
//
//    const validator = {
//      errors: [],
//
//      // Проверяет что значение не пустое (не "", не undefined, не null)
//      checkRequired: function(value, fieldName) {
//        if (value === undefined || value === null || value === "") {
//          this.errors.push({ field: fieldName, message: fieldName + " обязательно" });
//        }
//      },
//
//      // Проверяет минимальную длину строки
//      checkMinLength: function(value, min, fieldName) {
//        if (typeof value === "string" && value.length < min) {
//          this.errors.push({
//            field: fieldName,
//            message: fieldName + " минимум " + min + " символов"
//          });
//        }
//      },
//
//      // Проверяет что строка содержит @ и точку после @
//      checkEmail: function(value) {
//        if (typeof value !== "string" || value.indexOf("@") === -1 || value.indexOf(".") === -1) {
//          this.errors.push({ field: "email", message: "Невалидный email" });
//        }
//      },
//
//      // Проверяет что значение — число в диапазоне от min до max
//      checkNumberRange: function(value, min, max, fieldName) {
//        if (typeof value !== "number" || value < min || value > max) {
//          this.errors.push({
//            field: fieldName,
//            message: fieldName + " должно быть от " + min + " до " + max
//          });
//        }
//      },
//
//      hasErrors: function() { return this.errors.length > 0; },
//      getErrors: function() { return this.errors; },
//      reset: function() { this.errors = []; }
//    };
//
// 2. Напиши функцию validateForm(data, mode), которая:
//    - mode — необязательный: "strict" или "soft" (если не передан — используй ?? "strict")
//    - Вызывает validator.reset()
//    - Для каждого поля используй switch/case по имени поля для выбора проверок:
//      case "name":  checkRequired + checkMinLength (мин. 2)
//      case "email": checkRequired + checkEmail
//      case "age":   если data.age — строка, приведи к Number() перед проверкой
//                    checkNumberRange (от 18 до 120)
//    - Если mode === "soft" — НЕ бросай ошибку, верни { success: false, errors: [...] }
//    - Если mode === "strict" и validator.hasErrors() — throw new Error("Форма невалидна")
//      Перед throw сохрани ошибки: const errors = validator.getErrors();
//      Добавь к ошибке: err.errors = errors;
//    - Если ошибок нет — return { success: true, data: data }
//
// 3. Протестируй в try/catch:
//
//    Тест 1 — валидные данные:
//    validateForm({ name: "Игорь", email: "igor@mail.ru", age: 25 })
//    → { success: true, data: { name: "Игорь", email: "igor@mail.ru", age: 25 } }
//
//    Тест 2 — всё неправильно:
//    validateForm({ name: "", email: "bad", age: 10 })
//    → Error с err.errors:
//      [
//        { field: "name",  message: "name обязательно" },
//        { field: "name",  message: "name минимум 2 символов" },
//        { field: "email", message: "Невалидный email" },
//        { field: "age",   message: "age должно быть от 18 до 120" }
//      ]
//
//    Тест 3 — частично:
//    validateForm({ name: "Ан", email: "a@b.ru", age: 200 })
//    → Error с err.errors:
//      [
//        { field: "age", message: "age должно быть от 18 до 120" }
//      ]
//
//    В catch — выведи каждую ошибку:
//    for (let i = 0; i < err.errors.length; i++) {
//      console.log("  " + err.errors[i].field + ": " + err.errors[i].message);
//    }
//
// --- Тесты ---
// validateForm({ name: "Игорь", email: "igor@mail.ru", age: 25 })
//   → { success: true, data: {...} }
// validateForm({ name: "", email: "bad", age: 10 })
//   → Error: "Форма невалидна", err.errors.length === 4  (mode по умолчанию "strict")
// validateForm({ name: "Ан", email: "a@b.ru", age: 200 })
//   → Error: "Форма невалидна", err.errors.length === 1
// validateForm({ name: "", email: "bad", age: 10 }, "soft")
//   → { success: false, errors: [...] }  (soft mode — без throw)
// validateForm({ name: "Игорь", email: "i@m.ru", age: "25" })
//   → { success: true, data: {...} }  (age строка "25" → Number("25") = 25 — валидно)
//
// --- Ключевая концепция ---
// Объект с методами — альтернатива class. Методы через this обращаются к общему состоянию.
// Валидатор собирает ВСЕ ошибки (не бросает на первой) — удобно для форм.
// К объекту Error можно добавлять свои свойства (err.errors = [...]).
