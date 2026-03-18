# Глава 5. Хранение данных в браузере

> [[js-fundamentals|<- Назад к оглавлению JS]]

---

## Зачем эта тема существует?

Когда пользователь перезагружает страницу, весь JavaScript "забывает" всё, что было. Переменные исчезают, состояние теряется. Чтобы сохранять данные между перезагрузками -- тему оформления, товары в корзине, токен авторизации -- нужно хранилище в браузере. localStorage, sessionStorage и cookies решают эту задачу, каждый по-своему.

---

## 1. localStorage

### Что это такое?

`localStorage` -- хранилище пар "ключ-значение" в браузере. Данные сохраняются **навсегда** (пока пользователь или код не удалит их). Они привязаны к домену сайта.

**Аналогия:** localStorage -- это записная книжка, которая лежит на твоём столе. Ты можешь написать в неё что-то, закрыть, уйти домой, вернуться завтра -- записи на месте. Но другой человек (другой домен) твою книжку прочитать не может.

### Как работает?

#### Основные методы

```js
// Сохранить значение
localStorage.setItem('username', 'Игорь');
localStorage.setItem('theme', 'dark');

// Прочитать значение
const name = localStorage.getItem('username');
console.log(name); // "Игорь"

// Прочитать несуществующий ключ
const missing = localStorage.getItem('absent');
console.log(missing); // null

// Удалить одно значение
localStorage.removeItem('theme');

// Удалить ВСЁ
localStorage.clear();
```

#### Другие способы доступа

```js
// Можно обращаться как к свойствам объекта (но не рекомендуется)
localStorage.username = 'Игорь';     // записать
console.log(localStorage.username);   // прочитать

// Количество ключей
console.log(localStorage.length); // 2

// Получить ключ по индексу
console.log(localStorage.key(0)); // "username" (порядок не гарантирован)
```

#### Перебор всех данных

```js
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}: ${value}`);
}

// Или через Object.keys
Object.keys(localStorage).forEach(key => {
  console.log(`${key}: ${localStorage.getItem(key)}`);
});
```

### Плохой пример -> Хороший пример

```js
// Плохо: обращение через точку -- может конфликтовать с методами
localStorage.key = 'value';
// localStorage.key -- это и метод, и теперь ещё свойство! Конфликт.

// Хорошо: всегда через setItem/getItem
localStorage.setItem('key', 'value');
localStorage.getItem('key');
```

> **Частое заблуждение:** "localStorage можно использовать в приватном режиме." В некоторых браузерах в приватном/инкогнито режиме localStorage может быть ограничен или очищаться при закрытии окна. Оборачивай обращения в try-catch на всякий случай.

---

## 2. Хранение объектов: JSON.stringify и JSON.parse

### Что это такое?

localStorage хранит только строки. Если записать число, массив или объект, они будут преобразованы в строку через `.toString()`, что обычно даёт бесполезный результат. Для корректного сохранения сложных данных используют JSON.

### Как работает?

```js
// Проблема: объект превращается в "[object Object]"
localStorage.setItem('user', { name: 'Игорь' });
console.log(localStorage.getItem('user')); // "[object Object]" -- данные потеряны!

// Решение: JSON.stringify при записи, JSON.parse при чтении

// Сохранение объекта
const user = { name: 'Игорь', age: 25, skills: ['JS', 'HTML'] };
localStorage.setItem('user', JSON.stringify(user));
// В хранилище: '{"name":"Игорь","age":25,"skills":["JS","HTML"]}'

// Чтение объекта
const savedUser = JSON.parse(localStorage.getItem('user'));
console.log(savedUser.name);    // "Игорь"
console.log(savedUser.skills);  // ["JS", "HTML"]
```

#### Безопасное чтение

```js
// Если ключа нет, getItem вернёт null, а JSON.parse(null) вернёт null
// Но если данные повреждены, JSON.parse выбросит ошибку!

function loadFromStorage(key, defaultValue) {
  try {
    const data = localStorage.getItem(key);
    return data !== null ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Ошибка чтения из localStorage:', error);
    return defaultValue;
  }
}

// Использование
const settings = loadFromStorage('settings', { theme: 'light', lang: 'ru' });
```

#### Сохранение массива

```js
// Корзина покупок
let cart = loadFromStorage('cart', []);

// Добавить товар
cart.push({ id: 1, name: 'Книга', price: 500 });
cart.push({ id: 2, name: 'Ручка', price: 50 });
localStorage.setItem('cart', JSON.stringify(cart));

// При следующей загрузке страницы -- корзина на месте
cart = loadFromStorage('cart', []);
console.log(cart.length); // 2
```

### Плохой пример -> Хороший пример

```js
// Плохо: сохранять массив без JSON.stringify
localStorage.setItem('items', [1, 2, 3]);
console.log(localStorage.getItem('items')); // "1,2,3" (строка, не массив!)
JSON.parse(localStorage.getItem('items'));   // ошибка!

// Хорошо: всегда через JSON
localStorage.setItem('items', JSON.stringify([1, 2, 3]));
const items = JSON.parse(localStorage.getItem('items'));
console.log(Array.isArray(items)); // true
console.log(items[0]);            // 1 (число, не строка)
```

> **Мини-проверка:** Что вернёт `JSON.parse('undefined')`? Ответ: выбросит ошибку `SyntaxError`. Поэтому всегда проверяй, что `getItem` вернул не `null`, прежде чем парсить.

---

## 3. sessionStorage

### Что это такое?

`sessionStorage` работает точно так же, как `localStorage`, но данные живут только пока открыта вкладка браузера. Закрыл вкладку -- данные исчезли.

**Аналогия:** sessionStorage -- как записка на маркерной доске. Пока ты в кабинете -- записка на месте. Вышел и закрыл дверь -- уборщик всё стёр.

### Как работает?

```js
// API идентичный localStorage
sessionStorage.setItem('step', '3');
console.log(sessionStorage.getItem('step')); // "3"
sessionStorage.removeItem('step');
sessionStorage.clear();
```

#### Когда использовать sessionStorage

```js
// Пример: многошаговая форма
// Шаг 1
sessionStorage.setItem('step1', JSON.stringify({
  name: 'Игорь',
  email: 'igor@test.com'
}));

// Шаг 2 (другая страница или компонент)
const step1Data = JSON.parse(sessionStorage.getItem('step1'));
console.log(step1Data.name); // "Игорь"

// При закрытии вкладки -- черновик пропадёт (и это нормально)
```

---

## 4. Разница между localStorage и sessionStorage

### Что это такое?

Оба хранилища имеют одинаковый API, но разные правила "времени жизни" данных.

### Как работает?

| Характеристика | localStorage | sessionStorage |
|----------------|-------------|----------------|
| Время жизни | Навсегда (пока не удалишь) | До закрытия вкладки |
| Доступ между вкладками | Да (один домен) | Нет (только текущая вкладка) |
| Объём | ~5-10 МБ | ~5-10 МБ |
| API | Одинаковый | Одинаковый |
| При перезагрузке страницы | Сохраняется | Сохраняется |
| При закрытии вкладки | Сохраняется | Удаляется |

```js
// localStorage -- для долгосрочных данных
localStorage.setItem('theme', 'dark');         // тема оформления
localStorage.setItem('lang', 'ru');            // язык интерфейса
localStorage.setItem('token', 'abc123');       // токен авторизации

// sessionStorage -- для временных данных одной сессии
sessionStorage.setItem('scrollPosition', '450'); // позиция прокрутки
sessionStorage.setItem('formDraft', '...');      // черновик формы
sessionStorage.setItem('searchFilters', '...');  // фильтры поиска
```

---

## 5. Событие storage

### Что это такое?

Когда данные в `localStorage` меняются в одной вкладке, другие вкладки того же домена могут об этом узнать через событие `storage`. Это способ синхронизации между вкладками.

### Как работает?

```js
// Вкладка 1: слушает изменения
window.addEventListener('storage', function (event) {
  console.log('Ключ:', event.key);          // какой ключ изменился
  console.log('Старое значение:', event.oldValue);
  console.log('Новое значение:', event.newValue);
  console.log('URL источника:', event.url);

  // Пример: синхронизация темы между вкладками
  if (event.key === 'theme') {
    document.body.className = event.newValue; // применить тему
  }
});

// Вкладка 2: меняет данные
localStorage.setItem('theme', 'dark');
// Вкладка 1 получит событие storage!
```

#### Важные нюансы

```js
// Событие storage НЕ срабатывает в той же вкладке, где произошло изменение!
// Только в других вкладках того же домена.

// Событие НЕ срабатывает для sessionStorage
// (потому что sessionStorage изолирован по вкладкам)

// При clear() -- event.key будет null
```

> **Частое заблуждение:** "Событие storage срабатывает в той же вкладке." Нет! Оно срабатывает только в **других** вкладках. Если нужно реагировать в той же вкладке -- слушай своё собственное кастомное событие или оборачивай setItem.

> **Мини-проверка:** Сработает ли событие `storage` при вызове `sessionStorage.setItem()`? Ответ: нет, потому что sessionStorage изолирован по вкладкам.

---

## 6. Cookies

### Что это такое?

Cookies (куки) -- самый старый механизм хранения данных в браузере. Главное отличие: куки отправляются на сервер с каждым HTTP-запросом. Из-за этого они используются в основном для авторизации (session ID, токены).

### Как работает?

```js
// Установить cookie
document.cookie = 'username=Игорь';
document.cookie = 'theme=dark';

// Чтение -- одна строка со всеми куками
console.log(document.cookie);
// "username=Игорь; theme=dark"

// Установить с параметрами
document.cookie = 'token=abc123; max-age=86400; path=/; secure';
// max-age=86400 -- живёт 24 часа (в секундах)
// path=/ -- доступна на всём сайте
// secure -- только по HTTPS
```

#### Вспомогательные функции

Работать с cookies неудобно, поэтому обычно пишут хелперы:

```js
// Установка
function setCookie(name, value, days) {
  const maxAge = days * 24 * 60 * 60; // дни в секунды
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/`;
}

// Чтение
function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// Удаление (устанавливаем с прошедшей датой)
function deleteCookie(name) {
  document.cookie = `${name}=; max-age=0; path=/`;
}

// Использование
setCookie('lang', 'ru', 30);        // на 30 дней
console.log(getCookie('lang'));       // "ru"
deleteCookie('lang');                 // удалено
```

---

## 7. Сравнение: cookies vs localStorage vs sessionStorage

### Что это такое?

Три механизма хранения данных, каждый для своих целей.

### Как работает?

| | Cookies | localStorage | sessionStorage |
|---|---------|-------------|----------------|
| Объём | ~4 КБ | ~5-10 МБ | ~5-10 МБ |
| Время жизни | Настраивается (expires/max-age) | Навсегда | До закрытия вкладки |
| Отправка на сервер | Да, с каждым запросом | Нет | Нет |
| Доступ из JS | Неудобный API | Удобный API | Удобный API |
| Между вкладками | Да | Да | Нет |
| HTTP-only | Можно запретить доступ из JS | Нет | Нет |

#### Когда что использовать

```js
// Cookies -- авторизация, серверные настройки
// (данные нужны серверу при каждом запросе)
setCookie('session_id', 'abc123', 7);

// localStorage -- пользовательские предпочтения, кэш данных
// (данные нужны только клиенту, надолго)
localStorage.setItem('theme', 'dark');
localStorage.setItem('cart', JSON.stringify(items));

// sessionStorage -- временные данные одной вкладки
// (данные не нужны после закрытия)
sessionStorage.setItem('formDraft', JSON.stringify(draft));
sessionStorage.setItem('lastSearch', 'javascript');
```

### Плохой пример -> Хороший пример

```js
// Плохо: хранить большие данные в cookies (4 КБ лимит + тормозит запросы)
document.cookie = 'cart=' + JSON.stringify(bigCartArray);
// Эти данные будут отправляться на сервер с КАЖДЫМ запросом!

// Хорошо: большие данные в localStorage
localStorage.setItem('cart', JSON.stringify(bigCartArray));
// На сервер не отправляется, лимит 5-10 МБ
```

> **Частое заблуждение:** "Cookies не нужны, есть localStorage." Cookies по-прежнему незаменимы для авторизации, потому что они автоматически отправляются на сервер. HttpOnly cookies ещё и защищены от XSS-атак (JavaScript не может их прочитать).

---

## 8. Практический пример: переключатель темы

### Что это такое?

Полный пример использования localStorage для сохранения настроек пользователя между сессиями.

### Как работает?

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body.dark { background: #1a1a2e; color: #eee; }
    body.light { background: #fff; color: #333; }
    .theme-btn { padding: 10px 20px; cursor: pointer; }
  </style>
</head>
<body>
  <button class="theme-btn" id="themeToggle">Переключить тему</button>

  <script>
    const btn = document.getElementById('themeToggle');

    // При загрузке: восстановить тему из localStorage
    function loadTheme() {
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.body.className = savedTheme;
    }

    // Переключение темы
    btn.addEventListener('click', function () {
      const current = localStorage.getItem('theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';

      document.body.className = next;
      localStorage.setItem('theme', next);
    });

    // Синхронизация между вкладками
    window.addEventListener('storage', function (event) {
      if (event.key === 'theme') {
        document.body.className = event.newValue;
      }
    });

    // Запуск
    loadTheme();
  </script>
</body>
</html>
```

> **Мини-проверка:** Что произойдёт, если вызвать `localStorage.clear()` в одной вкладке? Ответ: все данные localStorage удалятся, и другие вкладки получат событие `storage` с `event.key === null`.

---

## Итог

- `localStorage` хранит данные навсегда, доступен между вкладками одного домена.
- `sessionStorage` хранит данные до закрытия вкладки, изолирован от других вкладок.
- Оба хранят только строки. Для объектов и массивов используй `JSON.stringify` / `JSON.parse`.
- Всегда оборачивай `JSON.parse` в try-catch -- данные могут быть повреждены.
- Событие `storage` позволяет синхронизировать данные между вкладками (только для localStorage).
- Cookies -- для данных, которые нужны серверу (авторизация). Лимит 4 КБ, неудобный API.
- localStorage -- для клиентских данных (настройки, кэш). Лимит 5-10 МБ, удобный API.
- Не храни чувствительные данные (пароли, ключи API) в localStorage -- они доступны любому JS-коду на странице.

---

> [[dom/04-forms|<- Формы]]
>
> [[js-fundamentals|<- Назад к оглавлению JS]]
