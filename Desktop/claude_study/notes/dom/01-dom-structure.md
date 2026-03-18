# Глава 1. Структура DOM

> [[js-fundamentals|<- Назад к оглавлению JS]]

---

## Зачем эта тема существует?

Браузер не работает с HTML напрямую -- он превращает текст разметки в древовидную структуру объектов, которая называется DOM. Без понимания DOM невозможно делать интерактивные страницы: менять текст, добавлять элементы, реагировать на действия пользователя. DOM -- это мост между JavaScript и тем, что видит пользователь на экране.

---

## 1. Что такое DOM

### Что это такое?

**DOM (Document Object Model)** -- это представление HTML-документа в виде дерева объектов. Каждый тег, текст, комментарий становится узлом (node) этого дерева.

**Аналогия:** представь семейное генеалогическое древо. В нём есть предки, потомки, братья и сёстры. HTML-документ устроен точно так же: `<html>` -- прародитель, `<head>` и `<body>` -- его дети, а элементы внутри `<body>` -- внуки.

### Как работает?

Когда браузер получает HTML-код:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Моя страница</title>
  </head>
  <body>
    <h1>Привет</h1>
    <p>Текст параграфа</p>
  </body>
</html>
```

Он строит дерево:

```
document
  └── html
        ├── head
        │     └── title
        │           └── "Моя страница" (текстовый узел)
        └── body
              ├── h1
              │     └── "Привет" (текстовый узел)
              └── p
                    └── "Текст параграфа" (текстовый узел)
```

Объект `document` -- это точка входа. Через него мы обращаемся ко всему дереву.

```js
console.log(document);             // весь документ
console.log(document.documentElement); // элемент <html>
console.log(document.head);        // элемент <head>
console.log(document.body);        // элемент <body>
```

---

## 2. Типы узлов

### Что это такое?

Не каждый узел в DOM -- это тег. Существует несколько типов узлов, и важно их различать.

| Тип узла | nodeType | Пример |
|----------|----------|--------|
| Элемент (Element) | 1 | `<div>`, `<p>`, `<a>` |
| Текст (Text) | 3 | `"Привет"`, пробелы, переносы строк |
| Комментарий (Comment) | 8 | `<!-- комментарий -->` |
| Документ (Document) | 9 | `document` |

### Как работает?

```js
const heading = document.querySelector('h1');

console.log(heading.nodeType);  // 1 (элемент)
console.log(heading.nodeName);  // "H1"

const textInside = heading.firstChild;
console.log(textInside.nodeType);  // 3 (текст)
console.log(textInside.nodeValue); // "Привет"
```

> **Частое заблуждение:** "В DOM только теги." Нет -- пробелы и переносы строк между тегами тоже становятся текстовыми узлами. Это частая причина путаницы при навигации по дереву.

---

## 3. Поиск элементов

### Что это такое?

Прежде чем что-то менять на странице, нужно найти нужный элемент. JavaScript предоставляет несколько способов поиска.

### Как работает?

#### getElementById

Ищет элемент по атрибуту `id`. Возвращает один элемент или `null`.

```html
<div id="header">Шапка сайта</div>
```

```js
const header = document.getElementById('header');
console.log(header.textContent); // "Шапка сайта"
```

#### querySelector

Ищет **первый** элемент, подходящий под CSS-селектор. Возвращает один элемент или `null`.

```html
<ul>
  <li class="item">Первый</li>
  <li class="item">Второй</li>
  <li class="item active">Третий</li>
</ul>
```

```js
const first = document.querySelector('.item');
console.log(first.textContent); // "Первый"

const active = document.querySelector('.item.active');
console.log(active.textContent); // "Третий"

const li = document.querySelector('ul > li:last-child');
console.log(li.textContent); // "Третий"
```

#### querySelectorAll

Ищет **все** элементы, подходящие под CSS-селектор. Возвращает `NodeList`.

```js
const items = document.querySelectorAll('.item');
console.log(items.length); // 3

items.forEach(item => {
  console.log(item.textContent);
});
// "Первый"
// "Второй"
// "Третий"
```

### Плохой пример -> Хороший пример

```js
// Плохо: getElementsByClassName возвращает "живую" коллекцию,
// которая может меняться прямо во время перебора
const items = document.getElementsByClassName('item');

// Хорошо: querySelectorAll возвращает статичный NodeList,
// который не изменится, даже если DOM изменится после вызова
const items = document.querySelectorAll('.item');
```

> **Мини-проверка:** Что вернёт `document.querySelector('.absent')`, если элемента с таким классом нет? Ответ: `null`.

---

## 4. NodeList vs HTMLCollection

### Что это такое?

Это два похожих, но разных типа коллекций, которые возвращают методы поиска.

| | NodeList | HTMLCollection |
|---|---------|----------------|
| Возвращает | `querySelectorAll` | `getElementsByClassName`, `getElementsByTagName`, `children` |
| Живая? | Нет (статичная) | Да (живая) |
| `forEach` | Есть | Нет |
| Содержит | Любые узлы | Только элементы |

### Как работает?

```js
// NodeList -- статичная, есть forEach
const nodeList = document.querySelectorAll('li');
nodeList.forEach(li => console.log(li.textContent));

// HTMLCollection -- живая, нет forEach
const collection = document.getElementsByTagName('li');

// Нужно преобразовать в массив для перебора:
const array = Array.from(collection);
array.forEach(li => console.log(li.textContent));
// или:
[...collection].forEach(li => console.log(li.textContent));
```

**"Живая" коллекция** означает, что она автоматически обновляется при изменении DOM:

```js
const divs = document.getElementsByTagName('div'); // живая
console.log(divs.length); // например, 3

document.body.appendChild(document.createElement('div'));
console.log(divs.length); // 4 -- коллекция обновилась сама!

const divs2 = document.querySelectorAll('div'); // статичная
// divs2.length останется прежним, даже если добавить новый div
```

> **Частое заблуждение:** "NodeList -- это массив." Нет. У NodeList нет методов `map`, `filter`, `reduce`. Для этого нужно сначала преобразовать в массив через `Array.from()`.

---

## 5. Навигация по дереву

### Что это такое?

Когда у тебя уже есть ссылка на элемент, ты можешь перемещаться по дереву: к родителю, к детям, к соседям. Это называется **traversal** (обход).

### Как работает?

Есть два набора свойств: для всех узлов и только для элементов.

| Все узлы (включая текст) | Только элементы |
|--------------------------|-----------------|
| `parentNode` | `parentElement` |
| `childNodes` | `children` |
| `firstChild` | `firstElementChild` |
| `lastChild` | `lastElementChild` |
| `nextSibling` | `nextElementSibling` |
| `previousSibling` | `previousElementSibling` |

```html
<ul id="list">
  <li>Первый</li>
  <li>Второй</li>
  <li>Третий</li>
</ul>
```

```js
const list = document.getElementById('list');

// Дети-элементы (без текстовых узлов)
console.log(list.children.length);        // 3
console.log(list.firstElementChild.textContent); // "Первый"
console.log(list.lastElementChild.textContent);  // "Третий"

// Родитель
const li = document.querySelector('li');
console.log(li.parentElement.id); // "list"

// Соседи
const second = list.children[1];
console.log(second.previousElementSibling.textContent); // "Первый"
console.log(second.nextElementSibling.textContent);     // "Третий"
```

### Плохой пример -> Хороший пример

```js
// Плохо: firstChild может вернуть текстовый узел (перенос строки)
const first = list.firstChild;
console.log(first.nodeType); // 3 (текст!), а не элемент

// Хорошо: firstElementChild всегда вернёт элемент
const first = list.firstElementChild;
console.log(first.nodeType); // 1 (элемент)
```

> **Мини-проверка:** У элемента `<body>` кто является `parentElement`? Ответ: элемент `<html>` (то есть `document.documentElement`).

---

## 6. Метод closest

### Что это такое?

`closest(selector)` ищет ближайшего предка (включая сам элемент), который соответствует CSS-селектору. Это как подниматься по дереву вверх и проверять каждый узел.

### Как работает?

```html
<div class="card">
  <div class="card-body">
    <button class="btn">Нажми</button>
  </div>
</div>
```

```js
const btn = document.querySelector('.btn');

// Поднимаемся вверх от кнопки и ищем .card
const card = btn.closest('.card');
console.log(card); // <div class="card">...</div>

// Если предок не найден -- возвращает null
const form = btn.closest('form');
console.log(form); // null
```

> **Частое заблуждение:** "`closest` ищет среди детей." Нет, он ищет среди **предков** -- от текущего элемента вверх к корню дерева.

---

## Итог

- **DOM** -- древовидное представление HTML-документа в виде объектов JavaScript.
- Узлы бывают разных типов: элементы, текст, комментарии.
- Для поиска используй `querySelector` и `querySelectorAll` -- они принимают CSS-селекторы и возвращают статичные результаты.
- `NodeList` (от `querySelectorAll`) -- статичная коллекция с `forEach`. `HTMLCollection` -- живая, без `forEach`.
- Для навигации используй свойства с `Element` в имени (`children`, `firstElementChild`, `nextElementSibling`), чтобы не натыкаться на текстовые узлы.
- `closest` ищет предка вверх по дереву.

---

> [[dom/02-dom-manipulation|Далее: Изменение DOM ->]]
>
> [[js-fundamentals|<- Назад к оглавлению JS]]
