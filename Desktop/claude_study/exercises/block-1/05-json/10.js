// ========== Задание JSON #10 — КОМПЛЕКСНАЯ ЗАДАЧА: Хранилище с TTL ==========
// Уровень: 🔴
//
// Создай объект `storage` для работы с данными (имитация localStorage):
//
// Внутри — приватный объект `data = {}` (через замыкание или класс).
//
// Методы:
// - `set(key, value)` — сохраняет JSON.stringify(value) по ключу
// - `get(key, fallback)` — парсит JSON и возвращает; если ключа нет — fallback
// - `remove(key)` — удаляет ключ
// - `clear()` — очищает всё
// - `keys()` — возвращает массив ключей
//
// Бонус: создай `createCachedStorage(ttlMs)`:
// - `set(key, value)` — сохраняет { data: value, expiresAt: Date.now() + ttlMs }
// - `get(key)` — возвращает value если не истёк срок, иначе null (и удаляет запись)
//
// Тесты:
// storage.set("user", { name: "Игорь", age: 20 });
// storage.set("theme", "dark");
//
// console.log(storage.get("user"));   // { name: "Игорь", age: 20 }
// console.log(storage.get("theme"));  // "dark"
// console.log(storage.get("missing", "default")); // "default"
// console.log(storage.keys());        // ["user", "theme"]
//
// storage.remove("theme");
// console.log(storage.keys()); // ["user"]
//
// // Бонус (TTL):
// const cache = createCachedStorage(100); // 100ms TTL
// cache.set("temp", "данные");
// console.log(cache.get("temp")); // "данные"
// // Через 200ms:
// // setTimeout(() => console.log(cache.get("temp")), 200); // null (истёк)
//
// 📖 Раздел учебника: ВСЕ разделы → notes/js-advanced/05-json.md
// ================================================

// Пиши код ниже:
