// ========== Задание Продвинутые классы #2 — Фабричный метод (static) ==========
// Уровень: 🟢
//
// Создай класс `Color` с:
// - конструктором `(r, g, b)`
// - статическим методом `static fromHex(hex)` — создаёт Color из hex-строки "#ff0000"
// - статическим методом `static fromArray([r, g, b])` — создаёт Color из массива
// - методом `toString()` — возвращает `"rgb(r, g, b)"`
//
// Тесты:
// const red = Color.fromHex("#ff0000");
// console.log(red.toString()); // "rgb(255, 0, 0)"
//
// const green = Color.fromArray([0, 255, 0]);
// console.log(green.toString()); // "rgb(0, 255, 0)"
//
// const blue = new Color(0, 0, 255);
// console.log(blue.toString()); // "rgb(0, 0, 255)"
//
// 📖 Раздел учебника: "Фабричный метод" → notes/js-advanced/04-classes-advanced.md
// ================================================

// Пиши код ниже:
