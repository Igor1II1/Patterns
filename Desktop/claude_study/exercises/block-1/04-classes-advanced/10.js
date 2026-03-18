// ========== Задание Продвинутые классы #10 — Ошибки с классами ==========
// Уровень: 🟡
//
// В каждом блоке кода есть ошибка. Найди её, объясни в комментарии,
// и напиши исправленную версию.
//
// --- Ошибка 1: Вызов без new ---
// class Point {
//   constructor(x, y) { this.x = x; this.y = y; }
// }
// const p = Point(1, 2); // Что произойдёт?
// Объяснение:
// Исправление:

// --- Ошибка 2: Потеря this в коллбэке ---
// class Timer {
//   constructor() { this.seconds = 0; }
//   start() {
//     setTimeout(function() {
//       this.seconds++;
//       console.log(this.seconds);
//     }, 1000);
//   }
// }
// const t = new Timer();
// t.start(); // Что произойдёт?
// Объяснение:
// Исправление:

// --- Ошибка 3: Мутация приватного массива ---
// class TodoList {
//   #items = ["Купить молоко", "Выучить JS"];
//   get items() { return this.#items; }
// }
// const list = new TodoList();
// list.items.push("Хакерская запись");
// console.log(list.items); // Что будет?
// Объяснение:
// Исправление:

// --- Ошибка 4: Метод в constructor ---
// class Greeter {
//   constructor(name) {
//     this.name = name;
//     this.greet = function() { return `Hello, ${this.name}`; };
//   }
// }
// Объяснение (почему это плохо):
// Исправление:
//
// 📖 Раздел учебника: "Типичные ошибки с классами" → notes/js-advanced/04-classes-advanced.md
// ================================================

// Пиши код ниже:
