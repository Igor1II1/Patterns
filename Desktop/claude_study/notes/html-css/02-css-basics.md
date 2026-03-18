# CSS: Основы — селекторы, специфичность, блочная модель

← [[html-css/01-html5]] | Следующая: [[html-css/03-flexbox]] →

---

## Как подключить CSS

```html
<!-- Внешний файл (рекомендуется) -->
<link rel="stylesheet" href="style.css">

<!-- Встроенный в HTML (для одной страницы) -->
<style>
  h1 { color: red; }
</style>

<!-- Инлайн (только в крайнем случае) -->
<p style="color: red;">текст</p>
```

---

## Синтаксис

```css
селектор {
  свойство: значение;
  другое-свойство: другое-значение;
}

/* Комментарий */

h1 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 16px;
}
```

---

## Селекторы

```css
/* По тегу */
p { color: gray; }

/* По классу (точка) */
.btn { padding: 8px 16px; }

/* По id (решётка) */
#header { background: #fff; }

/* По атрибуту */
input[type="email"] { border-color: blue; }
a[href^="https"] { color: green; }    /* начинается с */
a[href$=".pdf"] { color: red; }       /* заканчивается на */

/* Дочерний (только прямой потомок) */
nav > ul { list-style: none; }

/* Потомок (любой уровень вложенности) */
article p { line-height: 1.6; }

/* Соседний элемент */
h2 + p { margin-top: 0; }

/* Все последующие братья */
h2 ~ p { color: gray; }

/* Несколько селекторов */
h1, h2, h3 { font-family: Georgia; }
```

### Псевдоклассы

```css
a:hover { color: blue; }           /* при наведении */
a:active { color: red; }           /* при клике */
input:focus { outline: 2px solid blue; }  /* в фокусе */

li:first-child { font-weight: bold; }
li:last-child { border-bottom: none; }
li:nth-child(2n) { background: #f0f0f0; }  /* чётные */
li:nth-child(odd) { background: #fff; }    /* нечётные */

p:not(.special) { color: gray; }   /* все p кроме .special */
input:required { border-color: red; }
input:valid { border-color: green; }
```

### Псевдоэлементы

```css
/* Текст до/после содержимого */
.quote::before { content: '"'; }
.quote::after  { content: '"'; }

/* Первая буква */
p::first-letter { font-size: 2em; }

/* Первая строка */
p::first-line { font-weight: bold; }

/* Выделение текста */
::selection { background: yellow; }

/* Placeholder в инпуте */
input::placeholder { color: #999; }
```

---

## Специфичность — какой стиль победит

Когда несколько правил применяются к одному элементу, побеждает более специфичное.

| Тип | Специфичность |
|-----|--------------|
| `!important` | Всегда победит (избегай) |
| Инлайн `style=""` | 1-0-0-0 |
| `#id` | 0-1-0-0 |
| `.class`, `[attr]`, `:pseudo-class` | 0-0-1-0 |
| `tag`, `::pseudo-element` | 0-0-0-1 |

```css
p { color: gray; }             /* 0-0-0-1 */
.text { color: blue; }         /* 0-0-1-0 — победит */
#main p { color: green; }      /* 0-1-0-1 — ещё специфичнее */
```

**Правила:**
- Не используй `!important` без крайней необходимости
- Не используй `#id` в стилях компонентов — слишком высокая специфичность
- Пиши плоские, низкоспецифичные селекторы

---

## Блочная модель (Box Model)

Каждый элемент — это прямоугольник с четырьмя слоями:

```
┌─────────────────────────────┐  ← margin (внешний отступ)
│  ┌───────────────────────┐  │
│  │  border (граница)     │  │
│  │  ┌─────────────────┐  │  │
│  │  │ padding (внутр.) │  │  │
│  │  │  ┌───────────┐  │  │  │
│  │  │  │  content  │  │  │  │
│  │  │  └───────────┘  │  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

```css
.box {
  width: 300px;           /* ширина content */
  height: 200px;          /* высота content */
  padding: 20px;          /* внутренний отступ */
  border: 2px solid #333; /* граница */
  margin: 16px;           /* внешний отступ */
}
```

### box-sizing

По умолчанию `width` = только content. С padding и border итоговая ширина будет `300 + 20*2 + 2*2 = 344px`.

```css
/* Сделать width = весь блок (border-box) */
* {
  box-sizing: border-box;
}
/* Теперь width:300px — это весь блок включая padding и border */
```

**Всегда добавляй `box-sizing: border-box` в сброс стилей** — иначе вёрстка ведёт себя неожиданно.

---

## Единицы измерения

```css
/* Абсолютные */
px   — пиксели (наиболее точные)

/* Относительные */
%    — процент от родителя
em   — относительно font-size элемента (1em = font-size)
rem  — относительно font-size <html> (обычно 16px)
vw   — 1% ширины viewport (видимой области)
vh   — 1% высоты viewport

/* Когда что */
font-size: rem          — размеры шрифта (масштабируется с настройками браузера)
padding, margin: rem/px — отступы
width: % или px         — ширина блоков
height: vh              — полноэкранные секции (100vh)
```

---

## Цвета

```css
color: red;                  /* именованный */
color: #ff0000;              /* hex */
color: #f00;                 /* короткий hex */
color: rgb(255, 0, 0);       /* rgb */
color: rgba(255, 0, 0, 0.5); /* rgba с прозрачностью */
color: hsl(0, 100%, 50%);    /* hsl */
color: hsla(0, 100%, 50%, 0.5);
```

---

## Display — тип отображения

```css
display: block;    /* занимает всю ширину, начинается с новой строки */
                   /* div, p, h1-h6, section, article — по умолчанию block */

display: inline;   /* встраивается в текст, width/height не работают */
                   /* span, a, strong, em — по умолчанию inline */

display: inline-block; /* встраивается в текст, но принимает width/height */

display: none;     /* скрыть элемент (удаляется из потока) */
display: flex;     /* Flexbox — следующая глава */
display: grid;     /* Grid — через главу */
```

---

## Позиционирование

```css
position: static;   /* по умолчанию: в нормальном потоке */

position: relative; /* смещается от своей нормальной позиции */
top: 10px;          /* смещение, но место в потоке сохраняется */

position: absolute; /* выходит из потока, позиционируется относительно
                       ближайшего предка с position ≠ static */
top: 0;
right: 0;

position: fixed;    /* фиксируется относительно viewport (не скроллится) */
top: 0;

position: sticky;   /* статичный пока не доходит до точки,
                       потом фиксируется */
top: 0;
```

**Паттерн: абсолютное позиционирование внутри relative**
```css
.card {
  position: relative; /* контекст для дочерних absolute */
}
.badge {
  position: absolute;
  top: 8px;
  right: 8px;
}
```

---

## Сброс стилей (CSS Reset)

Браузеры добавляют стили по умолчанию. Их сбрасывают в начале:

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  color: #333;
}

img {
  max-width: 100%;
  display: block;
}

ul, ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}
```

---

## Навигация

← [[html-css/01-html5]] | Следующая: [[html-css/03-flexbox]] →
