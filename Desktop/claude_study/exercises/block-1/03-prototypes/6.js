// ========== Задание Прототипы #6 — Object.create ==========
// Уровень: 🟡
//
// 1. Создай объект-прототип `personProto` с методами:
//    - `greet()` → `"Привет, я [name]"`
//    - `isAdult()` → `true` если `this.age >= 18`
//
// 2. Создай два объекта через Object.create(personProto):
//    - igor: name = "Игорь", age = 20
//    - masha: name = "Маша", age = 16
//
// 3. Создай объект `pureDict` через Object.create(null) — объект вообще без прототипа.
//
// Тесты:
// console.log(igor.greet());     // "Привет, я Игорь"
// console.log(igor.isAdult());   // true
// console.log(masha.isAdult());  // false
//
// // Методы — из прототипа:
// console.log(igor.hasOwnProperty("greet")); // false
// console.log(igor.hasOwnProperty("name"));  // true
//
// // Чистый словарь:
// console.log(pureDict.toString); // undefined — нет прототипа!
//
// 📖 Раздел учебника: "Object.create()" → notes/js-advanced/03-prototypes.md
// ================================================

// Пиши код ниже:
