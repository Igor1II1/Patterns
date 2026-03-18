# Глава 1. Что такое Next.js. App Router

> [[nextjs-fundamentals]] | **App Router** | [[nextjs/02-server-client]] >>

---

## Зачем эта тема существует?

React сам по себе --- это библиотека для построения интерфейсов. Но для реального веб-приложения нужно гораздо больше: маршрутизация (routing), серверный рендеринг (SSR), оптимизация производительности, работа с API. Можно собирать всё это вручную, а можно взять **Next.js** --- фреймворк, который решает эти задачи из коробки.

Next.js --- это стандарт индустрии для React-приложений. Его используют Netflix, TikTok, Twitch и тысячи компаний. Если ты знаешь React и Next.js --- ты можешь строить полноценные веб-приложения.

---

## 1. Что такое Next.js

### Что это такое?

Next.js --- это **React-фреймворк** от компании Vercel. Он берет React и добавляет:

- **Файловый роутинг** --- структура папок = структура URL
- **Серверный рендеринг** --- страницы генерируются на сервере (быстрее, лучше для SEO)
- **API-маршруты** --- бэкенд прямо в проекте
- **Оптимизацию** --- изображения, шрифты, код автоматически оптимизируются
- **Деплой** --- одна команда и проект в интернете

### Как это работает?

```
React (библиотека)              Next.js (фреймворк)
─────────────────               ────────────────────
Компоненты                      Компоненты
JSX                             JSX
Хуки                            Хуки
                                + Файловый роутинг
                                + SSR / SSG / ISR
                                + API Routes
                                + Image optimization
                                + Middleware
                                + И многое другое
```

### Создание проекта

```bash
npx create-next-app@latest my-app
# Ответь "Yes" на TypeScript, ESLint, Tailwind, App Router

cd my-app
npm run dev
# Открой http://localhost:3000
```

### Структура проекта

```
my-app/
  app/                  ← App Router (главная папка)
    layout.tsx          ← корневой layout
    page.tsx            ← главная страница (/)
    globals.css         ← глобальные стили
  public/               ← статические файлы (картинки, иконки)
  next.config.js        ← конфигурация Next.js
  tsconfig.json         ← конфигурация TypeScript
  package.json          ← зависимости
```

### Частые заблуждения

- "Next.js заменяет React". Нет, Next.js **построен на** React. Всё, что ты знаешь о React (компоненты, хуки, JSX) --- работает в Next.js.
- "Next.js --- это только для больших проектов". Нет, он отлично подходит и для маленьких сайтов, лендингов, блогов.

### Мини-проверка

Чем Next.js отличается от React?

---

## 2. App Router и файловый роутинг

### Что это такое?

В Next.js маршруты (URL-адреса) определяются **структурой папок** внутри директории `app/`. Не нужно настраивать роутер вручную --- создал папку и файл `page.tsx` --- маршрут готов.

### Как это работает?

```
app/
  page.tsx              → /
  about/
    page.tsx            → /about
  blog/
    page.tsx            → /blog
    [slug]/
      page.tsx          → /blog/any-post-slug
  dashboard/
    page.tsx            → /dashboard
    settings/
      page.tsx          → /dashboard/settings
```

Правило простое: **путь к файлу `page.tsx` = URL-адрес**.

```typescript
// app/page.tsx --- главная страница (/)
export default function HomePage() {
  return (
    <main>
      <h1>Главная страница</h1>
      <p>Добро пожаловать!</p>
    </main>
  );
}

// app/about/page.tsx --- страница /about
export default function AboutPage() {
  return (
    <main>
      <h1>О нас</h1>
      <p>Мы делаем крутые вещи.</p>
    </main>
  );
}
```

### Плохой и хороший пример

```typescript
// Плохо --- в обычном React нужно настраивать роутер вручную
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Post />} />
      </Routes>
    </BrowserRouter>
  );
}

// Хорошо --- в Next.js структура папок и есть роутинг
// Просто создаешь файлы --- и всё работает
// app/page.tsx         → /
// app/about/page.tsx   → /about
// app/blog/page.tsx    → /blog
// app/blog/[slug]/page.tsx → /blog/:slug
```

### Мини-проверка

Какой URL будет у файла `app/products/new/page.tsx`?

---

## 3. Специальные файлы: layout, loading, error

### Что это такое?

App Router использует соглашения об именах файлов. Каждое имя --- особая роль.

### layout.tsx --- общий каркас страниц

```typescript
// app/layout.tsx --- корневой layout (оборачивает ВСЕ страницы)
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <header>
          <nav>Навигация</nav>
        </header>
        <main>{children}</main>
        <footer>Подвал сайта</footer>
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx --- layout только для /dashboard/*
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard">
      <aside>Боковое меню</aside>
      <section>{children}</section>
    </div>
  );
}
```

Лейауты **вложены**: страница `/dashboard/settings` оборачивается сначала в `DashboardLayout`, потом в `RootLayout`.

```
RootLayout
  └─ <header> + <footer>
     └─ DashboardLayout
        └─ <aside> + <section>
           └─ SettingsPage (page.tsx)
```

### loading.tsx --- индикатор загрузки

```typescript
// app/dashboard/loading.tsx --- показывается пока страница загружается
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent" />
      <span className="ml-2">Загрузка...</span>
    </div>
  );
}
```

Next.js автоматически оборачивает `page.tsx` в React Suspense с этим компонентом как fallback.

### error.tsx --- обработка ошибок

```typescript
// app/dashboard/error.tsx --- показывается при ошибке
"use client"; // error.tsx ОБЯЗАТЕЛЬНО должен быть Client Component

interface ErrorProps {
  error: Error;
  reset: () => void;  // функция для повторной попытки
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  return (
    <div>
      <h2>Что-то пошло не так!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Попробовать снова</button>
    </div>
  );
}
```

### not-found.tsx --- страница 404

```typescript
// app/not-found.tsx --- показывается для несуществующих маршрутов
export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>Страница не найдена</p>
    </div>
  );
}
```

### Сводная таблица специальных файлов

| Файл | Назначение |
|------|-----------|
| `page.tsx` | Содержимое страницы (создает маршрут) |
| `layout.tsx` | Общий каркас для группы страниц |
| `loading.tsx` | Индикатор загрузки (Suspense fallback) |
| `error.tsx` | Обработка ошибок (обязательно "use client") |
| `not-found.tsx` | Страница 404 |

### Мини-проверка

Чем `layout.tsx` отличается от обычного компонента-обертки?

---

## 4. Динамические маршруты [slug]

### Что это такое?

Квадратные скобки в имени папки создают **динамический сегмент** маршрута. Это как параметр в URL --- `/blog/first-post`, `/blog/second-post` обрабатываются одним файлом.

### Как это работает?

```typescript
// app/blog/[slug]/page.tsx --- обрабатывает /blog/любое-значение

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  return (
    <article>
      <h1>Статья: {slug}</h1>
      {/* В реальном приложении тут загрузка данных по slug */}
    </article>
  );
}

// /blog/hello-world  → slug = "hello-world"
// /blog/typescript   → slug = "typescript"
// /blog/42           → slug = "42"
```

### Несколько динамических сегментов

```typescript
// app/shop/[category]/[productId]/page.tsx

interface ProductPageProps {
  params: Promise<{
    category: string;
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, productId } = await params;

  return (
    <div>
      <p>Категория: {category}</p>
      <p>Товар: {productId}</p>
    </div>
  );
}

// /shop/electronics/iphone-15 → category="electronics", productId="iphone-15"
```

### Catch-all маршруты

```typescript
// app/docs/[...slugParts]/page.tsx --- ловит ЛЮБУЮ глубину вложенности

interface DocsPageProps {
  params: Promise<{
    slugParts: string[];
  }>;
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slugParts } = await params;

  return (
    <div>
      <p>Путь: {slugParts.join(" / ")}</p>
    </div>
  );
}

// /docs/getting-started           → slugParts = ["getting-started"]
// /docs/api/reference             → slugParts = ["api", "reference"]
// /docs/api/reference/endpoints   → slugParts = ["api", "reference", "endpoints"]
```

### Мини-проверка

Как получить значение динамического сегмента внутри компонента страницы?

---

## 5. Route Groups (группы маршрутов)

### Что это такое?

Иногда нужно сгруппировать маршруты для общего layout, но **не добавлять** папку в URL. Круглые скобки `(name)` создают группу, которая не влияет на URL.

### Как это работает?

```
app/
  (marketing)/            ← группа, НЕ часть URL
    layout.tsx            ← общий layout для маркетинговых страниц
    page.tsx              → /
    about/
      page.tsx            → /about
    pricing/
      page.tsx            → /pricing
  (dashboard)/            ← другая группа
    layout.tsx            ← свой layout для дашборда
    dashboard/
      page.tsx            → /dashboard
    settings/
      page.tsx            → /settings
```

```typescript
// app/(marketing)/layout.tsx --- layout для маркетинговых страниц
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav>Главная | О нас | Цены</nav>
      {children}
    </div>
  );
}

// app/(dashboard)/layout.tsx --- layout для дашборда
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <aside>Меню дашборда</aside>
      <main>{children}</main>
    </div>
  );
}
```

Папки `(marketing)` и `(dashboard)` не появляются в URL --- это чисто организационная структура.

### Частые заблуждения

- "Группы маршрутов добавляют сегмент в URL". Нет, круглые скобки специально для того, чтобы **не** влиять на URL.
- "Можно использовать только одну группу". Нет, групп может быть сколько угодно.

### Мини-проверка

Какой URL будет у файла `app/(auth)/login/page.tsx`?

---

## Итог

Next.js превращает React из библиотеки в полноценный фреймворк. App Router --- это современный подход к организации приложения, где структура файлов определяет маршруты.

**Ключевые идеи главы:**

- **Next.js** --- React-фреймворк с роутингом, SSR, оптимизацией из коробки
- **Файловый роутинг** --- путь к `page.tsx` = URL
- **layout.tsx** --- общий каркас для группы страниц (вложенные лейауты)
- **loading.tsx** --- автоматический индикатор загрузки
- **error.tsx** --- обработка ошибок (обязательно `"use client"`)
- **[slug]** --- динамические маршруты, значение доступно через `params`
- **[...slug]** --- catch-all маршруты для любой глубины вложенности
- **(group)** --- группировка маршрутов без влияния на URL

---

> [[nextjs-fundamentals]] | **App Router** | [[nextjs/02-server-client]] >>
