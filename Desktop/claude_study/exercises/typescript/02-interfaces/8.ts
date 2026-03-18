// ==================================================
// Задание 8: Комплексная задача — система интернет-магазина
// Уровень: 🔴 Сложный
// Тема: Все концепции 02-interfaces вместе
// Ссылка: notes/typescript/02-interfaces.md — вся глава
// ==================================================
//
// Создай систему типов для интернет-магазина:
//
// 1. Интерфейс BaseEntity: id (readonly number), createdAt (string)
//
// 2. Интерфейс Category extends BaseEntity:
//    - name: string
//    - slug: string
//
// 3. Интерфейс Product extends BaseEntity:
//    - name: string
//    - price: number
//    - description?: string
//    - category: Category
//    - inStock: boolean
//    - tags: string[]
//
// 4. Интерфейс CartItem:
//    - product: Product
//    - quantity: number
//
// 5. Тип OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled"
//
// 6. Интерфейс Order extends BaseEntity:
//    - items: CartItem[]
//    - status: OrderStatus
//    - totalPrice: number
//    - customer: { name: string; email: string; address: string }
//
// 7. Функция calculateTotal(items: CartItem[]): number
//    Считает сумму (product.price * quantity для каждого item).
//
// 8. Функция createOrder(items: CartItem[], customer: Order["customer"]): Order
//    Создаёт заказ с id, createdAt, items, status "pending", totalPrice.
//
// 9. Функция getOrderSummary(order: Order): string
//    Возвращает: "Заказ #{id}: {кол-во товаров} товаров на {totalPrice}₽, статус: {status}"
//
// Создай 2 товара, добавь в корзину, создай заказ и выведи summary.
//
// Пиши код ниже:
// ==================================================
