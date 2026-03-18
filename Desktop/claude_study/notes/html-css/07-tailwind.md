# Tailwind CSS: утилитарный подход

← [[html-css/06-bem]] | ← [[html-css-fundamentals]]

---

## Что такое Tailwind

Tailwind CSS — CSS-фреймворк с утилитарными классами. Вместо написания CSS ты применяешь готовые классы прямо в HTML.

```html
<!-- Обычный CSS -->
<div class="card">...</div>
<!-- _card.css: .card { padding: 16px; border-radius: 8px; background: white; ... } -->

<!-- Tailwind -->
<div class="p-4 rounded-lg bg-white shadow-md">...</div>
```

---

## Зачем Tailwind (а не обычный CSS)

| Обычный CSS | Tailwind |
|-------------|---------|
| Придумывать имена классов | Не нужны имена |
| CSS файл растёт бесконечно | CSS не растёт |
| Конфликты классов | Нет конфликтов |
| Переключаться между файлами | Всё в HTML |
| Сложно делать варианты | Модификаторы прямо в классе |

Tailwind популярен в React / Next.js — стандарт индустрии в 2025+.

---

## Установка

```bash
# В проекте с Vite или Next.js
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# В tailwind.config.js добавить пути файлов
content: ["./src/**/*.{html,js,jsx,ts,tsx}"]

# В global CSS
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Базовые классы

### Размеры

```html
<!-- padding: p-{n}, px-{n} (горизонт), py-{n} (вертик), pt/pr/pb/pl -->
<div class="p-4">      <!-- padding: 1rem (16px) -->
<div class="px-6 py-3"><!-- padding: 1.5rem / 0.75rem -->

<!-- margin: m-{n}, mx, my, mt/mr/mb/ml -->
<div class="mt-4 mb-8">
<div class="mx-auto">  <!-- центрировать блок -->

<!-- Шкала: 1=4px, 2=8px, 3=12px, 4=16px, 6=24px, 8=32px, 12=48px, 16=64px -->
```

### Ширина и высота

```html
<div class="w-full">      <!-- width: 100% -->
<div class="w-1/2">       <!-- width: 50% -->
<div class="w-64">        <!-- width: 16rem (256px) -->
<div class="max-w-lg">    <!-- max-width: 32rem -->
<div class="max-w-screen-xl mx-auto"> <!-- контейнер -->

<div class="h-screen">    <!-- height: 100vh -->
<div class="h-64">        <!-- height: 16rem -->
<div class="min-h-screen"><!-- min-height: 100vh -->
```

### Типографика

```html
<h1 class="text-3xl font-bold">          <!-- font-size + font-weight -->
<p class="text-base text-gray-600">      <!-- размер + цвет -->
<p class="text-sm leading-relaxed">      <!-- маленький, увеличенный line-height -->
<p class="text-center uppercase tracking-wide"> <!-- выравнивание, регистр, spacing -->
```

### Цвета

```html
<div class="bg-blue-500">          <!-- синий фон -->
<div class="bg-white/80">          <!-- белый с 80% прозрачностью -->
<p class="text-gray-700">          <!-- тёмно-серый текст -->
<p class="text-red-500">           <!-- красный -->
<div class="border-b border-gray-200"> <!-- нижняя граница -->
```

Цвета: `gray, red, orange, yellow, green, blue, purple, pink`
Оттенки: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900`

---

## Flexbox в Tailwind

```html
<div class="flex">                  <!-- display: flex -->
<div class="flex items-center">     <!-- align-items: center -->
<div class="flex justify-between">  <!-- justify-content: space-between -->
<div class="flex flex-col">         <!-- flex-direction: column -->
<div class="flex flex-wrap gap-4">  <!-- flex-wrap + gap -->
<div class="flex-1">                <!-- flex: 1 -->
```

## Grid в Tailwind

```html
<div class="grid grid-cols-3 gap-4">  <!-- 3 колонки -->
<div class="grid grid-cols-1 md:grid-cols-3">  <!-- адаптивный grid -->
<div class="col-span-2">             <!-- grid-column: span 2 -->
```

---

## Адаптивность — префиксы брейкпоинтов

```html
<!-- Mobile-first: без префикса = мобильный, с префиксом = от брейкпоинта -->

<div class="text-sm md:text-base lg:text-lg">
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
<div class="hidden md:flex">    <!-- скрыть на мобильном, показать на md+ -->
<div class="flex md:hidden">    <!-- показать на мобильном, скрыть на md+ -->
```

Брейкпоинты: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`

---

## Состояния — hover, focus, active

```html
<button class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700">
<input class="border focus:border-blue-500 focus:outline-none">
<li class="hover:bg-gray-100 cursor-pointer">
```

## Тёмная тема

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // или 'media'
}
```

---

## Практический пример: карточка книги

```html
<article class="bg-white rounded-xl shadow-md overflow-hidden flex max-w-sm">

  <div class="relative w-32 flex-shrink-0">
    <img class="w-full h-full object-cover" src="cover.jpg" alt="Обложка">
    <span class="absolute top-2 left-0 bg-blue-500 text-white text-xs px-2 py-0.5">
      Новинка
    </span>
  </div>

  <div class="p-4 flex flex-col gap-1">
    <h3 class="text-lg font-bold text-gray-900">Мастер и Маргарита</h3>
    <p class="text-sm text-gray-500">М. Булгаков</p>
    <p class="text-sm text-gray-400">1967</p>
    <div class="mt-auto flex gap-2 pt-2">
      <button class="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md transition-colors">
        В библиотеку
      </button>
      <button class="border border-gray-300 hover:bg-gray-50 text-sm px-3 py-1.5 rounded-md transition-colors">
        Подробнее
      </button>
    </div>
  </div>

</article>
```

---

## @apply — переиспользование

Если один и тот же набор классов повторяется — можно вынести:

```css
/* style.css */
@layer components {
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors;
  }
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-600 text-white;
  }
  .btn-ghost {
    @apply border border-gray-300 hover:bg-gray-50;
  }
}
```

```html
<button class="btn btn-primary">Сохранить</button>
```

---

## Tailwind vs БЭМ

Это не конкуренты — в разных контекстах:
- **Чистый CSS проект** — используй БЭМ
- **React / Next.js** — используй Tailwind (стандарт)
- **Можно комбинировать** — БЭМ для компонентов, Tailwind для утилит

---

## Полезные ресурсы

- Документация: tailwindcss.com/docs
- Шпаргалка: nerdcave.com/tailwind-cheat-sheet
- Shadcn/ui — готовые компоненты на Tailwind + Radix

---

## Навигация

← [[html-css/06-bem]] | ← [[html-css-fundamentals]]
