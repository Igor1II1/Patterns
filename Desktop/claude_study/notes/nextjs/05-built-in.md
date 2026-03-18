# Глава 5. Встроенные компоненты и оптимизация

> << [[nextjs/04-api-routes]] | [[nextjs-fundamentals]] | **Встроенные компоненты** | [[nextjs/06-shadcn]] >>

---

## Зачем эта тема существует?

Веб-производительность напрямую влияет на пользователей и бизнес. Каждая лишняя секунда загрузки --- это потерянные посетители. Next.js предоставляет встроенные компоненты, которые автоматически оптимизируют изображения, навигацию, шрифты и скрипты. Не нужно настраивать ничего вручную --- просто используй правильные компоненты вместо обычных HTML-тегов.

---

## 1. Компонент Image

### Что это такое?

`next/image` --- замена стандартного `<img>`. Автоматически оптимизирует изображения: конвертирует в WebP/AVIF, генерирует разные размеры для разных экранов, загружает лениво (только когда видно на экране).

### Как это работает?

```typescript
import Image from "next/image";

// --- Локальное изображение (из папки проекта) ---
import heroImage from "@/public/hero.jpg";

export default function HomePage() {
  return (
    <Image
      src={heroImage}
      alt="Герой баннера"
      // width и height определяются автоматически из файла
      placeholder="blur"  // размытая заглушка пока грузится
      priority             // загрузить сразу (для элементов "выше сгиба")
    />
  );
}

// --- Удаленное изображение (по URL) ---
export default function UserAvatar() {
  return (
    <Image
      src="https://example.com/avatar.jpg"
      alt="Аватар пользователя"
      width={100}          // обязательно для удаленных изображений
      height={100}         // обязательно для удаленных изображений
      className="rounded-full"
    />
  );
}
```

### Свойства Image

```typescript
<Image
  src="/photo.jpg"      // путь к изображению
  alt="Описание"        // обязательный атрибут
  width={800}           // ширина в пикселях
  height={600}          // высота в пикселях
  priority              // загрузить немедленно (для LCP-элементов)
  placeholder="blur"    // размытая заглушка при загрузке
  quality={85}          // качество сжатия (1-100, по умолчанию 75)
  fill                  // растянуть на весь контейнер (вместо width/height)
  sizes="(max-width: 768px) 100vw, 50vw"  // подсказка для адаптивности
  className="rounded"   // CSS-классы
/>
```

### fill --- изображение на весь контейнер

```typescript
// Когда размер неизвестен --- используй fill
export default function Banner() {
  return (
    <div className="relative w-full h-[400px]">
      {/* Контейнер ДОЛЖЕН иметь position: relative */}
      <Image
        src="/banner.jpg"
        alt="Баннер"
        fill                           // занимает весь контейнер
        style={{ objectFit: "cover" }} // как background-size: cover
        sizes="100vw"
        priority
      />
    </div>
  );
}
```

### Настройка удаленных изображений

```typescript
// next.config.js --- нужно разрешить домены для удаленных изображений
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
```

### Плохой и хороший пример

```typescript
// Плохо --- обычный img, нет оптимизации
export default function Gallery() {
  return <img src="/photo.jpg" alt="Фото" />;
  // Загрузит оригинал (5MB), нет lazy loading, нет WebP
}

// Хорошо --- next/image с полной оптимизацией
import Image from "next/image";

export default function Gallery() {
  return (
    <Image
      src="/photo.jpg"
      alt="Фото"
      width={800}
      height={600}
      // Автоматически: WebP, lazy loading, srcset для разных экранов
    />
  );
}
```

### Частые заблуждения

- "`<Image>` работает точно как `<img>`". Нет. `<Image>` требует `width` и `height` (или `fill`), а для удаленных URL нужна настройка `remotePatterns`.

### Мини-проверка

Зачем `<Image>` требует `width` и `height`?

---

## 2. Компонент Link

### Что это такое?

`next/link` --- замена стандартного `<a>` для навигации внутри приложения. Делает клиентскую навигацию (без перезагрузки страницы) и предзагрузку страниц.

### Как это работает?

```typescript
import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Главная</Link>
      <Link href="/about">О нас</Link>
      <Link href="/blog">Блог</Link>
      <Link href="/contact">Контакты</Link>
    </nav>
  );
}

// Динамические ссылки
interface Post {
  slug: string;
  title: string;
}

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

### Свойства Link

```typescript
<Link
  href="/about"              // URL (обязательный)
  prefetch={true}            // предзагрузить страницу (по умолчанию: true)
  replace                    // заменить запись в истории (вместо push)
  scroll={false}             // не скроллить вверх при переходе
  className="text-blue-500"  // CSS-классы
  target="_blank"            // открыть в новой вкладке
>
  О нас
</Link>

// Объект href для сложных URL
<Link
  href={{
    pathname: "/blog/[slug]",
    query: { slug: "first-post" },
  }}
>
  Первый пост
</Link>
```

### Плохой и хороший пример

```typescript
// Плохо --- обычный <a> для внутренней навигации
export default function Nav() {
  return <a href="/about">О нас</a>;
  // Полная перезагрузка страницы, нет предзагрузки
}

// Хорошо --- Link для внутренней навигации
import Link from "next/link";

export default function Nav() {
  return <Link href="/about">О нас</Link>;
  // Клиентская навигация, предзагрузка, мгновенный переход
}

// Для внешних ссылок --- обычный <a> допустим
export default function Footer() {
  return <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>;
}
```

### Мини-проверка

Чем `<Link>` лучше обычного `<a>` для внутренней навигации?

---

## 3. Компонент Script

### Что это такое?

`next/script` --- управление загрузкой сторонних скриптов (аналитика, виджеты, карты). Позволяет контролировать, когда и как скрипт загружается.

### Как это работает?

```typescript
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"  // загрузить после гидрации
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>

        {/* Виджет чата --- загрузить когда браузер свободен */}
        <Script
          src="https://chat-widget.example.com/widget.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
```

### Стратегии загрузки

| Стратегия | Когда загружается | Для чего |
|-----------|------------------|---------|
| `beforeInteractive` | До гидрации | Критичные скрипты (полифиллы) |
| `afterInteractive` | После гидрации (по умолчанию) | Аналитика, трекинг |
| `lazyOnload` | Когда браузер свободен | Виджеты, чаты, некритичные скрипты |
| `worker` | В Web Worker (экспериментально) | Тяжелые вычисления |

### Мини-проверка

Какую стратегию использовать для Google Analytics?

---

## 4. Metadata API --- SEO

### Что это такое?

Metadata API --- способ задать мета-теги страницы (`<title>`, `<meta description>` и др.) для SEO и социальных сетей.

### Как это работает?

```typescript
// --- Статические метаданные ---
// app/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Главная | Мой сайт",
  description: "Описание главной страницы для поисковых систем",
  keywords: ["next.js", "react", "typescript"],
  openGraph: {
    title: "Мой сайт",
    description: "Крутой сайт на Next.js",
    images: ["/og-image.jpg"],
  },
};

export default function HomePage() {
  return <h1>Главная</h1>;
}

// --- Динамические метаданные ---
// app/blog/[slug]/page.tsx
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetch(`https://api.example.com/posts/${slug}`).then(r => r.json());

  return {
    title: `${post.title} | Блог`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetch(`https://api.example.com/posts/${slug}`).then(r => r.json());
  return <article>{post.content}</article>;
}
```

### Metadata в layout (наследование)

```typescript
// app/layout.tsx --- базовые метаданные
export const metadata: Metadata = {
  title: {
    default: "Мой сайт",           // заголовок по умолчанию
    template: "%s | Мой сайт",     // шаблон: "О нас | Мой сайт"
  },
  description: "Базовое описание сайта",
};

// app/about/page.tsx --- переопределение для конкретной страницы
export const metadata: Metadata = {
  title: "О нас",  // Итог: "О нас | Мой сайт" (по шаблону из layout)
  description: "Всё о нашей команде",
};
```

### Мини-проверка

Чем `generateMetadata` отличается от `export const metadata`?

---

## 5. Оптимизация шрифтов

### Что это такое?

`next/font` загружает шрифты **при сборке**, встраивает их в CSS и устраняет сдвиг макета (layout shift) при загрузке шрифтов.

### Как это работает?

```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from "next/font/google";

// Загрузка Google шрифта
const inter = Inter({
  subsets: ["latin", "cyrillic"],  // подмножества (для русского --- cyrillic)
  display: "swap",                  // показать текст системным шрифтом пока грузится
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",  // CSS-переменная для использования в Tailwind
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.className} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### Локальные шрифты

```typescript
import localFont from "next/font/local";

const myFont = localFont({
  src: [
    { path: "../public/fonts/MyFont-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/MyFont-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
});
```

### Использование с Tailwind

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)"],  // CSS-переменная из next/font
      },
    },
  },
};
```

### Плохой и хороший пример

```typescript
// Плохо --- подключение через link в HTML (дополнительный запрос, layout shift)
// <link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet">

// Хорошо --- next/font (шрифт встроен при сборке, нет доп. запросов)
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin", "cyrillic"] });
```

### Мини-проверка

Почему `next/font` лучше, чем подключение шрифта через `<link>`?

---

## 6. Переменные окружения

### Что это такое?

Переменные окружения хранят конфигурацию: ключи API, адреса баз данных, секреты. Next.js разделяет их на серверные (секретные) и публичные (доступные в браузере).

### Как это работает?

```bash
# .env.local --- переменные окружения (НЕ коммитить в git!)

# Серверные (доступны ТОЛЬКО на сервере)
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
API_SECRET_KEY=super-secret-key-123
SMTP_PASSWORD=email-password

# Публичные (доступны и на сервере, и в браузере)
# ОБЯЗАТЕЛЬНО начинаются с NEXT_PUBLIC_
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_NAME=Мой сайт
```

```typescript
// Серверный код (Route Handler, Server Component)
const dbUrl = process.env.DATABASE_URL;           // работает
const apiKey = process.env.API_SECRET_KEY;         // работает

// Клиентский код (Client Component)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;    // работает (есть префикс)
// const secret = process.env.API_SECRET_KEY;      // undefined (нет префикса)
```

### Файлы окружения по приоритету

```
.env                 ← базовые значения (коммитятся)
.env.local           ← локальные переопределения (НЕ коммитятся)
.env.development     ← только для npm run dev
.env.production      ← только для npm run build / start
.env.test            ← только для тестов
```

### Плохой и хороший пример

```typescript
// Плохо --- секрет с префиксом NEXT_PUBLIC (попадет в браузер!)
// .env.local
// NEXT_PUBLIC_DATABASE_URL=postgresql://user:pass@localhost/db
// NEXT_PUBLIC_API_SECRET=my-secret-key

// Хорошо --- секреты без префикса, публичные с префиксом
// .env.local
// DATABASE_URL=postgresql://user:pass@localhost/db       (только сервер)
// API_SECRET=my-secret-key                               (только сервер)
// NEXT_PUBLIC_APP_NAME=My App                            (доступно везде)
```

### Частые заблуждения

- "Все переменные окружения доступны в браузере". Нет, только с префиксом `NEXT_PUBLIC_`. Остальные существуют только на сервере.

### Мини-проверка

Почему нельзя добавлять `NEXT_PUBLIC_` к переменной с паролем от базы данных?

---

## Итог

Встроенные компоненты Next.js автоматически оптимизируют ключевые аспекты производительности. Используй их вместо стандартных HTML-тегов.

**Ключевые идеи главы:**

- **Image** --- оптимизация изображений (WebP, lazy loading, srcset). Требует `width`/`height` или `fill`
- **Link** --- клиентская навигация без перезагрузки, предзагрузка страниц
- **Script** --- управление загрузкой сторонних скриптов (стратегии: `afterInteractive`, `lazyOnload`)
- **Metadata API** --- SEO-теги (`title`, `description`, Open Graph). Статические или динамические (`generateMetadata`)
- **next/font** --- оптимизация шрифтов, встраивание при сборке, без layout shift
- **Переменные окружения** --- `NEXT_PUBLIC_` для публичных, без префикса для серверных секретов

---

> << [[nextjs/04-api-routes]] | [[nextjs-fundamentals]] | **Встроенные компоненты** | [[nextjs/06-shadcn]] >>
