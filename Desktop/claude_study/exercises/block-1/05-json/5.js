// ========== Задание JSON #5 — Replacer-массив (белый список) ==========
// Уровень: 🟡
//
// Дан объект пользователя с "чувствительными" данными.
// Используй replacer-массив чтобы в JSON попали ТОЛЬКО безопасные поля.
//
// Тесты:
// const user = {
//   id: 42,
//   name: "Игорь",
//   email: "igor@example.com",
//   password: "secret123",
//   token: "abc-xyz-123",
//   role: "admin"
// };
//
// const safeJson = JSON.stringify(user, ["id", "name", "email", "role"], 2);
// console.log(safeJson);
// // Должно содержать: id, name, email, role
// // НЕ должно содержать: password, token
//
// 📖 Раздел учебника: "Replacer в stringify — фильтрация полей" → notes/js-advanced/05-json.md
// ================================================

// Пиши код ниже:
