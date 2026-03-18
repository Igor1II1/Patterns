# CSS: Адаптивный дизайн — медиазапросы

← [[html-css/04-grid]] | Следующая: [[html-css/06-bem]] →

---

## Что такое адаптивный дизайн

Адаптивный (responsive) дизайн — страница нормально выглядит на любом размере экрана: телефон, планшет, десктоп.

Главные инструменты:
1. **Медиазапросы** — применять стили при определённой ширине
2. **Относительные единицы** — `%`, `rem`, `vw` вместо `px`
3. **Flexbox / Grid** — автоматический перенос элементов
4. **`max-width`** — ограничение ширины контента

---

## Meta viewport (обязательно!)

Без этого тега мобильники уменьшают страницу чтобы влезла:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## Медиазапросы

```css
/* Применить стиль когда ширина экрана <= 768px */
@media (max-width: 768px) {
  .nav {
    flex-direction: column;
  }
}

/* Когда >= 1024px */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }
}

/* Диапазон */
@media (min-width: 768px) and (max-width: 1024px) {
  /* планшет */
}

/* Ориентация */
@media (orientation: landscape) { ... }

/* Тёмная тема системы */
@media (prefers-color-scheme: dark) {
  body { background: #1a1a1a; color: #fff; }
}
```

---

## Mobile-First vs Desktop-First

### Desktop-First (пишешь для десктопа, потом уменьшаешь)
```css
.grid { grid-template-columns: repeat(3, 1fr); }

@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; } /* перезаписываем */
}
```

### Mobile-First (пишешь для мобильных, потом расширяешь)
```css
.grid { grid-template-columns: 1fr; } /* мобильный по умолчанию */

@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(3, 1fr); } /* добавляем */
}
```

**Mobile-First предпочтительнее** — меньше кода, лучшая производительность на мобильных, современный подход.

---

## Стандартные брейкпоинты

```css
/* Мобильный (по умолчанию) — до 640px */

/* Планшет */
@media (min-width: 640px) { ... }  /* sm */

/* Маленький десктоп */
@media (min-width: 768px) { ... }  /* md */

/* Десктоп */
@media (min-width: 1024px) { ... } /* lg */

/* Большой экран */
@media (min-width: 1280px) { ... } /* xl */
```

Эти значения используют Bootstrap, Tailwind и большинство фреймворков.

---

## Практические паттерны

### Контейнер с ограничением ширины

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px; /* отступы на мобильных */
}

@media (min-width: 768px) {
  .container {
    padding: 0 24px;
  }
}
```

### Навигация: мобильное меню

```css
.nav-links {
  display: none; /* скрыть на мобильном */
}

.nav-links.open {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .nav-links {
    display: flex; /* показать на десктопе */
    flex-direction: row;
  }
  .hamburger {
    display: none; /* скрыть бургер на десктопе */
  }
}
```

### Сетка карточек

```css
.cards {
  display: grid;
  grid-template-columns: 1fr;           /* мобильный: 1 в ряд */
  gap: 16px;
}

@media (min-width: 640px) {
  .cards {
    grid-template-columns: repeat(2, 1fr); /* планшет: 2 в ряд */
  }
}

@media (min-width: 1024px) {
  .cards {
    grid-template-columns: repeat(3, 1fr); /* десктоп: 3 в ряд */
  }
}

/* ИЛИ короче с auto-fill: */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
```

### Типографика

```css
body {
  font-size: 16px; /* мобильный */
}

h1 {
  font-size: 1.75rem; /* 28px */
}

@media (min-width: 768px) {
  h1 {
    font-size: 2.5rem; /* 40px */
  }
}

/* Или через clamp() — автоматический масштаб */
h1 {
  font-size: clamp(1.75rem, 4vw, 3rem);
  /* мин: 28px, растёт с шириной, макс: 48px */
}
```

---

## Полезные CSS-хаки для адаптивности

```css
/* Изображение не выходит за пределы контейнера */
img {
  max-width: 100%;
  height: auto;
}

/* Таблица с горизонтальным скроллом на мобильном */
.table-wrapper {
  overflow-x: auto;
}

/* Встроенное видео responsive */
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
}
.video-wrapper iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
}
```

---

## Тестирование адаптивности

1. **Chrome DevTools** (F12) → Toggle device toolbar → выбери устройство
2. Проверяй реальные размеры: 375px (iPhone SE), 768px (iPad), 1280px (ноутбук)
3. Тестируй на реальном телефоне через `localhost` (одна сеть WiFi)

---

## Навигация

← [[html-css/04-grid]] | Следующая: [[html-css/06-bem]] →
