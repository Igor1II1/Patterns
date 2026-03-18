// ==================================================
// Задание 1: next/image — оптимизация изображений
// Уровень: 🟢 Лёгкий
// Тема: Image компонент, width/height, fill, sizes
// Ссылка: notes/nextjs/05-built-in.md — "Image"
// ==================================================
//
// 1. Импортируй Image из "next/image" и создай:
//    - Локальное изображение: <Image src="/hero.jpg" width={800} height={400} alt="Hero" />
//    - Аватар: <Image src="/avatar.png" width={48} height={48} alt="Avatar" className="rounded-full" />
//
// 2. Используй fill для фонового изображения:
//    <div style={{ position: "relative", width: "100%", height: "400px" }}>
//      <Image src="/banner.jpg" fill alt="Banner" style={{ objectFit: "cover" }} />
//    </div>
//
// 3. Используй sizes для адаптивности:
//    <Image src="/photo.jpg" fill sizes="(max-width: 768px) 100vw, 50vw" alt="Photo" />
//
// 4. Напиши конфигурацию next.config.js для внешних изображений:
//    images: { remotePatterns: [{ protocol: "https", hostname: "example.com" }] }
//
// 5. Напиши в комментарии: зачем использовать next/image вместо <img>?
//    (Автоматическая оптимизация, lazy loading, WebP, responsive)
//
// Пиши код ниже:
// ==================================================
