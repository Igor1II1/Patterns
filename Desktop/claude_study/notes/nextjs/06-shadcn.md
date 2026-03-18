# Глава 6. Shadcn/ui

> << [[nextjs/05-built-in]] | [[nextjs-fundamentals]] | **Shadcn/ui** |

---

## Зачем эта тема существует?

Создавать компоненты интерфейса с нуля --- кнопки, модалки, формы, выпадающие меню --- это сотни часов работы. Нужно думать о доступности (accessibility), анимациях, keyboard navigation, edge cases. Библиотеки компонентов решают эту проблему, но большинство из них (Material UI, Ant Design) навязывают свой стиль и тяжело кастомизируются.

Shadcn/ui --- другой подход. Это не npm-пакет, а **коллекция компонентов, которые копируются прямо в твой проект**. Ты получаешь исходный код, полностью его контролируешь и стилизуешь через Tailwind CSS. Это стандарт в современных Next.js-проектах.

---

## 1. Что такое Shadcn/ui

### Что это такое?

Shadcn/ui --- это набор переиспользуемых компонентов, построенных на:
- **Radix UI** --- "безголовая" (headless) библиотека с логикой и доступностью (модалки, меню, тултипы)
- **Tailwind CSS** --- стилизация через утилитарные классы
- **TypeScript** --- полная типизация

Ключевое отличие: компоненты не устанавливаются как пакет. Они **копируются** в папку `components/ui` твоего проекта. Ты владеешь кодом и можешь менять его как хочешь.

### Как это работает?

```
Обычная UI-библиотека:
  npm install some-ui → node_modules → обновления ломают код → сложно кастомизировать

Shadcn/ui:
  npx shadcn@latest add button → components/ui/button.tsx → твой код → полный контроль
```

### Установка

```bash
# 1. Создай Next.js проект (если нет)
npx create-next-app@latest my-app --typescript --tailwind --eslint

# 2. Инициализируй shadcn/ui
cd my-app
npx shadcn@latest init

# Ответь на вопросы:
# Style: Default или New York
# Base color: Slate, Gray, Zinc, Neutral, Stone
# CSS variables: Yes (рекомендуется)
```

После инициализации появятся:
```
components/
  ui/               ← сюда будут копироваться компоненты
lib/
  utils.ts           ← утилита cn() для работы с классами
components.json      ← конфигурация shadcn/ui
```

### Утилита cn()

```typescript
// lib/utils.ts --- создается автоматически
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// cn() объединяет классы и разрешает конфликты Tailwind
cn("px-4 py-2", "px-6")           // → "px-6 py-2" (px-6 заменяет px-4)
cn("text-red-500", false && "hidden") // → "text-red-500" (false игнорируется)
cn("rounded", className)          // → объединение с пользовательскими классами
```

### Мини-проверка

Чем Shadcn/ui отличается от обычных UI-библиотек вроде Material UI?

---

## 2. Добавление и использование компонентов

### Что это такое?

Каждый компонент добавляется отдельной командой. Файл копируется в `components/ui/`, и ты можешь его использовать и менять.

### Как это работает?

```bash
# Добавление компонентов
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog

# Добавить несколько сразу
npx shadcn@latest add button card input label textarea

# Посмотреть все доступные компоненты
npx shadcn@latest add
```

После `add button` появляется файл `components/ui/button.tsx`:

```typescript
// components/ui/button.tsx (упрощенная версия)
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Базовые стили (всегда применяются)
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ...компонент Button
```

### Использование

```typescript
import { Button } from "@/components/ui/button";

export default function MyPage() {
  return (
    <div className="space-y-4">
      {/* Варианты стиля */}
      <Button>По умолчанию</Button>
      <Button variant="secondary">Вторичная</Button>
      <Button variant="destructive">Удалить</Button>
      <Button variant="outline">Контурная</Button>
      <Button variant="ghost">Прозрачная</Button>
      <Button variant="link">Как ссылка</Button>

      {/* Размеры */}
      <Button size="sm">Маленькая</Button>
      <Button size="default">Обычная</Button>
      <Button size="lg">Большая</Button>

      {/* С иконкой */}
      <Button size="icon">X</Button>

      {/* Состояния */}
      <Button disabled>Заблокирована</Button>

      {/* Как ссылка (через asChild) */}
      <Button asChild>
        <a href="/about">Перейти</a>
      </Button>
    </div>
  );
}
```

### Мини-проверка

Куда копируются компоненты при выполнении `npx shadcn@latest add button`?

---

## 3. Кастомизация через Tailwind

### Что это такое?

Раз компоненты находятся в твоем проекте, ты можешь менять их стили как угодно. Shadcn/ui использует CSS-переменные для темизации и Tailwind-классы для стилей.

### Как это работает?

```typescript
// Способ 1: className при использовании (добавляет классы)
<Button className="w-full rounded-full">
  Кнопка на всю ширину
</Button>

<Button className="bg-green-600 hover:bg-green-700 text-white">
  Зеленая кнопка
</Button>

// Способ 2: изменение исходного файла компонента
// components/ui/button.tsx --- меняй варианты и стили как хочешь

// Способ 3: создание обертки с кастомными стилями
import { Button, ButtonProps } from "@/components/ui/button";

function PrimaryButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-8"
      {...props}
    >
      {children}
    </Button>
  );
}
```

### Добавление нового варианта

```typescript
// components/ui/button.tsx --- добавляем свой вариант
const buttonVariants = cva(
  "inline-flex items-center justify-center ...",
  {
    variants: {
      variant: {
        default: "bg-primary ...",
        destructive: "bg-destructive ...",
        // Твой новый вариант
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-500 text-black hover:bg-yellow-600",
      },
      // ...
    },
  }
);

// Использование
<Button variant="success">Сохранено</Button>
<Button variant="warning">Внимание</Button>
```

### Мини-проверка

Какие два способа кастомизации компонентов Shadcn/ui существуют?

---

## 4. Темизация (Theming)

### Что это такое?

Shadcn/ui использует CSS-переменные для цветов. Меняя переменные --- меняешь вид всех компонентов сразу. Поддержка светлой и темной темы из коробки.

### Как это работает?

```css
/* app/globals.css --- CSS-переменные определяют тему */
@layer base {
  :root {
    /* Светлая тема */
    --background: 0 0% 100%;        /* белый фон */
    --foreground: 222 84% 5%;       /* темный текст */
    --primary: 222 47% 11%;         /* основной цвет */
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --destructive: 0 84% 60%;       /* красный для ошибок/удаления */
    --border: 214 32% 91%;
    --ring: 222 84% 5%;
    --radius: 0.5rem;               /* скругление углов */
  }

  .dark {
    /* Темная тема */
    --background: 222 84% 5%;       /* темный фон */
    --foreground: 210 40% 98%;      /* светлый текст */
    --primary: 210 40% 98%;
    --primary-foreground: 222 47% 11%;
    --secondary: 217 33% 17%;
    --destructive: 0 63% 31%;
    --border: 217 33% 17%;
    --ring: 212 100% 67%;
  }
}
```

### Переключение темы

```typescript
// Установи next-themes
// npm install next-themes

// app/providers.tsx
"use client";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}

// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// Компонент переключения темы
"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "Светлая тема" : "Темная тема"}
    </Button>
  );
}
```

### Мини-проверка

Как Shadcn/ui реализует поддержку светлой и темной темы?

---

## 5. Часто используемые компоненты

### Card --- карточка

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// npx shadcn@latest add card

export function ProductCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>MacBook Pro</CardTitle>
        <CardDescription>Ноутбук для разработчиков</CardDescription>
      </CardHeader>
      <CardContent>
        <p>16 ГБ RAM, 512 ГБ SSD, чип M3</p>
        <p className="text-2xl font-bold mt-2">199 990 руб.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">В избранное</Button>
        <Button>В корзину</Button>
      </CardFooter>
    </Card>
  );
}
```

### Dialog --- модальное окно

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// npx shadcn@latest add dialog input label

export function EditProfileDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Редактировать профиль</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактирование профиля</DialogTitle>
          <DialogDescription>
            Измените данные и нажмите "Сохранить".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Имя</Label>
            <Input id="name" defaultValue="Игорь" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" defaultValue="igor@test.com" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button type="submit">Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Form --- формы с валидацией

```typescript
// Shadcn/ui формы работают с react-hook-form + zod
// npm install react-hook-form @hookform/resolvers zod
// npx shadcn@latest add form input

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Схема валидации
const formSchema = z.object({
  username: z.string().min(2, "Минимум 2 символа").max(50, "Максимум 50 символов"),
  email: z.string().email("Некорректный email"),
});

type FormValues = z.infer<typeof formSchema>;

export function RegistrationForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    // Отправка данных на сервер
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <Input placeholder="igor_dev" {...field} />
              </FormControl>
              <FormDescription>Ваше публичное имя.</FormDescription>
              <FormMessage /> {/* Сообщение об ошибке */}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="igor@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Зарегистрироваться</Button>
      </form>
    </Form>
  );
}
```

### Плохой и хороший пример

```typescript
// Плохо --- модалка с нуля (много кода, нет accessibility)
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50" onClick={onClose}>
      <div className="bg-white p-4" onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>X</button>
      </div>
    </div>
  );
  // Нет: focus trap, ESC закрытие, aria-атрибуты, анимация
}

// Хорошо --- shadcn/ui Dialog (accessibility, анимация, keyboard навигация)
<Dialog>
  <DialogTrigger asChild>
    <Button>Открыть</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Заголовок</DialogTitle>
    </DialogHeader>
    <p>Содержимое модалки</p>
  </DialogContent>
</Dialog>
```

### Частые заблуждения

- "Shadcn/ui --- это готовый дизайн-система". Нет, это набор компонентов-заготовок. Дизайн ты определяешь сам через Tailwind и CSS-переменные.
- "Обновить компоненты можно через npm update". Нет, компоненты --- это файлы в твоем проекте. Для обновления нужно заново запустить `npx shadcn@latest add` (перезапишет файл).

### Мини-проверка

Какие три технологии лежат в основе Shadcn/ui?

---

## Итог

Shadcn/ui --- это не библиотека, а коллекция компонентов, которые ты копируешь в свой проект. Полный контроль, полная кастомизация, accessibility из коробки.

**Ключевые идеи главы:**

- **Shadcn/ui** --- компоненты копируются в проект (`components/ui/`), а не устанавливаются как пакет
- **Основа:** Radix UI (логика, accessibility) + Tailwind CSS (стили) + TypeScript (типы)
- **cn()** --- утилита для объединения Tailwind-классов без конфликтов
- **Варианты** (`variant`, `size`) --- встроенная система стилей через `cva`
- **Темизация** --- CSS-переменные для цветов, поддержка светлой/темной темы
- **Ключевые компоненты:** Button, Card, Dialog, Form, Input, Label
- **Формы:** интеграция с react-hook-form + zod для валидации

---

> << [[nextjs/05-built-in]] | [[nextjs-fundamentals]] | **Shadcn/ui** |
