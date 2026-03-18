# Глава 2. Server Components и Client Components

> << [[nextjs/01-app-router]] | [[nextjs-fundamentals]] | **Server vs Client** | [[nextjs/03-ssr-ssg]] >>

---

## Зачем эта тема существует?

В обычном React весь код работает в браузере (на клиенте). Компонент загружается, выполняется JavaScript, рисуется интерфейс. Это значит, что пользователь сначала видит пустую страницу, потом ждет загрузки JS, и только потом видит содержимое.

Next.js с App Router изменил подход: по умолчанию компоненты выполняются **на сервере**. Сервер генерирует готовый HTML и отправляет его пользователю --- страница появляется мгновенно. Это быстрее, лучше для SEO и безопаснее. Но некоторые вещи (обработка кликов, состояние) возможны только в браузере. Поэтому нужно понимать, когда использовать серверные, а когда клиентские компоненты.

---

## 1. Server Components (серверные компоненты)

### Что это такое?

Server Component --- компонент, который выполняется **только на сервере**. Его код никогда не попадает в браузер. Результат --- готовый HTML, который отправляется клиенту.

### Как это работает?

```typescript
// app/users/page.tsx --- Server Component по умолчанию
// Никакой специальной пометки не нужно

interface User {
  id: number;
  name: string;
  email: string;
}

export default async function UsersPage() {
  // Можно напрямую обращаться к базе данных или API
  const response = await fetch("https://api.example.com/users");
  const users: User[] = await response.json();

  return (
    <div>
      <h1>Пользователи</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} --- {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Преимущества серверных компонентов

```typescript
// 1. Прямой доступ к данным --- без API-слоя
import { db } from "@/lib/database";

export default async function ProductsPage() {
  const products = await db.product.findMany(); // Запрос к БД прямо в компоненте
  return <ProductList products={products} />;
}

// 2. Секретные данные в безопасности
export default async function SecretPage() {
  const apiKey = process.env.SECRET_API_KEY; // Этот ключ не попадет в браузер
  const data = await fetch("https://api.example.com", {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  // ...
}

// 3. Меньше JavaScript отправляется в браузер
// Тяжелые библиотеки для работы с данными остаются на сервере
import { marked } from "marked";       // 50KB библиотека
import { sanitize } from "dompurify";  // 30KB библиотека

export default async function ArticlePage() {
  const markdown = await getArticle();
  const html = sanitize(marked(markdown));
  // marked и dompurify НЕ попадут в клиентский бандл
  return <article dangerouslySetInnerHTML={{ __html: html }} />;
}
```

### Что НЕЛЬЗЯ делать в Server Components

```typescript
// Ошибка --- нельзя использовать хуки состояния
export default function Counter() {
  const [count, setCount] = useState(0); // ОШИБКА
  return <button onClick={() => setCount(count + 1)}>{count}</button>; // ОШИБКА
}

// Ошибка --- нельзя использовать browser API
export default function WindowSize() {
  const width = window.innerWidth; // ОШИБКА: window не существует на сервере
  return <p>Ширина: {width}</p>;
}

// Ошибка --- нельзя добавлять обработчики событий
export default function Button() {
  return <button onClick={() => alert("клик")}>Нажми</button>; // ОШИБКА
}
```

### Мини-проверка

Почему в Server Component нельзя использовать `useState`?

---

## 2. Client Components (клиентские компоненты)

### Что это такое?

Client Component --- компонент, который выполняется **в браузере**. Он нужен для интерактивности: обработка кликов, формы, анимации, состояние.

### Как это работает?

```typescript
// app/components/Counter.tsx --- Client Component
"use client"; // Эта директива ОБЯЗАТЕЛЬНА

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Счетчик: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  );
}
```

Директива `"use client"` ставится **в самом начале файла**, до всех импортов. Она говорит Next.js: "этот компонент и все его импорты должны работать в браузере".

### Когда нужен Client Component

```typescript
// 1. Состояние (useState, useReducer)
"use client";
import { useState } from "react";

export function ToggleMenu() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>Меню</button>
      {isOpen && <nav>Пункты меню...</nav>}
    </>
  );
}

// 2. Эффекты (useEffect)
"use client";
import { useEffect, useState } from "react";

export function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return <span>{isOnline ? "В сети" : "Не в сети"}</span>;
}

// 3. Обработчики событий (onClick, onChange, onSubmit)
"use client";

export function LikeButton() {
  const handleClick = () => {
    console.log("Понравилось!");
  };
  return <button onClick={handleClick}>Лайк</button>;
}

// 4. Browser API (window, document, localStorage)
"use client";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  return <button onClick={toggle}>Тема: {theme}</button>;
}
```

### Частые заблуждения

- "`'use client'` значит, что компонент рендерится ТОЛЬКО в браузере". Нет. Client Components тоже проходят серверный пререндеринг (SSR) для начального HTML. `"use client"` означает, что компонент **гидрируется** в браузере --- получает интерактивность.
- "Нужно ставить `'use client'` на каждый компонент". Нет, только на те, которым нужна интерактивность. Все дочерние компоненты клиентского компонента тоже автоматически становятся клиентскими.

### Мини-проверка

Где именно в файле ставится директива `"use client"`?

---

## 3. Когда использовать Server, когда Client

### Что это такое?

Главное правило: **по умолчанию используй Server Components**. Переключайся на Client только когда нужна интерактивность.

### Таблица выбора

| Задача | Server | Client |
|--------|--------|--------|
| Загрузка данных (fetch, БД) | Да | Нет (можно, но хуже) |
| Доступ к секретам (API ключи) | Да | Нет (небезопасно) |
| Статический контент | Да | Нет (излишне) |
| SEO-важный контент | Да | Можно, но хуже |
| useState / useReducer | Нет | Да |
| useEffect | Нет | Да |
| onClick / onChange | Нет | Да |
| Browser API (window, localStorage) | Нет | Да |
| Сторонние библиотеки с хуками | Нет | Да |

### Как это работает на практике?

```typescript
// Страница --- Server Component (загружает данные)
// app/blog/[slug]/page.tsx
import { LikeButton } from "@/components/LikeButton"; // клиентский
import { CommentForm } from "@/components/CommentForm"; // клиентский

interface Post {
  title: string;
  content: string;
  likes: number;
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const response = await fetch(`https://api.example.com/posts/${slug}`);
  const post: Post = await response.json();

  return (
    <article>
      {/* Статический контент --- серверный */}
      <h1>{post.title}</h1>
      <div>{post.content}</div>

      {/* Интерактивные части --- клиентские */}
      <LikeButton initialLikes={post.likes} postId={slug} />
      <CommentForm postId={slug} />
    </article>
  );
}
```

Принцип: **"серверное дерево с клиентскими листьями"**. Основная структура на сервере, интерактивные куски --- на клиенте.

### Плохой и хороший пример

```typescript
// Плохо --- вся страница клиентская ради одной кнопки
"use client";
import { useState, useEffect } from "react";

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  useEffect(() => {
    fetch("/api/product/1").then(r => r.json()).then(setProduct);
  }, []);
  // Весь код в браузере, загрузка данных через useEffect...
}

// Хорошо --- страница серверная, только кнопка клиентская
// page.tsx (Server Component)
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function ProductPage() {
  const product = await fetch("https://api.example.com/product/1")
    .then(r => r.json());

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Цена: {product.price} руб.</p>
      <AddToCartButton productId={product.id} />
    </div>
  );
}
```

### Мини-проверка

Почему лучше по умолчанию использовать Server Components?

---

## 4. Загрузка данных в Server Components

### Что это такое?

В серверных компонентах можно использовать `async/await` прямо в теле компонента. Не нужен `useEffect` --- данные загружаются на сервере до отправки HTML клиенту.

### Как это работает?

```typescript
// Прямой fetch в компоненте
export default async function UsersPage() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();

  return (
    <ul>
      {users.map((user: { id: number; name: string }) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Несколько запросов параллельно
export default async function DashboardPage() {
  const [usersRes, postsRes, statsRes] = await Promise.all([
    fetch("https://api.example.com/users"),
    fetch("https://api.example.com/posts"),
    fetch("https://api.example.com/stats"),
  ]);

  const users = await usersRes.json();
  const posts = await postsRes.json();
  const stats = await statsRes.json();

  return (
    <div>
      <UsersList users={users} />
      <PostsList posts={posts} />
      <StatsPanel stats={stats} />
    </div>
  );
}
```

### Мини-проверка

Почему в Server Components не нужен `useEffect` для загрузки данных?

---

## 5. Правила сериализации

### Что это такое?

Когда серверный компонент передает данные клиентскому через пропсы, эти данные должны быть **сериализуемыми** --- то есть их можно превратить в JSON. Функции, классы, Map, Set --- передать нельзя.

### Как это работает?

```typescript
// Можно передавать:
// - строки, числа, boolean, null
// - массивы и объекты (с сериализуемыми значениями)
// - Date (передается как строка)

// app/page.tsx (Server Component)
import { UserCard } from "@/components/UserCard";

export default async function Page() {
  const user = await getUser();

  return (
    <UserCard
      name={user.name}         // строка --- ок
      age={user.age}           // число --- ок
      tags={user.tags}         // массив строк --- ок
      // onClick={() => {}}    // ОШИБКА: функции не сериализуемы
      // ref={someRef}         // ОШИБКА: ref не сериализуем
    />
  );
}
```

```typescript
// НЕЛЬЗЯ передавать из Server в Client:
// - Функции
// - Классы (экземпляры)
// - Map, Set, WeakMap, WeakSet
// - Symbol
// - JSX как пропс (кроме children)

// Плохо
<ClientComponent onSave={() => saveToDb()} />  // Ошибка

// Хорошо --- передай данные, а логику реализуй на клиенте
<ClientComponent userId={user.id} />
// Внутри ClientComponent вызывай Server Action или API
```

### Частые заблуждения

- "Нельзя вложить Server Component внутрь Client Component". Можно, но только через `children`. Серверный компонент передается как JSX-children, и это работает.

```typescript
// Это работает:
// layout.tsx (Server)
import { Sidebar } from "@/components/Sidebar"; // Client
import { Navigation } from "@/components/Navigation"; // Server

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Sidebar>
      <Navigation /> {/* Server Component внутри Client через children */}
    </Sidebar>
  );
}
```

### Мини-проверка

Можно ли передать функцию как пропс из Server Component в Client Component?

---

## Итог

Разделение на Server и Client Components --- ключевая концепция Next.js App Router. Серверные компоненты загружают данные, клиентские обеспечивают интерактивность.

**Ключевые идеи главы:**

- **По умолчанию** все компоненты --- серверные (Server Components)
- **`"use client"`** --- директива для клиентских компонентов (в начале файла)
- **Server Components:** загрузка данных, доступ к БД и секретам, статический контент
- **Client Components:** состояние, эффекты, обработчики событий, browser API
- **Паттерн:** серверное дерево с клиентскими листьями
- **Сериализация:** из сервера в клиент можно передавать только JSON-совместимые данные
- **Server Component через children** --- способ вложить серверный компонент в клиентский

---

> << [[nextjs/01-app-router]] | [[nextjs-fundamentals]] | **Server vs Client** | [[nextjs/03-ssr-ssg]] >>
