// ============================================
// Задание 10.4 — Разделение на модули (архитектура)
// Уровень: 🟡 Средний
// ============================================
//
// 📖 Раздел учебника: "Пути при импорте", "Структура проекта" (10-modules.md)
//
// --- Описание ---
// Хорошая архитектура = каждый файл отвечает за одну задачу.
// Модули позволяют разделить код на логические части.
//
// --- Что нужно сделать ---
//
// Разбей этот монолитный код на отдельные файлы:
//
// function formatName(name) { return name.trim().toLowerCase(); }
// function formatPrice(n) { return `${n.toLocaleString("ru-RU")} ₽`; }
// function validateEmail(email) { return email.includes("@"); }
// function validateAge(age) { return Number.isInteger(age) && age >= 0 && age <= 150; }
// function getUsers() { return [{ name: "Игорь" }, { name: "Анна" }]; }
// function createUser(name, email) { return { name, email }; }
//
// Создай структуру файлов:
// - utils/format.js   — formatName, formatPrice (named exports)
// - utils/validate.js — validateEmail, validateAge (named exports)
// - api/users.js      — getUsers, createUser (named exports)
// - main.js           — импортирует и использует всё
//
// (Создай все файлы в папке 10-modules/)
//
// --- Тесты ---
// В main.js должно работать:
// import { formatName, formatPrice } from "./utils/format.js";
// import { validateEmail } from "./utils/validate.js";
// import { getUsers, createUser } from "./api/users.js";
//
// formatName("  ИГОРЬ  ")  → "игорь"
// formatPrice(50000)       → "50 000 ₽"
// validateEmail("i@mail")  → true
// getUsers()               → [...]
//
// --- Ключевая концепция ---
// Один файл = одна ответственность.
// ./relative — для своих файлов, без ./ — для node_modules.
