# Глава 3. События

> [[js-fundamentals|<- Назад к оглавлению JS]]

---

## Зачем эта тема существует?

Веб-страница без событий -- как телевизор без пульта: смотреть можно, а взаимодействовать нельзя. События -- это механизм, через который браузер сообщает JavaScript о действиях пользователя (клик, ввод текста, нажатие клавиши) и о событиях страницы (загрузка, прокрутка). Без событий не существует интерактивных приложений.

---

## 1. Добавление обработчиков: addEventListener

### Что это такое?

Обработчик события -- это функция, которая выполнится, когда произойдёт определённое событие. `addEventListener` привязывает обработчик к элементу.

**Аналогия:** ты ставишь датчик движения на дверь. Датчик (обработчик) срабатывает каждый раз, когда кто-то проходит (событие).

### Как работает?

```html
<button id="btn">Нажми меня</button>
```

```js
const btn = document.getElementById('btn');

// Синтаксис: element.addEventListener(событие, функция)
btn.addEventListener('click', function () {
  console.log('Кнопка нажата!');
});

// С именованной функцией (предпочтительно)
function handleClick() {
  console.log('Кнопка нажата!');
}
btn.addEventListener('click', handleClick);
```

#### removeEventListener

Для удаления обработчика нужна ссылка на ту же функцию:

```js
function handleClick() {
  console.log('Сработал!');
}

btn.addEventListener('click', handleClick);

// Позже, когда обработчик больше не нужен:
btn.removeEventListener('click', handleClick);
```

### Плохой пример -> Хороший пример

```js
// Плохо: анонимную функцию невозможно удалить
btn.addEventListener('click', function () {
  console.log('Нельзя удалить этот обработчик');
});
// btn.removeEventListener('click', ???) -- нет ссылки!

// Хорошо: именованная функция -- можно удалить
function handleClick() {
  console.log('Можно удалить');
}
btn.addEventListener('click', handleClick);
btn.removeEventListener('click', handleClick); // работает
```

> **Частое заблуждение:** "Можно привязать событие через `onclick`." Можно, но `onclick` позволяет только один обработчик на событие. `addEventListener` позволяет несколько, и это стандартный подход.

```js
// onclick -- только один обработчик, второй перезапишет первый
btn.onclick = function () { console.log('Первый'); };
btn.onclick = function () { console.log('Второй'); }; // Первый потерян!

// addEventListener -- оба работают
btn.addEventListener('click', () => console.log('Первый'));
btn.addEventListener('click', () => console.log('Второй'));
// Оба сработают при клике
```

---

## 2. Объект события (Event)

### Что это такое?

Когда событие происходит, браузер создаёт объект с подробной информацией о нём и передаёт его в обработчик как аргумент.

### Как работает?

```js
btn.addEventListener('click', function (event) {
  console.log(event.type);    // "click"
  console.log(event.target);  // элемент, на котором произошёл клик
  console.log(event.currentTarget); // элемент, к которому привязан обработчик
  console.log(event.clientX); // координата X курсора
  console.log(event.clientY); // координата Y курсора
});
```

Частые свойства объекта события:

| Свойство | Описание |
|----------|----------|
| `event.type` | Тип события (`"click"`, `"keydown"` и т.д.) |
| `event.target` | Элемент, на котором **произошло** событие |
| `event.currentTarget` | Элемент, к которому **привязан** обработчик |
| `event.preventDefault()` | Отменить действие по умолчанию |
| `event.stopPropagation()` | Остановить всплытие |
| `event.key` | Нажатая клавиша (для событий клавиатуры) |

> **Мини-проверка:** Чем `event.target` отличается от `event.currentTarget`? Ответ: `target` -- где событие реально произошло (например, на вложенном `<span>`). `currentTarget` -- элемент, на котором висит обработчик (например, родительский `<div>`).

---

## 3. Всплытие и погружение

### Что это такое?

Когда событие происходит на элементе, оно не остаётся на нём. Событие проходит три фазы:

1. **Погружение (capturing)** -- от `document` вниз к целевому элементу
2. **Цель (target)** -- событие на самом элементе
3. **Всплытие (bubbling)** -- от целевого элемента вверх к `document`

**Аналогия:** брось камень в воду. Волны расходятся от точки падения к берегам -- это всплытие. А погружение -- как если бы волна шла от берега к камню.

### Как работает?

```html
<div id="outer">
  <div id="inner">
    <button id="btn">Нажми</button>
  </div>
</div>
```

```js
document.getElementById('outer').addEventListener('click', () => {
  console.log('outer');
});

document.getElementById('inner').addEventListener('click', () => {
  console.log('inner');
});

document.getElementById('btn').addEventListener('click', () => {
  console.log('btn');
});

// При клике на кнопку выведет:
// "btn"    (цель)
// "inner"  (всплытие)
// "outer"  (всплытие)
```

По умолчанию обработчики срабатывают на фазе **всплытия**. Чтобы поймать событие на фазе **погружения**, передай третий аргумент:

```js
document.getElementById('outer').addEventListener('click', () => {
  console.log('outer -- погружение');
}, true); // true = фаза погружения

// При клике на кнопку:
// "outer -- погружение"  (погружение)
// "btn"                  (цель)
// "inner"                (всплытие)
// "outer"                (всплытие, если есть второй обработчик)
```

---

## 4. stopPropagation vs preventDefault

### Что это такое?

Два метода, которые часто путают. Они делают совершенно разные вещи.

### Как работает?

#### preventDefault -- отмена действия по умолчанию

Отменяет стандартное поведение браузера, но **не** останавливает всплытие.

```js
// Отменить переход по ссылке
const link = document.querySelector('a');
link.addEventListener('click', function (event) {
  event.preventDefault(); // страница НЕ перейдёт по href
  console.log('Клик по ссылке перехвачен');
});

// Отменить отправку формы
const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
  event.preventDefault(); // страница НЕ перезагрузится
  console.log('Форма перехвачена, обрабатываем через JS');
});
```

#### stopPropagation -- остановка всплытия

Останавливает передачу события родительским элементам, но **не** отменяет действие по умолчанию.

```js
document.getElementById('inner').addEventListener('click', function (event) {
  event.stopPropagation(); // событие НЕ дойдёт до #outer
  console.log('inner');
});

document.getElementById('outer').addEventListener('click', () => {
  console.log('outer'); // НЕ сработает при клике на #inner
});
```

### Плохой пример -> Хороший пример

```js
// Плохо: stopPropagation вместо preventDefault
link.addEventListener('click', function (event) {
  event.stopPropagation(); // всплытие остановлено, но ссылка всё равно откроется!
});

// Хорошо: preventDefault для отмены перехода
link.addEventListener('click', function (event) {
  event.preventDefault(); // переход отменён
});
```

> **Частое заблуждение:** "`stopPropagation` отменяет действие по умолчанию." Нет! Для отмены действия нужен `preventDefault`. Это две разные вещи: одна про всплытие, другая про поведение браузера.

---

## 5. Делегирование событий

### Что это такое?

Вместо того чтобы вешать обработчик на каждый элемент списка, вешаем один обработчик на их общего родителя. Благодаря всплытию событие дойдёт до родителя, а через `event.target` мы узнаем, на каком именно ребёнке кликнули.

**Аналогия:** вместо того чтобы ставить камеру наблюдения в каждую квартиру, ставим одну на входе в подъезд -- она увидит всех, кто входит и выходит.

### Как работает?

```html
<ul id="menu">
  <li data-action="save">Сохранить</li>
  <li data-action="load">Загрузить</li>
  <li data-action="search">Поиск</li>
</ul>
```

```js
// Один обработчик на родителе вместо трёх на каждом <li>
document.getElementById('menu').addEventListener('click', function (event) {
  const action = event.target.dataset.action;
  if (!action) return; // клик не на <li>

  switch (action) {
    case 'save':
      console.log('Сохраняем...');
      break;
    case 'load':
      console.log('Загружаем...');
      break;
    case 'search':
      console.log('Ищем...');
      break;
  }
});
```

#### Проблема с вложенными элементами

Если внутри `<li>` есть вложенный элемент, `event.target` может указать на него, а не на `<li>`:

```html
<ul id="menu">
  <li data-action="save"><span>Сохранить</span></li>
</ul>
```

```js
// event.target может быть <span>, а не <li>!
// Решение: closest
document.getElementById('menu').addEventListener('click', function (event) {
  const li = event.target.closest('li[data-action]');
  if (!li) return;

  console.log(li.dataset.action); // "save"
});
```

### Плохой пример -> Хороший пример

```js
// Плохо: обработчик на каждый элемент (100 элементов = 100 обработчиков)
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', function () {
    console.log(this.textContent);
  });
});

// Хорошо: один обработчик на контейнер (1 обработчик на всех)
document.getElementById('container').addEventListener('click', function (event) {
  const item = event.target.closest('.item');
  if (!item) return;
  console.log(item.textContent);
});
```

Преимущества делегирования:
- Экономия памяти (меньше обработчиков)
- Работает для динамически добавленных элементов
- Проще управлять (добавить/убрать один обработчик)

> **Мини-проверка:** Почему делегирование работает с элементами, которые ещё не существуют на момент привязки обработчика? Ответ: потому что обработчик висит на родителе, который уже существует. Когда новый ребёнок появится и на нём кликнут, событие всплывёт до родителя.

---

## 6. Распространённые события

### Что это такое?

Обзор событий, которые используются чаще всего.

### Как работает?

#### События мыши

```js
element.addEventListener('click', handler);     // клик
element.addEventListener('dblclick', handler);   // двойной клик
element.addEventListener('mouseenter', handler); // курсор вошёл
element.addEventListener('mouseleave', handler); // курсор ушёл
element.addEventListener('contextmenu', handler); // правый клик
```

#### События клавиатуры

```js
document.addEventListener('keydown', function (event) {
  console.log(event.key);  // "Enter", "Escape", "a", "ArrowUp"
  console.log(event.code); // "Enter", "Escape", "KeyA", "ArrowUp"

  if (event.key === 'Escape') {
    console.log('Нажат Escape');
  }

  // Сочетание клавиш
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault(); // отменить сохранение страницы
    console.log('Ctrl+S перехвачен');
  }
});
```

#### События ввода

```js
const input = document.querySelector('input');

// input -- срабатывает при каждом изменении значения
input.addEventListener('input', function (event) {
  console.log('Текущее значение:', event.target.value);
});

// change -- срабатывает когда поле потеряло фокус и значение изменилось
input.addEventListener('change', function (event) {
  console.log('Финальное значение:', event.target.value);
});

// focus / blur -- получение / потеря фокуса
input.addEventListener('focus', () => console.log('Поле в фокусе'));
input.addEventListener('blur', () => console.log('Поле потеряло фокус'));
```

#### Событие загрузки

```js
// DOMContentLoaded -- DOM построен, но картинки и стили могут ещё грузиться
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM готов');
  // Здесь безопасно искать элементы
});

// load -- всё загружено, включая картинки, стили, шрифты
window.addEventListener('load', function () {
  console.log('Страница полностью загружена');
});
```

#### События формы

```js
const form = document.querySelector('form');

form.addEventListener('submit', function (event) {
  event.preventDefault(); // предотвращаем перезагрузку страницы
  console.log('Форма отправлена через JS');
});
```

> **Частое заблуждение:** "Скрипт в `<head>` всегда найдёт элементы из `<body>`." Нет! Если скрипт выполняется до построения DOM, элементов ещё не существует. Решения: `DOMContentLoaded`, атрибут `defer` у `<script>`, или размещение `<script>` в конце `<body>`.

---

## 7. Одноразовый обработчик

### Что это такое?

Иногда нужно, чтобы обработчик сработал только один раз. Для этого есть опция `once`.

### Как работает?

```js
btn.addEventListener('click', function () {
  console.log('Сработаю только один раз');
}, { once: true });
```

---

## Итог

- `addEventListener` -- стандартный способ привязки обработчиков. Позволяет несколько обработчиков на одно событие.
- Объект `event` содержит всю информацию о событии: тип, цель, координаты, клавиши.
- События **всплывают** от потомка к предку. Это можно использовать для делегирования.
- `preventDefault()` -- отменить действие по умолчанию (переход по ссылке, отправку формы).
- `stopPropagation()` -- остановить всплытие. Используй редко и осознанно.
- **Делегирование** -- вешай один обработчик на родителя вместо множества на детей.
- `DOMContentLoaded` -- запускай код когда DOM готов.
- Для именованных обработчиков можно использовать `removeEventListener`.

---

> [[dom/02-dom-manipulation|<- Изменение DOM]] | [[dom/04-forms|Далее: Формы ->]]
>
> [[js-fundamentals|<- Назад к оглавлению JS]]
