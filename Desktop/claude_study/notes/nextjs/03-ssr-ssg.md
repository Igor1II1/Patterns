# Глава 3. SSR, SSG и ISR

> << [[nextjs/02-server-client]] | [[nextjs-fundamentals]] | **SSR/SSG/ISR** | [[nextjs/04-api-routes]] >>

---

## Зачем эта тема существует?

Когда пользователь открывает страницу, HTML можно сгенерировать тремя способами: заранее (при сборке), по запросу (на каждый визит) или заранее с периодическим обновлением. Каждый подход имеет свои плюсы. Страница с товаром может обновляться раз в минуту, блог-пост --- генерироваться один раз при деплое, а личный кабинет --- рендериться на каждый запрос. Понимание этих стратегий --- ключ к быстрым и надежным приложениям.

---

## 1. Три стратегии рендеринга

### Что это такое?

- **SSG (Static Site Generation)** --- HTML генерируется **при сборке** (build). Одинаковый для всех пользователей.
- **SSR (Server-Side Rendering)** --- HTML генерируется **на каждый запрос** на сервере.
- **ISR (Incremental Static Regeneration)** --- HTML генерируется при сборке, но **обновляется** через заданный интервал.

### Как это работает?

```
SSG (статика):
  npm run build → HTML готов → CDN раздает
  Все пользователи получают одинаковый HTML
  Скорость: молниеносная (CDN)

SSR (динамика):
  Запрос пользователя → сервер генерирует HTML → отправляет
  Каждый запрос = свежие данные
  Скорость: зависит от сервера и базы данных

ISR (гибрид):
  npm run build → HTML готов → CDN раздает
  Через N секунд → фоновое обновление HTML
  Скорость: как SSG, свежесть: почти как SSR
```

### Когда что использовать?

| Стратегия | Подходит для | Примеры |
|-----------|-------------|---------|
| SSG | Контент, который редко меняется | Блог, документация, лендинг |
| SSR | Персонализированный или часто меняющийся контент | Личный кабинет, лента новостей, поиск |
| ISR | Контент, который меняется, но не критично иметь самые свежие данные | Каталог товаров, страницы товаров, рейтинги |

### Мини-проверка

Чем SSG отличается от SSR?

---

## 2. Статический рендеринг (SSG) --- поведение по умолчанию

### Что это такое?

В Next.js App Router страница рендерится статически по умолчанию, если она не использует динамические функции (cookies, headers, searchParams).

### Как это работает?

```typescript
// app/about/page.tsx --- статическая страница
// Генерируется один раз при сборке
export default function AboutPage() {
  return (
    <main>
      <h1>О компании</h1>
      <p>Мы делаем крутые продукты с 2020 года.</p>
    </main>
  );
}

// Статическая страница с данными
// Данные загружаются при сборке, fetch кэшируется по умолчанию
export default async function BlogPage() {
  const response = await fetch("https://api.example.com/posts");
  // По умолчанию этот fetch кэшируется = SSG
  const posts = await response.json();

  return (
    <ul>
      {posts.map((post: { id: number; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### generateStaticParams --- предгенерация динамических страниц

```typescript
// app/blog/[slug]/page.tsx
// Без generateStaticParams --- страницы генерируются по запросу
// С generateStaticParams --- страницы генерируются при сборке

interface Post {
  slug: string;
  title: string;
  content: string;
}

// Эта функция вызывается при build --- говорит Next.js какие страницы создать
export async function generateStaticParams() {
  const response = await fetch("https://api.example.com/posts");
  const posts: Post[] = await response.json();

  // Возвращаем массив объектов с параметрами
  return posts.map((post) => ({
    slug: post.slug
  }));
  // Next.js создаст: /blog/first-post, /blog/second-post, ...
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const response = await fetch(`https://api.example.com/posts/${slug}`);
  const post: Post = await response.json();

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}
```

### Плохой и хороший пример

```typescript
// Плохо --- блог с SSR (каждый запрос = запрос к БД, хотя контент не меняется)
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // force-dynamic делает SSR --- лишняя нагрузка для статичного контента
  const post = await db.post.findUnique({ where: { slug } });
  return <article>{post?.content}</article>;
}
export const dynamic = "force-dynamic"; // Зачем? Контент не персонализированный

// Хорошо --- блог с SSG (генерируется при сборке, раздается с CDN)
export async function generateStaticParams() {
  const posts = await db.post.findMany({ select: { slug: true } });
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });
  return <article>{post?.content}</article>;
}
```

### Мини-проверка

Что делает функция `generateStaticParams`?

---

## 3. Динамический рендеринг (SSR)

### Что это такое?

SSR --- страница генерируется на сервере при каждом запросе. HTML всегда содержит актуальные данные.

### Как это работает?

Страница становится динамической автоматически, если использует:
- `cookies()` или `headers()`
- `searchParams` в пропсах страницы
- `fetch` с `{ cache: "no-store" }`
- Экспорт `dynamic = "force-dynamic"`

```typescript
// Способ 1: использование cookies/headers
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  const response = await fetch("https://api.example.com/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const user = await response.json();

  return <h1>Привет, {user.name}!</h1>;
}

// Способ 2: использование searchParams
interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", page = "1" } = await searchParams;

  const response = await fetch(
    `https://api.example.com/search?q=${q}&page=${page}`
  );
  const results = await response.json();

  return (
    <div>
      <h1>Результаты для: {q}</h1>
      {results.map((item: { id: number; title: string }) => (
        <p key={item.id}>{item.title}</p>
      ))}
    </div>
  );
}

// Способ 3: fetch без кэша
export default async function StockPricePage() {
  const response = await fetch("https://api.example.com/stock/AAPL", {
    cache: "no-store" // Всегда свежие данные
  });
  const stock = await response.json();

  return <p>Цена Apple: ${stock.price}</p>;
}

// Способ 4: явное указание
export const dynamic = "force-dynamic";

export default async function LiveFeedPage() {
  // Всегда SSR
  const feed = await getFeed();
  return <Feed items={feed} />;
}
```

### Мини-проверка

Какие три вещи автоматически делают страницу динамической?

---

## 4. ISR (Incremental Static Regeneration)

### Что это такое?

ISR --- золотая середина между SSG и SSR. Страница генерируется статически, но автоматически обновляется через заданный интервал. Пользователь получает быстрый ответ с CDN, а данные при этом относительно свежие.

### Как это работает?

```typescript
// app/products/page.tsx --- обновляется каждые 60 секунд
export default async function ProductsPage() {
  const response = await fetch("https://api.example.com/products", {
    next: { revalidate: 60 } // Обновлять каждые 60 секунд
  });
  const products = await response.json();

  return (
    <div>
      <h1>Каталог товаров</h1>
      {products.map((p: { id: number; name: string; price: number }) => (
        <div key={p.id}>
          <h2>{p.name}</h2>
          <p>{p.price} руб.</p>
        </div>
      ))}
    </div>
  );
}
```

### Как работает revalidate "под капотом"

```
Запрос 1 (0 сек):    Генерируется HTML → кэшируется → отдается пользователю
Запрос 2 (30 сек):   Отдается кэшированный HTML (60 сек не прошло)
Запрос 3 (65 сек):   Отдается кэшированный HTML, но в фоне запускается обновление
Запрос 4 (70 сек):   Отдается НОВЫЙ HTML (обновление завершилось)
```

Ключевой момент: пользователь **никогда не ждет** генерации. Он всегда получает кэшированную версию, а обновление происходит в фоне.

### revalidate на уровне страницы

```typescript
// Вместо указания в каждом fetch, можно задать для всей страницы
export const revalidate = 3600; // Вся страница обновляется раз в час

export default async function NewsPage() {
  const news = await fetch("https://api.example.com/news").then(r => r.json());
  return <NewsList items={news} />;
}
```

### Ревалидация по запросу (on-demand)

```typescript
// Вместо таймера --- обновление по событию
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Обновить конкретную страницу
  revalidatePath("/products");

  // Или обновить все fetch с определенным тегом
  revalidateTag("products");

  return Response.json({ revalidated: true });
}

// В компоненте --- помечаем fetch тегом
export default async function ProductsPage() {
  const response = await fetch("https://api.example.com/products", {
    next: { tags: ["products"] } // Тег для ревалидации
  });
  const products = await response.json();
  return <ProductList products={products} />;
}

// Теперь при POST /api/revalidate --- страница обновится
// Полезно для webhook'ов от CMS
```

### Плохой и хороший пример

```typescript
// Плохо --- каталог товаров с SSR (нагрузка на сервер при каждом запросе)
export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await fetch("https://api.example.com/products").then(r => r.json());
  return <ProductList products={products} />;
}

// Хорошо --- ISR, обновляется раз в минуту
export const revalidate = 60;

export default async function CatalogPage() {
  const products = await fetch("https://api.example.com/products").then(r => r.json());
  return <ProductList products={products} />;
}
```

### Частые заблуждения

- "ISR обновляет страницу ровно каждые N секунд". Нет. Обновление запускается только при следующем запросе после истечения интервала. Если страницу никто не посещает --- она не обновляется.
- "Revalidate 60 значит данные всегда максимум минутной давности". Нет. Если после истечения 60 секунд прошло ещё 5 часов без посещений, первый пользователь получит 5-часовые данные, и только следующий --- свежие.

### Мини-проверка

Что произойдет, если `revalidate = 60` и страницу посетили через 90 секунд?

---

## 5. Сводная таблица: когда что использовать

| Критерий | SSG | ISR | SSR |
|----------|-----|-----|-----|
| Скорость | Максимальная | Высокая | Средняя |
| Свежесть данных | На момент сборки | С задержкой (revalidate) | Всегда актуальные |
| Нагрузка на сервер | Нулевая (CDN) | Минимальная | Высокая |
| Персонализация | Нет | Нет | Да |
| Примеры | Блог, документация, лендинг | Каталог, рейтинги, статьи | Личный кабинет, поиск, корзина |

### Как Next.js определяет стратегию

```typescript
// SSG (по умолчанию) --- нет динамических функций
export default async function Page() {
  const data = await fetch("https://api.example.com/data");
  return <div>{/* ... */}</div>;
}

// ISR --- есть revalidate
export const revalidate = 60;
export default async function Page() {
  const data = await fetch("https://api.example.com/data");
  return <div>{/* ... */}</div>;
}

// SSR --- есть динамические функции или force-dynamic
import { cookies } from "next/headers";
export default async function Page() {
  const cookieStore = await cookies(); // Это делает страницу динамической
  return <div>{/* ... */}</div>;
}
```

### Мини-проверка

Какую стратегию выбрать для страницы профиля пользователя? Почему?

---

## Итог

SSG, SSR и ISR --- три стратегии рендеринга, каждая для своего случая. Next.js автоматически выбирает оптимальную стратегию, но ты можешь управлять этим явно.

**Ключевые идеи главы:**

- **SSG** --- статическая генерация при сборке, максимальная скорость, для неизменного контента
- **SSR** --- генерация на каждый запрос, всегда свежие данные, для персонализированного контента
- **ISR** --- статика + фоновое обновление, баланс скорости и свежести
- **`generateStaticParams`** --- предгенерация динамических страниц при сборке
- **`revalidate`** --- интервал обновления для ISR (в секундах)
- **`revalidatePath` / `revalidateTag`** --- обновление по запросу (on-demand)
- **По умолчанию** Next.js делает SSG, если нет динамических функций

---

> << [[nextjs/02-server-client]] | [[nextjs-fundamentals]] | **SSR/SSG/ISR** | [[nextjs/04-api-routes]] >>
