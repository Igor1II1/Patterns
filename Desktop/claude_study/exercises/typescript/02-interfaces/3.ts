// ==================================================
// Задание 3: Type Alias vs Interface
// Уровень: 🟢 Лёгкий
// Тема: type alias, когда что использовать
// Ссылка: notes/typescript/02-interfaces.md — "Type Alias", "Interface vs Type"
// ==================================================
//
// 1. Создай тип (type alias) ID = string | number
//
// 2. Создай тип Point = { x: number; y: number }
//
// 3. Создай интерфейс IPoint { x: number; y: number }
//
// 4. Создай объект p1: Point и объект p2: IPoint — оба работают одинаково.
//
// 5. Создай тип Result = "success" | "error" (union — только type, не interface!)
//
// 6. Напиши функцию distance(a: Point, b: Point): number
//    Возвращает расстояние между точками:
//    Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)
//
// 7. Напиши комментарий: когда использовать interface, когда type?
//    (Правило: объекты → interface, union/примитивы → type)
//
// Пиши код ниже:
// ==================================================
