// ========== Задание 2.5 ==========
// Напиши функцию canAccess(user) которая возвращает true если пользователь
// может получить доступ.
//
// Условия доступа:
//   пользователь активен И (является админом ИЛИ (является модератором И подтверждён email))
//
// canAccess({ active: true, role: "admin", emailVerified: false })     // true
// canAccess({ active: true, role: "moderator", emailVerified: true })  // true
// canAccess({ active: true, role: "moderator", emailVerified: false }) // false
// canAccess({ active: false, role: "admin", emailVerified: true })     // false
// canAccess({ active: true, role: "user", emailVerified: true })       // false
//
// Раздел учебника: "Логические операторы &&, ||"
//
// Забегая вперёд — объекты (глава 7):
// user — это объект с полями. Доступ через точку:
// user.active        // true или false
// user.role          // "admin", "moderator", "user"
// user.emailVerified // true или false

// function canAccess(user) {
//   if (
//     (user.active  && user.role == "admin") ||
//     (user.role == "moderator" && user.emailVerified )
//   ) {
//     return true;
//   } else if (
//     user.active &&
//     user.role == "moderator" &&
//     user.emailVerified 
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// }


function canAccess(user){
    return user.active && (user.role === "admin" || (user.role === "moderator" && user.emailVerified))
   
}

console.log(canAccess({ active: true, role: "admin", emailVerified: false })); // true
console.log(canAccess({ active: true, role: "moderator", emailVerified: true })); // true
console.log(canAccess({ active: true, role: "moderator", emailVerified: false })); // false
console.log(canAccess({ active: false, role: "admin", emailVerified: true })); // false
console.log(canAccess({ active: true, role: "user", emailVerified: true })); // false

// ========== Разбор задания ==========
// Что делали:    составляли сложное логическое выражение из && и ||.
// Почему так:    условие из задания дословно переводится в код:
//                "активен И (админ ИЛИ (модератор И email))" →
//                user.active && (role === "admin" || (role === "moderator" && emailVerified))
//                Скобки задают порядок — как в математике.
// Для чего:      проверка прав доступа — одна из самых частых задач в реальных проектах.
//                Умение читать и составлять логические выражения — базовый навык.
// Главное понять: && — все должны быть true. || — хотя бы одно true.
//                Скобки группируют операции. Без скобок && выполняется раньше ||.
//                Можно возвращать логическое выражение напрямую через return —
//                не нужен if/else когда функция возвращает true/false.
//
// Пошагово для ({ active: true, role: "admin", emailVerified: false }):
//   true && ("admin" === "admin" || ("admin" === "moderator" && false))
//   true && (true || (false && false))
//   true && (true || false)
//   true && true → true
