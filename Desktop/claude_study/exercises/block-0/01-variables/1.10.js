// ========== Задание 1.10 ==========
// Напиши функцию isValidAge(value) которая проверяет корректность возраста.
// Условия (все три одновременно):
//   - значение является числом (не строка, не null, не NaN)
//   - значение целое (не дробное)
//   - значение в диапазоне 0-150 включительно
// Инструмент: Number.isInteger(value) — проверяет и тип и целостность сразу.
// Раздел учебника: "Оператор typeof", "Примитивные типы -> number"

function isValidAge(value){
    if(Number.isInteger(value) && value>= 0 && value<=150 ){
        return true
    }else{
        return false
    }
}



console.log(isValidAge(25));    // true
console.log(isValidAge(0));     // true
console.log(isValidAge(150));   // true
console.log(isValidAge(-1));    // false — отрицательный
console.log(isValidAge(151));   // false — слишком большой
console.log(isValidAge(25.5));  // false — дробный
console.log(isValidAge("25"));  // false — строка
console.log(isValidAge(null));  // false — null
console.log(isValidAge(NaN));   // false — NaN

// ========== Разбор задания ==========
// Что делали:    функция isValidAge — валидация что значение является корректным возрастом.
// Почему так:    Number.isInteger() одновременно проверяет тип (number) и целостность (нет дробей).
//                Один метод отсекает: строки, null, NaN, undefined, дроби — всё сразу.
//                Диапазон 0-150 пишется через && (нельзя 0 < v <= 150 — JS вычисляет слева направо).
// Для чего:      валидация входных данных — обязательная практика.
//                Нельзя доверять внешним данным: всегда проверяй перед работой со значением.
// Главное понять: Number.isInteger() — мощный инструмент для валидации чисел.
//                Можно сократить до одной строки (вернуть само условие):
//                  return Number.isInteger(value) && value >= 0 && value <= 150;
//                Условие && уже возвращает true/false — if/else не обязателен.