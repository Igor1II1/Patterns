// ==================================================
// Задание 4: ISR — Incremental Static Regeneration
// Уровень: 🟡 Средний
// Тема: revalidate, on-demand revalidation
// Ссылка: notes/nextjs/03-ssr-ssg.md — "ISR"
// ==================================================
//
// 1. Напиши страницу NewsPage с ISR:
//    - fetch с { next: { revalidate: 60 } } — обновление каждые 60 секунд
//    - Или export const revalidate = 60 на уровне страницы
//    - Страница статическая, но обновляется каждую минуту
//
// 2. Напиши страницу ProductPage с ISR:
//    - revalidate: 3600 (раз в час)
//    - Загружает товар по id
//    - generateStaticParams для популярных товаров
//
// 3. Напиши API-маршрут для on-demand revalidation:
//    // app/api/revalidate/route.ts
//    import { revalidatePath } from "next/cache"
//    // POST /api/revalidate — принудительно обновляет страницу
//
// 4. Напиши в комментарии:
//    - Что такое ISR и чем отличается от SSG и SSR?
//    - Что значит revalidate: 60?
//    - Когда ISR лучше SSR? (много страниц, данные обновляются, но не каждую секунду)
//
// Пиши код ниже:
// ==================================================
