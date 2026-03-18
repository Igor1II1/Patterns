# Итераторы и генераторы

> [[js-fundamentals|← Назад к оглавлению JS]]

Итераторы и генераторы — это механизм, который стоит за привычными конструкциями вроде `for...of` и лежит в основе `async/await`. Понимание этих концепций откроет, как JavaScript обрабатывает последовательности данных под капотом.

---

## 1. Протокол итерации

### Что такое итерируемый объект (Iterable)

Итерируемый объект — это любой объект, который умеет выдавать свои элементы по одному. Массивы, строки, `Map`, `Set`, `NodeList` — все они итерируемые.

```js
// Все эти структуры можно перебирать через for...of
for (const char of 'hello') console.log(char);  // h e l l o
for (const item of [1, 2, 3]) console.log(item); // 1 2 3
for (const [key, val] of new Map([['a', 1]])) console.log(key, val); // a 1

// Спред и деструктуризация тоже работают с итерируемыми объектами
const letters = [... 'abc']; // ['a', 'b', 'c']
const [first, ...rest] = new Set([10, 20, 30]); // first=10, rest=[20, 30]
```

### Symbol.iterator — ключ к итерируемости

Объект становится итерируемым, если у него есть метод с ключом `Symbol.iterator`. Это специальный глобальный символ, встроенный в JavaScript.

```js
// Массив итерируемый? Проверим:
const arr = [1, 2, 3];
typeof arr[Symbol.iterator]; // 'function' — да, есть метод!

// Строка тоже:
typeof 'hello'[Symbol.iterator]; // 'function'

// Обычный объект — нет:
typeof {}[Symbol.iterator]; // 'undefined' — не итерируемый!

// Поэтому for...of с {} бросает ошибку:
// for (const x of {}) {...} → TypeError: {} is not iterable
```

### Как работает for...of под капотом

`for...of` — это синтаксический сахар. Посмотрим, что происходит пошагово:

```js
const arr = ['a', 'b', 'c'];

// for...of делает вот что:
// Шаг 1: вызывает arr[Symbol.iterator]() и получает объект-итератор
const iterator = arr[Symbol.iterator]();

// Шаг 2: снова и снова вызывает iterator.next()
// пока done не станет true
let result = iterator.next();
console.log(result); // { value: 'a', done: false }

result = iterator.next();
console.log(result); // { value: 'b', done: false }

result = iterator.next();
console.log(result); // { value: 'c', done: false }

result = iterator.next();
console.log(result); // { value: undefined, done: true } — конец!

// for...of — это то же самое, записанное коротко:
for (const item of arr) {
  console.log(item); // 'a', 'b', 'c'
}
```

Аналогия: итерируемый объект — это книга. `Symbol.iterator` — это метод "открыть книгу и поставить закладку на первую страницу". Итератор — это сама закладка, которая умеет перелистывать страницы через `next()`.

---

## 2. Итератор (Iterator)

### Интерфейс итератора

Итератор — это объект с единственным обязательным методом `next()`. Каждый вызов `next()` возвращает объект с двумя полями:
- `value` — текущее значение
- `done` — `false` если есть ещё значения, `true` если итерация завершена

### Создание своего итератора вручную

Напишем итератор для диапазона чисел — чтобы перебирать числа от `start` до `end`:

```js
function createRange(start, end) {
  let current = start;

  return {
    // Сам итератор — объект с методом next()
    next() {
      if (current <= end) {
        return { value: current++, done: false };
      }
      return { value: undefined, done: true };
    },

    // Чтобы этот объект можно было использовать в for...of,
    // он должен также быть итерируемым (Symbol.iterator возвращает себя)
    [Symbol.iterator]() {
      return this;
    }
  };
}

const range = createRange(1, 5);

// Вручную
range.next(); // { value: 1, done: false }
range.next(); // { value: 2, done: false }
range.next(); // { value: 3, done: false }

// Через for...of (потому что добавили Symbol.iterator)
for (const num of createRange(1, 5)) {
  console.log(num); // 1, 2, 3, 4, 5
}

// Через спред
const nums = [...createRange(1, 5)]; // [1, 2, 3, 4, 5]
```

Итераторы вручную писать громоздко. Именно для этого придуманы генераторы.

---

## 3. Генераторы (Generator functions)

### Синтаксис function*

Генераторная функция отличается звёздочкой `*` после слова `function`. Внутри неё можно использовать `yield` — ключевое слово, которое приостанавливает функцию и возвращает значение.

```js
function* simpleGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

// Вызов генераторной функции НЕ выполняет её тело!
// Он создаёт объект-генератор
const gen = simpleGenerator();

// Только после .next() начинается выполнение — до первого yield
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: undefined, done: true } — функция завершилась
```

Аналогия: генераторная функция — это рецепт с паузами. Повар (`gen.next()`) выполняет рецепт до отметки "подождать" (`yield`), отдаёт промежуточный результат, и ждёт следующего вызова, чтобы продолжить с того места, где остановился.

### Состояние генератора сохраняется между вызовами

```js
function* counter() {
  let count = 0;
  while (true) { // бесконечный цикл — нормально для генератора!
    yield count++;
  }
}

const c = counter();
c.next(); // { value: 0, done: false }
c.next(); // { value: 1, done: false }
c.next(); // { value: 2, done: false }
// count продолжает расти при каждом вызове
```

### Пример: бесконечный генератор ID

```js
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const generateId = idGenerator();

const user1 = { name: 'Алиса', id: generateId.next().value }; // id: 1
const user2 = { name: 'Боб',   id: generateId.next().value }; // id: 2
const user3 = { name: 'Карл',  id: generateId.next().value }; // id: 3
```

### Пример: генератор диапазона (range)

Сравните с ручным итератором выше — генератор гораздо чище:

```js
function* range(start, end, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

// Простое использование
for (const num of range(1, 10)) {
  console.log(num); // 1, 2, 3, ..., 10
}

// С шагом
const evens = [...range(0, 10, 2)]; // [0, 2, 4, 6, 8, 10]
const odds  = [...range(1, 10, 2)]; // [1, 3, 5, 7, 9]

// Генератор автоматически итерируемый — работает с for...of, спредом и деструктуризацией
const [first, second, third] = range(100, 200, 50); // 100, 150, 200
```

### for...of с генератором

Генераторы автоматически реализуют протокол итерации, поэтому с ними работают все итерационные инструменты:

```js
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Берём первые 8 чисел Фибоначчи
const fib = fibonacci();
const first8 = Array.from({ length: 8 }, () => fib.next().value);
// [0, 1, 1, 2, 3, 5, 8, 13]

// Или с помощью вспомогательного генератора (take — берёт N элементов)
function* take(iterable, n) {
  let count = 0;
  for (const item of iterable) {
    if (count++ >= n) break;
    yield item;
  }
}

const first10Fibs = [...take(fibonacci(), 10)];
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

---

## 4. yield* — делегирование

`yield*` позволяет генератору "передать управление" другому генератору или итерируемому объекту. Это как если повар из нашей аналогии говорит: "для этого шага следуй другому рецепту полностью".

```js
function* numbers() {
  yield 1;
  yield 2;
}

function* letters() {
  yield 'a';
  yield 'b';
}

// Без yield* — пришлось бы вручную перебирать
function* combined() {
  yield* numbers(); // делегируем numbers() целиком
  yield* letters(); // затем letters() целиком
  yield* [10, 20]; // работает с любым итерируемым объектом
  yield* 'xyz';    // и со строками!
}

console.log([...combined()]);
// [1, 2, 'a', 'b', 10, 20, 'x', 'y', 'z']
```

### Практический пример: обход дерева

```js
// Дерево вложенных массивов
const tree = [1, [2, [3, 4]], [5, 6]];

function* flatten(iterable) {
  for (const item of iterable) {
    if (Array.isArray(item)) {
      yield* flatten(item); // рекурсивное делегирование!
    } else {
      yield item;
    }
  }
}

console.log([...flatten(tree)]); // [1, 2, 3, 4, 5, 6]
```

---

## 5. Практические применения

### Ленивая загрузка данных

Генераторы позволяют работать с данными "по требованию", не загружая всё сразу в память:

```js
// Обычный подход — загружаем ВСЕ 10000 записей сразу
function getAllUsers() {
  return fetchAllUsers(); // 10000 объектов в памяти!
}

// С генератором — загружаем по частям
async function* getUsersBatch(batchSize = 100) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`/api/users?page=${page}&limit=${batchSize}`);
    const data = await response.json();

    yield* data.users; // отдаём пользователей по одному

    hasMore = data.hasNextPage;
    page++;
  }
}

// Используем: обрабатываем каждого пользователя по мере поступления
for await (const user of getUsersBatch()) {
  await processUser(user);
}
```

### Пагинация

```js
function* paginate(items, pageSize) {
  for (let i = 0; i < items.length; i += pageSize) {
    yield items.slice(i, i + pageSize);
  }
}

const allProducts = [/* 50 товаров */];
const pages = paginate(allProducts, 10);

pages.next().value; // товары 1-10 (страница 1)
pages.next().value; // товары 11-20 (страница 2)
pages.next().value; // товары 21-30 (страница 3)

// Все страницы
for (const page of paginate(allProducts, 10)) {
  renderPage(page);
}
```

### Бесконечные последовательности

```js
// Бесконечный список чётных чисел
function* evenNumbers(start = 0) {
  let n = start % 2 === 0 ? start : start + 1;
  while (true) {
    yield n;
    n += 2;
  }
}

// Берём только сколько нужно
const first5Evens = [...take(evenNumbers(), 5)]; // [0, 2, 4, 6, 8]
const evensFrom10 = [...take(evenNumbers(10), 3)]; // [10, 12, 14]

// Генератор уникальных токенов
function* tokenGenerator() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  while (true) {
    let token = '';
    for (let i = 0; i < 16; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    yield token;
  }
}

const tokens = tokenGenerator();
tokens.next().value; // 'aK9mNpQrSt2uVwXy'
tokens.next().value; // 'Bc3dEf4gHi5jKl6m'
```

---

## 6. Связь с async/await

`async/await` — это не новая концепция, а синтаксический сахар поверх генераторов и промисов. Под капотом `async` функция работает очень похоже на генератор:

```js
// Генератор с ручным управлением промисами (упрощённо)
function* fetchUserGen(id) {
  const user = yield fetch(`/api/users/${id}`);
  const posts = yield fetch(`/api/posts?userId=${user.id}`);
  return posts;
}

// async/await делает то же самое, но автоматически
async function fetchUser(id) {
  const user = await fetch(`/api/users/${id}`);
  const posts = await fetch(`/api/posts?userId=${user.id}`);
  return posts;
}
```

Каждый `await` — это `yield`, а движок JavaScript автоматически управляет продолжением выполнения, когда промис разрешается. Именно поэтому понимание генераторов помогает глубже понять `async/await`.

Асинхронные генераторы (`async function*`) позволяют объединить оба механизма — это основа асинхронных итераторов и конструкции `for await...of`.

---

## Итог

### Протокол итерации

```js
// Объект итерируемый, если у него есть Symbol.iterator
obj[Symbol.iterator](); // возвращает итератор

// Итератор — объект с методом next()
iterator.next(); // возвращает { value, done }
```

### Генераторы — ключевой синтаксис

```js
// Объявление
function* myGenerator() {
  yield 1;        // приостановить и вернуть 1
  yield* [2, 3];  // делегировать [2, 3]
  return 4;       // завершить (done: true)
}

// Использование
const gen = myGenerator();  // создаём объект-генератор
gen.next();  // { value: 1, done: false }
gen.next();  // { value: 2, done: false }
gen.next();  // { value: 3, done: false }
gen.next();  // { value: 4, done: true }

// Генератор — итерируемый объект
for (const val of myGenerator()) { ... }
const arr = [...myGenerator()];
```

### Сравнительная таблица

| Понятие | Что это | Пример |
|---------|---------|--------|
| Итерируемый объект | Имеет `[Symbol.iterator]()` | Массив, строка, Set, Map |
| Итератор | Объект с `next()` | `arr[Symbol.iterator]()` |
| Генератор | Функция с `function*` и `yield` | `function* range() { ... }` |
| `yield` | Пауза и возврат значения | `yield x` |
| `yield*` | Делегирование другому итерируемому | `yield* otherGen()` |

**Ключевые моменты:**
- `for...of` вызывает `[Symbol.iterator]()`, затем `next()` в цикле
- Генераторы — самый удобный способ создавать итераторы
- `yield` запоминает место выполнения — следующий `next()` продолжит оттуда
- Бесконечные генераторы безопасны — значения вычисляются только при запросе
- `async/await` построен поверх генераторов — `await` это по сути `yield` для промисов

---

*← [[js-advanced/08-date-math|Date и Math]] | [[js-fundamentals|К оглавлению]]*
