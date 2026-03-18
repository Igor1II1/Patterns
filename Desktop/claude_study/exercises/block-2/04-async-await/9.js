// ========== Задание async/await #9 — Распространённые ошибки ==========
// Уровень: 🔴
//
// В каждом примере есть ошибка, связанная с async/await.
// Найди ошибку, объясни её и исправь.
//
// 📖 Раздел учебника: "Распространённые ошибки" → notes/js-async/04-async-await.md
// ================================================

// Пиши код ниже:

function задержка(мс) {
  return new Promise(resolve => setTimeout(resolve, мс));
}

function получитьДанные() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ name: "Игорь" }), 500);
  });
}

// ОШИБКА 1: забыт await
// async function пример1() {
//   const данные = получитьДанные();
//   console.log(данные.name); // undefined — почему?
// }
// Исправь:


// ОШИБКА 2: нет обработки ошибок
// async function пример2() {
//   const данные = await fetch("https://несуществующий.домен");
//   const json = await данные.json();
//   console.log(json);
// }
// Исправь (добавь try/catch):


// ОШИБКА 3: лишний await
// async function пример3() {
//   const x = await 42;
//   const y = await "строка";
//   console.log(x + " " + y);
// }
// Объясни, почему await здесь лишний:


// ОШИБКА 4: последовательные независимые запросы (медленно)
// async function пример4() {
//   const a = await получитьДанные();
//   const b = await получитьДанные();
//   const c = await получитьДанные();
//   console.log(a, b, c);
// }
// Исправь (сделай параллельно):
