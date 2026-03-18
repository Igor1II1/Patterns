# Мониторинг: логирование и отслеживание ошибок

> [[devops/08-cicd|<-- Предыдущая: CI/CD]] | [[devops/10-portfolio|Следующая: Портфолио -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]

---

## Зачем эта тема существует?

Задеплоил приложение и забыл? Через неделю пользователи жалуются на ошибки, а ты даже не знаешь о них. Мониторинг — это глаза и уши твоего приложения на продакшне. Он сообщает об ошибках до того, как пожалуются пользователи, показывает производительность и помогает найти причину проблем.

---

## Логирование

### Что это такое?

Логирование — запись событий, происходящих в приложении: запросы, ошибки, действия пользователей. Логи — первое место, куда ты смотришь при отладке проблемы на продакшне.

### Как работает?

```typescript
// lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const CURRENT_LEVEL = process.env.LOG_LEVEL || 'info'

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[CURRENT_LEVEL as LogLevel]
}

function formatMessage(level: LogLevel, message: string, data?: any): string {
  const timestamp = new Date().toISOString()
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`
  return data ? `${base} ${JSON.stringify(data)}` : base
}

export const logger = {
  debug: (message: string, data?: any) => {
    if (shouldLog('debug')) console.debug(formatMessage('debug', message, data))
  },
  info: (message: string, data?: any) => {
    if (shouldLog('info')) console.log(formatMessage('info', message, data))
  },
  warn: (message: string, data?: any) => {
    if (shouldLog('warn')) console.warn(formatMessage('warn', message, data))
  },
  error: (message: string, data?: any) => {
    if (shouldLog('error')) console.error(formatMessage('error', message, data))
  },
}
```

```typescript
// Использование в API Route
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    logger.info('POST /api/users', { email: body.email })

    const user = await prisma.user.create({
      data: { email: body.email, name: body.name },
    })

    const duration = Date.now() - startTime
    logger.info('User created', { userId: user.id, duration: `${duration}ms` })

    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    const duration = Date.now() - startTime
    logger.error('Failed to create user', {
      error: error.message,
      code: error.code,
      duration: `${duration}ms`,
    })

    return NextResponse.json({ error: 'Ошибка' }, { status: 500 })
  }
}
```

### Что логировать

```typescript
// ДА — логируй это:
logger.info('User logged in', { userId: user.id })
logger.info('Order created', { orderId: order.id, total: order.total })
logger.warn('Rate limit approaching', { ip, requests: count })
logger.error('Database connection failed', { error: err.message })
logger.error('Payment failed', { orderId, error: err.message })

// НЕТ — не логируй это:
logger.info('Password: 12345')           // Пароли!
logger.info('Token: eyJhbGciOiJI...')    // Токены!
logger.info('Card: 4111111111111111')    // Номера карт!
logger.debug('Entered function foo')      // Шум без пользы
```

### Частые заблуждения

- "console.log достаточно" — для разработки да, для продакшна нет. Нужны уровни, форматирование, структурированные данные.
- "Логи нужно читать руками" — для маленьких проектов да. Для больших — нужны инструменты поиска по логам (Vercel Dashboard, Datadog, ELK).

### Мини-проверка

1. Какие четыре уровня логирования ты знаешь?
2. Что нельзя писать в логи?
3. Зачем логировать время выполнения запроса?

---

## Sentry — отслеживание ошибок

### Что это такое?

Sentry — сервис для автоматического отслеживания ошибок в приложении. Когда происходит ошибка, Sentry собирает контекст (стек вызовов, данные пользователя, версия браузера) и отправляет уведомление.

### Как работает?

```bash
npx @sentry/wizard@latest -i nextjs
# Wizard автоматически:
# - установит пакеты
# - создаст sentry.client.config.ts
# - создаст sentry.server.config.ts
# - настроит next.config.js
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Процент транзакций для мониторинга производительности
  tracesSampleRate: 1.0,  // 100% в разработке, 10-20% на продакшне

  // Не отправлять в режиме разработки
  enabled: process.env.NODE_ENV === 'production',
})
```

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,  // 10% транзакций
  enabled: process.env.NODE_ENV === 'production',
})
```

### Ручной отлов ошибок

```typescript
import * as Sentry from '@sentry/nextjs'

export async function POST(request: NextRequest) {
  try {
    // ...
  } catch (error) {
    // Отправить ошибку в Sentry с дополнительным контекстом
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/users',
        method: 'POST',
      },
      extra: {
        requestBody: await request.clone().json(),
      },
      user: {
        email: session?.user?.email,
      },
    })

    return NextResponse.json({ error: 'Ошибка' }, { status: 500 })
  }
}
```

### Что дает Sentry

```
1. Автоматический сбор ошибок — не нужно ловить каждую вручную
2. Группировка — похожие ошибки объединяются
3. Контекст — стек вызовов, данные пользователя, браузер
4. Уведомления — email, Slack, Telegram при новых ошибках
5. Тренды — "эта ошибка появилась после деплоя X"
6. Source Maps — показывает ошибку в исходном коде, не в минифицированном
```

### Частые заблуждения

- "Sentry ловит все ошибки автоматически" — необработанные исключения да, но try/catch-ошибки нужно отправлять вручную через captureException.
- "Sentry бесплатен" — бесплатный план: 5000 событий/месяц. Для учебного проекта хватит.

### Мини-проверка

1. Что такое DSN в Sentry?
2. Зачем уменьшать tracesSampleRate на продакшне?
3. Чем Sentry лучше обычного console.error?

---

## Мониторинг производительности

### Что это такое?

Мониторинг производительности показывает, как быстро работает приложение: время загрузки страниц, время ответа API, узкие места.

### Как работает?

```typescript
// Простой мониторинг времени API
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const start = Date.now()

  const response = NextResponse.next()

  // Добавляем заголовок с временем обработки
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`)

  return response
}

export const config = {
  matcher: '/api/:path*',
}
```

### Web Vitals (клиентская производительность)

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />        {/* Аналитика посещений */}
        <SpeedInsights />     {/* Мониторинг производительности */}
      </body>
    </html>
  )
}
```

### Ключевые метрики

```
Frontend (Web Vitals):
- LCP (Largest Contentful Paint) — время загрузки главного контента
  Хорошо: < 2.5 сек, Плохо: > 4 сек

- FID (First Input Delay) — время до реакции на первое действие
  Хорошо: < 100 мс, Плохо: > 300 мс

- CLS (Cumulative Layout Shift) — прыганье элементов при загрузке
  Хорошо: < 0.1, Плохо: > 0.25

Backend:
- Response Time — время ответа API
  Хорошо: < 200 мс, Приемлемо: < 1 сек, Плохо: > 3 сек

- Error Rate — процент ошибок
  Хорошо: < 1%, Плохо: > 5%

- Uptime — время без падений
  Хорошо: > 99.9% (8.7 ч простоя в год)
```

---

## Healthcheck эндпоинт

### Что это такое?

Healthcheck — специальный эндпоинт, который сообщает, работает ли приложение и его зависимости (база данных, Redis).

### Как работает?

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const health: Record<string, string> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }

  // Проверка базы данных
  try {
    await prisma.$queryRaw`SELECT 1`
    health.database = 'connected'
  } catch {
    health.database = 'disconnected'
    health.status = 'degraded'
  }

  const statusCode = health.status === 'ok' ? 200 : 503

  return NextResponse.json(health, { status: statusCode })
}
```

```json
// GET /api/health — все хорошо
{
  "status": "ok",
  "timestamp": "2026-03-07T10:00:00.000Z",
  "database": "connected"
}

// GET /api/health — проблема с БД
{
  "status": "degraded",
  "timestamp": "2026-03-07T10:00:00.000Z",
  "database": "disconnected"
}
```

### Использование в Docker

```yaml
# docker-compose.yml
services:
  app:
    build: .
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/api/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Внешний мониторинг

```
Бесплатные сервисы для мониторинга uptime:
- UptimeRobot (50 мониторов бесплатно)
- Better Stack (бесплатный план)

Настройка:
1. Регистрация на uptimerobot.com
2. Add New Monitor -> HTTP(s)
3. URL: https://myapp.com/api/health
4. Interval: 5 minutes
5. Alert Contacts: твой email / Telegram
```

### Частые заблуждения

- "Если сайт открывается — все работает" — нет, база данных может быть недоступна, а главная страница кешируется.
- "Мониторинг нужен только крупным компаниям" — даже для пет-проекта полезно знать, что он упал.

### Мини-проверка

1. Что возвращает healthcheck-эндпоинт?
2. Какой HTTP-код при проблемах — 200 или 503?
3. Зачем мониторить uptime внешним сервисом?

---

## Итог

| Инструмент | Что делает | Бесплатный план |
|-----------|-----------|----------------|
| Logger | Запись событий в приложении | Встроенный |
| Sentry | Отслеживание ошибок | 5000 событий/мес |
| Vercel Analytics | Аналитика посещений | Бесплатно |
| Vercel Speed Insights | Web Vitals | Бесплатно |
| UptimeRobot | Мониторинг доступности | 50 мониторов |
| Healthcheck | Проверка состояния сервисов | Встроенный |

Минимальный мониторинг для любого проекта:
1. Структурированное логирование (logger)
2. Sentry для ошибок
3. Healthcheck-эндпоинт
4. UptimeRobot для внешнего мониторинга

---

> [[devops/08-cicd|<-- Предыдущая: CI/CD]] | [[devops/10-portfolio|Следующая: Портфолио -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]
