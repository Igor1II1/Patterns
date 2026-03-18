# Глава 4. API Routes (Route Handlers)

> << [[nextjs/03-ssr-ssg]] | [[nextjs-fundamentals]] | **API Routes** | [[nextjs/05-built-in]] >>

---

## Зачем эта тема существует?

Веб-приложению нужен бэкенд: обработка форм, аутентификация, работа с базой данных, интеграция с внешними сервисами. Обычно для этого создают отдельный сервер на Express, Fastify или другом фреймворке. Next.js позволяет создавать API-эндпоинты **прямо в проекте** --- без отдельного сервера. Один проект, один деплой, фронтенд и бэкенд вместе.

---

## 1. Что такое Route Handlers

### Что это такое?

Route Handler --- это файл `route.ts` внутри папки `app/api/`, который обрабатывает HTTP-запросы. Каждый экспортированный метод (GET, POST, PUT, DELETE) обрабатывает соответствующий HTTP-метод.

### Как это работает?

```typescript
// app/api/hello/route.ts
// URL: GET /api/hello

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Привет, мир!" });
}

// Результат запроса GET /api/hello:
// { "message": "Привет, мир!" }
```

### Структура файлов

```
app/
  api/
    hello/
      route.ts          → GET/POST /api/hello
    users/
      route.ts          → GET/POST /api/users
      [id]/
        route.ts        → GET/PUT/DELETE /api/users/123
    auth/
      login/
        route.ts        → POST /api/auth/login
```

Важно: файл `route.ts` и `page.tsx` **не могут** находиться в одной папке. Папка --- либо страница, либо API-эндпоинт.

### Мини-проверка

Какой URL будет у файла `app/api/products/route.ts`?

---

## 2. GET --- получение данных

### Что это такое?

GET-запросы используются для получения данных. Не изменяют состояние на сервере.

### Как это работает?

```typescript
// app/api/users/route.ts
import { NextResponse } from "next/server";

interface User {
  id: number;
  name: string;
  email: string;
}

// Имитация базы данных
const users: User[] = [
  { id: 1, name: "Игорь", email: "igor@test.com" },
  { id: 2, name: "Аня", email: "anna@test.com" },
  { id: 3, name: "Борис", email: "boris@test.com" },
];

export async function GET() {
  return NextResponse.json(users);
}

// GET с параметрами запроса (query params)
// URL: /api/users?role=admin&page=2

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get("role");  // "admin"
  const page = searchParams.get("page");  // "2"

  // Фильтрация и пагинация
  let filtered = users;
  if (role) {
    filtered = filtered.filter(u => u.role === role);
  }

  return NextResponse.json({
    data: filtered,
    page: Number(page) || 1,
    total: filtered.length
  });
}
```

### GET с динамическим параметром

```typescript
// app/api/users/[id]/route.ts
// URL: GET /api/users/1

import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const userId = Number(id);

  const user = users.find(u => u.id === userId);

  if (!user) {
    return NextResponse.json(
      { error: "Пользователь не найден" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}
```

### Мини-проверка

Как получить query-параметр из URL в Route Handler?

---

## 3. POST --- создание данных

### Что это такое?

POST-запросы используются для создания новых ресурсов. Тело запроса содержит данные для создания.

### Как это работает?

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Читаем тело запроса
  const body = await request.json();

  // Валидация
  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: "Имя и email обязательны" },
      { status: 400 }
    );
  }

  // Создание пользователя (в реальности --- запись в БД)
  const newUser = {
    id: Date.now(),
    name: body.name,
    email: body.email
  };

  return NextResponse.json(newUser, { status: 201 }); // 201 Created
}

// Пример запроса из клиента
// fetch("/api/users", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ name: "Новый", email: "new@test.com" })
// })
```

### Обработка FormData

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const file = formData.get("avatar") as File;

  if (!file) {
    return NextResponse.json({ error: "Файл не загружен" }, { status: 400 });
  }

  // Обработка файла
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Сохранение файла (пример)
  // await writeFile(`./public/uploads/${file.name}`, buffer);

  return NextResponse.json({
    message: "Файл загружен",
    fileName: file.name,
    size: file.size
  });
}
```

### Мини-проверка

Какой HTTP-статус возвращается при успешном создании ресурса?

---

## 4. PUT и DELETE --- обновление и удаление

### Что это такое?

PUT --- обновление существующего ресурса. DELETE --- удаление ресурса.

### Как это работает?

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT --- обновление пользователя
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const userId = Number(id);
  const body = await request.json();

  // Проверяем, существует ли пользователь
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return NextResponse.json(
      { error: "Пользователь не найден" },
      { status: 404 }
    );
  }

  // Обновляем
  users[userIndex] = { ...users[userIndex], ...body };

  return NextResponse.json(users[userIndex]);
}

// DELETE --- удаление пользователя
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const userId = Number(id);

  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return NextResponse.json(
      { error: "Пользователь не найден" },
      { status: 404 }
    );
  }

  users.splice(userIndex, 1);

  return NextResponse.json(
    { message: "Пользователь удален" },
    { status: 200 }
  );
}

// PATCH --- частичное обновление (альтернатива PUT)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const userId = Number(id);
  const body = await request.json();

  const user = users.find(u => u.id === userId);
  if (!user) {
    return NextResponse.json({ error: "Не найден" }, { status: 404 });
  }

  // Обновляем только переданные поля
  Object.assign(user, body);

  return NextResponse.json(user);
}
```

### Плохой и хороший пример

```typescript
// Плохо --- нет проверки ошибок, нет правильных статусов
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  deleteUser(Number(id));
  return NextResponse.json({ ok: true });
}

// Хорошо --- проверка существования, правильные статусы, понятные сообщения
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const userId = Number(id);

  if (isNaN(userId)) {
    return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });
  }

  const user = await findUser(userId);
  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }

  await deleteUser(userId);
  return NextResponse.json({ message: `Пользователь ${userId} удален` });
}
```

### Мини-проверка

Чем PUT отличается от PATCH?

---

## 5. Request и Response

### Что это такое?

Next.js использует стандартные Web API: `Request` (расширенный до `NextRequest`) и `Response` (расширенный до `NextResponse`).

### Как это работает?

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // --- NextRequest: чтение запроса ---

  // URL и параметры
  const url = request.nextUrl;              // URL объект
  const path = url.pathname;                // "/api/users"
  const query = url.searchParams.get("q");  // значение параметра ?q=

  // Заголовки
  const contentType = request.headers.get("content-type");
  const authToken = request.headers.get("authorization");

  // Cookies
  const session = request.cookies.get("session")?.value;

  // --- NextResponse: формирование ответа ---

  // JSON-ответ
  return NextResponse.json(
    { data: "значение" },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Custom-Header": "значение"
      }
    }
  );
}

// Редирект
export async function GET() {
  return NextResponse.redirect(new URL("/login", request.url));
}

// Ответ без тела
export async function DELETE() {
  // 204 No Content --- успешное удаление без тела ответа
  return new NextResponse(null, { status: 204 });
}
```

### Установка cookies в ответе

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Проверка логина...
  const token = generateToken(body.email);

  const response = NextResponse.json({ success: true });

  response.cookies.set("session", token, {
    httpOnly: true,       // недоступен из JavaScript
    secure: true,         // только HTTPS
    sameSite: "lax",      // защита от CSRF
    maxAge: 60 * 60 * 24  // 24 часа
  });

  return response;
}
```

### Мини-проверка

Как установить cookie в ответе Route Handler?

---

## 6. Middleware

### Что это такое?

Middleware --- функция, которая выполняется **перед** каждым запросом (до Route Handlers и страниц). Используется для аутентификации, редиректов, логирования.

### Как это работает?

```typescript
// middleware.ts --- файл в КОРНЕ проекта (рядом с app/)
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Пример: защита маршрутов --- проверка аутентификации
  const isAuthenticated = request.cookies.has("session");

  if (path.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Пример: логирование
  console.log(`[${new Date().toISOString()}] ${request.method} ${path}`);

  // Пропустить запрос дальше
  return NextResponse.next();
}

// Указываем, для каких путей работает middleware
export const config = {
  matcher: [
    "/dashboard/:path*",   // все пути начинающиеся с /dashboard
    "/api/admin/:path*",   // все админские API
    // Не включаем: /api/auth, /_next, статические файлы
  ]
};
```

### Добавление заголовков через middleware

```typescript
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Добавить заголовки безопасности ко всем ответам
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Добавить информацию о стране (для геолокации)
  const country = request.geo?.country || "unknown";
  response.headers.set("X-User-Country", country);

  return response;
}
```

### Частые заблуждения

- "Middleware может обращаться к базе данных". Middleware работает в Edge Runtime, который имеет ограничения. Тяжелые операции лучше делать в Route Handlers.
- "Middleware нужен для каждого API-маршрута". Нет, для логики конкретного эндпоинта используй проверки внутри Route Handler.

### Мини-проверка

Где должен находиться файл `middleware.ts`?

---

## 7. Основы ограничения запросов (Rate Limiting)

### Что это такое?

Rate limiting --- ограничение количества запросов от одного пользователя за период времени. Защищает API от злоупотреблений.

### Как это работает?

```typescript
// Простой rate limiter на основе Map (для учебных целей)
// В продакшене используй Redis или специализированные сервисы

const rateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true; // разрешено
  }

  if (record.count >= limit) {
    return false; // лимит превышен
  }

  record.count++;
  return true; // разрешено
}

// Использование в Route Handler
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  // Максимум 10 запросов в минуту
  if (!checkRateLimit(ip, 10, 60 * 1000)) {
    return NextResponse.json(
      { error: "Слишком много запросов. Попробуйте позже." },
      { status: 429 } // 429 Too Many Requests
    );
  }

  // Обработка запроса...
  return NextResponse.json({ success: true });
}
```

### Мини-проверка

Какой HTTP-статус возвращается при превышении лимита запросов?

---

## Итог

Route Handlers --- это бэкенд внутри Next.js-приложения. Файл `route.ts` с экспортированными HTTP-методами --- и API готов.

**Ключевые идеи главы:**

- **route.ts** --- файл API-эндпоинта, экспортирует функции GET, POST, PUT, DELETE
- **NextRequest** --- чтение URL, заголовков, cookies, тела запроса
- **NextResponse** --- формирование ответа (JSON, статус, заголовки, cookies)
- **Динамические параметры** --- `[id]` в пути, доступ через `params`
- **Middleware** --- выполняется перед запросами, файл в корне проекта
- **Rate limiting** --- ограничение количества запросов (статус 429)
- **HTTP-статусы:** 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 404 (Not Found), 429 (Too Many Requests)

---

> << [[nextjs/03-ssr-ssg]] | [[nextjs-fundamentals]] | **API Routes** | [[nextjs/05-built-in]] >>
