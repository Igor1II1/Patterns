// ========== Практикум R1.6 -- Темы 1+2+3 ==========
// Напиши функцию filterProducts(products, filters) которая фильтрует товары
// по нескольким критериям и возвращает подходящие.
//
// Фильтры — объект с необязательными полями:
//   - minPrice (число или undefined)
//   - maxPrice (число или undefined)
//   - inStock (true/false или undefined)
//
// Если фильтр undefined — не применять его (пропустить проверку).
// Используй ?? чтобы определить "фильтр не задан".
//
// Используй:
//   - for...of для перебора товаров (тема 3)
//   - continue для пропуска неподходящих (тема 3)
//   - typeof, ?? для проверки наличия фильтра (тема 1)
//   - if для каждого фильтра (тема 2)
//   - push для сборки результата
//
// const products = [
//   { name: "Мышь", price: 1500, inStock: true },
//   { name: "Клавиатура", price: 3000, inStock: false },
//   { name: "Монитор", price: 25000, inStock: true },
//   { name: "Наушники", price: 5000, inStock: true },
//   { name: "Кабель", price: 300, inStock: false },
// ];
//
// filterProducts(products, { minPrice: 1000, maxPrice: 5000 })
// → [Мышь, Клавиатура, Наушники]  (price от 1000 до 5000)
//
// filterProducts(products, { inStock: true })
// → [Мышь, Монитор, Наушники]  (только в наличии)
//
// filterProducts(products, { minPrice: 2000, inStock: true })
// → [Монитор, Наушники]  (цена >= 2000 И в наличии)
//
// filterProducts(products, {})
// → [все 5 товаров]  (фильтры не заданы — вернуть всё)
//
// Забегая вперёд — объекты (глава 7):
// product.price     // доступ к полю
// filters.minPrice  // undefined если не передано
//
// Раздел учебника: "for...of" + "continue" (js/03-loops.md)
//                  + "??" (js/01-variables.md) + "if" (js/02-conditions.md)


const products = [
  { name: "Мышь", price: 1500, inStock: true },
  { name: "Клавиатура", price: 3000, inStock: false },
  { name: "Монитор", price: 25000, inStock: true },
  { name: "Наушники", price: 5000, inStock: true },
  { name: "Кабель", price: 300, inStock: false },
];


function filterProducts(products, filters){
    const result =[]
    for(const el of products){
        if( filters.minPrice!== undefined && el.price< filters.minPrice){
            continue;
        }
         if(filters.maxPrice!==undefined && el.price> filters.maxPrice){
            continue;
        }
         if(filters.inStock!==undefined && el.inStock !== filters.inStock){
            continue;
        }

        result.push(el)
    }
    return result;
}

console.log("===1===")
console.log(filterProducts(products, { minPrice: 1000, maxPrice: 5000 }))
// → [Мышь, Клавиатура, Наушники]  (price от 1000 до 5000)

console.log("===2===")
console.log(filterProducts(products, { inStock: true }))
// → [Мышь, Монитор, Наушники]  (только в наличии)
console.log("===3===")
console.log(filterProducts(products, { minPrice: 2000, inStock: true }))
// → [Монитор, Наушники]  (цена >= 2000 И в наличии)
console.log("===4===")
console.log(filterProducts(products, {}))
// → [все 5 товаров]  (фильтры не заданы — вернуть всё)

// ========== Разбор задания ==========
//
// Что делали:    Функция фильтрует массив товаров по необязательным фильтрам
//                (minPrice, maxPrice, inStock). Если фильтр не задан — не применять.
//
// === Пошаговый разбор кода ===
//
// 1. const result = [];
//    Пустой массив — сюда попадут только подходящие товары.
//
// 2. for (const el of products)
//    el — один товар за итерацию: { name: "Мышь", price: 1500, inStock: true }
//
// 3. ТРИ if + continue — три "двери-фильтра":
//
//    Каждый if имеет ДВЕ части, соединённые через &&:
//
//    ЧАСТЬ 1: filters.minPrice !== undefined  — "фильтр задан?"
//    ─────────────────────────────────────────────────────────
//    Когда обращаешься к свойству которого НЕТ в объекте — JS возвращает undefined.
//    filters = { inStock: true }  →  filters.minPrice = undefined (нет такого свойства)
//    filters = { minPrice: 1000 } →  filters.minPrice = 1000 (есть)
//
//    Если фильтр НЕ задан (undefined) → первая часть = false
//    → false && (что угодно) = false → continue НЕ сработает
//    → товар ПРОХОДИТ (открытая дверь — фильтр не применяется)
//
//    ЧАСТЬ 2: el.price < filters.minPrice  — "товар не подходит?"
//    ─────────────────────────────────────────────────────────
//    Проверяем ТОЛЬКО если фильтр задан (первая часть = true).
//    Если цена ниже минимума → true → continue → товар ПРОПУЩЕН.
//    Если цена выше минимума → false → товар ПРОХОДИТ.
//
//    ВМЕСТЕ: "Если фильтр задан И товар не подходит — пропустить"
//    Это значит: товар проходит если фильтр НЕ задан ИЛИ товар подходит.
//
// 4. result.push(el)
//    Если товар прошёл ВСЕ ТРИ фильтра (ни один continue не сработал) —
//    добавляем его в результат.
//
// === Как работают три фильтра ===
//
//    if (filters.minPrice !== undefined && el.price < filters.minPrice) continue;
//    → "Цена ниже минимума? Пропустить"
//
//    if (filters.maxPrice !== undefined && el.price > filters.maxPrice) continue;
//    → "Цена выше максимума? Пропустить"
//
//    if (filters.inStock !== undefined && el.inStock !== filters.inStock) continue;
//    → "Наличие не совпадает с фильтром? Пропустить"
//    !== для inStock потому что сравниваем boolean (true/false) с boolean.
//
// === Полная трассировка — вызов 1: { minPrice: 1000, maxPrice: 5000 } ===
//
// Мышь (price: 1500):
//   minPrice: 1000 !== undefined → true, 1500 < 1000 → false. true && false = false. Идём дальше.
//   maxPrice: 5000 !== undefined → true, 1500 > 5000 → false. true && false = false. Идём дальше.
//   inStock:  undefined !== undefined → false. false && ... = false. Идём дальше.
//   → push(Мышь) ✓
//
// Монитор (price: 25000):
//   minPrice: 1000 !== undefined → true, 25000 < 1000 → false. Идём дальше.
//   maxPrice: 5000 !== undefined → true, 25000 > 5000 → true. true && true = true → CONTINUE!
//   → пропущен (слишком дорогой)
//
// Кабель (price: 300):
//   minPrice: 1000 !== undefined → true, 300 < 1000 → true. true && true = true → CONTINUE!
//   → пропущен (слишком дешёвый)
//
// === Полная трассировка — вызов 4: {} (пустой фильтр) ===
//
// Мышь:
//   minPrice: undefined !== undefined → false → пропускаем проверку.
//   maxPrice: undefined !== undefined → false → пропускаем проверку.
//   inStock:  undefined !== undefined → false → пропускаем проверку.
//   → push(Мышь) ✓   (все двери открыты — фильтров нет)
//
// То же самое для ВСЕХ товаров → result = все 5 товаров.
//
// === Почему это работает ===
//
// Паттерн "необязательный фильтр":
//   filters.поле !== undefined && условие_отсева
//
// Первая часть (filters.поле !== undefined) — это ЗАЩИТА.
// Без неё, когда фильтр не задан:
//   el.price < undefined → false (JS не ломается, но логика ненадёжная)
//   el.inStock !== undefined → true (все товары будут пропущены!)
//
// С защитой: если фильтр не задан → false && ... → false → товар проходит.
// Это как охранник на двери: если его нет (фильтр не задан) — все проходят.
//
// Для чего:      Фильтрация товаров — основа любого интернет-магазина.
//                Пользователь ставит фильтры, бэкенд отбирает подходящие товары.
// Главное понять: !== undefined && условие — паттерн "проверяй только если фильтр задан".
//                Три отдельных if+continue — три независимых фильтра-двери.