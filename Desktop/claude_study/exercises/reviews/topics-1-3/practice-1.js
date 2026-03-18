// ========== Практикум R1.1 -- Темы 1+2+3 ==========
// Напиши функцию analyzeArray(arr) которая проходит по массиву и для каждого
// элемента определяет: тип (typeof), falsy/truthy, и если число — знак.
// Возвращает массив строк с описанием.
//
// Используй:
//   - for...of для перебора массива (тема 3)
//   - typeof для определения типа (тема 1)
//   - if/else if для определения знака (тема 2)
//   - push для добавления в результат
//
// analyzeArray([0, "hello", null, -5, true])
// [
//   "number, falsy, ноль",
//   "string, truthy",
//   "object, falsy",
//   "number, truthy, отрицательное",
//   "boolean, truthy"
// ]

// analyzeArray([42, "", undefined])
//  [
//   "number, truthy, положительное",
//   "string, falsy",
//   "undefined, falsy"
// ]
//
// Забегая вперёд — массивы (глава 6):
// const result = [];          // пустой массив
// result.push(элемент);       // добавить в конец
//
// Раздел учебника: "for...of" (js/03-loops.md) + "typeof" (js/01-variables.md)
//                  + "if/else" (js/02-conditions.md)

function analyzeArray(arr) {
  const result = [];
  for (const el of arr) {
    let description = typeof el;
    if (el) {
      description = description + ", truthy";
    } else {
      description = description + ", falsy";
    }
    if (typeof el === "number") {
      if (el > 0) {
        description = description + ", положительное";
      } else if (el < 0) {
        description = description + ", отрицательное";
      } else {
        description = description + ", ноль";
      }
    }
    result.push(description);
  }
  return result;
}

console.log(analyzeArray([0, "hello", null, -5, true]));
console.log(analyzeArray([42, "", undefined]));

// ========== Разбор задания ==========
// Что делали:    Функция проходит по массиву, для каждого элемента собирает строку-описание:
//                тип (typeof) + falsy/truthy + знак числа (если это число).
//
// Почему так:    Строка description собирается по частям через конкатенацию.
//                description = description + ", truthy" — ДОБАВЛЯЕТ к существующей строке.
//                description = el + ", truthy" — ЗАТИРАЕТ строку значением элемента (ошибка!).
//
// Вложенный if:  Внутри любого блока { } можно писать любой код, включая другой if.
//                Внешний if (typeof el === "number") работает как ФИЛЬТР —
//                проверка знака выполняется ТОЛЬКО для чисел.
//                Для строк, boolean, null — этот блок просто пропускается.
//
//   Пример для элемента -5:
//     Шаг 1: description = typeof(-5)           → "number"
//     Шаг 2: if(-5) → truthy                    → "number, truthy"
//     Шаг 3: typeof(-5) === "number" → да, заходим
//       Шаг 3.1: -5 > 0? нет
//       Шаг 3.2: -5 < 0? да                     → "number, truthy, отрицательное"
//     Шаг 4: result.push("number, truthy, отрицательное")
//
//   Пример для элемента "hello":
//     Шаг 1: description = typeof("hello")      → "string"
//     Шаг 2: if("hello") → truthy               → "string, truthy"
//     Шаг 3: typeof("hello") === "number"? НЕТ  → пропускаем весь блок
//     Шаг 4: result.push("string, truthy")
//
// Для чего:      Анализ данных — частая задача. В реальных проектах: валидация входных данных,
//                логирование, отладка — нужно понимать что пришло и какого оно типа.
// Главное понять: description = description + ... (добавлять к строке, не затирать).
//                Вложенный if — это фильтр: дополнительная проверка выполняется
//                только когда внешнее условие true.
