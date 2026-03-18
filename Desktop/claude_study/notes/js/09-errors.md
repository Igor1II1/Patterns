# Обработка ошибок — try/catch/finally, throw

> [[js-fundamentals|← Назад к оглавлению JS]]
> Задания главы: `exercises/block-0/09-errors/script.js`

---

## Зачем эта тема существует?

Любая программа работает с внешним миром: пользовательский ввод, файлы, сеть, JSON-данные. Внешний мир ненадёжен — пользователь введёт мусор, сервер не ответит, JSON окажется битым. Без обработки ошибок программа просто падает при первой проблеме, и всё что ниже по коду — не выполнится.

Обработка ошибок — это механизм, который позволяет поймать проблему, отреагировать на неё (показать сообщение, подставить значение по умолчанию, повторить попытку) и продолжить работу программы.

```js
// Без обработки — программа падает:
const user = null;
console.log(user.name); // TypeError: Cannot read properties of null
// Всё что ниже этой строки — НЕ выполнится

// С обработкой — программа продолжает работу:
try {
  console.log(user.name);
} catch (error) {
  console.log("Пользователь не загружен");
}
console.log("Программа работает дальше"); // выполнится
```

---

## try/catch — основная конструкция

### Откуда взялось и зачем

Конструкция `try/catch` появилась в языке C++ в 1990-х и быстро перешла в Java, C#, JavaScript и другие языки. Идея: вместо того чтобы проверять каждую операцию на ошибку вручную (`if (result === null) ...`), ты оборачиваешь блок кода и говоришь: "попробуй выполнить, а если что-то пойдёт не так — вот план Б".

### Что это такое

`try` — блок с "опасным" кодом (который может вызвать ошибку).
`catch` — блок который выполнится только если в `try` произошла ошибка.

**Аналогия:** ты несёшь поднос с тарелками (try). Если уронишь — подхватываешь осколки и убираешь (catch). Если не уронишь — catch просто не срабатывает.

### Синтаксис

```js
try {
  // Код который может вызвать ошибку
} catch (error) {
  // Выполнится ТОЛЬКО если в try произошла ошибка
  // error — объект с информацией об ошибке
}
```

### Как работает — по шагам

```
Шаг 1: JS начинает выполнять код внутри try
Шаг 2: Если ошибки нет → выполняет весь try, catch пропускается
Шаг 3: Если ошибка есть → try прерывается в точке ошибки,
        управление переходит в catch
Шаг 4: Код после try/catch выполняется в любом случае
```

```js
try {
  console.log("1. Начало try");
  const data = JSON.parse("не валидный JSON"); // Ошибка здесь
  console.log("2. Эта строка НЕ выполнится");  // пропущена
} catch (error) {
  console.log("3. Поймали ошибку:", error.message);
}
console.log("4. Программа продолжает работу");

// Вывод:
// "1. Начало try"
// "3. Поймали ошибку: Unexpected token н in JSON at position 0"
// "4. Программа продолжает работу"
```

> **Механика: как try/catch работает внутри**
> 1. JS входит в блок `try` и запоминает "точку спасения" — адрес блока `catch`
> 2. Выполняет строки `try` одну за другой, сверху вниз
> 3. Если ошибка — JS **немедленно прекращает** выполнение `try` (остальные строки пропускаются)
> 4. Движок создаёт объект ошибки (`{ name, message, stack }`) и **прыгает** в `catch`
> 5. Переменная `error` в `catch(error)` — это ссылка на тот самый объект ошибки
> 6. После `catch` выполнение продолжается **после всей конструкции try/catch**
> ```
> try {                         catch (error) {
>   строка 1  ✅ выполнена        // error = объект ошибки
>   строка 2  💥 ОШИБКА ──────►   // обработка
>   строка 3  ⛔ пропущена       }
> }                              ↓ код после try/catch продолжается
> ```

### Объект ошибки

В `catch` ты получаешь объект `error` с тремя основными свойствами:

| Свойство | Что содержит | Пример |
|----------|-------------|--------|
| `error.name` | Тип ошибки | `"TypeError"` |
| `error.message` | Текстовое описание | `"Cannot read properties of null"` |
| `error.stack` | Полный стек вызовов (для отладки) | Многострочная строка с файлами и номерами строк |

```js
try {
  null.property;
} catch (error) {
  console.log(error.name);    // "TypeError"
  console.log(error.message); // "Cannot read properties of null (reading 'property')"
  console.log(error.stack);   // TypeError: Cannot read properties of null...
                               //     at Object.<anonymous> (script.js:2:3)
}
```

### Плохой пример → Хороший пример

```js
// ❌ Плохо: ручная проверка каждого шага
let data = null;
const jsonStr = '{"name": "Игорь"}';
const parsed = JSON.parse(jsonStr);
if (parsed !== null && parsed !== undefined) {
  data = parsed;
} else {
  data = {};
}
// Проблема: если JSON.parse упадёт — этот if не поможет,
// потому что ошибка произойдёт ДО проверки

// ✅ Хорошо: try/catch ловит ошибку в момент её возникновения
let data2;
try {
  data2 = JSON.parse("битый JSON");
} catch (error) {
  console.error("Не удалось распарсить JSON:", error.message);
  data2 = {}; // значение по умолчанию
}
```

> ⚠️ **Важно:** `try/catch` ловит только **ошибки во время выполнения** (runtime errors). Если в коде синтаксическая ошибка (забыл закрыть скобку), JS не сможет даже запустить скрипт — `try/catch` не поможет:
> ```js
> // Это НЕ поймается — скрипт не запустится вообще:
> try {
>   let x = ;  // SyntaxError при парсинге файла
> } catch (e) {
>   // сюда управление не дойдёт
> }
> ```

> ⚠️ **Важно:** `try/catch` работает **синхронно**. Если внутри `try` запустить `setTimeout`, ошибка внутри колбэка НЕ будет поймана:
> ```js
> try {
>   setTimeout(() => {
>     null.property; // Ошибка — но catch её НЕ поймает!
>   }, 1000);
> } catch (e) {
>   // Сюда управление НЕ придёт
>   // Потому что catch уже выполнился (прошёл мимо),
>   // а setTimeout сработает потом, через секунду
> }
> ```
> Асинхронная обработка ошибок (через `async/await`) — тема отдельного блока.

> ❌ **Частые заблуждения:**
> - "try/catch замедляет программу" — нет. Современные движки JS оптимизируют try/catch. Используй его свободно там, где нужно.
> - "try/catch ловит все ошибки в программе" — нет. Только ошибки внутри блока `try`, и только синхронные.
> - "Нужно оборачивать весь код в try/catch" — нет. Оборачивай только те места, где реально может произойти ошибка (парсинг, работа с данными, обращение к свойствам).

> 🔍 **Мини-проверка:** что выведет этот код?
> ```js
> try {
>   console.log("A");
>   JSON.parse("ok");
>   console.log("B");
> } catch (e) {
>   console.log("C");
> }
> console.log("D");
> ```
> <details><summary>Ответ</summary>
>
> `"A"`, затем ошибка на `JSON.parse("ok")` — строка `"ok"` не является валидным JSON (нет кавычек вокруг, это не число, не `true/false/null`). Поэтому `"B"` не выведется, управление перейдёт в catch.
> Вывод: `A`, `C`, `D`.
>
> Подвох: `JSON.parse('"ok"')` (со вложенными кавычками) — сработало бы. А `JSON.parse("ok")` — нет.
> </details>

---

## Типы встроенных ошибок

### Что это такое

JavaScript имеет несколько встроенных типов ошибок. Все они наследуют от базового класса `Error`. Тип ошибки помогает понять что именно пошло не так.

| Тип | Когда возникает | Пример |
|-----|----------------|--------|
| `TypeError` | Операция над неверным типом | `null.something`, вызов не-функции `undefined()` |
| `ReferenceError` | Обращение к необъявленной переменной | `console.log(abc)` где `abc` не объявлена |
| `SyntaxError` | Ошибка в синтаксисе (в т.ч. в `JSON.parse`) | `JSON.parse("{bad}")` |
| `RangeError` | Значение вне допустимого диапазона | `new Array(-1)`, `(1).toFixed(200)` |
| `URIError` | Ошибка в функциях `encodeURI`/`decodeURI` | `decodeURIComponent("%")` |

```js
// TypeError:
let x;
x.toString(); // TypeError: Cannot read properties of undefined (reading 'toString')

// ReferenceError:
console.log(undeclaredVar); // ReferenceError: undeclaredVar is not defined

// SyntaxError (при парсинге JSON):
JSON.parse("{bad}"); // SyntaxError: Expected property name or '}' ...

// RangeError:
new Array(-1); // RangeError: Invalid array length
```

### Проверка типа ошибки — instanceof

Оператор `instanceof` проверяет, к какому типу относится ошибка. Это нужно чтобы обрабатывать разные ошибки по-разному:

```js
try {
  // код который может бросить разные типы ошибок
  JSON.parse(userInput);
} catch (error) {
  if (error instanceof SyntaxError) {
    console.log("Невалидный JSON:", error.message);
  } else if (error instanceof TypeError) {
    console.log("Проблема с типом данных:", error.message);
  } else {
    console.log("Неизвестная ошибка:", error.message);
  }
}
```

> 💡 **На заметку:** `instanceof` проверяет всю цепочку наследования. Поскольку все типы ошибок наследуют от `Error`, проверка `error instanceof Error` вернёт `true` для любой ошибки — `TypeError`, `RangeError` и т.д.

> 🔍 **Мини-проверка:** какой тип ошибки?
> ```js
> try {
>   const obj = {};
>   obj.method();
> } catch (e) {
>   console.log(e.name); // ???
> }
> ```
> <details><summary>Ответ</summary>
>
> `"TypeError"` — потому что `obj.method` равно `undefined`, а ты пытаешься вызвать `undefined` как функцию. Это ошибка типа: значение не является функцией.
> </details>

---

## throw — создать свою ошибку

### Откуда взялось и зачем

JavaScript не знает бизнес-логику твоего приложения. Для JS возраст `-5` — это обычное число, а пустое имя `""` — обычная строка. Ошибки не будет. Но для твоей программы это невалидные данные.

`throw` позволяет создать и "бросить" ошибку вручную — не ждать пока JS сам упадёт, а явно сказать: "здесь проблема, дальше выполнять нельзя".

### Что это такое

`throw` — оператор, который прерывает выполнение и передаёт ошибку ближайшему `catch`. Работает так же, как если бы JS сам бросил ошибку — код после `throw` не выполняется.

**Аналогия:** пожарная сигнализация. Пожар (ошибка JS) включает её автоматически. Но ты можешь нажать кнопку вручную (throw), если заметил дым раньше автоматики.

### Синтаксис

```js
throw new Error("Описание проблемы");
throw new TypeError("Ожидалось число, получена строка");
throw new RangeError("Значение вне допустимого диапазона");
```

### Пример: валидация данных

```js
function createUser(name, age) {
  // Проверяем тип
  if (typeof name !== "string") {
    throw new TypeError("Имя должно быть строкой");
  }
  if (typeof age !== "number") {
    throw new TypeError("Возраст должен быть числом");
  }

  // Проверяем значения
  if (name.trim() === "") {
    throw new TypeError("Имя не может быть пустым");
  }
  if (age < 0 || age > 150) {
    throw new RangeError(`Недопустимый возраст: ${age}`);
  }

  return { name: name.trim(), age };
}

// Использование:
try {
  const user = createUser("Игорь", 25);
  console.log(user); // { name: "Игорь", age: 25 }
} catch (error) {
  console.log(error.name);    // "RangeError" / "TypeError" — зависит от ошибки
  console.log(error.message); // текст ошибки
}
```

### Плохой пример → Хороший пример

```js
// ❌ Плохо: бросать строку — теряешь информацию (нет name, stack)
throw "Что-то пошло не так";

// ❌ Плохо: бросать число или объект
throw 404;
throw { error: "не найдено" };

// ✅ Хорошо: всегда бросай объект Error (или его подкласс)
throw new Error("Что-то пошло не так");
throw new TypeError("Ожидалось число");
throw new RangeError("Значение вне диапазона");
```

> ⚠️ **Важно:** технически `throw` может бросить что угодно — строку, число, объект. Но ВСЕГДА бросай объект `Error` или его подкласс. Причина: только у объекта `Error` есть свойства `name`, `message` и `stack`. Без `stack` невозможно найти где произошла ошибка.

> **Механика: как throw создаёт ошибку и как она "всплывает"**
> 1. `new Error("текст")` — создаёт обычный объект `{ name: "Error", message: "текст", stack: "..." }`
> 2. `throw` — **прерывает** текущую функцию (как `return`, но без возврата значения)
> 3. JS ищет ближайший `catch` **вверх по стеку вызовов** (от текущей функции к вызвавшей)
> 4. Если нашёл `catch` — передаёт туда объект ошибки и продолжает оттуда
> 5. Если **не нашёл** ни одного `catch` до самого верха — программа падает
> ```
> main()                         ← 4. catch нет? ПРОГРАММА ПАДАЕТ
>   └─ getUser()                 ← 3. catch нет? идём выше
>       └─ validate()            ← 2. catch нет? идём выше
>           └─ throw new Error() ← 1. ошибка тут — ищем catch
> ```
> Если обернуть `main()` в `try/catch` — ошибка из `validate()` поймается там.

> ❌ **Частые заблуждения:**
> - "throw и return — одно и то же" — нет. `return` возвращает значение вызывающему коду. `throw` прерывает выполнение и передаёт управление ближайшему `catch`. Если `catch` нет — программа падает.
> - "throw можно использовать только внутри try" — нет. `throw` можно писать в любом месте. Но если выше по стеку вызовов нет `catch` — программа упадёт с необработанной ошибкой.

> 🔍 **Мини-проверка:** что произойдёт?
> ```js
> function validate(age) {
>   if (age < 0) throw new RangeError("Отрицательный возраст");
>   return "OK";
> }
>
> console.log(validate(25));
> console.log(validate(-1));
> console.log(validate(30));
> ```
> <details><summary>Ответ</summary>
>
> Первый вызов: выведет `"OK"` (возраст 25, валидация пройдена).
> Второй вызов: бросит `RangeError`. Поскольку нет `try/catch` — программа упадёт.
> Третий вызов: НЕ выполнится — программа уже упала на втором вызове.
> </details>

---

## Кастомные классы ошибок

### Откуда взялось и зачем

Встроенных типов (`TypeError`, `RangeError`) мало — они описывают проблемы с JS, а не с твоей бизнес-логикой. В реальном приложении нужны свои типы: `ValidationError` (невалидные данные формы), `NotFoundError` (ресурс не найден), `AuthError` (нет доступа). Свой тип ошибки позволяет:
1. Различать ошибки по типу через `instanceof`
2. Добавлять свои поля (какое поле невалидно, какой HTTP-код)
3. Обрабатывать каждый тип по-своему

### Как создать

Кастомная ошибка — это класс, который наследует от `Error` через `extends`:

```js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);                // передаём message родителю Error
    this.name = "ValidationError"; // переопределяем имя (иначе будет "Error")
    this.field = field;            // своё поле: какое поле невалидно
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(`${resource} с id=${id} не найден`);
    this.name = "NotFoundError";
    this.resource = resource;
    this.id = id;
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}
```

> 💡 **На заметку:** `super(message)` — вызов конструктора родителя `Error`. Это обязательно — без него `message` и `stack` не заполнятся. Подробнее о наследовании классов — в блоке 1 (ООП).

### Как использовать

```js
function getUser(id, currentUser) {
  if (!currentUser) {
    throw new AuthError("Требуется авторизация");
  }
  if (typeof id !== "number") {
    throw new ValidationError("id", "Должен быть числом");
  }
  if (id > 100) {
    throw new NotFoundError("User", id);
  }
  return { id, name: "Игорь" };
}

// Обработка — каждый тип по-своему:
try {
  const user = getUser(999, { name: "Admin" });
} catch (error) {
  if (error instanceof AuthError) {
    console.log("Войдите в систему:", error.message);
  } else if (error instanceof ValidationError) {
    console.log(`Ошибка в поле "${error.field}": ${error.message}`);
  } else if (error instanceof NotFoundError) {
    console.log(`${error.resource} #${error.id} не найден`);
  } else {
    console.log("Неизвестная ошибка:", error.message);
  }
}
// Вывод: "User #999 не найден"
```

### Структура наследования

```
Error (базовый класс)
├── TypeError        (встроенный)
├── RangeError       (встроенный)
├── SyntaxError      (встроенный)
├── ReferenceError   (встроенный)
├── ValidationError  (кастомный)
├── NotFoundError    (кастомный)
└── AuthError        (кастомный)
```

Поэтому `error instanceof Error` — `true` для всех, и встроенных, и кастомных.

---

## finally — выполнить всегда

### Откуда взялось и зачем

Бывают операции, которые нужно сделать независимо от результата: скрыть индикатор загрузки, закрыть файл, отключиться от базы данных. Без `finally` пришлось бы дублировать этот код и в `try`, и в `catch`:

```js
// ❌ Без finally — дублирование:
try {
  showSpinner();
  const data = loadData();
  hideSpinner();  // при успехе
} catch (e) {
  hideSpinner();  // при ошибке — тот же код!
  showError(e);
}

// ✅ С finally — одно место:
try {
  showSpinner();
  const data = loadData();
} catch (e) {
  showError(e);
} finally {
  hideSpinner(); // выполнится в ЛЮБОМ случае
}
```

### Что это такое

`finally` — блок который выполняется **всегда**: и после успешного `try`, и после `catch`, и даже если в `catch` есть `return` или новая ошибка.

### Порядок выполнения

```js
// Случай 1: ошибки НЕТ
try {
  console.log("try");      // 1
} catch (e) {
  console.log("catch");    // пропущен
} finally {
  console.log("finally");  // 2
}
// Вывод: "try", "finally"

// Случай 2: ошибка ЕСТЬ
try {
  console.log("try");      // 1
  throw new Error("упс");
} catch (e) {
  console.log("catch");    // 2
} finally {
  console.log("finally");  // 3
}
// Вывод: "try", "catch", "finally"
```

### finally и return

`finally` выполняется даже если в `try` или `catch` есть `return`:

```js
function test() {
  try {
    return "из try";
  } finally {
    console.log("finally выполнился!"); // выполнится ДО return
  }
}

console.log(test());
// "finally выполнился!"
// "из try"
```

> **Механика: почему finally выполняется даже после return**
> 1. Когда JS встречает `return "из try"` внутри `try` — он **запоминает** возвращаемое значение, но НЕ выходит из функции сразу
> 2. JS проверяет: "есть ли блок `finally`?" — если да, выполняет его **перед** фактическим выходом
> 3. После `finally` JS возвращает **запомненное** значение из шага 1
> ```
> try {
>   return "A"    → запомнил "A", но НЕ вышел
> } finally {
>   console.log() → выполняется СЕЙЧАС
> }               → ТЕПЕРЬ выходит и возвращает "A"
> ```
> Тот же механизм работает при `throw` внутри `try` — finally выполнится перед тем, как ошибка полетит дальше.

> ⚠️ **Важно:** если в `finally` есть свой `return`, он **перезапишет** return из `try` или `catch`. Это неочевидное поведение — избегай `return` в `finally`:
> ```js
> function bad() {
>   try {
>     return "из try";
>   } finally {
>     return "из finally"; // перезаписывает!
>   }
> }
> console.log(bad()); // "из finally" — неожиданно!
> ```

### try/finally без catch

Можно использовать `try/finally` без `catch` — ошибка не будет поймана, но `finally` выполнится перед падением:

```js
function riskyOperation() {
  try {
    // опасный код
    null.property; // TypeError
  } finally {
    console.log("Очистка ресурсов"); // выполнится
  }
  // TypeError всё равно "полетит" дальше — catch нет
}

try {
  riskyOperation(); // ошибка поймается здесь
} catch (e) {
  console.log("Поймали:", e.message);
}
// "Очистка ресурсов"
// "Поймали: Cannot read properties of null (reading 'property')"
```

> ❌ **Частые заблуждения:**
> - "finally нужен только для ошибок" — нет. `finally` выполняется всегда, даже если ошибки не было. Он для кода, который обязан выполниться в любом случае.
> - "Если есть catch, finally не нужен" — не всегда. `catch` обрабатывает ошибку, `finally` делает очистку. Они решают разные задачи.

> 🔍 **Мини-проверка:** что выведет?
> ```js
> function getData() {
>   try {
>     console.log("1");
>     throw new Error("сбой");
>     console.log("2");
>   } catch (e) {
>     console.log("3");
>     return "результат";
>   } finally {
>     console.log("4");
>   }
> }
> console.log(getData());
> ```
> <details><summary>Ответ</summary>
>
> 1. `"1"` — начало try
> 2. Ошибка на `throw` — `"2"` пропускается
> 3. `"3"` — catch выполняется
> 4. `return "результат"` — запланирован, но сначала finally
> 5. `"4"` — finally выполняется перед return
> 6. `"результат"` — возврат из функции
>
> Вывод: `1`, `3`, `4`, `результат`
> </details>

---

## Антипаттерны — как НЕ надо

### 1. Проглатывать ошибки (пустой catch)

```js
// ❌ Плохо — ошибка "съедается", ты не знаешь что пошло не так:
try {
  doSomething();
} catch (e) {
  // пусто — самый частый антипаттерн!
}

// ✅ Хорошо — как минимум логируй:
try {
  doSomething();
} catch (e) {
  console.error("doSomething упал:", e.message);
}
```

### 2. Оборачивать слишком много кода

```js
// ❌ Плохо — если упадёт, непонятно где именно:
try {
  const user = getUser();
  const profile = getProfile(user.id);
  const posts = getPosts(profile.authorId);
  renderAll(user, profile, posts);
} catch (e) {
  console.error(e); // одна из четырёх функций упала — какая?
}

// ✅ Лучше — оборачивай конкретные опасные операции:
let user;
try {
  user = getUser();
} catch (e) {
  console.error("Ошибка получения пользователя:", e.message);
  return;
}

// дальше работаем с user
```

### 3. Бросать строки вместо объектов Error

```js
// ❌ Плохо — нет name, нет stack, невозможно отладить:
throw "Что-то пошло не так";
throw 404;

// ✅ Хорошо — всегда объект Error:
throw new Error("Что-то пошло не так");
throw new TypeError("Ожидалось число");
```

### 4. Ловить ошибку и бросать заново без информации

```js
// ❌ Плохо — потерял оригинальное сообщение:
try {
  riskyCode();
} catch (e) {
  throw new Error("Ошибка"); // оригинальный e.message потерян
}

// ✅ Хорошо — сохраняй контекст:
try {
  riskyCode();
} catch (e) {
  throw new Error(`Ошибка в riskyCode: ${e.message}`);
}
```

---

## Практический паттерн: функция-обёртка

Часто нужно сделать функцию "безопасной" — чтобы она не падала, а возвращала результат или ошибку. Этот паттерн используется в задании 9.6:

```js
// Обёртка: превращает "опасную" функцию в "безопасную"
function tryCatch(fn) {
  return function (...args) {
    try {
      return { ok: true, value: fn(...args) };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };
}

// Использование:
const safeParse = tryCatch(JSON.parse);

safeParse('{"a": 1}');      // { ok: true, value: { a: 1 } }
safeParse("битый JSON");     // { ok: false, error: "Unexpected token..." }
```

> 💡 **На заметку:** `...args` — это rest-параметры (собирают все переданные аргументы в массив). `fn(...args)` — spread (разворачивают массив обратно в аргументы). Эти синтаксисы изучаются в главе про функции (04-functions). Если забыл — перечитай раздел "Rest и Spread".

---

## Практический паттерн: retry (повтор при ошибке)

Иногда операция может упасть временно (сбой сети, занят ресурс). Вместо одного падения — повторить несколько раз:

```js
function retry(fn, times) {
  for (let i = 1; i <= times; i++) {
    try {
      return fn(); // если успех — сразу возвращаем результат
    } catch (error) {
      if (i === times) {
        throw error; // последняя попытка — бросаем ошибку дальше
      }
      console.log(`Попытка ${i} неудачна: ${error.message}`);
    }
  }
}

// Тестируем:
let attempts = 0;
function unstable() {
  attempts++;
  if (attempts < 3) throw new Error("Временная ошибка");
  return "Успех!";
}

console.log(retry(unstable, 5)); // "Успех!" (на 3-й попытке)
```

Этот паттерн используется в задании 9.5.

---

## Итог

```
try {
  // опасный код
} catch (error) {
  // реакция на ошибку
  // error.name    — тип ошибки
  // error.message — описание
  // error.stack   — стек вызовов
} finally {
  // выполнится ВСЕГДА — для очистки ресурсов
}

throw new Error("описание"); — создать и бросить ошибку
throw new TypeError("...");  — конкретный тип
throw new MyError("...");    — кастомный класс

instanceof — проверить тип ошибки:
  if (error instanceof ValidationError) { ... }

КАСТОМНЫЕ ОШИБКИ:
  class MyError extends Error {
    constructor(message) {
      super(message);
      this.name = "MyError";
    }
  }

ПРАВИЛА:
  - Всегда логируй ошибки (не пустой catch)
  - Бросай объекты Error (не строки и не числа)
  - Используй кастомные классы для бизнес-ошибок
  - В finally — очищай ресурсы
  - Оборачивай конкретные опасные места, а не всё подряд
  - try/catch ловит только синхронные runtime-ошибки
```

---

*← [[js/08-this|this]] | [[js/10-modules|Модули]] → | [[js-fundamentals|К оглавлению]]*
