// ========== Задание ООП #8 — Как работает new ==========
// Уровень: 🟡
//
// Напиши функцию `myNew(Constructor, ...args)`, которая имитирует оператор `new`:
//
// Шаги (по учебнику):
// 1. Создать пустой объект
// 2. Установить ему прототип: Object.setPrototypeOf(obj, Constructor.prototype)
// 3. Вызвать Constructor с this = obj: Constructor.apply(obj, args)
// 4. Если конструктор вернул объект — вернуть его, иначе вернуть obj
//
// Тесты:
// function Person(name, age) {
//   this.name = name;
//   this.age = age;
// }
// Person.prototype.greet = function() {
//   return `Привет, я ${this.name}`;
// };
//
// const p = myNew(Person, "Игорь", 20);
// console.log(p.name);    // "Игорь"
// console.log(p.age);     // 20
// console.log(p.greet()); // "Привет, я Игорь"
// console.log(p instanceof Person); // true
//
// 📖 Раздел учебника: "Механика: как работает new" → notes/js-advanced/01-oop-basics.md
// ================================================

// Пиши код ниже:
