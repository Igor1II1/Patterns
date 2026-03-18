// ========== Задание 1.7 ==========
// Напиши функцию initSettings(settings) которая устанавливает значения по умолчанию
// для настроек пользователя — но только если поле не задано (null или undefined).
//
// Значения по умолчанию:
//   theme         → "light"
//   language      → "ru"
//   fontSize      → 14
//   notifications → true
//
// Важно: значения 0, false и "" — валидные настройки, их нельзя заменять!
// Используй оператор ??= для каждого поля.
//
// Раздел учебника: "Оператор нулевого присваивания ??="

function initSettings(settings){
settings.theme ??="light";
settings.language ??="ru"
settings.fontSize ??=14;
settings.notifications ??=true;
return settings
}


console.log(initSettings({ theme: null, language: undefined, fontSize: 0, notifications: false }))

// ========== Разбор задания ==========
// Что делали:    функция initSettings — заполняет поля по умолчанию только если они null/undefined.
// Почему так:    ??= присваивает значение только если переменная null или undefined.
//                0, false, "" — не трогает, потому что они не null и не undefined.
// Для чего:      классический паттерн инициализации настроек: "если не задано — поставь умолчание".
//                Используется для конфигов, настроек, опциональных параметров функций.
// Главное понять: ??= ≠ ||=
//                ||= заменил бы 0 и false (falsy значения).
//                ??= сохраняет 0 и false — заменяет только null и undefined.
