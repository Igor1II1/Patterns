// ========== Задание Прототипы #11 — myInstanceOf ==========
// Уровень: 🔴
//
// Напиши функцию `myInstanceOf(obj, Constructor)`, которая
// проходит по прототипной цепочке obj и проверяет,
// встречается ли Constructor.prototype.
//
// НЕ используй оператор instanceof — имитируй его вручную.
//
// Алгоритм:
// 1. Получи прототип obj через Object.getPrototypeOf
// 2. Пока прототип !== null:
//    - Если прототип === Constructor.prototype → return true
//    - Иначе поднимись на уровень выше
// 3. Дошёл до null → return false
//
// Тесты:
// class A {}
// class B extends A {}
// class C {}
//
// const b = new B();
// console.log(myInstanceOf(b, B));      // true
// console.log(myInstanceOf(b, A));      // true
// console.log(myInstanceOf(b, Object)); // true
// console.log(myInstanceOf(b, C));      // false
// console.log(myInstanceOf(b, Array));  // false
//
// console.log(myInstanceOf([], Array));  // true
// console.log(myInstanceOf([], Object)); // true
//
// 📖 Раздел учебника: "instanceof — как работает" → notes/js-advanced/03-prototypes.md
// ================================================

// Пиши код ниже:
