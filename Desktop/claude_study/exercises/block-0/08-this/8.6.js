// ============================================
// Задание 8.6 — this в коллбэках
// Уровень: 🔴 Продвинутый
// ============================================
//
// 📖 Раздел учебника: "Типичная ловушка", "bind()" (08-this.md)
//
// --- Описание ---
// Когда метод передаётся как коллбэк (в другую функцию) — this теряется.
// Это самая частая причина багов с this в реальном коде.
//
// --- Что нужно сделать ---
//
// Часть 1 — потеря this при передаче метода как коллбэка:
//
// const counter = {
//   count: 0,
//   increment() {
//     this.count++;
//     console.log("count: " + this.count);
//   }
// };
//
// function runCallback(callback) {
//   callback(); // вызов без контекста — this потерян!
// }
//
// 1. Скопируй код, вызови:
//    counter.increment();          // работает? что выведет?
//    runCallback(counter.increment); // работает? что выведет?
//
// 2. Объясни в комментарии: почему runCallback теряет this?
//    Подсказка: что происходит когда counter.increment присваивается
//    в параметр callback?
//
// 3. Исправь вызов через bind:
//    runCallback(counter.increment.bind(counter));
//    Проверь что теперь работает правильно.
//
// 4. Исправь вызов через стрелочную обёртку:
//    runCallback(() => counter.increment());
//    Объясни почему это работает.
//
// Часть 2 — this сохраняется при вызове через точку:
//
// const calculator = {
//   result: 0,
//
//   add(n) {
//     this.result += n;
//     return this;  // возвращаем объект для цепочки
//   },
//
//   subtract(n) {
//     this.result -= n;
//     return this;
//   },
//
//   multiply(n) {
//     this.result *= n;
//     return this;
//   },
//
//   getResult() {
//     return this.result;
//   }
// };
//
// 5. Вызови цепочкой:
//    calculator.add(10).subtract(3).multiply(2).getResult()
//    Что вернёт? Объясни почему this не теряется в цепочке.
//    Подсказка: каждый метод вызывается через точку.
//
// 6. Теперь попробуй "оторвать" метод:
//    const add = calculator.add;
//    add(5); // что произойдёт? Почему?
//
// Часть 3 — комплексная задача:
//
// 7. Создай объект taskRunner:
//    const taskRunner = {
//      name: "Runner",
//      tasks: [],
//
//      addTask(description, action) — добавляет { description, action } в this.tasks
//        - Если description falsy (!description) — используй значение по умолчанию через || : "Без названия"
//        - Если typeof action !== "function" — не добавляй, верни false
//        - Если всё ок — добавь и верни true
//
//      runAll() — проходит по this.tasks, для каждой:
//        console.log(this.name + " выполняет: " + task.description);
//        task.action();
//    };
//
// 8. Создай объект logger:
//    const logger = {
//      prefix: "[LOG]",
//      log(message) {
//        console.log(this.prefix + " " + message);
//      }
//    };
//
// 9. Добавь задачу в taskRunner:
//    taskRunner.addTask("Логирование", logger.log.bind(logger, "Задача выполнена"));
//
//    Без bind — this.prefix будет undefined.
//    С bind — всё работает.
//
// 10. Добавь ещё 2 задачи с разными объектами и методами.
//     Каждый раз привязывай this через bind.
//
// 11. Проверь граничные случаи addTask:
//     taskRunner.addTask("", logger.log.bind(logger, "test"));   // → description заменится на "Без названия"
//     taskRunner.addTask("Тест", null);                          // → false (action не функция)
//     taskRunner.addTask("Тест", "строка");                      // → false (typeof !== "function")
//
// --- Тесты ---
// counter.increment()                → "count: 1" (this = counter)
// runCallback(counter.increment)     → ошибка или "count: NaN" (this потерян)
// runCallback(counter.increment.bind(counter)) → "count: 2" (this привязан)
// runCallback(() => counter.increment())       → "count: 3" (вызов через точку)
//
// calculator.add(10).subtract(3).multiply(2).getResult() → 14
//
// taskRunner.runAll() → выводит все задачи с правильным контекстом
//
// --- Ключевая концепция ---
// Передача метода как коллбэка = потеря this.
// Вызов через точку (obj.method()) = this сохраняется.
// Цепочка вызовов работает потому что каждый метод вызывается через точку.
// В реальном коде (React, обработчики событий) — ВСЕГДА привязывай this через bind
// или используй стрелочную обёртку.
