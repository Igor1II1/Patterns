// ==================================================
// Задание 7: Интерфейсы для функций и вложенные интерфейсы
// Уровень: 🟡 Средний
// Тема: Функции в интерфейсах, вложенность
// Ссылка: notes/typescript/02-interfaces.md — "Вложенные интерфейсы"
// ==================================================
//
// 1. Создай интерфейс MathOperation:
//    (a: number, b: number): number
//    Создай переменные add и multiply с этим типом.
//
// 2. Создай интерфейс Address:
//    - street: string
//    - city: string
//    - zipCode: string
//
// 3. Создай интерфейс Company:
//    - name: string
//    - address: Address (вложенный интерфейс)
//    - employees: number
//
// 4. Создай интерфейс Employee:
//    - name: string
//    - position: string
//    - company: Company (вложенный)
//    - contacts: { phone: string; email: string } (inline вложенность)
//
// 5. Создай объект employee типа Employee с полным заполнением всех полей.
//
// 6. Напиши функцию getEmployeeCity(emp: Employee): string
//    Возвращает город компании сотрудника.
//
// Пиши код ниже:
// ==================================================
