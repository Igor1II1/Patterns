# Fetch API — HTTP-запросы из JavaScript

> [[js-fundamentals|<-- Назад к оглавлению JS]]

---

## Зачем эта тема существует?

Веб-приложения почти всегда общаются с сервером: загружают данные, отправляют формы, проверяют авторизацию. Раньше для этого использовался `XMLHttpRequest` — громоздкий и неудобный API. В 2015 году появился `fetch()` — современный, основанный на промисах способ делать HTTP-запросы. Fetch — это мост между фронтендом и бэкендом, и каждый веб-разработчик использует его ежедневно.

---

## Базовый GET-запрос

### Что это такое?

`fetch(url)` отправляет HTTP-запрос на указанный адрес и возвращает **промис**, который завершается объектом `Response` (ответ сервера).

Аналогия: `fetch` — это почтальон. Ты даёшь ему адрес (URL), он идёт туда, забирает посылку (ответ) и приносит тебе. Он не открывает посылку сам — для этого нужно вызвать `.json()` или `.text()`.

### Как работает?

```js
// Простейший запрос
fetch("https://jsonplaceholder.typicode.com/users/1")
  .then(function(response) {
    return response.json();  // парсим JSON (тоже промис!)
  })
  .then(function(data) {
    console.log(data.name);  // "Leanne Graham"
  })
  .catch(function(error) {
    console.error("Ошибка:", error);
  });
```

С async/await — читабельнее:

```js
async function получитьПользователя(id) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/" + id);
    const data = await response.json();
    console.log(data.name);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

получитьПользователя(1);
```

### Двухэтапный процесс

Обрати внимание: получение данных из `fetch` — это **два шага**:

```
Шаг 1: fetch(url)        → промис → Response (заголовки пришли)
Шаг 2: response.json()   → промис → данные (тело распарсено)
```

```
┌────────┐    запрос     ┌────────┐    ответ      ┌──────────┐
│ Браузер│──────────────>│ Сервер │──────────────>│ Response │
└────────┘               └────────┘               └─────┬────┘
                                                        │
                                                  .json() / .text()
                                                        │
                                                        ▼
                                                 ┌──────────┐
                                                 │  Данные   │
                                                 └──────────┘
```

Методы для чтения тела ответа:

| Метод | Возвращает | Когда использовать |
|-------|-----------|-------------------|
| `response.json()` | Объект/массив | JSON-данные от API |
| `response.text()` | Строка | HTML, plain text |
| `response.blob()` | Blob (бинарные данные) | Картинки, файлы |
| `response.arrayBuffer()` | ArrayBuffer | Низкоуровневые бинарные данные |

**Каждый из этих методов можно вызвать только ОДИН раз** — тело ответа читается как поток.

> **Частое заблуждение:** "`response.json()` — это синхронная операция." Нет — это промис! Поэтому нужен `await` или `.then()`.

---

## Объект Response

### Что это такое?

`Response` — объект, который содержит информацию об ответе сервера: статус, заголовки и тело.

### Как работает?

```js
async function анализОтвета() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");

  console.log(response.status);     // 200 (HTTP-код)
  console.log(response.statusText); // "OK"
  console.log(response.ok);         // true (статус 200-299)
  console.log(response.url);        // URL запроса
  console.log(response.headers.get("content-type")); // "application/json; ..."
}
```

Основные HTTP-коды:

```
200 — OK (успешно)
201 — Created (создано)
204 — No Content (успешно, но тела нет)
400 — Bad Request (плохой запрос)
401 — Unauthorized (не авторизован)
403 — Forbidden (запрещено)
404 — Not Found (не найдено)
500 — Internal Server Error (ошибка сервера)
```

---

## Обработка ошибок: сетевые vs HTTP

### Что это такое?

Это **самая важная ловушка** fetch. Есть два типа ошибок, и fetch обрабатывает их по-разному:

1. **Сетевая ошибка** — нет интернета, DNS не найден, сервер не отвечает → fetch **reject** (попадает в `.catch`)
2. **HTTP-ошибка** — сервер ответил кодом 404, 500 и т.д. → fetch **fulfilled** (НЕ попадает в `.catch`!)

```
fetch("https://example.com/api")

Нет интернета:
  → Promise rejected → .catch() ловит

Сервер ответил 404:
  → Promise fulfilled!
  → response.ok === false
  → .catch() НЕ сработает!
```

### Плохой пример -> Хороший пример

```js
// ПЛОХО — HTTP-ошибки не обрабатываются
async function загрузить(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();  // 404 страница — не JSON!
    return data;
  } catch (err) {
    console.log("Ошибка");  // сработает только при сетевой ошибке
  }
}
```

```js
// ХОРОШО — проверяем response.ok
async function загрузить(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("HTTP ошибка: " + response.status);
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.error("Ошибка загрузки:", err.message);
    // Ловит И сетевые ошибки, И HTTP-ошибки
  }
}
```

> **Мини-проверка:** Попадёт ли ответ с кодом 500 в `.catch()` у fetch?
> Ответ: Нет. fetch считает любой ответ от сервера "успешным" (промис fulfilled). Нужно проверять `response.ok` вручную.

---

## POST-запрос

### Что это такое?

POST используется для **отправки данных** на сервер: создание нового пользователя, отправка формы, сохранение настроек.

### Как работает?

```js
async function создатьПост(заголовок, текст) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: заголовок,
        body: текст,
        userId: 1
      })
    });

    if (!response.ok) {
      throw new Error("HTTP ошибка: " + response.status);
    }

    const результат = await response.json();
    console.log("Создан пост с id:", результат.id);
    return результат;

  } catch (err) {
    console.error("Ошибка создания поста:", err.message);
  }
}

создатьПост("Мой первый пост", "Привет, мир!");
```

Структура второго аргумента fetch:

```js
fetch(url, {
  method: "POST",              // HTTP-метод: GET, POST, PUT, DELETE, PATCH
  headers: {
    "Content-Type": "application/json",  // тип отправляемых данных
    "Authorization": "Bearer token123"   // токен авторизации (если нужен)
  },
  body: JSON.stringify(данные)  // тело запроса (строка!)
});
```

### HTTP-методы

| Метод | Действие | Тело запроса |
|-------|----------|-------------|
| **GET** | Получить данные | Нет |
| **POST** | Создать ресурс | Да |
| **PUT** | Заменить ресурс целиком | Да |
| **PATCH** | Обновить часть ресурса | Да |
| **DELETE** | Удалить ресурс | Обычно нет |

```js
// PUT — обновить пользователя
await fetch("/api/users/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Игорь", age: 26 })
});

// DELETE — удалить пользователя
await fetch("/api/users/1", {
  method: "DELETE"
});
```

### Плохой пример -> Хороший пример

```js
// ПЛОХО — забыли Content-Type и stringify
await fetch("/api/users", {
  method: "POST",
  body: { name: "Игорь" }  // объект! Сервер получит "[object Object]"
});
```

```js
// ХОРОШО — правильный Content-Type и JSON.stringify
await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ name: "Игорь" })
});
```

> **Частое заблуждение:** "Можно передать объект в body напрямую." Нет — `body` принимает строку, `Blob`, `FormData` или `URLSearchParams`. Объект нужно сначала превратить в JSON-строку через `JSON.stringify()`.

---

## Заголовки (Headers)

### Что это такое?

HTTP-заголовки — это **метаданные** запроса и ответа. Они говорят серверу, что мы отправляем и какой ответ ожидаем.

### Как работает?

```js
// Создание заголовков
const headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Authorization", "Bearer mytoken123");

// Или проще — объектом
const response = await fetch("/api/data", {
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer mytoken123",
    "Accept": "application/json"        // какой формат ответа хотим
  }
});

// Чтение заголовков ответа
console.log(response.headers.get("content-type"));
console.log(response.headers.get("x-total-count"));  // кастомные заголовки API
```

Часто используемые заголовки:

| Заголовок | Зачем |
|-----------|-------|
| `Content-Type` | Формат отправляемых данных |
| `Authorization` | Токен авторизации |
| `Accept` | Какой формат ответа ожидаем |
| `Cache-Control` | Настройки кэширования |

---

## CORS — Cross-Origin Resource Sharing

### Что это такое?

CORS — это механизм безопасности браузера. Он **запрещает** запросы с одного домена на другой, если сервер явно не разрешил это.

Аналогия: ты живёшь в доме (твой сайт). Ты можешь свободно ходить по своему дому (запросы к своему серверу). Но чтобы зайти в соседний дом (чужой сервер), сосед должен выдать тебе пропуск (CORS-заголовки).

### Как работает?

```
Твой сайт: https://mysite.com
API:        https://api.example.com

Браузер:  "Это разные домены! Сервер, ты разрешаешь?"
Сервер:   Access-Control-Allow-Origin: https://mysite.com
Браузер:  "OK, разрешаю запрос."

Или:
Сервер:   (нет заголовка CORS)
Браузер:  "Запрещено! CORS error."
```

```
┌──────────────┐         ┌──────────────────┐
│  mysite.com  │──fetch──│ api.example.com  │
│  (браузер)   │         │    (сервер)      │
└──────┬───────┘         └────────┬─────────┘
       │                          │
       │  Запрос от другого       │
       │  домена (cross-origin)   │
       │                          │
       │  ← Access-Control-Allow-Origin: *
       │     (или конкретный домен)
       │                          │
       ▼                          │
  Если заголовок есть → ОК        │
  Если нет → CORS Error           │
```

**Что делать при CORS-ошибке?**

Эту проблему **решает бэкенд**, не фронтенд. Сервер должен добавить заголовки:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

Для разработки можно использовать прокси или расширения браузера, но в продакшене — **только настройка сервера**.

> **Частое заблуждение:** "CORS — это ограничение сервера." Нет — CORS проверяет **браузер**. Если ты делаешь запрос из Node.js (не из браузера), CORS не действует. Это защита пользователей от вредоносных сайтов.

---

## Практический пример: полный CRUD

```js
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// CREATE — создать
async function создать(данные) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(данные)
  });
  if (!response.ok) throw new Error("Ошибка создания: " + response.status);
  return response.json();
}

// READ — прочитать
async function прочитать(id) {
  const response = await fetch(API_URL + "/" + id);
  if (!response.ok) throw new Error("Не найдено: " + response.status);
  return response.json();
}

// UPDATE — обновить
async function обновить(id, данные) {
  const response = await fetch(API_URL + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(данные)
  });
  if (!response.ok) throw new Error("Ошибка обновления: " + response.status);
  return response.json();
}

// DELETE — удалить
async function удалить(id) {
  const response = await fetch(API_URL + "/" + id, {
    method: "DELETE"
  });
  if (!response.ok) throw new Error("Ошибка удаления: " + response.status);
  return true;
}

// Использование
async function демо() {
  try {
    const новый = await создать({ title: "Тест", body: "Текст", userId: 1 });
    console.log("Создан:", новый);

    const пост = await прочитать(1);
    console.log("Прочитан:", пост.title);

    const обновлённый = await обновить(1, { title: "Новый заголовок" });
    console.log("Обновлён:", обновлённый.title);

    await удалить(1);
    console.log("Удалён");
  } catch (err) {
    console.error(err.message);
  }
}
```

> **Мини-проверка:** Почему в GET-запросе нет `body`, а в POST — есть?
> Ответ: GET предназначен для **получения** данных, параметры передаются через URL (?id=1&name=...). POST предназначен для **отправки** данных, они передаются в теле запроса.

---

## Итог

| Понятие | Описание |
|---------|----------|
| **fetch(url)** | Отправляет HTTP-запрос, возвращает промис с Response |
| **response.json()** | Парсит тело ответа как JSON (промис!) |
| **response.ok** | `true` если статус 200-299 |
| **response.status** | HTTP-код ответа (200, 404, 500...) |
| **method** | HTTP-метод: GET, POST, PUT, DELETE |
| **headers** | Метаданные запроса/ответа |
| **body** | Тело запроса (JSON.stringify для JSON) |
| **CORS** | Защита браузера от кросс-доменных запросов |

**Чеклист при работе с fetch:**
1. Всегда проверяй `response.ok`
2. Не забывай `JSON.stringify()` для body
3. Указывай `Content-Type: application/json` при отправке JSON
4. Оборачивай в `try/catch`
5. Помни: `response.json()` — это промис, нужен `await`

---

> [[js-async/05-promise-methods|<-- Методы Promise]] | [[js-fundamentals|К оглавлению JS -->]]
