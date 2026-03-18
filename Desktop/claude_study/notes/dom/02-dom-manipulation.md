# Глава 2. Изменение DOM

> [[js-fundamentals|<- Назад к оглавлению JS]]

---

## Зачем эта тема существует?

Находить элементы -- только половина дела. Настоящая интерактивность начинается, когда мы меняем страницу: создаём новые элементы, удаляем старые, переключаем классы, обновляем текст. Именно через изменение DOM JavaScript превращает статичный HTML в живое приложение.

---

## 1. Создание элементов

### Что это такое?

`document.createElement(tag)` создаёт новый HTML-элемент в памяти. Элемент ещё не виден на странице -- его нужно вставить в дерево.

**Аналогия:** это как вырезать деталь в мастерской. Деталь готова, но пока ты не прикрутишь её к конструкции, никто её не увидит.

### Как работает?

```js
// 1. Создаём элемент
const paragraph = document.createElement('p');

// 2. Наполняем содержимым
paragraph.textContent = 'Новый параграф';

// 3. Вставляем в DOM (теперь он виден!)
document.body.appendChild(paragraph);
```

Для создания текстового узла отдельно (редко нужно):

```js
const textNode = document.createTextNode('Просто текст');
```

---

## 2. Вставка элементов

### Что это такое?

Есть несколько способов вставить элемент в нужное место дерева. Каждый метод определяет позицию нового элемента.

### Как работает?

#### appendChild -- в конец

```html
<ul id="list">
  <li>Первый</li>
</ul>
```

```js
const list = document.getElementById('list');
const newItem = document.createElement('li');
newItem.textContent = 'Второй';

list.appendChild(newItem);
// Результат: <ul><li>Первый</li><li>Второй</li></ul>
```

#### insertBefore -- перед указанным элементом

```js
const thirdItem = document.createElement('li');
thirdItem.textContent = 'Между';

// insertBefore(новый, перед_каким)
list.insertBefore(thirdItem, newItem);
// Результат: Первый -> Между -> Второй
```

#### Современные методы: prepend, append, before, after

```js
const list = document.getElementById('list');

// В начало списка (внутрь)
const first = document.createElement('li');
first.textContent = 'В самое начало';
list.prepend(first);

// В конец списка (внутрь) -- аналог appendChild
const last = document.createElement('li');
last.textContent = 'В самый конец';
list.append(last);

// Перед списком (снаружи, как соседа)
const heading = document.createElement('h2');
heading.textContent = 'Мой список';
list.before(heading);

// После списка (снаружи, как соседа)
const note = document.createElement('p');
note.textContent = 'Конец списка';
list.after(note);
```

#### insertAdjacentHTML -- вставка HTML-строки в точную позицию

```js
const container = document.getElementById('list');

// Четыре позиции:
container.insertAdjacentHTML('beforebegin', '<p>Перед элементом</p>');
container.insertAdjacentHTML('afterbegin', '<li>Первым внутри</li>');
container.insertAdjacentHTML('beforeend', '<li>Последним внутри</li>');
container.insertAdjacentHTML('afterend', '<p>После элемента</p>');
```

```
<!-- beforebegin -->
<ul id="list">
  <!-- afterbegin -->
  <li>существующий контент</li>
  <!-- beforeend -->
</ul>
<!-- afterend -->
```

---

## 3. Удаление элементов

### Что это такое?

Элемент можно убрать из DOM. Современный способ -- метод `remove()`.

### Как работает?

```js
// Современный способ
const item = document.querySelector('.old-item');
item.remove(); // элемент исчез из страницы

// Старый способ (через родителя)
const parent = item.parentElement;
parent.removeChild(item);
```

#### Замена элемента

```js
const oldElement = document.querySelector('.old');
const newElement = document.createElement('div');
newElement.textContent = 'Я новый!';

oldElement.replaceWith(newElement);
```

---

## 4. textContent vs innerHTML

### Что это такое?

Два способа задать содержимое элемента. Между ними принципиальная разница в безопасности.

### Как работает?

```js
const div = document.querySelector('#box');

// textContent -- безопасно, вставляет ТЕКСТ как есть
div.textContent = '<b>Жирный</b>';
// На экране: <b>Жирный</b> (теги видны как текст)

// innerHTML -- парсит HTML, создаёт элементы
div.innerHTML = '<b>Жирный</b>';
// На экране: **Жирный** (теги применились)
```

### Плохой пример -> Хороший пример

```js
// ОПАСНО: innerHTML с пользовательскими данными
const userInput = '<img src=x onerror="alert(\'Взлом!\')">';
div.innerHTML = userInput; // Выполнится вредоносный код! (XSS-атака)

// БЕЗОПАСНО: textContent экранирует HTML
div.textContent = userInput; // Покажет текст как есть, без выполнения
```

> **Частое заблуждение:** "innerHTML -- удобнее, значит лучше." Нет. Используй `innerHTML` только когда ты полностью контролируешь строку. Если в строке есть данные от пользователя -- только `textContent`.

> **Мини-проверка:** Что произойдёт при `element.innerHTML = ''`? Ответ: всё содержимое элемента будет удалено.

---

## 5. Работа с атрибутами

### Что это такое?

Атрибуты HTML-тегов (`id`, `class`, `src`, `href`, `data-*`) можно читать и менять через JavaScript.

### Как работает?

```js
const link = document.querySelector('a');

// Чтение
console.log(link.getAttribute('href'));  // "https://example.com"
console.log(link.href);                 // полный URL (свойство DOM)

// Установка
link.setAttribute('href', 'https://google.com');
link.setAttribute('target', '_blank');

// Проверка наличия
console.log(link.hasAttribute('target')); // true

// Удаление
link.removeAttribute('target');
```

#### data-атрибуты

Специальные пользовательские атрибуты с префиксом `data-`:

```html
<div id="user" data-user-id="42" data-role="admin">Игорь</div>
```

```js
const user = document.getElementById('user');

// Через dataset (data-user-id -> dataset.userId)
console.log(user.dataset.userId); // "42"
console.log(user.dataset.role);   // "admin"

// Установка
user.dataset.status = 'active';
// Результат: <div ... data-status="active">
```

---

## 6. Работа с классами: classList

### Что это такое?

`classList` -- это объект для удобной работы с CSS-классами элемента. Гораздо безопаснее, чем менять `className` вручную.

**Аналогия:** представь бейдж с несколькими наклейками. `classList` позволяет добавлять, убирать и переключать наклейки по одной, не трогая остальные.

### Как работает?

```html
<div id="box" class="card active">Контент</div>
```

```js
const box = document.getElementById('box');

// Добавить класс
box.classList.add('highlighted');
// class="card active highlighted"

// Удалить класс
box.classList.remove('active');
// class="card highlighted"

// Переключить (есть -- убрать, нет -- добавить)
box.classList.toggle('visible');
// class="card highlighted visible"

box.classList.toggle('visible');
// class="card highlighted" (убрал обратно)

// Проверить наличие
console.log(box.classList.contains('card')); // true

// Добавить несколько сразу
box.classList.add('big', 'rounded');
```

### Плохой пример -> Хороший пример

```js
// Плохо: className перезаписывает ВСЕ классы
box.className = 'active';
// Были "card highlighted", стал только "active" -- остальные потерялись!

// Хорошо: classList.add добавляет, не трогая остальные
box.classList.add('active');
// Класс "active" добавился к существующим
```

> **Мини-проверка:** Что вернёт `classList.toggle('open')`? Ответ: `true` если класс был добавлен, `false` если убран.

---

## 7. Изменение стилей через style

### Что это такое?

Свойство `style` позволяет задавать инлайновые стили элементу. Имена CSS-свойств записываются в camelCase.

### Как работает?

```js
const box = document.getElementById('box');

// CSS: background-color -> JS: backgroundColor
box.style.backgroundColor = '#3498db';
box.style.color = 'white';
box.style.padding = '20px';
box.style.borderRadius = '8px'; // border-radius -> borderRadius

// Убрать инлайновый стиль
box.style.padding = ''; // пустая строка сбрасывает
```

### Плохой пример -> Хороший пример

```js
// Плохо: менять много стилей по одному
box.style.width = '200px';
box.style.height = '200px';
box.style.background = 'red';
box.style.border = '1px solid black';

// Хорошо: переключить CSS-класс (стили описаны в CSS)
box.classList.add('big-red-box');
```

> **Частое заблуждение:** "Нужно менять стили через JS." В 90% случаев лучше переключать CSS-классы через `classList`. Прямое изменение `style` оправдано только для динамических значений (например, позиция при перетаскивании).

---

## 8. DocumentFragment для производительности

### Что это такое?

`DocumentFragment` -- это "невидимый контейнер", в который можно собрать несколько элементов перед вставкой в DOM. Это позволяет вставить всё одной операцией вместо многих.

**Аналогия:** вместо того чтобы нести покупки из машины по одной штуке, ты складываешь всё в один пакет и несёшь за раз.

### Как работает?

```js
const list = document.getElementById('list');
const data = ['Яблоко', 'Банан', 'Вишня', 'Дыня', 'Ежевика'];

// Создаём фрагмент
const fragment = document.createDocumentFragment();

// Собираем элементы в фрагменте (DOM не перерисовывается)
for (const fruit of data) {
  const li = document.createElement('li');
  li.textContent = fruit;
  fragment.appendChild(li);
}

// Одна вставка -- одна перерисовка
list.appendChild(fragment);
```

### Плохой пример -> Хороший пример

```js
// Плохо: 1000 вставок = 1000 перерисовок
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `Элемент ${i}`;
  document.body.appendChild(div); // перерисовка при каждой вставке
}

// Хорошо: 1 вставка = 1 перерисовка
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `Элемент ${i}`;
  fragment.appendChild(div); // в памяти, без перерисовки
}
document.body.appendChild(fragment); // одна перерисовка
```

> **Мини-проверка:** Что останется от DocumentFragment после вставки в DOM? Ответ: фрагмент станет пустым -- его дети переместились в DOM.

---

## 9. Клонирование элементов

### Что это такое?

`cloneNode()` создаёт копию существующего элемента. Полезно, когда нужно продублировать сложную структуру.

### Как работает?

```js
const original = document.querySelector('.card');

// Поверхностная копия (без детей)
const shallow = original.cloneNode(false);

// Глубокая копия (со всеми детьми)
const deep = original.cloneNode(true);

document.body.appendChild(deep);
```

> **Частое заблуждение:** "Клон наследует обработчики событий." Нет. `cloneNode` копирует только разметку и атрибуты, но не обработчики, добавленные через `addEventListener`.

---

## Итог

- `createElement` создаёт элемент в памяти; `appendChild`, `prepend`, `before`, `after` вставляют его в DOM.
- `remove()` удаляет элемент из дерева.
- `textContent` -- безопасная вставка текста. `innerHTML` -- парсит HTML (опасно с пользовательскими данными).
- `setAttribute` / `dataset` -- работа с атрибутами.
- `classList` (`add`, `remove`, `toggle`, `contains`) -- правильный способ управлять классами.
- `style` -- для инлайновых стилей в camelCase. Но лучше переключать классы.
- `DocumentFragment` -- собирай элементы в памяти, вставляй одной операцией.
- `cloneNode(true)` -- глубокая копия элемента.

---

> [[dom/01-dom-structure|<- Структура DOM]] | [[dom/03-events|Далее: События ->]]
>
> [[js-fundamentals|<- Назад к оглавлению JS]]
