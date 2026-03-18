// ========== Задание Date и Math #8 — toString(radix) и системы счисления ==========
// Уровень: 🟡
//
// 1. Переведи число 255 в двоичную, восьмеричную и шестнадцатеричную системы
//    через toString(radix).
//
// 2. Напиши функцию `randomHexColor()`, генерирующую случайный hex-цвет "#RRGGBB"
//    Подсказка: randomInt(0, 255).toString(16).padStart(2, '0')
//
// 3. Используй parseInt с основанием для обратной конвертации:
//    - "ff" из 16-ричной → 255
//    - "11111111" из двоичной → 255
//
// Тесты:
// console.log((255).toString(16)); // "ff"
// console.log((255).toString(2));  // "11111111"
// console.log((255).toString(8));  // "377"
//
// const color = randomHexColor();
// console.log(color); // например "#a3f29b"
// console.log(/^#[0-9a-f]{6}$/.test(color)); // true
//
// console.log(parseInt("ff", 16));       // 255
// console.log(parseInt("11111111", 2));   // 255
//
// 📖 Раздел учебника: "Форматирование числа" → notes/js-advanced/08-date-math.md
// ================================================

// Пиши код ниже:
