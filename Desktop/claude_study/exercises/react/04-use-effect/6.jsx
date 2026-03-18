// ========== Задание React #6 — Загрузка данных (fetch) ==========
// Уровень: 🟡
//
// Создай компонент, загружающий данные с API.
//
// Шаги:
// 1. State: data (null), loading (true), error (null)
// 2. useEffect с async функцией внутри (fetchData)
// 3. URL: https://jsonplaceholder.typicode.com/users/1
// 4. Обработка ошибок через try/catch
// 5. Флаг cancelled для предотвращения гонки
// 6. Ранний return: if (loading) → "Загрузка...", if (error) → ошибка
// 7. Зависимость: [userId] — при смене userId перезагрузить
//
// 📖 Раздел учебника: "Загрузка данных (fetch)" → notes/react/04-use-effect.md
// ================================================

// Пиши код ниже:
