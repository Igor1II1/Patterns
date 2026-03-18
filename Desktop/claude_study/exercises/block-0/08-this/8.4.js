// ============================================
// Задание 8.4 — call, apply, bind на практике
// Уровень: 🟡 Средний
// ============================================
//
// 📖 Раздел учебника: "call / apply / bind" (08-this.md)
//
// --- Описание ---
// call, apply и bind позволяют явно указать this при вызове функции.
// Это мощный инструмент для "заимствования" методов между объектами.
//
// --- Что нужно сделать ---
//
// Часть 1 — introduce с разными объектами:
//
// function introduce() {
//   return this.name + ", " + this.age + " лет";
// }
//
// const igor = { name: "Игорь", age: 20 };
// const anna = { name: "Анна", age: 25 };
// const max = { name: "Макс", age: 30 };
//
// 1. Вызови introduce для каждого объекта через call
// 2. Вызови introduce для каждого объекта через apply
// 3. Создай привязанную версию introduceIgor через bind
//    Проверь: introduceIgor() возвращает "Игорь, 20 лет"
//
// Часть 2 — функция с аргументами:
//
// function formatInfo(city, job) {
//   return this.name + " из " + city + ", работает " + job;
// }
//
// 4. Вызови formatInfo для igor через call с аргументами "Москва", "разработчик"
// 5. Вызови formatInfo для anna через apply с аргументами ["Питер", "дизайнер"]
// 6. Создай через bind функцию igorInfo, где this = igor
//    Вызови: igorInfo("Казань", "тестировщик")
//
// Часть 3 — заимствование метода:
//
// const calculator = {
//   value: 100,
//   add(n) { return this.value + n; },
//   subtract(n) { return this.value - n; }
// };
//
// const wallet = { value: 500 };
//
// 7. Напиши функцию borrowMethod(donor, receiver, methodName):
//    - Берёт метод methodName из объекта donor
//    - Вызывает его с контекстом receiver
//    - Возвращает результат
//    Пример: borrowMethod(calculator, wallet, "add")(50) → 550
//
//    Подсказка: верни donor[methodName].bind(receiver)
//
// 8. Используй borrowMethod чтобы:
//    - "одолжить" метод add у calculator и вызвать с wallet
//    - "одолжить" метод subtract и вызвать с wallet
//
// --- Тесты ---
// introduce.call(igor)              → "Игорь, 20 лет"
// introduce.call(anna)              → "Анна, 25 лет"
// introduce.apply(max)              → "Макс, 30 лет"
// introduceIgor()                   → "Игорь, 20 лет"
//
// formatInfo.call(igor, "Москва", "разработчик")    → "Игорь из Москва, работает разработчик"
// formatInfo.apply(anna, ["Питер", "дизайнер"])      → "Анна из Питер, работает дизайнер"
// igorInfo("Казань", "тестировщик")                  → "Игорь из Казань, работает тестировщик"
//
// borrowMethod(calculator, wallet, "add")(50)        → 550
// borrowMethod(calculator, wallet, "subtract")(100)  → 400
//
// --- Ключевая концепция ---
// call/apply — вызывают функцию сразу с нужным this.
// bind — создаёт новую функцию с привязанным this (не вызывает).
// Заимствование методов — мощный паттерн: один объект "берёт" метод другого.
