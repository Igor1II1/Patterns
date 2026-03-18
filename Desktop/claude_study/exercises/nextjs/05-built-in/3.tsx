// ==================================================
// Задание 3: Metadata API и SEO
// Уровень: 🟡 Средний
// Тема: metadata, generateMetadata, Open Graph
// Ссылка: notes/nextjs/05-built-in.md — "Metadata API"
// ==================================================
//
// 1. Напиши статический metadata для главной страницы:
//    export const metadata: Metadata = {
//      title: "Мой сайт",
//      description: "Описание сайта",
//    }
//
// 2. Напиши metadata с шаблоном title в layout.tsx:
//    title: { default: "Мой сайт", template: "%s | Мой сайт" }
//    Теперь title: "Блог" на странице → "Блог | Мой сайт" в браузере.
//
// 3. Напиши динамический generateMetadata для /blog/[slug]:
//    export async function generateMetadata({ params }): Promise<Metadata> {
//      const post = await getPost(params.slug)
//      return {
//        title: post.title,
//        description: post.excerpt,
//        openGraph: { title: post.title, images: [post.image] }
//      }
//    }
//
// 4. Напиши metadata с Open Graph для шаринга в соцсетях:
//    openGraph: { title, description, images, type: "website" }
//
// 5. Напиши в комментарии: зачем нужен Open Graph?
//
// Пиши код ниже:
// ==================================================
