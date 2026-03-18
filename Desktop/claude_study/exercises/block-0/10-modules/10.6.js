// ============================================
// Задание 10.6 — Динамический импорт
// Уровень: 🟡 Средний
// ============================================
//
// 📖 Раздел учебника: "Динамический импорт (import())" (10-modules.md)
//
// --- Описание ---
// import() — функция, которая загружает модуль ДИНАМИЧЕСКИ (по требованию).
// Возвращает Promise. Используется для ленивой загрузки.
//
// ⚠️ МИНИ-СПРАВКА: Promise и async/await
// import() возвращает Promise — это объект, представляющий результат
// операции, которая завершится в будущем. Подробно Promise изучается
// в Блоке 2 (js-async). Здесь достаточно знать:
//   - .then(callback) — вызывает callback когда Promise разрешится
//   - Внутри .then() получаем загруженный модуль как объект
//
// --- Что нужно сделать ---
//
// 1. Напиши код который загружает модуль math.js ДИНАМИЧЕСКИ:
//
//    function calculate(operation, a, b) {
//      import("./math.js").then(function(math) {
//        // math.add, math.subtract, etc.
//        // Вызови нужную функцию по названию operation
//        if (operation === "add") {
//          console.log(math.add(a, b));
//        } else if (operation === "multiply") {
//          console.log(math.multiply(a, b));
//        }
//        // ... добавь остальные операции
//      });
//    }
//
//    calculate("add", 2, 3);      // 5
//    calculate("multiply", 4, 5); // 20
//
// 2. Объясни в комментарии:
//    - Чем import() отличается от import ... from "..."?
//    - Когда использовать динамический импорт?
//    - Что такое "ленивая загрузка" (lazy loading)?
//
// 3. Покажи пример условного импорта:
//    if (условие) {
//      import("./heavy-module.js").then(function(module) {
//        module.doSomething();
//      });
//    }
//    // Объясни: почему это нельзя сделать через обычный import?
//
// 4. (Накопительное: объекты + массивы + функции + условия + ошибки + this)
//    Создай файл data-processor.js:
//
//    export function processItems(items, options) {
//      // items — массив объектов: [{ name: "...", price: 100 }, ...]
//      // options — необязательный (используй ?? {} для значения по умолчанию)
//      //   options.currency — валюта для отчёта (по умолчанию ?? "RUB")
//      //   options.discountPercent — скидка в % (по умолчанию ?? 0)
//      // Проверяет каждый элемент:
//      //   - Если name не строка или falsy (!item.name) — бросает TypeError
//      //   - Если price — строка, приведи к Number(item.price); если результат NaN — бросает RangeError
//      //   - Если price не число или < 0 — бросает RangeError
//      //   - Применяй скидку: finalPrice = price * (1 - discountPercent / 100)
//      // Возвращает объект:
//      //   { count: кол-во, total: сумма finalPrice, currency: "RUB", names: массив имён через ", " }
//    }
//
//    export const stats = {
//      history: [],
//      run(items) {
//        // Вызывает processItems(items) в try/catch
//        // При успехе — сохраняет результат в this.history (push)
//        // При ошибке — сохраняет { error: error.message } в this.history
//        // Возвращает результат или null
//      },
//      getHistory() {
//        return this.history;  // используем this
//      }
//    };
//
//    В main.js — загрузи data-processor.js ДИНАМИЧЕСКИ:
//    import("./data-processor.js").then(function(mod) {
//      mod.stats.run([{ name: "Ноутбук", price: 50000 }, { name: "Мышь", price: 1500 }]);
//      mod.stats.run([{ name: "", price: -1 }]);  // ошибка
//      console.log(mod.stats.getHistory());
//    });
//
// --- Тесты задания 1-3 ---
// calculate("add", 2, 3)      → выведет 5
// calculate("multiply", 4, 5) → выведет 20
//
// --- Тесты задания 4 ---
// processItems([{ name: "A", price: 100 }, { name: "B", price: 200 }])
//   → { count: 2, total: 300, currency: "RUB", names: "A, B" }
// processItems([{ name: "A", price: "100" }, { name: "B", price: 200 }], { discountPercent: 10 })
//   → { count: 2, total: 270, currency: "RUB", names: "A, B" }  // "100"→Number→90, 200→180
// processItems([{ name: "", price: 100 }])
//   → TypeError
// processItems([{ name: "A", price: "abc" }])
//   → RangeError (Number("abc") → NaN)
// stats.run([{ name: "X", price: 50 }])
//   → { count: 1, total: 50, names: "X" }, добавлено в history
// stats.run([{ name: "", price: -1 }])
//   → null, ошибка добавлена в history
// stats.getHistory()
//   → [{ count: 1, total: 50, names: "X" }, { error: "..." }]
//
// --- Ключевая концепция ---
// import ... from = статический (в начале файла, всегда загружается).
// import() = динамический (когда нужно, возвращает Promise).
// .then() — способ получить результат из Promise (подробно — в Блоке 2).
// Динамический импорт позволяет загружать модули с объектами, методами (this) и обработкой ошибок.
