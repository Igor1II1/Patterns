// ==================================================
// Задание 3: Динамические маршруты [slug]
// Уровень: 🟡 Средний
// Тема: [id], [slug], params в динамических роутах
// Ссылка: notes/nextjs/01-app-router.md — "Динамические маршруты"
// ==================================================
//
// 1. Напиши app/blog/[slug]/page.tsx:
//    - Принимает { params }: { params: { slug: string } }
//    - Выводит "Пост: {slug}"
//    URL: /blog/my-first-post → slug = "my-first-post"
//
// 2. Напиши app/users/[id]/page.tsx:
//    - Принимает params.id
//    - Выводит "Профиль пользователя #{id}"
//
// 3. Напиши app/shop/[category]/[productId]/page.tsx:
//    - Вложенные динамические сегменты
//    - Принимает params.category и params.productId
//    - URL: /shop/electronics/123
//
// 4. Напиши app/docs/[...slug]/page.tsx (catch-all):
//    - params.slug — массив строк
//    - URL: /docs/react/hooks/useState → slug = ["react", "hooks", "useState"]
//    - Выведи "хлебные крошки": React > Hooks > useState
//
// Пиши код ниже:
// ==================================================
