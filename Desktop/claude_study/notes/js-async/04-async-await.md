# async/await

> [[js-fundamentals|<-- Назад к оглавлению JS]]

---

## Зачем эта тема существует?

Промисы решили проблему Callback Hell, но цепочки `.then().then().then()` всё равно выглядят громоздко. В ES2017 появился синтаксис `async/await` — способ писать асинхронный код так, **будто он синхронный**. Это не новый механизм, а **синтаксический сахар** поверх промисов. Под капотом всё те же Promise, но код читается линейно, как обычная последовательность действий.

---

## async-функции

### Что это такое?

Ключевое слово `async` перед функцией делает две вещи:
1. Функция **всегда** возвращает промис
2. Внутри неё можно использовать `await`

Аналогия: пометка `async` — как табличка "Эта кухня работает с предзаказами". Всё, что из неё выходит, упаковано в промис-контейнер.

### Как работает?

```js
// Обычная функция — возвращает значение
function обычная() {
  return 42;
}
console.log(обычная()); // 42

// async-функция — возвращает промис
async function асинхронная() {
  return 42;
}
console.log(асинхронная()); // Promise { fulfilled: 42 }

// Чтобы получить значение:
асинхронная().then(function(результат) {
  console.log(результат); // 42
});
```

Даже если ты возвращаешь обычное значение, `async` оборачивает его в `Promise.resolve()`:

```js
async function привет() {
  return "Привет!";
}

// Эквивалентно:
function привет() {
  return Promise.resolve("Привет!");
}
```

### Плохой пример -> Хороший пример

```js
// ПЛОХО — async без необходимости (функция уже возвращает промис)
async function загрузить(url) {
  return fetch(url);  // fetch уже возвращает промис
  // async оборачивает промис в ещё один промис — лишнее
}
```

```js
// ХОРОШО — async нужен, если используешь await внутри
async function загрузить(url) {
  const ответ = await fetch(url);
  return ответ.json();
}
```

---

## await — ожидание результата

### Что это такое?

`await` ставится перед промисом и **приостанавливает** выполнение async-функции до тех пор, пока промис не завершится. Возвращает результат промиса.

Аналогия: ты на кухне и говоришь "подожди, пока вода закипит" (`await кипячение`). Ты не уходишь с кухни, но и не делаешь ничего другого — просто ждёшь. Когда вода закипела — продолжаешь готовить.

**Важно:** `await` можно использовать **только внутри async-функции** (или на верхнем уровне модуля).

### Как работает?

```js
function загрузитьДанные() {
  return new Promise(function(resolve) {
    setTimeout(() => resolve({ name: "Игорь" }), 2000);
  });
}

// С промисами (.then)
function показатьТhen() {
  загрузитьДанные().then(function(данные) {
    console.log(данные.name);
  });
}

// С async/await — то же самое, но читается как синхронный код
async function показатьAwait() {
  const данные = await загрузитьДанные();  // ждём 2 секунды
  console.log(данные.name);                // продолжаем
}
```

Сравнение цепочки промисов и async/await:

```js
// ПРОМИСЫ
function получитьПрофиль() {
  return загрузить("/api/user")
    .then(function(user) {
      return загрузить("/api/posts/" + user.id);
    })
    .then(function(posts) {
      return загрузить("/api/comments/" + posts[0].id);
    })
    .then(function(comments) {
      return { comments: comments };
    });
}

// ASYNC/AWAIT — линейный, читаемый код
async function получитьПрофиль() {
  const user = await загрузить("/api/user");
  const posts = await загрузить("/api/posts/" + user.id);
  const comments = await загрузить("/api/comments/" + posts[0].id);
  return { comments: comments };
}
```

> **Частое заблуждение:** "`await` блокирует весь JavaScript." Нет! `await` приостанавливает только **текущую async-функцию**. Остальной код, другие обработчики событий и промисы продолжают работать нормально.

```
async function A() {
  console.log("A: начало");
  await пауза(2000);          // A приостановлена
  console.log("A: конец");    // выполнится через 2 сек
}

A();
console.log("Не ждём A!");    // выполнится СРАЗУ

// Результат:
// A: начало
// Не ждём A!
// A: конец         (через 2 секунды)
```

---

## Обработка ошибок: try/catch

### Что это такое?

С промисами мы ловили ошибки через `.catch()`. С `async/await` используем обычный `try/catch` — как в синхронном коде.

### Как работает?

```js
async function загрузитьПользователя(id) {
  try {
    const ответ = await fetch("/api/users/" + id);

    if (!ответ.ok) {
      throw new Error("HTTP ошибка: " + ответ.status);
    }

    const данные = await ответ.json();
    console.log("Пользователь: " + данные.name);

  } catch (ошибка) {
    console.error("Не удалось загрузить:", ошибка.message);
  } finally {
    console.log("Запрос завершён");  // выполнится в любом случае
  }
}
```

### Плохой пример -> Хороший пример

```js
// ПЛОХО — нет обработки ошибок
async function загрузить() {
  const данные = await fetch("/api/data");  // если упадёт — необработанная ошибка
  const json = await данные.json();
  показать(json);
}
```

```js
// ХОРОШО — обработка ошибок через try/catch
async function загрузить() {
  try {
    const данные = await fetch("/api/data");
    const json = await данные.json();
    показать(json);
  } catch (err) {
    показатьОшибку("Не удалось загрузить данные");
    console.error(err);
  }
}
```

> **Мини-проверка:** Что произойдет, если `await` получит rejected промис без try/catch?
> Ответ: будет необработанный rejected промис (UnhandledPromiseRejection) — в Node.js это предупреждение, в будущих версиях — краш.

---

## Последовательное vs параллельное выполнение

### Что это такое?

Это самая важная ловушка async/await. `await` выполняет промисы **последовательно** — каждый ждёт предыдущий. Но если операции **независимы**, их можно запустить параллельно.

### Как работает?

```js
function пауза(мс) {
  return new Promise(resolve => setTimeout(resolve, мс));
}

async function загрузитьА() {
  await пауза(2000);
  return "A";
}

async function загрузитьБ() {
  await пауза(2000);
  return "B";
}
```

**Последовательно (медленно):**

```js
async function последовательно() {
  console.time("время");

  const а = await загрузитьА();  // 2 секунды
  const б = await загрузитьБ();  // ещё 2 секунды

  console.log(а, б);
  console.timeEnd("время");      // ~4 секунды!
}
```

```
Время: ────[  A: 2сек  ]────[  B: 2сек  ]────  = 4 сек
```

**Параллельно (быстро):**

```js
async function параллельно() {
  console.time("время");

  // Запускаем ОБА промиса сразу
  const промисА = загрузитьА();
  const промисБ = загрузитьБ();

  // Ждём оба результата
  const а = await промисА;
  const б = await промисБ;

  console.log(а, б);
  console.timeEnd("время");  // ~2 секунды!
}
```

```
Время: ────[  A: 2сек  ]────  = 2 сек
           [  B: 2сек  ]
```

**Ещё лучше — через Promise.all:**

```js
async function параллельноAll() {
  const [а, б] = await Promise.all([
    загрузитьА(),
    загрузитьБ()
  ]);
  console.log(а, б);  // ~2 секунды
}
```

### Плохой пример -> Хороший пример

```js
// ПЛОХО — последовательные независимые запросы
async function загрузитьСтраницу() {
  const user = await fetch("/api/user");       // 500мс
  const posts = await fetch("/api/posts");     // 500мс
  const notifications = await fetch("/api/n"); // 500мс
  // Итого: 1500мс — ждём каждый по очереди
}
```

```js
// ХОРОШО — параллельные независимые запросы
async function загрузитьСтраницу() {
  const [user, posts, notifications] = await Promise.all([
    fetch("/api/user"),
    fetch("/api/posts"),
    fetch("/api/n")
  ]);
  // Итого: ~500мс — все запросы одновременно
}
```

> **Частое заблуждение:** "Надо всегда использовать `Promise.all` для скорости." Нет — только когда запросы **независимы**. Если второй запрос зависит от результата первого, они **должны** быть последовательными.

---

## await в циклах

### Как работает?

**for...of** — последовательно (каждая итерация ждёт предыдущую):

```js
async function последовательно(urls) {
  const результаты = [];

  for (const url of urls) {
    const ответ = await fetch(url);  // ждём каждый по очереди
    результаты.push(await ответ.json());
  }

  return результаты;
}
```

**forEach с await — НЕ РАБОТАЕТ как ожидается:**

```js
// ПЛОХО — forEach не ждёт await!
async function сломано(urls) {
  const результаты = [];

  urls.forEach(async function(url) {
    const ответ = await fetch(url);  // await внутри отдельной async-функции
    результаты.push(await ответ.json());
  });

  console.log(результаты);  // [] — пустой! forEach не ждёт
}
```

**Параллельно через map + Promise.all:**

```js
// ХОРОШО — параллельно
async function параллельно(urls) {
  const промисы = urls.map(async function(url) {
    const ответ = await fetch(url);
    return ответ.json();
  });

  const результаты = await Promise.all(промисы);
  return результаты;
}
```

> **Мини-проверка:** Почему `forEach` с `async/await` не работает?
> Ответ: `forEach` вызывает колбэк, но **не ждёт** возвращаемый промис. Он не рассчитан на async-колбэки. Используй `for...of` или `Promise.all` с `map`.

---

## Распространённые ошибки

### 1. Забыть await

```js
async function пример() {
  const данные = fetch("/api/data");  // забыли await!
  console.log(данные);                // Promise { <pending> } — не данные!
}
```

### 2. await вне async-функции

```js
// ОШИБКА — нельзя использовать await вне async
const данные = await fetch("/api/data");
// SyntaxError: await is only valid in async functions
```

### 3. Не обработать ошибку

```js
// Если промис rejected и нет try/catch — UnhandledPromiseRejection
async function опасно() {
  const данные = await fetch("https://несуществующий.домен");
  // TypeError: fetch failed — и никто не поймал
}

опасно(); // предупреждение в консоли
```

### 4. Лишний await для не-промиса

```js
// Не нужно — обычное значение не требует await
async function пример() {
  const x = await 42;      // работает, но бессмысленно
  const y = await "строка"; // то же самое
}
```

---

## Итог

| Понятие | Описание |
|---------|----------|
| **async** | Делает функцию асинхронной, она всегда возвращает промис |
| **await** | Приостанавливает async-функцию до завершения промиса |
| **try/catch** | Обработка ошибок в async-функциях |
| **Последовательно** | `await a(); await b();` — одно за другим |
| **Параллельно** | `await Promise.all([a(), b()])` — одновременно |

**Правила:**
1. `await` работает **только** внутри `async`-функции
2. `await` приостанавливает **только эту функцию**, не весь JS
3. Независимые операции запускай **параллельно** через `Promise.all`
4. Всегда оборачивай `await` в `try/catch`
5. **Не используй** `forEach` с `async/await` — используй `for...of` или `map` + `Promise.all`

---

> [[js-async/03-promises|<-- Промисы]] | [[js-async/05-promise-methods|Далее: Методы Promise -->]]
