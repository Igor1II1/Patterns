# Глава 2: Замыкания и область видимости

> [[js-fundamentals|← Назад к оглавлению JS]]

---

## Что такое замыкание?

**Замыкание (closure)** — это функция, которая «помнит» переменные из той области видимости, в которой она была создана, даже после того как эта область перестала выполняться.

Проще говоря: функция тащит за собой «рюкзак» со всеми переменными, которые были рядом, когда она родилась.

**Аналогия из жизни:** представь, что ты уходишь из дома на работу и берёшь с собой ключи. Ты уже не дома, но ключи — у тебя. Можешь вернуться и открыть дверь в любой момент. Замыкание — это и есть такие «ключи»: доступ к переменным, которые технически уже «ушли» из активной зоны.

```js
function makeGreeting(name) {
  // переменная name живёт здесь
  return function() {
    // эта функция "помнит" name — это и есть замыкание
    console.log(`Hello, ${name}!`);
  };
}

const greetAlice = makeGreeting("Alice");
const greetBob   = makeGreeting("Bob");

greetAlice(); // "Hello, Alice!"
greetBob();   // "Hello, Bob!"
```

После вызова `makeGreeting("Alice")` функция завершилась — но `greetAlice` всё ещё держит доступ к переменной `name = "Alice"`. Это и есть замыкание.

---

## Лексическая область видимости

### Как JavaScript ищет переменные

JavaScript использует **лексическую (статическую) область видимости**: место, где написана функция в коде, определяет, к каким переменным она имеет доступ. Не место, откуда она вызвана — а место, где она объявлена.

Когда JS встречает переменную, он ищет её по **цепочке областей видимости (scope chain)**:
1. Сначала смотрит в **текущую функцию**
2. Если не нашёл — смотрит в **родительскую функцию**
3. Дальше вверх по вложенности...
4. В конце — в **глобальную область видимости**
5. Если не нашёл нигде — `ReferenceError`

```js
const globalVar = "I am global";

function outer() {
  const outerVar = "I am outer";

  function middle() {
    const middleVar = "I am middle";

    function inner() {
      const innerVar = "I am inner";

      // inner видит всё выше по цепочке:
      console.log(innerVar);   // "I am inner"     — собственная область
      console.log(middleVar);  // "I am middle"    — область middle
      console.log(outerVar);   // "I am outer"     — область outer
      console.log(globalVar);  // "I am global"    — глобальная область
    }

    inner();
  }

  middle();
}

outer();
```

> **Ключевое правило:** поиск идёт только **вверх**, никогда вниз или в сторону. Внешняя функция не видит переменные внутренней.

### Каждая функция создаёт свою область

```js
function first() {
  const secret = "first's secret";
}

function second() {
  // console.log(secret); // ReferenceError — second не видит переменные first
}
```

---

## Как работает замыкание: пошаговый пример

Разберём счётчик — классический пример замыкания.

```js
function makeCounter() {
  let count = 0; // переменная в области видимости makeCounter

  return {
    increment() { count++; },
    decrement() { count--; },
    getCount()  { return count; }
  };
}

const counter = makeCounter();
```

Что происходит шаг за шагом:

1. Вызываем `makeCounter()` — создаётся переменная `count = 0`
2. `makeCounter` возвращает объект с тремя методами
3. `makeCounter` завершает выполнение, но `count` **не уничтожается** — на неё ссылаются методы
4. Каждый метод «помнит» переменную `count` из своего лексического окружения

```js
counter.increment(); // count = 1
counter.increment(); // count = 2
counter.increment(); // count = 3
counter.decrement(); // count = 2
console.log(counter.getCount()); // 2
```

Важно: каждый вызов `makeCounter()` создаёт **отдельное замыкание** — отдельный `count`:

```js
const counterA = makeCounter();
const counterB = makeCounter();

counterA.increment();
counterA.increment();
counterB.increment();

console.log(counterA.getCount()); // 2 — своя переменная
console.log(counterB.getCount()); // 1 — своя переменная
```

---

## Практические применения

### 1. Фабричные функции (Factory Functions)

Фабрика — функция, которая возвращает другие функции или объекты, настроенные под конкретные параметры.

```js
function makeMultiplier(factor) {
  return function(number) {
    return number * factor; // factor "запомнен" из внешней функции
  };
}

const double  = makeMultiplier(2);
const triple  = makeMultiplier(3);
const tenTimes = makeMultiplier(10);

console.log(double(5));   // 10
console.log(triple(5));   // 15
console.log(tenTimes(5)); // 50
```

**Аналогия:** фабрика — это станок с настройками. Ты настраиваешь станок один раз (`makeMultiplier(2)`) и потом используешь готовый инструмент (`double`).

```js
// Более реальный пример: фабрика валидаторов
function makeRangeValidator(min, max) {
  return function(value) {
    if (value < min) return `Too small, minimum is ${min}`;
    if (value > max) return `Too large, maximum is ${max}`;
    return "Valid";
  };
}

const validateAge      = makeRangeValidator(0, 120);
const validateQuantity = makeRangeValidator(1, 999);

console.log(validateAge(25));       // "Valid"
console.log(validateAge(150));      // "Too large, maximum is 120"
console.log(validateQuantity(0));   // "Too small, minimum is 1"
```

---

### 2. Приватные данные через замыкания

До появления приватных полей (`#`) в классах ES2022, замыкания были главным способом скрыть данные.

```js
function createBankAccount(initialBalance) {
  let balance = initialBalance; // приватная переменная — снаружи недоступна
  const transactionLog = [];    // приватный массив

  return {
    deposit(amount) {
      if (amount <= 0) throw new Error("Amount must be positive");
      balance += amount;
      transactionLog.push(`+${amount}`);
    },
    withdraw(amount) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      transactionLog.push(`-${amount}`);
    },
    getBalance() {
      return balance; // читать можно, изменить напрямую — нет
    },
    getHistory() {
      return [...transactionLog]; // возвращаем копию, не сам массив
    }
  };
}

const account = createBankAccount(1000);
account.deposit(500);
account.withdraw(200);

console.log(account.getBalance()); // 1300
console.log(account.getHistory()); // ["+500", "-200"]

// account.balance — undefined, переменная скрыта в замыкании
```

---

### 3. Частичное применение (Partial Application)

Частичное применение — это фиксация части аргументов функции, чтобы получить новую функцию с меньшим числом параметров.

```js
function add(a, b, c) {
  return a + b + c;
}

// Создаём функцию с зафиксированным первым аргументом
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

const add10 = partial(add, 10);      // a = 10 зафиксирован
const add10and20 = partial(add, 10, 20); // a = 10, b = 20 зафиксированы

console.log(add10(5, 3));     // 18  (10 + 5 + 3)
console.log(add10and20(7));   // 37  (10 + 20 + 7)
```

**Где это используется:** конфигурация обработчиков событий, создание специализированных функций из универсальных.

```js
// Реальный пример: логирование с префиксом
function log(level, message) {
  console.log(`[${level.toUpperCase()}] ${message}`);
}

const logInfo  = partial(log, "info");
const logError = partial(log, "error");

logInfo("Server started");   // [INFO] Server started
logError("File not found");  // [ERROR] File not found
```

---

## IIFE — Немедленно вызываемое функциональное выражение

**IIFE (Immediately Invoked Function Expression)** — функция, которая определяется и сразу же вызывается.

```js
// Синтаксис: оборачиваем функцию в () и сразу добавляем ()
(function() {
  console.log("I run immediately!");
})();

// Вариант со стрелочной функцией
(() => {
  console.log("Arrow IIFE!");
})();
```

### Зачем нужен IIFE?

**Изоляция области видимости.** До появления `let`/`const` и модулей, IIFE был единственным способом создать «приватную» область, не засоряя глобальное пространство имён.

```js
// Проблема без IIFE: переменная попадает в глобальную область
var config = { debug: true }; // глобальная — может конфликтовать

// Решение через IIFE: переменная изолирована
const app = (function() {
  const config = { debug: true }; // приватная для IIFE

  function init() {
    if (config.debug) console.log("Debug mode on");
  }

  // Возвращаем только публичный интерфейс
  return { init };
})();

app.init();        // "Debug mode on"
// app.config     // undefined — скрыто в замыкании
```

**Когда IIFE актуален сейчас:** в современном JS с модулями (`import`/`export`) и `let`/`const` необходимость в IIFE значительно снизилась, но паттерн встречается в старом коде и в конкретных ситуациях (например, для асинхронного кода на верхнем уровне до появления top-level `await`).

---

## Ловушка замыкания в цикле

Это одна из самых распространённых ошибок при работе с замыканиями.

### Проблема с `var`

```js
// Что хочет разработчик: функции выводят 0, 1, 2, 3, 4
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i); // Ожидаем: 0, 1, 2, 3, 4
  }, 100);
}

// Что получаем: 5, 5, 5, 5, 5
```

**Почему так происходит?** `var` не имеет блочной области видимости — переменная `i` одна на весь цикл. Все пять функций замкнулись на **одну и ту же** переменную `i`. К моменту срабатывания таймеров цикл уже завершился и `i = 5`.

**Аналогия:** пятеро студентов договорились, что запишут номер доски перед уходом. Но они записали не само число, а адрес доски. Когда они вернулись — на доске уже стояло «5».

### Решение 1: `let` (современный способ)

```js
for (let i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i); // 0, 1, 2, 3, 4 — корректно!
  }, 100);
}
```

`let` создаёт **новую переменную `i` для каждой итерации** — каждая функция замыкается на свою копию.

### Решение 2: IIFE (классический способ для `var`)

```js
for (var i = 0; i < 5; i++) {
  (function(localI) {
    setTimeout(function() {
      console.log(localI); // 0, 1, 2, 3, 4 — корректно!
    }, 100);
  })(i); // передаём текущее значение i как аргумент
}
```

IIFE создаёт новую область видимости на каждой итерации. Аргумент `localI` получает **текущее значение** `i` (а не ссылку на переменную).

### Решение 3: `bind` или стрелочная функция с параметром

```js
for (var i = 0; i < 5; i++) {
  setTimeout(console.log.bind(null, i), 100); // 0, 1, 2, 3, 4
}
```

> **Практический вывод:** всегда используй `let` в циклах — это решает проблему наиболее чисто. Знать решение через IIFE важно для понимания старого кода.

---

## Типичные ошибки с замыканиями

| Ошибка | Причина | Решение |
|--------|---------|---------|
| Все функции в цикле видят одно значение | `var` не блочный | Используй `let` |
| Утечка памяти | Замыкание держит ненужные объекты | Обнуляй ссылки когда объект больше не нужен |
| Непредвиденное изменение состояния | Несколько функций делят одну переменную | Возвращай копии (`[...array]`, `{...obj}`) |

---

## Итог

```
Замыкание = функция + её лексическое окружение (переменные из внешней области)

Как JS ищет переменные (scope chain):
  текущая функция → внешняя функция → ... → глобальная → ReferenceError

Замыкание создаётся:
  function outer() {
    const x = 10;           // переменная во внешней области
    return function inner() {
      return x;             // inner помнит x — это замыкание
    };
  }

Применения:
  - Фабричные функции     → makeMultiplier(2) возвращает готовую double()
  - Приватные данные      → balance недоступен снаружи createBankAccount()
  - Частичное применение  → partial(fn, arg1) фиксирует часть аргументов

IIFE:
  (function() { /* изолированный код */ })();

Ловушка в цикле:
  for (var i ...)  → все замыкания видят одну переменную (используй let!)
  for (let i ...)  → каждая итерация получает свою переменную ✓
```

---

*← [[js-advanced/01-oop-basics|ООП]] | [[js-advanced/03-prototypes|Прототипы]] → | [[js-fundamentals|К оглавлению]]*
