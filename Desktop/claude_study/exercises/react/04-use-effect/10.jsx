// ========== Задание React #10 — КОМПЛЕКСНАЯ ЗАДАЧА: Профиль пользователя с API ==========
// Уровень: 🔴
//
// Создай компонент профиля, который загружает данные по userId.
//
// Требования:
// 1. props: userId
// 2. State: user (null), loading (true), error (null)
// 3. useEffect с fetch: https://jsonplaceholder.typicode.com/users/${userId}
// 4. Флаг cancelled для предотвращения гонки данных
// 5. Функция очистки: cancelled = true
// 6. Ранние return: loading → спиннер, error → сообщение, !user → "Не найден"
// 7. Отобрази: имя, email, телефон, город (user.address.city)
// 8. Кнопки для смены userId (1-10) — при смене перезагрузка данных
// 9. document.title = имя пользователя (второй useEffect)
// 10. Обработка HTTP-ошибок: if (!response.ok) throw new Error(...)
//
// 📖 Раздел учебника: Все разделы → notes/react/04-use-effect.md
// ================================================

// Пиши код ниже:
