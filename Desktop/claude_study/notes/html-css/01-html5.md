# HTML5: Семантика, формы, структура

← [[html-css-fundamentals]] | Следующая: [[html-css/02-css-basics]] →

---

## Что такое HTML

**HTML (HyperText Markup Language)** — язык разметки. Он описывает структуру и содержимое страницы, но не её внешний вид. Внешний вид — за CSS.

Браузер читает HTML и строит из него **DOM (Document Object Model)** — дерево объектов, с которым работает JavaScript.

---

## Базовая структура документа

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Описание страницы для SEO">
  <title>Заголовок вкладки</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Содержимое страницы -->
  <script src="main.js" defer></script>
</body>
</html>
```

**Важно:**
- `lang="ru"` — язык для screen readers и SEO
- `charset="UTF-8"` — поддержка кириллицы
- `viewport` — обязательно для адаптивности
- `defer` — JS выполняется после загрузки DOM

---

## Семантические теги

Семантика = каждый тег несёт смысл, а не просто форматирует.

```html
<!-- Не семантично: div суп -->
<div class="header">...</div>
<div class="nav">...</div>
<div class="main">...</div>
<div class="footer">...</div>

<!-- Семантично: каждый тег говорит что это -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>
```

### Структурные теги

```html
<header>         <!-- шапка сайта или секции -->
<nav>            <!-- навигационное меню -->
<main>           <!-- основной контент (один на странице) -->
<article>        <!-- самостоятельный блок (пост, карточка) -->
<section>        <!-- тематическая секция -->
<aside>          <!-- боковая колонка, дополнительное -->
<footer>         <!-- подвал -->
```

### Контентные теги

```html
<h1>–<h6>        <!-- заголовки (h1 — один на странице) -->
<p>              <!-- абзац -->
<ul> / <ol>      <!-- ненумерованный / нумерованный список -->
<li>             <!-- элемент списка -->
<a href="...">   <!-- ссылка -->
<img src="..." alt="описание">  <!-- изображение -->
<figure>         <!-- медиа + подпись -->
  <img ...>
  <figcaption>Подпись</figcaption>
</figure>
<blockquote>     <!-- цитата -->
<time datetime="2026-03-01">1 марта</time>  <!-- дата -->
```

### Инлайн теги

```html
<strong>        <!-- важное (жирный) -->
<em>            <!-- акцент (курсив) -->
<span>          <!-- универсальный инлайн-контейнер -->
<code>          <!-- код -->
<mark>          <!-- выделение -->
<abbr title="HyperText Markup Language">HTML</abbr>
```

---

## Зачем семантика

1. **SEO** — поисковики лучше индексируют структурированный контент
2. **Доступность** — screen readers (для незрячих) понимают `<nav>`, `<main>`, `<article>`
3. **Читаемость кода** — сразу понятно что к чему
4. **CSS** — легче писать стили: `article img` лучше чем `.card-wrap .inner img`

---

## Формы

```html
<form action="/submit" method="POST" novalidate>

  <!-- Текстовый ввод -->
  <label for="name">Имя</label>
  <input type="text" id="name" name="name" placeholder="Введи имя"
         required minlength="2" maxlength="50">

  <!-- Email -->
  <input type="email" id="email" name="email" required>

  <!-- Пароль -->
  <input type="password" id="password" name="password" minlength="8">

  <!-- Число -->
  <input type="number" id="age" name="age" min="18" max="120">

  <!-- Чекбокс -->
  <label>
    <input type="checkbox" name="agree" required>
    Согласен с условиями
  </label>

  <!-- Радио-кнопки -->
  <fieldset>
    <legend>Статус книги</legend>
    <label><input type="radio" name="status" value="want"> Хочу</label>
    <label><input type="radio" name="status" value="reading"> Читаю</label>
    <label><input type="radio" name="status" value="done"> Прочитал</label>
  </fieldset>

  <!-- Выпадающий список -->
  <select name="genre">
    <option value="">Выбери жанр</option>
    <option value="fiction">Художественная</option>
    <option value="tech">Техническая</option>
  </select>

  <!-- Textarea -->
  <textarea name="notes" rows="4" cols="50" placeholder="Заметки..."></textarea>

  <!-- Кнопки -->
  <button type="submit">Отправить</button>
  <button type="reset">Сбросить</button>
  <button type="button">Просто кнопка</button>

</form>
```

### Важные атрибуты инпутов

| Атрибут | Что делает |
|---------|-----------|
| `required` | Обязательное поле |
| `disabled` | Неактивно |
| `readonly` | Только чтение |
| `placeholder` | Подсказка (не label!) |
| `autocomplete="off"` | Отключить автозаполнение |
| `autofocus` | Фокус при загрузке страницы |

### Типы input

```html
text, email, password, number, tel, url
date, time, datetime-local, month, week
range, color, file
checkbox, radio
search
hidden
```

---

## Атрибуты

```html
<!-- Глобальные атрибуты (у любого тега) -->
id="unique-id"         <!-- уникальный идентификатор -->
class="btn btn-primary" <!-- CSS классы -->
data-id="42"           <!-- кастомные данные (data-атрибуты) -->
hidden                 <!-- скрыть элемент -->
tabindex="0"           <!-- порядок Tab-навигации -->
title="Подсказка"      <!-- всплывающая подсказка -->
```

Доступ к data-атрибутам в JS:
```javascript
const element = document.querySelector('[data-id]');
console.log(element.dataset.id); // '42'
```

---

## Ссылки и изображения

```html
<!-- Ссылки -->
<a href="/about">Внутренняя ссылка</a>
<a href="https://google.com" target="_blank" rel="noopener noreferrer">Внешняя</a>
<a href="mailto:email@example.com">Email</a>
<a href="tel:+71234567890">Телефон</a>
<a href="#section-id">Якорь на странице</a>

<!-- Изображения -->
<img
  src="photo.jpg"
  alt="Описание для screen readers и SEO"   <!-- обязательно! -->
  width="400"
  height="300"
  loading="lazy"       <!-- ленивая загрузка -->
>

<!-- Адаптивные изображения -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="...">
</picture>
```

---

## Частые ошибки

| Ошибка | Правильно |
|--------|----------|
| Много `<h1>` на странице | Один `<h1>` — главный заголовок |
| `<div>` вместо `<button>` | `<button type="button">` для кнопок |
| `<img>` без `alt` | Всегда добавлять `alt` |
| `<label>` без `for` / `id` | Связывать label и input |
| `<br>` для отступов | Используй CSS `margin` |
| `<b>` и `<i>` для смысла | `<strong>` и `<em>` для смысла |

---

## Навигация

← [[html-css-fundamentals]] | Следующая: [[html-css/02-css-basics]] →
