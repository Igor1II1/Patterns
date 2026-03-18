// ========== Практикум R1.4 -- Темы 1+2+3 (предсказания) ==========
// Что выведет каждый блок? Напиши ответ в комментарии ПЕРЕД запуском.
// Потом запусти node practice-4.js и проверь себя.

// --- Блок 1: типы и приведение (тема 1) ---
console.log(typeof null);          // object но это ошибка с 1995 года , правильно проверять value==null, value===null
console.log(typeof [1, 2]);        // array, это тоже объект
// ❌ Ответ: "object", не "array". typeof не умеет отличать массив от объекта —
// для него и {}, и [] это "object". Чтобы проверить массив, нужен Array.isArray([1,2]) → true
console.log(5 + "3");              // 53 строкой
console.log("5" - 2);             // 3 числом
console.log(true + true);          // 2 числом
console.log(NaN === NaN);          // true
// ❌ Ответ: false. NaN — единственное значение в JS, которое не равно самому себе.
// NaN === NaN → false. Именно поэтому нужен Number.isNaN() для проверки.

// --- Блок 2: логические операторы и условия (темы 1+2) ---
console.log(0 || null || "найден"); // "найден"
console.log(1 && 0 && 3);           // false
// ❌ Ответ: 0, не false. && возвращает САМО falsy-значение, а не boolean.
// 1 — truthy, идём дальше → 0 — falsy, возвращаем 0. До 3 даже не дошли.
// Так же: null && "x" → null (не false), "" && "x" → "" (не false)
console.log(0 ?? "дефолт");         // 0
console.log("" ?? "дефолт");        // ""
console.log("" || "дефолт");        // "дефолт"

// --- Блок 3: циклы (тема 3) ---

// Что выведет? Сколько раз?
for (let i = 3; i >= 1; i--) {
  console.log(i);                   // 3,2,1
}

// Что выведет?
const arr = [10, 20, 30];
for (let i = 0; i <= arr.length; i++) {
  console.log(arr[i]);              // 10, 20,30, undefined
}

// Что выведет?
let result = 0;
const nums = [3, 7, 2, 9, 1];
for (const n of nums) {
  if (n > 7) break;
  result += n;
}
console.log(result);                // 0 потому что break написан до  result += n это условие не выполнится потому что после break цикл заканчивается и все что после не выполнится
// ❌ Ответ: 12. Ошибка в логике: break срабатывает ТОЛЬКО когда n > 7.
// Пошагово: n=3 (3>7? нет, result=3), n=7 (7>7? нет, 7 НЕ больше 7, result=10),
// n=2 (2>7? нет, result=12), n=9 (9>7? ДА — break!). Итого result = 3+7+2 = 12.
// Твоя ошибка: ты подумал что break сработает сразу, но условие n>7 не выполнялось до числа 9.

// Что выведет?
let str = "";
for (const char of "JavaScript") {
  if (char === "S") break;
  str = str + char;
}
console.log(str);                   // Java

