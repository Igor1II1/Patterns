// ============================================
// Задание 4.1 — Три способа объявить функцию
// Уровень: 🟢 Базовый
// ============================================
//
// 📖 Раздел учебника: "Три способа объявить функцию" (04-functions.md)
//
// --- Описание ---
// В JS есть три способа создать функцию:
// 1. Function Declaration — function name() {}
// 2. Function Expression — const name = function() {}
// 3. Arrow Function — const name = () => {}
//
// --- Что нужно сделать ---
//
// Для каждой из трёх функций ниже напиши ВСЕ три варианта:
//
// 1. greet(name) → "Привет, {name}!"
// 2. isAdult(age) → true если age >= 18, иначе false
// 3. square(n) → n в квадрате (n * n)
//
// Итого: 9 функций (3 задачи × 3 способа).
// Для стрелочных функций используй краткую запись
// (без фигурных скобок), где это возможно.
//
// Проверь каждую через console.log.
//
// --- Тесты ---
// greet("Игорь")   → "Привет, Игорь!"
// isAdult(18)      → true
// isAdult(15)      → false
// square(5)        → 25
//
// --- Ключевая концепция ---
// Declaration — поднимается (hoisting), можно вызвать до объявления
// Expression — НЕ поднимается, присвоена переменной
// Arrow — краткий синтаксис, НЕ имеет своего this


// 1. Function Declaration
function greet1(name){
    return `Привет, ${name}!`
};


// 2. Function Expression
const greet2 = function (name){
    return `Привет, ${name}!`
};



// 3. Arrow Function
const greet3 = (name)=> {return `Привет, ${name}!`};
const greet4 = (name)=> `Привет, ${name}!`;
const greet5 =  name => `Привет, ${name}!`;



// 1. Function Declaration
function isAdult1(age){
    return age>=18 
};


// 2. Function Expression
const isAdult2 =  function (age){
    return age>=18 
};


// 3. Arrow Function
const isAdult3= (age)=>{return age>=18 };
const isAdult4 = (age) => age>=18;
const isAdult5 =  age => age>=18;



function square1(n){
    return n*n
};

const square2 = function(n){
    return n*n
};

const square3 = (n)=>{return n*n};
const square4 = (n)=> n*n;
const square5 = n=> n*n;




console.log(greet1("Игорь"))
console.log(greet2("Игорь"))
console.log(greet3("Игорь"))
console.log(greet4("Игорь"))
console.log(greet5("Игорь"))



console.log(isAdult1(19))
console.log(isAdult2(20))
console.log(isAdult3(14))
console.log(isAdult4(12))
console.log(isAdult5(18))


console.log(square1(2))
console.log(square2(3))
console.log(square3(4))
console.log(square4(5))
console.log(square5(6))


// ========== РАЗБОР ЗАДАНИЯ ==========
//
// --- Что делали ---
// Написали 3 функции (greet, isAdult, square) тремя способами каждую:
// Declaration, Expression, Arrow (включая варианты arrow-записи).
//
// --- Пошаговый разбор ---
// 1. Function Declaration: function name() {} — поднимается (hoisting),
//    можно вызвать до объявления в коде.
// 2. Function Expression: const name = function() {} — НЕ поднимается,
//    присваивается переменной, доступна только после строки объявления.
// 3. Arrow Function: const name = () => {} — краткий синтаксис.
//    Три варианта записи:
//    a) (name) => { return ... }  — полная запись с телом
//    b) (name) => ...             — краткая (неявный return, без {})
//    c) name => ...               — без скобок (только для 1 параметра)
//
// --- Ошибки при решении ---
// Ошибка: в greet1 написал `Привет,${name}!` без пробела после запятой
// Как правильно: `Привет, ${name}!` — пробел после запятой
// Ошибка: isAdult писал age >= 18 ? true : false — лишний тернарный
// Как правильно: age >= 18 уже возвращает boolean, тернарный не нужен
//
// --- Что должен был усвоить ---
// 1. Три способа создать функцию и отличия между ними
// 2. Arrow function — краткая запись (без {}, без return, без скобок)
// 3. Если условие уже boolean — не оборачивай в ? true : false
//
// --- Для чего в реальной разработке ---
// Arrow-функции — основной способ в React и современном JS.
// Declaration — для главных функций файла. Expression — редко.
