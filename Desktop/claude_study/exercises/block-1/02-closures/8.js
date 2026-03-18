// ========== Задание Замыкания #8 — IIFE ==========
// Уровень: 🟡
//
// 1. Создай модуль `counter` через IIFE, который возвращает объект с:
//    - `increment()` — увеличивает приватный счётчик
//    - `getCount()` — возвращает значение
//    Переменная count должна быть изолирована внутри IIFE.
//
// 2. Создай модуль `config` через IIFE:
//    - Внутри IIFE объяви приватные переменные: debug = false, version = "1.0"
//    - Верни объект с методами:
//      - `isDebug()` — возвращает debug
//      - `getVersion()` — возвращает version
//      - `enableDebug()` — устанавливает debug = true
//
// Тесты:
// counter.increment();
// counter.increment();
// console.log(counter.getCount()); // 2
//
// console.log(config.isDebug());   // false
// config.enableDebug();
// console.log(config.isDebug());   // true
// console.log(config.getVersion()); // "1.0"
//
// 📖 Раздел учебника: "IIFE" → notes/js-advanced/02-closures.md
// ================================================

// Пиши код ниже:
