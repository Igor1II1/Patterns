# Проект 4: Блог-платформа на Next.js

**Месяц:** Июнь 2026
**Папка:** `projects/month-4-blog/`
**Стек:** Next.js 14 · TypeScript · Tailwind · Shadcn/ui

---

## Описание

Переписываем проект месяца 3 (или создаём новый) на Next.js + TypeScript. Платформа для публикации постов с категориями, поиском и комментариями (статическими — без БД, данные в JSON файлах или mock).

---

## Функциональность

### Обязательно
- [ ] Главная страница: список последних постов (SSG)
- [ ] Страница поста `/posts/[slug]` с полным текстом (SSG)
- [ ] Страница категории `/category/[name]`
- [ ] Поиск по постам (SSR или client-side)
- [ ] Адаптивный дизайн (Tailwind + мобильный)
- [ ] Тёмная тема (Tailwind dark mode)
- [ ] TypeScript — все компоненты и функции типизированы

### Дополнительно
- [ ] Пагинация
- [ ] API Route для поиска (`/api/search`)
- [ ] Страница "Об авторе"
- [ ] SEO: Metadata API для каждой страницы
- [ ] Open Graph изображения

---

## Стек

```
Next.js 14 (App Router)
TypeScript 5
Tailwind CSS 3
Shadcn/ui — компоненты (Button, Card, Badge, Input)
```

---

## Структура проекта

```
month-4-blog/
├── app/
│   ├── layout.tsx          ← корневой layout
│   ├── page.tsx            ← главная (список постов)
│   ├── posts/
│   │   └── [slug]/
│   │       └── page.tsx    ← страница поста (SSG)
│   ├── category/
│   │   └── [name]/
│   │       └── page.tsx
│   ├── search/
│   │   └── page.tsx
│   └── api/
│       └── search/
│           └── route.ts    ← API endpoint
├── components/
│   ├── PostCard.tsx
│   ├── PostList.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── SearchInput.tsx
├── lib/
│   ├── posts.ts            ← функции работы с данными
│   └── types.ts            ← TypeScript типы
├── data/
│   └── posts.json          ← данные постов (mock)
├── public/
└── tailwind.config.ts
```

---

## TypeScript типы

```typescript
// lib/types.ts
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  coverImage?: string;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}
```

---

## Ключевые концепции Next.js

### SSG — статическая генерация
```typescript
// app/posts/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  return <article>...</article>;
}
```

### Server vs Client Components
- По умолчанию в App Router все компоненты — серверные
- `'use client'` только когда нужны хуки или события

### API Route
```typescript
// app/api/search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';
  const results = searchPosts(query);
  return Response.json(results);
}
```

---

## Поэтапная разработка

### Этап 1: Настройка (день 1)
1. `npx create-next-app@latest` с TypeScript, Tailwind, App Router
2. Установить и настроить Shadcn: `npx shadcn-ui@latest init`
3. Создать `lib/types.ts` и `data/posts.json` с 5-10 тестовыми постами
4. Написать `lib/posts.ts` — функции чтения данных

### Этап 2: Главная и пост (дни 2-3)
1. Компонент `PostCard` с Shadcn `Card`
2. Главная страница — список постов
3. Страница поста `[slug]` — полный текст

### Этап 3: Категории и поиск (дни 4-5)
1. Страница категории
2. Поиск (client-side или API Route)
3. Компонент Header с навигацией

### Этап 4: Стили и SEO (дни 6-7)
1. Тёмная тема
2. Metadata для каждой страницы
3. Адаптивный дизайн
4. Деплой на Vercel

---

## Что проверяется из пройденных тем

| Тема | Как используется |
|------|-----------------|
| Next.js App Router | Вся структура |
| TypeScript | Типизация всего кода |
| Server Components | Главная, посты, категории |
| Client Components | Поиск, интерактив |
| SSG | Страницы постов |
| API Routes | Endpoint поиска |
| Tailwind | Все стили |
| Shadcn/ui | Готовые компоненты |
| Metadata API | SEO |
