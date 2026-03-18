# CSS Flexbox: строки и колонки

← [[html-css/02-css-basics]] | Следующая: [[html-css/04-grid]] →

---

## Что такое Flexbox

Flexbox — одномерная система раскладки. "Одномерная" — элементы выстраиваются в одну строку или один столбец.

Идеален для:
- Навигации
- Кнопок и групп элементов
- Центрирования
- Карточек в ряд

---

## Контейнер и элементы

```html
<div class="container">    ← flex-контейнер
  <div class="item">1</div>  ← flex-элементы
  <div class="item">2</div>
  <div class="item">3</div>
</div>
```

```css
.container {
  display: flex;  /* включить flexbox */
}
```

Flex-свойства делятся на два вида:
- Свойства **контейнера** — управляют как элементы расположены внутри
- Свойства **элементов** — управляют конкретным элементом

---

## Свойства контейнера

### flex-direction — направление оси

```css
flex-direction: row;            /* → горизонтально (по умолчанию) */
flex-direction: row-reverse;    /* ← горизонтально в обратном порядке */
flex-direction: column;         /* ↓ вертикально */
flex-direction: column-reverse; /* ↑ вертикально в обратном порядке */
```

### justify-content — выравнивание по главной оси

```css
justify-content: flex-start;    /* прижать к началу (по умолчанию) */
justify-content: flex-end;      /* прижать к концу */
justify-content: center;        /* по центру */
justify-content: space-between; /* равные промежутки между элементами */
justify-content: space-around;  /* промежутки + полупромежутки по краям */
justify-content: space-evenly;  /* равные промежутки везде */
```

### align-items — выравнивание по поперечной оси

```css
align-items: stretch;    /* растянуть (по умолчанию) */
align-items: flex-start; /* прижать к началу поперечной оси */
align-items: flex-end;   /* прижать к концу */
align-items: center;     /* по центру */
align-items: baseline;   /* по базовой линии текста */
```

### flex-wrap — перенос на новую строку

```css
flex-wrap: nowrap;  /* не переносить (по умолчанию) */
flex-wrap: wrap;    /* переносить когда не помещается */
flex-wrap: wrap-reverse;
```

### gap — отступы между элементами

```css
gap: 16px;          /* одинаковые по горизонтали и вертикали */
gap: 8px 16px;      /* row-gap column-gap */
column-gap: 16px;   /* только по горизонтали */
row-gap: 8px;       /* только по вертикали */
```

---

## Свойства элементов

### flex — как занимать пространство

```css
/* flex — сокращение для: flex-grow flex-shrink flex-basis */
flex: 1;         /* flex: 1 1 0% — занять всё свободное место равномерно */
flex: 0 0 200px; /* фиксированная ширина 200px, не растягивается */
flex: auto;      /* flex: 1 1 auto */
```

Если всем элементам поставить `flex: 1` — они займут равные доли пространства.

### align-self — индивидуальное выравнивание

```css
/* Переопределяет align-items для конкретного элемента */
.special {
  align-self: center;
}
```

### order — порядок отображения

```css
.first  { order: -1; } /* будет первым */
.last   { order: 1; }  /* будет последним */
/* По умолчанию у всех order: 0 */
```

---

## Практические паттерны

### Центрирование по горизонтали и вертикали

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### Навигация: лого слева, меню справа

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Карточки в ряд с переносом

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card {
  flex: 0 0 calc(33.333% - 16px); /* 3 в ряд */
}
```

### Кнопка прижата к низу карточки

```css
.card {
  display: flex;
  flex-direction: column;
}
.card__content {
  flex: 1; /* занимает всё место, кнопка остаётся внизу */
}
.card__button {
  /* автоматически прижата к низу */
}
```

### Список с иконкой слева

```css
.list-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

---

## Полная шпаргалка

```
КОНТЕЙНЕР (display: flex)
│
├── flex-direction:    row | column | row-reverse | column-reverse
├── justify-content:  flex-start | flex-end | center | space-between | space-around | space-evenly
├── align-items:      stretch | flex-start | flex-end | center | baseline
├── flex-wrap:        nowrap | wrap | wrap-reverse
├── align-content:    (как align-items но для многострочных)
└── gap:              <row-gap> <column-gap>

ЭЛЕМЕНТЫ
│
├── flex:             <grow> <shrink> <basis>
├── align-self:       auto | flex-start | flex-end | center | stretch
├── order:            <число>
├── flex-grow:        <число> (0 = не растягивать)
├── flex-shrink:      <число> (0 = не сжимать)
└── flex-basis:       <размер> | auto
```

---

## Навигация

← [[html-css/02-css-basics]] | Следующая: [[html-css/04-grid]] →
