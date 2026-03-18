# CSS Grid: двумерные сетки

← [[html-css/03-flexbox]] | Следующая: [[html-css/05-responsive]] →

---

## Flexbox vs Grid

| Flexbox | Grid |
|---------|------|
| Одномерный (строки ИЛИ колонки) | Двумерный (строки И колонки) |
| Контент определяет размер | Сетка определяет размер |
| Для компонентов (nav, card, btn) | Для макетов страниц |

Их можно комбинировать: Grid для layout страницы, Flexbox внутри компонентов.

---

## Основы Grid

```html
<div class="grid">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: 200px 200px 200px; /* 3 колонки по 200px */
  grid-template-rows: 100px 100px;          /* 2 строки по 100px */
  gap: 16px;
}
```

---

## grid-template-columns / rows

```css
/* Фиксированные */
grid-template-columns: 200px 200px 200px;

/* Дробные единицы fr (занять долю свободного места) */
grid-template-columns: 1fr 1fr 1fr;  /* равные колонки */
grid-template-columns: 2fr 1fr;      /* левая в 2 раза шире */

/* Смешанные */
grid-template-columns: 250px 1fr;    /* сайдбар + основной контент */

/* repeat() — повторение */
grid-template-columns: repeat(3, 1fr);   /* 3 равные колонки */
grid-template-columns: repeat(4, 200px); /* 4 колонки по 200px */

/* auto — по содержимому */
grid-template-columns: auto 1fr auto;

/* minmax() — между минимумом и максимумом */
grid-template-columns: repeat(3, minmax(200px, 1fr));
```

---

## Адаптивная сетка без медиазапросов

```css
/* auto-fill: создаёт столько колонок сколько влезет */
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

/* auto-fit: схлопывает пустые колонки */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

Это мощный паттерн — карточки сами перестраиваются при изменении ширины.

---

## Размещение элементов

По умолчанию элементы расставляются автоматически. Можно управлять вручную:

```css
.item {
  /* grid-column: start / end (номера линий, не колонок!) */
  grid-column: 1 / 3;  /* от линии 1 до линии 3 = 2 колонки */
  grid-column: 1 / -1; /* от начала до конца (весь ряд) */

  grid-row: 1 / 2;     /* занять 1 строку */
  grid-row: 1 / 3;     /* занять 2 строки */
}

/* Сокращение span */
.item {
  grid-column: span 2; /* занять 2 колонки (без указания линии) */
  grid-row: span 2;    /* занять 2 строки */
}
```

---

## Именованные области — grid-template-areas

Самый наглядный способ описать layout:

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main   main"
    "footer footer footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 60px 1fr 40px;
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

Точка `.` означает пустую ячейку:
```css
grid-template-areas:
  "header header"
  ".      main  "
  "footer footer";
```

---

## Выравнивание

```css
/* Выравнивание всего контента в ячейках */
justify-items: start | end | center | stretch;  /* по горизонтали */
align-items:   start | end | center | stretch;  /* по вертикали */

/* Выравнивание самой сетки в контейнере */
justify-content: start | end | center | space-between | space-evenly;
align-content:   start | end | center | space-between | space-evenly;

/* Для конкретного элемента */
.item {
  justify-self: center;
  align-self:   end;
}
```

---

## Типичные паттерны

### Три колонки с сайдбаром

```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr 200px;
  gap: 24px;
}
```

### Карточки с авто-переносом

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
```

### Holy Grail Layout

```css
body {
  display: grid;
  grid-template:
    "header"  60px
    "main"    1fr
    "footer"  40px
    / 1fr;
  min-height: 100vh;
}
```

### Фиче-секция (1 большая + 2 маленькие)

```css
.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
}
.feature--hero {
  grid-row: span 2; /* занимает 2 строки */
}
```

---

## Шпаргалка

```
КОНТЕЙНЕР
├── grid-template-columns: <sizes>
├── grid-template-rows: <sizes>
├── grid-template-areas: "..."
├── gap / column-gap / row-gap
├── justify-items / align-items    (выравнивание контента в ячейках)
└── justify-content / align-content (выравнивание сетки в контейнере)

ЭЛЕМЕНТЫ
├── grid-column: start / end
├── grid-row: start / end
├── grid-area: <name>
├── justify-self / align-self
└── order

ФУНКЦИИ
├── repeat(n, size)
├── minmax(min, max)
├── auto-fill / auto-fit
└── fr (дробные единицы)
```

---

## Навигация

← [[html-css/03-flexbox]] | Следующая: [[html-css/05-responsive]] →
