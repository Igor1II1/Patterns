// ========== Задание Продвинутые классы #1 — Static метод ==========
// Уровень: 🟢
//
// Создай класс `MathUtils` со статическими методами:
// - `static clamp(value, min, max)` — ограничивает value в диапазоне [min, max]
// - `static randomInt(min, max)` — случайное целое число от min до max включительно
//
// Тесты:
// console.log(MathUtils.clamp(150, 0, 100)); // 100
// console.log(MathUtils.clamp(-5, 0, 100));  // 0
// console.log(MathUtils.clamp(50, 0, 100));  // 50
//
// const r = MathUtils.randomInt(1, 6);
// console.log(r >= 1 && r <= 6); // true
//
// // Нельзя вызвать через экземпляр:
// // const m = new MathUtils();
// // m.clamp(5, 0, 10); // TypeError
//
// 📖 Раздел учебника: "Static методы" → notes/js-advanced/04-classes-advanced.md
// ================================================

// Пиши код ниже:
