// ========== Задание Продвинутые классы #12 — КОМПЛЕКСНАЯ ЗАДАЧА: Интернет-магазин ==========
// Уровень: 🔴
//
// Создай систему интернет-магазина, используя ВСЕ концепции:
// static, get/set, приватные поля, миксины.
//
// 1. Миксин `Timestampable`:
//    - Метод `setTimestamps()` — устанавливает this.createdAt (ISO строка)
//    - Метод `touch()` — обновляет this.updatedAt
//
// 2. Класс `Product`:
//    - Приватное поле `#price`
//    - Конструктор `(name, price, category)`
//    - Геттер `price` — возвращает цену
//    - Сеттер `price` — валидация (> 0, число)
//    - Геттер `priceFormatted` — возвращает `"[price] руб."`
//    - Статический метод `static compare(a, b)` — сравнивает по цене (для sort)
//
// 3. Класс `Cart`:
//    - Приватное поле `#items = []` (массив объектов {product, quantity})
//    - `add(product, quantity)` — добавить товар (если уже есть — увеличить quantity)
//    - `remove(productName)` — удалить товар по имени
//    - Геттер `total` — общая сумма (цена * кол-во для каждого товара)
//    - Геттер `totalFormatted` — `"Итого: [total] руб."`
//    - Геттер `itemCount` — общее количество товаров
//    - `getItems()` — возвращает КОПИЮ массива items
//    - Статическое свойство `static #cartCount = 0` — считает созданные корзины
//    - Статический метод `static getCartCount()`
//
// Применяй миксин Timestampable к Product.
//
// Тесты:
// const laptop = new Product("Ноутбук", 75000, "Электроника");
// const mouse = new Product("Мышь", 2500, "Аксессуары");
// const keyboard = new Product("Клавиатура", 5000, "Аксессуары");
//
// console.log(laptop.priceFormatted); // "75000 руб."
// console.log(laptop.createdAt);       // ISO строка
//
// const cart = new Cart();
// cart.add(laptop, 1);
// cart.add(mouse, 2);
// cart.add(keyboard, 1);
//
// console.log(cart.itemCount);       // 4
// console.log(cart.total);           // 85000
// console.log(cart.totalFormatted);  // "Итого: 85000 руб."
//
// cart.add(mouse, 1); // увеличить количество мышей
// console.log(cart.itemCount); // 5
//
// cart.remove("Мышь");
// console.log(cart.itemCount); // 2
//
// // Сортировка продуктов по цене:
// const sorted = [laptop, mouse, keyboard].sort(Product.compare);
// console.log(sorted.map(p => p.priceFormatted));
// // ["2500 руб.", "5000 руб.", "75000 руб."]
//
// console.log(Cart.getCartCount()); // 1
//
// 📖 Раздел учебника: ВСЕ разделы → notes/js-advanced/04-classes-advanced.md
// ================================================

// Пиши код ниже:
