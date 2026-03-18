// ========== Задание Замыкания #12 — КОМПЛЕКСНАЯ ЗАДАЧА: Система событий ==========
// Уровень: 🔴
//
// Создай функцию `createEventEmitter()`, которая возвращает объект
// с системой подписок на события (паттерн Observer/EventEmitter).
//
// Методы:
// - `on(event, callback)` — подписаться на событие
// - `off(event, callback)` — отписаться от события
// - `emit(event, ...data)` — вызвать все обработчики события с данными
// - `once(event, callback)` — подписаться на событие, но callback сработает только 1 раз
// - `listenerCount(event)` — количество подписчиков на событие
//
// Все данные (подписки) должны быть скрыты в замыкании.
//
// Тесты:
// const emitter = createEventEmitter();
//
// // Подписка
// function onMessage(text) { console.log("Сообщение:", text); }
// emitter.on("message", onMessage);
// emitter.on("message", (text) => console.log("Лог:", text));
//
// emitter.emit("message", "Привет!");
// // "Сообщение: Привет!"
// // "Лог: Привет!"
//
// console.log(emitter.listenerCount("message")); // 2
//
// // Отписка
// emitter.off("message", onMessage);
// console.log(emitter.listenerCount("message")); // 1
//
// // Once
// emitter.once("connect", (url) => console.log("Подключено к", url));
// emitter.emit("connect", "localhost"); // "Подключено к localhost"
// emitter.emit("connect", "localhost"); // (ничего — callback уже отработал)
// console.log(emitter.listenerCount("connect")); // 0
//
// 📖 Раздел учебника: ВСЕ разделы → notes/js-advanced/02-closures.md
// ================================================

// Пиши код ниже:
