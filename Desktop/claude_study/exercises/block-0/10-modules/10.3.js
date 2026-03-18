// ============================================
// Задание 10.3 — Импорт с переименованием и wildcard
// Уровень: 🟢 Базовый
// ============================================
//
// 📖 Раздел учебника: "Переименование при импорте", "Wildcard import" (10-modules.md)
//
// --- Описание ---
// import { x as y } — переименование при импорте.
// import * as module — импортирует ВСЁ как один объект.
//
// --- Что нужно сделать ---
//
// 1. Переименование (as):
//    Предположим, у тебя два модуля с одинаковым именем функции:
//
//    // utils/format.js: export function format(str) { ... }
//    // utils/date.js:   export function format(date) { ... }
//
//    Импортируй обе в main.js без конфликта:
//    import { format as formatString } from "./utils/format.js";
//    import { format as formatDate } from "./utils/date.js";
//
//    Напиши оба файла и покажи использование.
//
// 2. Wildcard import (* as):
//    import * as MathUtils from "./math.js";
//    MathUtils.add(2, 3);
//    MathUtils.PI;
//
//    Напиши код используя wildcard import для math.js из задания 10.1.
//    Объясни в комментарии: когда wildcard удобнее?
//
// ⚠️ МИНИ-СПРАВКА: new Date()
// Date — встроенный объект JS для работы с датами. Подробно изучается
// в Блоке 1 (js-advanced/08-date-math.md). Здесь достаточно знать:
//   - new Date() — создаёт объект с текущей датой и временем
//   - date.getDate() — число месяца (1-31)
//   - date.getMonth() — месяц (0-11, поэтому +1)
//   - date.getFullYear() — год (4 цифры)
//
// --- Тесты ---
// formatString("  hello  ") → "hello" (trim)
// formatDate(new Date())    → "13.03.2026" (дата в формате DD.MM.YYYY)
//
// MathUtils.add(2, 3)  → 5
// MathUtils.PI         → 3.14159
//
// --- Ключевая концепция ---
// as — решает конфликты имён.
// * as — когда нужно всё из модуля, или для неймспейсинга.
