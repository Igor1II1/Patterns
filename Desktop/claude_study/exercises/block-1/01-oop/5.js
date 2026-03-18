// ========== Задание ООП #5 — super в методах ==========
// Уровень: 🟡
//
// 1. Создай класс `Employee` с:
//    - конструктором, принимающим `name` и `salary`
//    - методом `getInfo()`, возвращающим `"[name], зарплата: [salary]"`
//
// 2. Создай класс `Manager`, который наследует `Employee`:
//    - конструктор принимает `name`, `salary`, `department`
//    - переопредели `getInfo()` — используй `super.getInfo()` и добавь `, отдел: [department]`
//
// 3. Создай класс `Director`, который наследует `Manager`:
//    - конструктор принимает `name`, `salary`, `department`, `bonus`
//    - переопредели `getInfo()` — используй `super.getInfo()` и добавь `, бонус: [bonus]`
//
// Тесты:
// const emp = new Employee("Иван", 50000);
// console.log(emp.getInfo()); // "Иван, зарплата: 50000"
//
// const mgr = new Manager("Ольга", 80000, "IT");
// console.log(mgr.getInfo()); // "Ольга, зарплата: 80000, отдел: IT"
//
// const dir = new Director("Пётр", 120000, "IT", 30000);
// console.log(dir.getInfo()); // "Пётр, зарплата: 120000, отдел: IT, бонус: 30000"
//
// 📖 Раздел учебника: "Наследование" → notes/js-advanced/01-oop-basics.md
// ================================================

// Пиши код ниже:
