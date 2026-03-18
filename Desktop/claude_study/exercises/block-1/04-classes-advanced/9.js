// ========== Задание Продвинутые классы #9 — Миксин-функция ==========
// Уровень: 🔴
//
// 1. Создай миксин-функцию `WithLogging(Base)`:
//    - Возвращает класс, наследующий Base
//    - Добавляет метод `log(message)` → `"[ClassName] message"`
//
// 2. Создай миксин-функцию `WithTimestamp(Base)`:
//    - В конструкторе добавляет `this.createdAt = new Date().toISOString()`
//    - Добавляет метод `getAge()` → `"Создано: [createdAt]"`
//
// 3. Создай базовый класс `Service` с конструктором `(name)`.
//
// 4. Создай `ApiService` наследуя Service с обоими миксинами:
//    class ApiService extends WithLogging(WithTimestamp(Service)) { ... }
//
// Тесты:
// const api = new ApiService("UserAPI");
// api.log("Запрос отправлен"); // "[ApiService] Запрос отправлен"
// console.log(api.name);       // "UserAPI"
// console.log(api.createdAt);  // ISO строка даты
// console.log(api.getAge());   // "Создано: 2026-..."
//
// 📖 Раздел учебника: "Функциональный подход к миксинам" → notes/js-advanced/04-classes-advanced.md
// ================================================

// Пиши код ниже:
