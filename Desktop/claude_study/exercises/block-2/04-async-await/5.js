// ========== Задание async/await #5 — Перепиши цепочку промисов ==========
// Уровень: 🟡
//
// Перепиши этот код с .then() на async/await.
// Результат должен быть идентичным.
//
// Шаги:
// 1. Создай async-функцию
// 2. Замени каждый .then() на await
// 3. Замени .catch() на try/catch
//
// Исходный код (перепиши его):
// загрузить("/api/user")
//   .then(function(user) {
//     console.log("Пользователь:", user);
//     return загрузить("/api/posts/" + user.id);
//   })
//   .then(function(posts) {
//     console.log("Посты:", posts);
//     return загрузить("/api/comments/" + posts[0].id);
//   })
//   .then(function(comments) {
//     console.log("Комментарии:", comments);
//   })
//   .catch(function(err) {
//     console.error("Ошибка:", err.message);
//   });
//
// 📖 Раздел учебника: "await — ожидание результата" → notes/js-async/04-async-await.md
// ================================================

// Пиши код ниже:

// Вспомогательная функция (не меняй):
function загрузить(url) {
  return new Promise(function(resolve) {
    setTimeout(() => resolve({ id: 1, url: url }), 300);
  });
}

// Перепиши на async/await:
