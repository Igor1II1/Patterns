// ========== Задание Продвинутые функции #6 — КОМПЛЕКСНАЯ ЗАДАЧА ==========
// Уровень: 🔴
//
// Создай утилиту `FunctionUtils` с методами, использующими ВСЕ концепции:
//
// 1. `curry(fn)` — универсальное каррирование (для функций с любым числом аргументов):
//    Если передано достаточно аргументов — вызвать fn
//    Если нет — вернуть функцию, ожидающую остальные
//    Подсказка: fn.length — количество параметров функции
//
// 2. `memoize(fn)` — мемоизация (кэш через Map, ключ — JSON.stringify(args))
//
// 3. `compose(...fns)` — композиция функций (справа налево):
//    compose(f, g, h)(x) === f(g(h(x)))
//
// 4. `pipe(...fns)` — пайплайн (слева направо):
//    pipe(f, g, h)(x) === h(g(f(x)))
//
// Тесты:
// // curry:
// function add(a, b, c) { return a + b + c; }
// const curriedAdd = FunctionUtils.curry(add);
// console.log(curriedAdd(1)(2)(3));   // 6
// console.log(curriedAdd(1, 2)(3));   // 6
// console.log(curriedAdd(1)(2, 3));   // 6
// console.log(curriedAdd(1, 2, 3));   // 6
//
// // memoize:
// let calls = 0;
// const factorial = FunctionUtils.memoize((n) => {
//   calls++;
//   return n <= 1 ? 1 : n * factorial(n - 1);
// });
// console.log(factorial(5)); // 120
// console.log(factorial(5)); // 120 (из кэша)
//
// // compose:
// const double = x => x * 2;
// const addOne = x => x + 1;
// const square = x => x * x;
//
// const transform = FunctionUtils.compose(square, addOne, double);
// console.log(transform(3)); // square(addOne(double(3))) = square(7) = 49
//
// // pipe:
// const pipeline = FunctionUtils.pipe(double, addOne, square);
// console.log(pipeline(3)); // square(addOne(double(3))) = 49
//
// 📖 Раздел учебника: ВСЕ разделы → notes/js-advanced/10-advanced-functions.md
// ================================================

// Пиши код ниже:
