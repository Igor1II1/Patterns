// ==================================================
// Задание 5: Generic-компоненты
// Уровень: 🟡 Средний
// Тема: Дженерики в React-компонентах
// Ссылка: notes/typescript/04-ts-react.md — "Generic-компоненты"
// ==================================================
//
// 1. Создай generic-компонент List<T>:
//    interface ListProps<T> {
//      items: T[]
//      renderItem: (item: T) => React.ReactNode
//    }
//
//    function List<T>({ items, renderItem }: ListProps<T>) {
//      return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>
//    }
//
// 2. Используй List для массива строк:
//    <List items={["Один", "Два"]} renderItem={(s) => <span>{s}</span>} />
//
// 3. Используй List для массива объектов User:
//    <List items={users} renderItem={(user) => <span>{user.name}</span>} />
//
// 4. Создай generic-компонент Select<T>:
//    interface SelectProps<T> {
//      options: T[]
//      getLabel: (option: T) => string
//      getValue: (option: T) => string
//      onChange: (option: T) => void
//    }
//
// 5. Используй Select для массива объектов City:
//    interface City { id: number; name: string }
//
// Пиши код ниже:
// ==================================================
