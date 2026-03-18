# БЭМ: Методология именования CSS-классов

← [[html-css/05-responsive]] | Следующая: [[html-css/07-tailwind]] →

---

## Что такое БЭМ и зачем он нужен

**БЭМ (Блок-Элемент-Модификатор)** — методология именования CSS-классов. Решает главную проблему CSS: глобальное пространство имён и непредсказуемые конфликты стилей.

**Без БЭМ** (проблемы):
```css
.title { font-size: 24px; }      /* какой title? */
.button { ... }                   /* а вдруг есть другой? */
.item.active { ... }              /* .active везде конфликтует */
```

**С БЭМ** (понятно и изолировано):
```css
.card__title { font-size: 24px; }
.nav__button { ... }
.card--featured { ... }
```

---

## Синтаксис

```
блок__элемент--модификатор

блок       — самостоятельный компонент
__элемент  — двойное подчёркивание
--модифик  — двойной дефис
```

---

## Блок

Независимый компонент. Может существовать сам по себе.

```html
<nav class="nav">...</nav>
<header class="header">...</header>
<div class="card">...</div>
<form class="search-form">...</form>
```

Блок = то что можно вырезать и вставить в другое место страницы.

---

## Элемент

Часть блока, которая не имеет смысла без него.

```html
<div class="card">
  <img class="card__image" src="...">
  <div class="card__body">
    <h3 class="card__title">Заголовок</h3>
    <p class="card__text">Описание</p>
    <button class="card__button">Читать</button>
  </div>
</div>
```

```css
.card { ... }
.card__image { ... }
.card__body { ... }
.card__title { ... }
.card__text { ... }
.card__button { ... }
```

**Важно:** `card__image`, не `card__body__image`. Элементы не вкладываются в селекторах — структура только в HTML.

---

## Модификатор

Вариация блока или элемента. Добавляется к базовому классу.

```html
<!-- Модификатор блока -->
<div class="card card--featured">...</div>
<div class="card card--disabled">...</div>
<button class="btn btn--primary">Сохранить</button>
<button class="btn btn--danger">Удалить</button>

<!-- Модификатор элемента -->
<li class="menu__item menu__item--active">...</li>
```

```css
/* Базовые стили */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Модификаторы добавляют/меняют */
.btn--primary {
  background: #007bff;
  color: white;
}

.btn--danger {
  background: #dc3545;
  color: white;
}

.btn--large {
  padding: 12px 24px;
  font-size: 1.125rem;
}
```

---

## Полный пример: карточка книги

```html
<article class="book-card book-card--featured">
  <div class="book-card__cover">
    <img class="book-card__image" src="cover.jpg" alt="Обложка">
    <span class="book-card__badge">Новинка</span>
  </div>
  <div class="book-card__info">
    <h3 class="book-card__title">Мастер и Маргарита</h3>
    <p class="book-card__author">М. Булгаков</p>
    <p class="book-card__year">1967</p>
    <div class="book-card__actions">
      <button class="btn btn--primary">В библиотеку</button>
      <button class="btn btn--ghost">Подробнее</button>
    </div>
  </div>
</article>
```

```css
.book-card {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.book-card--featured {
  border: 2px solid #007bff;
}

.book-card__cover {
  position: relative;
  flex: 0 0 120px;
}

.book-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-card__badge {
  position: absolute;
  top: 8px;
  left: 0;
  background: #007bff;
  color: white;
  padding: 2px 8px;
  font-size: 0.75rem;
}

.book-card__info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.book-card__title {
  font-size: 1.125rem;
  font-weight: bold;
}

.book-card__author,
.book-card__year {
  color: #666;
  font-size: 0.875rem;
}

.book-card__actions {
  margin-top: auto; /* прижать к низу */
  display: flex;
  gap: 8px;
}
```

---

## Правила БЭМ

1. **Не используй id в CSS** — только классы
2. **Не вкладывай элементы** — `card__title`, не `card__body__title`
3. **Блоки независимы** — не пиши `.sidebar .card { ... }` — это зависимость
4. **Один блок, один файл** (в идеале) — `_card.css`, `_btn.css`
5. **Модификатор не существует без базового класса**

```html
<!-- Неправильно: только модификатор -->
<button class="btn--primary">...</button>

<!-- Правильно: базовый + модификатор -->
<button class="btn btn--primary">...</button>
```

---

## Микс — элемент нескольких блоков

```html
<!-- Список статей -->
<ul class="articles">
  <!-- .articles__item — элемент списка -->
  <!-- .card — самостоятельный блок -->
  <li class="articles__item card">...</li>
</ul>
```

---

## Файловая структура

```
styles/
├── base/
│   ├── _reset.css
│   └── _typography.css
├── components/
│   ├── _btn.css
│   ├── _card.css
│   ├── _nav.css
│   └── _book-card.css
├── layout/
│   ├── _header.css
│   └── _footer.css
└── main.css   ← импортирует все остальные
```

---

## Навигация

← [[html-css/05-responsive]] | Следующая: [[html-css/07-tailwind]] →
