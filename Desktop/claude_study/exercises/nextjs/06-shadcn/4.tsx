// ==================================================
// Задание 4: Темизация и кастомизация
// Уровень: 🟡 Средний
// Тема: CSS-переменные, темы, cva()
// Ссылка: notes/nextjs/06-shadcn.md — "Темизация", "cva"
// ==================================================
//
// 1. Покажи структуру CSS-переменных shadcn (globals.css):
//    :root { --background: 0 0% 100%; --foreground: 0 0% 3.9%; ... }
//    .dark { --background: 0 0% 3.9%; --foreground: 0 0% 98%; ... }
//
// 2. Создай компонент ThemeToggle (переключатель темы):
//    - Кнопка с иконками Sun/Moon
//    - Переключает класс "dark" на <html>
//
// 3. Используй cva() для создания компонента с вариантами:
//    import { cva, type VariantProps } from "class-variance-authority"
//
//    const badgeVariants = cva("inline-flex items-center rounded-full px-2 py-1 text-xs", {
//      variants: {
//        variant: {
//          default: "bg-primary text-primary-foreground",
//          success: "bg-green-100 text-green-800",
//          warning: "bg-yellow-100 text-yellow-800",
//          error: "bg-red-100 text-red-800",
//        }
//      },
//      defaultVariants: { variant: "default" }
//    })
//
// 4. Создай компонент Badge с использованием cva и cn.
//
// 5. Покажи использование: <Badge variant="success">Активен</Badge>
//
// Пиши код ниже:
// ==================================================
