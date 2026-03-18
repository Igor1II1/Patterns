// ==================================================
// Задание 1: Установка и базовые компоненты shadcn/ui
// Уровень: 🟢 Лёгкий
// Тема: Установка, Button, cn()
// Ссылка: notes/nextjs/06-shadcn.md — "Установка", "Button"
// ==================================================
//
// 1. Напиши команды установки shadcn/ui (в комментарии):
//    npx shadcn-ui@latest init
//    npx shadcn-ui@latest add button
//
// 2. Покажи использование Button с разными вариантами:
//    <Button variant="default">Отправить</Button>
//    <Button variant="destructive">Удалить</Button>
//    <Button variant="outline">Отмена</Button>
//    <Button variant="ghost">Подробнее</Button>
//    <Button size="sm">Маленькая</Button>
//    <Button size="lg">Большая</Button>
//
// 3. Покажи использование функции cn() для условных классов:
//    import { cn } from "@/lib/utils"
//    <div className={cn("base-class", isActive && "active", isError && "text-red-500")}>
//
// 4. Создай компонент StatusBadge:
//    - Принимает status: "online" | "offline" | "away"
//    - Использует cn() для разных цветов
//
// Пиши код ниже:
// ==================================================
