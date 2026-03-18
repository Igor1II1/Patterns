// ========== Задание Продвинутые классы #8 — Миксин через Object.assign ==========
// Уровень: 🟡
//
// 1. Создай миксин `Printable` (обычный объект) с методом:
//    - `print()` → возвращает JSON.stringify(this, null, 2)
//
// 2. Создай миксин `Validatable` (обычный объект) с методами:
//    - `validate()` → возвращает массив ошибок (проверки: name не пустой, age > 0)
//    - `isValid()` → возвращает validate().length === 0
//
// 3. Создай класс `Person` с конструктором `(name, age)`.
//
// 4. Применяй миксины: Object.assign(Person.prototype, Printable, Validatable)
//
// Тесты:
// const p = new Person("Игорь", 20);
// console.log(p.isValid()); // true
// console.log(p.print());   // JSON-строка с name и age
//
// const bad = new Person("", -5);
// console.log(bad.isValid());   // false
// console.log(bad.validate());  // ["Имя не может быть пустым", "Некорректный возраст"]
//
// 📖 Раздел учебника: "Mixins — паттерн множественного наследования" → notes/js-advanced/04-classes-advanced.md
// ================================================

// Пиши код ниже:
