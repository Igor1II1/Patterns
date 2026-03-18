// ========== Задание DOM: Изменение #10 — КОМПЛЕКСНАЯ ЗАДАЧА ==========
// Уровень: 🔴
//
// Создай функцию `построитьКарточку(данные)`, которая создаёт
// карточку товара целиком из объекта данных.
//
// Входные данные:
// { title: "Ноутбук", price: 50000, category: "Электроника", inStock: true }
//
// Функция должна:
// 1. Создать <div class="card"> с data-category
// 2. Внутри: <h2> с названием
// 3. Внутри: <p class="price"> с ценой (формат: "50 000 ₽")
// 4. Внутри: <span class="badge"> — "В наличии" (зелёный) или "Нет" (красный)
// 5. Внутри: <button class="btn">Купить</button>
// 6. Если !inStock — кнопке добавить атрибут disabled
// 7. Вернуть готовый элемент
//
// Затем: создай 3 карточки из массива и добавь в body
// через DocumentFragment.
//
// Концепции: createElement, textContent, classList, dataset,
// setAttribute, appendChild, DocumentFragment, style
//
// 📖 Раздел учебника: все разделы → notes/dom/02-dom-manipulation.md
// ================================================

// Пиши код ниже:

const товары = [
  { title: "Ноутбук", price: 50000, category: "Электроника", inStock: true },
  { title: "Книга", price: 500, category: "Книги", inStock: true },
  { title: "Наушники", price: 3000, category: "Электроника", inStock: false }
];
