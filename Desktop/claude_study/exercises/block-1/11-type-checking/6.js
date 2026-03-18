// ========== Задание Проверка типов #6 — КОМПЛЕКСНАЯ ЗАДАЧА: Валидирующий Proxy ==========
// Уровень: 🔴
//
// Создай функцию `createValidatedObject(schema)`, которая:
// - Принимает схему валидации (объект с правилами для каждого поля)
// - Возвращает Proxy, который при set проверяет значения по схеме
//
// Схема — объект, где ключ = имя поля, значение = объект с правилами:
// { type: "string"|"number"|"boolean", required: true|false, min, max, minLength, maxLength }
//
// При нарушении правила — бросить Error с описанием.
// При get несуществующего свойства — вернуть undefined (обычное поведение).
//
// Также реализуй:
// - `has` trap — проверка свойства (prop in obj)
// - `deleteProperty` trap — запрет удаления required полей
//
// Тесты:
// const schema = {
//   name: { type: "string", required: true, minLength: 2, maxLength: 50 },
//   age: { type: "number", required: true, min: 0, max: 150 },
//   email: { type: "string", required: false },
//   isAdmin: { type: "boolean", required: false }
// };
//
// const user = createValidatedObject(schema);
//
// user.name = "Игорь";    // OK
// user.age = 20;          // OK
// user.isAdmin = false;   // OK
//
// console.log(user.name); // "Игорь"
// console.log(user.age);  // 20
//
// try { user.name = ""; } catch(e) { console.log(e.message); }
// // "name: минимальная длина 2"
//
// try { user.age = -5; } catch(e) { console.log(e.message); }
// // "age: минимум 0"
//
// try { user.age = "двадцать"; } catch(e) { console.log(e.message); }
// // "age: ожидается number"
//
// try { delete user.name; } catch(e) { console.log(e.message); }
// // "name: нельзя удалить обязательное поле"
//
// console.log("name" in user);    // true
// console.log("missing" in user); // false
//
// 📖 Раздел учебника: ВСЕ разделы → notes/js-advanced/11-type-checking.md
// ================================================

// Пиши код ниже:
