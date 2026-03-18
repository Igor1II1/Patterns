# Архитектура проекта: планирование перед кодом

> [[devops/02-frontend|Следующая глава: Frontend-разработка -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]

---

## Зачем эта тема существует?

Начинающие разработчики часто сразу открывают редактор и начинают писать код. Через неделю проект превращается в хаос: непонятная структура, запутанные связи, переделки на каждом шагу. Планирование архитектуры до написания кода экономит десятки часов. Это как чертеж дома: строить без него можно, но результат будет печальный.

---

## Схема базы данных (Database Schema Design)

### Что это такое?

Проектирование БД — первый шаг в создании приложения. Ты определяешь, какие данные хранить, как они связаны, и какие ограничения наложить.

### Как работает?

Пример: приложение "Доска задач" (как Trello).

```
Сущности:
- Пользователь (User) — кто пользуется приложением
- Доска (Board) — набор колонок с задачами
- Колонка (Column) — "To Do", "In Progress", "Done"
- Задача (Task) — конкретная задача
- Комментарий (Comment) — обсуждение задачи
```

### Шаг 1: Определи сущности и поля

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  avatar    String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())

  boards    Board[]
  tasks     Task[]      // задачи, назначенные пользователю
  comments  Comment[]
}

enum Role {
  USER
  ADMIN
}
```

### Шаг 2: Определи связи

```
User --1:N--> Board    (пользователь владеет досками)
Board --1:N--> Column  (доска содержит колонки)
Column --1:N--> Task   (колонка содержит задачи)
Task --1:N--> Comment  (задача имеет комментарии)
User --1:N--> Task     (пользователю назначены задачи)
User --1:N--> Comment  (пользователь пишет комментарии)
```

```prisma
model Board {
  id        String   @id @default(cuid())
  title     String
  owner     User     @relation(fields: [ownerId], references: [id])
  ownerId   String
  columns   Column[]
  createdAt DateTime @default(now())
}

model Column {
  id       String @id @default(cuid())
  title    String
  order    Int    // порядок колонки на доске
  board    Board  @relation(fields: [boardId], references: [id], onDelete: Cascade)
  boardId  String
  tasks    Task[]
}

model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  priority    Priority  @default(MEDIUM)
  order       Int       // порядок задачи в колонке
  column      Column    @relation(fields: [columnId], references: [id], onDelete: Cascade)
  columnId    String
  assignee    User?     @relation(fields: [assigneeId], references: [id])
  assigneeId  String?
  comments    Comment[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

model Comment {
  id        String   @id @default(cuid())
  text      String
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  taskId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
}
```

### Шаг 3: Проверь нормализацию

Нормализация — устранение дублирования данных:

```
Плохо (денормализовано):
Task: { title, assigneeName, assigneeEmail }
-- Если пользователь сменит имя, нужно обновить все его задачи

Хорошо (нормализовано):
Task: { title, assigneeId }  -->  User: { name, email }
-- Имя хранится в одном месте
```

### Частые заблуждения

- "Можно спроектировать БД позже" — можно, но переделывать связи в работающем приложении мучительно. Потрать 30 минут на схему сейчас.
- "Чем больше таблиц, тем лучше" — нет, таблица нужна только для сущности с собственным жизненным циклом. Не делай таблицу для каждого поля.

### Мини-проверка

1. С чего начинается проектирование БД?
2. Что такое нормализация?
3. Как определить, нужна ли отдельная таблица для данных?

---

## Проектирование API

### Что это такое?

API Design — определение эндпоинтов, методов, форматов запросов и ответов до написания кода.

### Как работает?

```
REST API для доски задач:

BOARDS
  GET    /api/boards          — список досок пользователя
  POST   /api/boards          — создать доску
  GET    /api/boards/:id      — одна доска (с колонками и задачами)
  PUT    /api/boards/:id      — обновить доску
  DELETE /api/boards/:id      — удалить доску

COLUMNS
  POST   /api/boards/:boardId/columns        — добавить колонку
  PUT    /api/columns/:id                     — обновить колонку
  DELETE /api/columns/:id                     — удалить колонку
  PATCH  /api/columns/reorder                 — изменить порядок

TASKS
  POST   /api/columns/:columnId/tasks         — создать задачу
  GET    /api/tasks/:id                        — одна задача
  PUT    /api/tasks/:id                        — обновить задачу
  DELETE /api/tasks/:id                        — удалить задачу
  PATCH  /api/tasks/:id/move                   — переместить в другую колонку

COMMENTS
  GET    /api/tasks/:taskId/comments           — комментарии задачи
  POST   /api/tasks/:taskId/comments           — добавить комментарий
  DELETE /api/comments/:id                     — удалить комментарий
```

### Правила хорошего API

```
1. URL описывает ресурс (существительное), не действие
   Хорошо:  POST /api/boards
   Плохо:   POST /api/createBoard

2. HTTP-метод описывает действие
   GET    — получить
   POST   — создать
   PUT    — обновить (полностью)
   PATCH  — обновить (частично)
   DELETE — удалить

3. Вложенность не глубже 2 уровней
   Хорошо:  /api/boards/:id/columns
   Плохо:   /api/boards/:id/columns/:id/tasks/:id/comments

4. Ответ всегда имеет предсказуемую структуру
   Успех:  { data: {...} }
   Список: { data: [...], pagination: {...} }
   Ошибка: { error: "Сообщение", code: "ERROR_CODE" }
```

### Документирование API

```typescript
// Описание эндпоинта (для себя и команды)
/**
 * POST /api/boards
 *
 * Создает новую доску.
 *
 * Требует авторизации: Да
 *
 * Body:
 *   { title: string }
 *
 * Response 201:
 *   { data: { id, title, ownerId, createdAt } }
 *
 * Errors:
 *   401 — Не авторизован
 *   422 — Невалидные данные
 */
```

### Частые заблуждения

- "REST — единственный вариант" — нет, есть GraphQL, tRPC, gRPC. Но REST — самый понятный для начала.

### Мини-проверка

1. Какой HTTP-метод для создания ресурса?
2. Почему URL не должен содержать глаголы?
3. Какая максимальная глубина вложенности URL?

---

## Планирование компонентов (Component Tree)

### Что это такое?

Component Tree — дерево React-компонентов. Планирование помогает понять, какие компоненты нужны, как они вложены, какие данные им нужны.

### Как работает?

```
Доска задач — дерево компонентов:

App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu (avatar, signOut)
│   └── Main
│       └── {children}
├── BoardsPage (список досок)
│   ├── BoardCard (карточка доски)
│   └── CreateBoardButton
├── BoardPage (одна доска)
│   ├── BoardHeader (название, настройки)
│   ├── ColumnList
│   │   └── Column
│   │       ├── ColumnHeader (название, меню)
│   │       ├── TaskList
│   │       │   └── TaskCard (превью задачи)
│   │       └── AddTaskButton
│   └── AddColumnButton
├── TaskModal (модалка задачи)
│   ├── TaskTitle
│   ├── TaskDescription
│   ├── TaskPriority
│   ├── TaskAssignee
│   └── CommentSection
│       ├── CommentList
│       │   └── Comment
│       └── CommentForm
```

### Определи пропсы

```typescript
// Для каждого компонента определи: какие данные ему нужны?

interface BoardCardProps {
  id: string
  title: string
  taskCount: number
  updatedAt: Date
}

interface ColumnProps {
  id: string
  title: string
  tasks: Task[]
  onAddTask: (title: string) => void
  onTaskMove: (taskId: string, targetColumnId: string) => void
}

interface TaskCardProps {
  id: string
  title: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  assignee?: { name: string; avatar?: string }
  commentCount: number
  onClick: () => void
}
```

### Частые заблуждения

- "Планировать компоненты — лишняя трата времени" — нет, это экономит время. Без плана ты создаешь компоненты хаотично, потом переделываешь половину.
- "Каждый элемент — отдельный компонент" — нет, выделяй компонент когда он переиспользуется или когда логика становится сложной.

---

## Структура папок проекта

### Как работает?

```
my-app/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Группа маршрутов (без авторизации)
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/            # Группа (с авторизацией)
│   │   ├── layout.tsx          # Общий layout с sidebar
│   │   ├── boards/page.tsx
│   │   └── boards/[id]/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── boards/route.ts
│   │   └── boards/[id]/route.ts
│   ├── layout.tsx              # Корневой layout
│   └── page.tsx                # Главная страница
├── components/
│   ├── ui/                     # Базовые UI-компоненты
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── boards/                 # Компоненты досок
│   │   ├── BoardCard.tsx
│   │   └── BoardList.tsx
│   └── tasks/                  # Компоненты задач
│       ├── TaskCard.tsx
│       └── TaskModal.tsx
├── lib/                        # Утилиты и конфигурация
│   ├── prisma.ts
│   ├── auth.ts
│   └── validations/
│       └── board.ts
├── hooks/                      # Кастомные хуки
│   └── useBoards.ts
├── types/                      # TypeScript типы
│   └── index.ts
├── prisma/
│   └── schema.prisma
└── public/                     # Статические файлы
```

### Мини-проверка

1. Зачем нужны группы маршрутов `(auth)` и `(dashboard)`?
2. Куда положить компонент Button, используемый везде?
3. Где хранить Zod-схемы валидации?

---

## Итог

Планирование проекта включает три этапа:

| Этап | Что делаем | Результат |
|------|-----------|-----------|
| 1. БД | Определяем сущности, связи, поля | Prisma Schema |
| 2. API | Определяем эндпоинты, методы, форматы | Список маршрутов |
| 3. Компоненты | Рисуем дерево, определяем пропсы | Component Tree |

Потрать 1-2 часа на планирование — сэкономишь 10+ часов на переделках.

---

> [[devops/02-frontend|Следующая глава: Frontend-разработка -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]
