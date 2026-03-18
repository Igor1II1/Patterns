// ========== Задание Прототипы #12 — КОМПЛЕКСНАЯ ЗАДАЧА: Система плагинов ==========
// Уровень: 🔴
//
// Создай систему, демонстрирующую все концепции прототипов:
//
// 1. Базовый объект `pluginProto` (через Object.create):
//    - Метод `init(name)` — устанавливает this.name
//    - Метод `getInfo()` — возвращает `"Плагин: [name]"`
//    - Метод `isActive()` — возвращает this.active || false
//
// 2. Создай `loggerPlugin` через Object.create(pluginProto):
//    - Собственный метод `log(message)` → `"[Logger: name] message"`
//    - Вызови init("Logger")
//    - Установи active = true
//
// 3. Создай `authPlugin` через Object.create(pluginProto):
//    - Собственный метод `login(user)` → `"[Auth] user вошёл"`
//    - Переопредели getInfo() → `"Плагин авторизации: [name]"`
//    - Вызови init("Auth")
//
// 4. Проверь:
//    - hasOwnProperty для собственных vs унаследованных методов
//    - for...in с фильтрацией
//    - Цепочку прототипов через Object.getPrototypeOf
//
// Тесты:
// console.log(loggerPlugin.getInfo());   // "Плагин: Logger"
// console.log(loggerPlugin.isActive());  // true
// console.log(loggerPlugin.log("test")); // "[Logger: Logger] test"
//
// console.log(authPlugin.getInfo());     // "Плагин авторизации: Auth"
// console.log(authPlugin.login("Игорь")); // "[Auth] Игорь вошёл"
//
// console.log(loggerPlugin.hasOwnProperty("log"));     // true
// console.log(loggerPlugin.hasOwnProperty("getInfo"));  // false
// console.log(Object.getPrototypeOf(loggerPlugin) === pluginProto); // true
//
// // Только собственные свойства loggerPlugin:
// console.log(Object.keys(loggerPlugin)); // ["name", "active", "log"] или подобное
//
// 📖 Раздел учебника: ВСЕ разделы → notes/js-advanced/03-prototypes.md
// ================================================

// Пиши код ниже:
