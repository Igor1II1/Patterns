// ============================================
// Задание 10.7 — Комплексное: модульная система утилит
// Уровень: 🔴 Продвинутый
// ============================================
//
// 📖 Раздел учебника: все разделы главы 10-modules.md
//
// --- Описание ---
// Комплексное задание: создай систему модулей для мини-приложения.
// Каждый модуль отвечает за свою задачу: хранение данных,
// валидация, форматирование.
//
// --- Что нужно сделать ---
//
// 1. Создай модуль storage.js:
//
//    ⚠️ МИНИ-СПРАВКА: Вместо localStorage (браузерного API, Блок 3)
//    мы используем обычный объект как хранилище. Принцип тот же:
//    сохраняем/загружаем данные по ключу.
//
//    const store = {};  // "хранилище" в памяти
//
//    export function save(key, value):
//      - Если typeof key !== "string" || !key — брось TypeError("key должен быть непустой строкой")
//      - Сериализует value через JSON.stringify
//      - Сохраняет в store[key]
//
//    export function load(key, defaultValue):
//      - defaultValue — если не передан, используй ?? null
//      - Загружает из store[key]
//      - Парсит через JSON.parse (обёрнуто в try/catch)
//      - Если нет данных или ошибка — возвращает defaultValue
//
//    export function remove(key):
//      - Удаляет store[key] через delete
//
//    export function clear():
//      - Удаляет все ключи из store (через for...in + delete)
//
// 2. Создай модуль todo.js:
//
//    ⚠️ Вместо class (Блок 1) используем фабричную функцию —
//    функция которая создаёт и возвращает объект с методами.
//
//    import { save, load } from "./storage.js";
//
//    export default function createTodoList(storageKey) {
//      // Задаём значение по умолчанию через ?? (nullish coalescing)
//      storageKey = storageKey ?? "todos";
//
//      let nextId = 1;
//      let todos = load(storageKey, []);
//      // Восстановим nextId из существующих данных
//      if (todos.length > 0) {
//        for (let i = 0; i < todos.length; i++) {
//          if (todos[i].id >= nextId) nextId = todos[i].id + 1;
//        }
//      }
//
//      return {
//        add(text) {
//          // Если text falsy (!text) — используй || для значения по умолчанию: "Без названия"
//          text = text || "Без названия";
//          // Если typeof text !== "string" — приведи через String(text)
//          if (typeof text !== "string") text = String(text);
//          const todo = { id: nextId, text: text, done: false };
//          nextId++;
//          todos.push(todo);
//          save(storageKey, todos);
//          return todo;
//        },
//
//        toggle(id) {
//          for (let i = 0; i < todos.length; i++) {
//            if (todos[i].id === id) {
//              todos[i].done = !todos[i].done;
//              break;
//            }
//          }
//          save(storageKey, todos);
//        },
//
//        remove(id) {
//          const index = todos.findIndex(function(t) { return t.id === id; });
//          if (index !== -1) {
//            todos.splice(index, 1);
//          }
//          save(storageKey, todos);
//        },
//
//        getAll() {
//          // Возвращаем копию чтобы не мутировали оригинал
//          return todos.map(function(t) { return { id: t.id, text: t.text, done: t.done }; });
//        },
//
//        // Новый метод: фильтрация по статусу через switch/case
//        getByStatus(status) {
//          // status: "done", "pending", "all" (если не передан — ?? "all")
//          status = status ?? "all";
//          switch (status) {
//            case "done":    return todos.filter(function(t) { return t.done === true; });
//            case "pending": return todos.filter(function(t) { return t.done === false; });
//            case "all":     return this.getAll();
//            default:        return [];  // неизвестный статус
//          }
//        }
//      };
//    }
//
// 3. Создай main.js который:
//    - Импортирует createTodoList из todo.js
//    - Создаёт список задач: const todo = createTodoList();
//    - Добавляет задачи, переключает, удаляет
//    - Показывает что данные сохраняются в storage
//
// --- Тесты ---
// import { save, load } from "./storage.js";
// save("user", { name: "Игорь", age: 25 });
// load("user")          → { name: "Игорь", age: 25 }
// load("missing")       → null    (defaultValue ?? null)
// load("missing", [])   → []
// save(123, "data")     → TypeError (key не строка)
// save("", "data")      → TypeError (key пустая строка — falsy)
//
// import createTodoList from "./todo.js";
// const todo = createTodoList();          // storageKey ?? "todos"
// todo.add("Купить молоко");
// todo.add("");                           // text || "Без названия" → "Без названия"
// todo.add(42);                           // typeof !== "string" → String(42) → "42"
// todo.getAll() → [{ id: 1, text: "Купить молоко", done: false }, ...]
// todo.toggle(1);
// todo.getAll()[0].done → true
// todo.getByStatus("done")    → только выполненные (switch/case)
// todo.getByStatus("pending") → только невыполненные
// todo.getByStatus()          → все (status ?? "all")
//
// --- Ключевая концепция ---
// Реальное приложение = несколько модулей, каждый со своей ответственностью.
// storage.js — утилита, todo.js — бизнес-логика, main.js — запуск.
// Фабричная функция — альтернатива class: функция создаёт объект с методами.
