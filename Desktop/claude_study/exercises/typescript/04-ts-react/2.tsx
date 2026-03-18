// ==================================================
// Задание 2: children и ReactNode
// Уровень: 🟢 Лёгкий
// Тема: Типизация children, ReactNode
// Ссылка: notes/typescript/04-ts-react.md — "Children"
// ==================================================
//
// 1. Создай интерфейс CardProps:
//    - title: string
//    - children: React.ReactNode
//
// 2. Напиши компонент Card({ title, children }: CardProps)
//    <div className="card">
//      <h3>{title}</h3>
//      <div className="card-body">{children}</div>
//    </div>
//
// 3. Создай интерфейс LayoutProps:
//    - header: React.ReactNode
//    - sidebar?: React.ReactNode
//    - children: React.ReactNode
//
// 4. Напиши компонент Layout({ header, sidebar, children }: LayoutProps)
//    <div>
//      <header>{header}</header>
//      {sidebar && <aside>{sidebar}</aside>}
//      <main>{children}</main>
//    </div>
//
// 5. Покажи пример использования Card (в комментарии):
//    <Card title="Профиль">
//      <p>Имя: Игорь</p>
//      <button>Редактировать</button>
//    </Card>
//
// Пиши код ниже:
// ==================================================
