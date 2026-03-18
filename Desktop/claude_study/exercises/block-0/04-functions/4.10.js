// ============================================
// Задание 4.10 — Рекурсия (продолжение)
// Уровень: 🟡 Средний
// ============================================
//
// 📖 Раздел учебника: "Рекурсия" (04-functions.md)
//
// --- Описание ---
// Рекурсия — это когда функция вызывает сама себя.
// Чтобы рекурсия не была бесконечной, нужен БАЗОВЫЙ СЛУЧАЙ —
// условие, при котором функция перестаёт вызывать себя и возвращает результат.
//
// Структура рекурсивной функции:
//   function рекурсия(параметр) {
//     if (базовый_случай) return результат;  // ← остановка
//     return рекурсия(изменённый_параметр);   // ← вызов самой себя
//   }
//
// В задании 4.9 ты писал factorial, fibonacci и sumRange.
// Здесь — новые задачи на рекурсию, чтобы закрепить паттерн.
//
// --- Что нужно сделать ---
//
// 1. Напиши функцию power(base, exp) — возведение в степень через рекурсию.
//    НЕ используй Math.pow или оператор **.
//    power(2, 3) = 2 * 2 * 2 = 8
//    Базовый случай: power(base, 0) = 1 (любое число в степени 0 = 1)
//    Рекурсивный случай: power(base, exp) = base * power(base, exp - 1)
//
// 2. Напиши функцию countDigits(n) — считает количество цифр в числе.
//    Число всегда целое положительное.
//    countDigits(7)     = 1
//    countDigits(42)    = 2
//    countDigits(12345) = 5
//    Подсказка: последнюю цифру можно "убрать" через Math.floor(n / 10).
//    Базовый случай: если n < 10, это одна цифра → вернуть 1.
//    Рекурсивный случай: 1 + countDigits(Math.floor(n / 10))
//
// 3. Напиши функцию sumDigits(n) — сумма цифр числа.
//    Число всегда целое положительное.
//    sumDigits(123) = 1 + 2 + 3 = 6
//    sumDigits(49)  = 4 + 9 = 13
//    Подсказка: последняя цифра = n % 10, остальное = Math.floor(n / 10).
//    Базовый случай: если n < 10, вернуть n (это одна цифра).
//    Рекурсивный случай: (n % 10) + sumDigits(Math.floor(n / 10))
//
// --- Тесты ---
// power(2, 0)   → 1
// power(2, 1)   → 2
// power(2, 3)   → 8
// power(2, 10)  → 1024
// power(3, 4)   → 81
// power(5, 3)   → 125
//
// countDigits(0)     → 1  (ноль — это одна цифра)
// countDigits(7)     → 1
// countDigits(42)    → 2
// countDigits(100)   → 3
// countDigits(12345) → 5
//
// sumDigits(5)    → 5
// sumDigits(123)  → 6
// sumDigits(49)   → 13
// sumDigits(999)  → 27
// sumDigits(1000) → 1
//
// --- Ключевая концепция ---
// Рекурсия = базовый случай + рекурсивный случай.
// Каждый рекурсивный вызов должен ПРИБЛИЖАТЬ к базовому случаю,
// иначе функция будет вызывать себя бесконечно → ошибка "Maximum call stack size exceeded".
//
// Здесь использованы только: переменные, условия, функции, рекурсия.
// Никаких массивов, объектов или замыканий.

// Пиши код ниже:

function power(base, exp) {
  if (exp === 0) return 1;
   return base * power(base, exp - 1)
}

console.log("1. Напиши функцию power(base, exp) — возведение в степень через рекурсию.")
console.log(power(2, 0))
console.log(power(2, 1))
console.log(power(2, 3))
console.log(power(2, 10))
console.log(power(3, 4))
console.log(power(5, 3))




function countDigits(n){
    if(n<10) return 1;
    return 1 + countDigits(Math.floor(n / 10))
    
} 


console.log("2. Напиши функцию countDigits(n) — считает количество цифр в числе.")
console.log(countDigits(0))
console.log(countDigits(7))
console.log(countDigits(42))
console.log(countDigits(100))
console.log(countDigits(12345))


function sumDigits(n){
    if( n < 10)return n;
    return (n % 10) + sumDigits(Math.floor(n / 10))
}


console.log("3. Напиши функцию sumDigits(n) — сумма цифр числа.")
console.log(sumDigits(5))
console.log(sumDigits(123))
console.log(sumDigits(49))
console.log(sumDigits(999))
console.log(sumDigits(1000))