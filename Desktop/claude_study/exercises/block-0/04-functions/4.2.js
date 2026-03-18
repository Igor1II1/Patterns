// ============================================
// Задание 4.2 — Hoisting функций
// Уровень: 🟢 Базовый
// ============================================
//
// 📖 Раздел учебника: "Hoisting функций" (04-functions.md)
//
// --- Описание ---
// Function Declaration поднимается целиком — можно вызвать до объявления.
// Function Expression и Arrow — НЕ поднимаются (TDZ, как let/const).
//
// --- Что нужно сделать ---
//
// Шаг A — В ЧАТ (до запуска):
// Для каждого блока скажи: что выведет? Ошибка? Значение?
//
// // Блок 1:
// console.log(sum(2, 3));
// function sum(a, b) { return a + b; }
//
// // Блок 2:
// console.log(multiply(2, 3));
// const multiply = function(a, b) { return a * b; };
//
// // Блок 3:
// console.log(divide(10, 2));
// const divide = (a, b) => a / b;
//
// // Блок 4:
// console.log(typeof greet);
// console.log(typeof farewell);
// function greet() { return "Привет"; }
// var farewell = function() { return "Пока"; };
//
// Шаг B — В ФАЙЛ:
// 1. Скопируй все 4 блока и к каждой строке добавь комментарий
// 2. Ответь в комментарии:
//    - Почему var farewell не вызывает ошибку, но undefined?
//    - Почему const multiply вызывает ошибку, а не undefined?
//
// --- Тесты ---
// Блок 1: 5 (Declaration поднимается)
// Блок 2: ReferenceError (const в TDZ)
// Блок 3: ReferenceError (const в TDZ)
// Блок 4: "function" и "undefined" (var поднимает объявление, но не значение)
//
// --- Ключевая концепция ---
// Только Function Declaration поднимается целиком.
// const/let + функция = TDZ до строки объявления.



// // Блок 1: значение 5 происходит поднятие
console.log(sum(2, 3));
function sum(a, b) { return a + b; }

// // Блок 2: ReferenceError const/let  подымаются но не инициализируются до строки объявления
console.log(multiply(2, 3));
const multiply = function(a, b) { return a * b; };

// Блок 3: ReferenceError const/let  подымаются но не инициализируются до строки объявления
console.log(divide(10, 2));
const divide = (a, b) => a / b;

// // Блок 4: function, undefined c var происходит поднятие
console.log(typeof greet);
console.log(typeof farewell);
function greet() { return "Привет"; }
var farewell = function() { return "Пока"; };


//    - Почему var farewell не вызывает ошибку, но undefined? потому что var подымаетс наверх он объявлен но не инициализирован поэтому undefined
//    - Почему const multiply вызывает ошибку, а не undefined? const/let попадают в tdz они не подымаются наверх, поэтому ReferenceError


// ========== РАЗБОР ЗАДАНИЯ ==========
//
// --- Что делали ---
// Предсказывали вывод 4 блоков кода на тему hoisting функций.
//
// --- Пошаговый разбор ---
// Блок 1: Function Declaration поднимается ЦЕЛИКОМ (и имя, и тело).
//         Поэтому sum(2,3) работает до строки объявления → 5.
//
// Блок 2: const + Function Expression — const в TDZ до строки объявления.
//         multiply не существует → ReferenceError.
//
// Блок 3: const + Arrow — то же что блок 2. Arrow — тоже expression.
//         divide не существует → ReferenceError.
//
// Блок 4:
//   typeof greet → "function" (Declaration поднята целиком)
//   typeof farewell → "undefined" (var поднимает ОБЪЯВЛЕНИЕ, не значение.
//   farewell = undefined до строки присваивания)
//
// --- Ошибки при решении ---
// Ошибка: typeof greet — сказал "object" (правильно "function")
// Как запомнить: typeof для функций возвращает "function", не "object"
//
// --- Что должен был усвоить ---
// 1. Только Function Declaration поднимается целиком
// 2. const/let + функция = TDZ, как обычная переменная
// 3. var поднимает объявление (undefined), не значение
// 4. typeof function = "function" (не "object")
//
// --- Для чего в реальной разработке ---
// Понимание hoisting помогает избегать багов с порядком кода.
// В современном JS используют const/let → порядок объявления важен.