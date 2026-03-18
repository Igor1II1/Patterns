// ========== Задание Продвинутые функции #3 — setTimeout и setInterval ==========
// Уровень: 🟢
//
// 1. Используй setTimeout для вывода "Таймер сработал!" через 1 секунду.
//
// 2. Используй setInterval для вывода "Тик!" каждую секунду.
//    Останови интервал через 5 секунд с помощью clearInterval.
//
// 3. Напиши функцию `delay(ms)` которая возвращает промис (используй setTimeout):
//    Это пригодится в будущем для async/await.
//
// Тесты:
// setTimeout(() => console.log("Таймер сработал!"), 1000);
//
// let count = 0;
// const intervalId = setInterval(() => {
//   count++;
//   console.log(`Тик! (${count})`);
//   if (count >= 5) clearInterval(intervalId);
// }, 1000);
//
// // Функция delay:
// function delay(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
// delay(2000).then(() => console.log("2 секунды прошли!"));
//
// 📖 Раздел учебника: "setTimeout и setInterval" → notes/js-advanced/10-advanced-functions.md
// ================================================

// Пиши код ниже:
