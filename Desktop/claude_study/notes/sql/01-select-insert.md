# Основы SQL: SELECT, INSERT, UPDATE, DELETE

> [[sql/02-join-group|Следующая глава: JOIN и GROUP BY -->]]
> [[sql-fundamentals|<-- Назад к оглавлению SQL]]

---

## Зачем эта тема существует?

Любое приложение работает с данными. Пользователи регистрируются, создают посты, делают заказы — все это хранится в базе данных. SQL (Structured Query Language) — язык, на котором ты разговариваешь с базой данных. Без SQL невозможно ни получить данные, ни записать их, ни изменить. Это фундамент backend-разработки.

---

## Что такое база данных и таблица

### Что это такое?

База данных — это организованное хранилище данных. Реляционная база данных хранит данные в **таблицах** — похоже на Excel, но с четкими правилами. Каждая таблица имеет **столбцы** (поля) и **строки** (записи).

### Как работает?

Представь таблицу `users`:

| id | name      | email            | age |
|----|-----------|------------------|-----|
| 1  | Игорь     | igor@mail.ru     | 25  |
| 2  | Анна      | anna@mail.ru     | 30  |
| 3  | Дмитрий   | dima@mail.ru     | 22  |

- **id** — уникальный номер записи (первичный ключ)
- **name, email, age** — столбцы с данными
- Каждая строка — одна запись (один пользователь)

### Типы данных в SQL

```sql
-- Числовые
INTEGER       -- целое число: 1, 42, -7
BIGINT        -- большое целое число
DECIMAL(10,2) -- точное десятичное: 99.99
REAL          -- число с плавающей точкой

-- Текстовые
VARCHAR(255)  -- строка до 255 символов
TEXT          -- текст без ограничения длины
CHAR(10)     -- строка фиксированной длины

-- Дата и время
DATE          -- дата: '2026-03-07'
TIMESTAMP     -- дата + время: '2026-03-07 14:30:00'

-- Логические
BOOLEAN       -- true / false

-- Специальные
SERIAL        -- автоинкремент (PostgreSQL)
UUID          -- уникальный идентификатор
```

### Частые заблуждения

- "VARCHAR и TEXT — одно и то же" — нет. VARCHAR имеет ограничение длины, TEXT — нет. Но в PostgreSQL разницы в производительности почти нет.
- "id можно не делать" — теоретически можно, но без первичного ключа невозможно однозначно идентифицировать запись.

### Мини-проверка

1. Что такое первичный ключ?
2. Какой тип данных выбрать для цены товара?
3. Чем SERIAL отличается от INTEGER?

---

## CREATE TABLE — создание таблицы

### Что это такое?

Команда `CREATE TABLE` создает новую таблицу в базе данных. Ты описываешь название, столбцы и их типы.

### Как работает?

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Разберем построчно:

```sql
id SERIAL PRIMARY KEY
-- SERIAL: автоматически увеличивается (1, 2, 3...)
-- PRIMARY KEY: уникальный идентификатор строки

name VARCHAR(100) NOT NULL
-- Строка до 100 символов
-- NOT NULL: поле обязательно для заполнения

email VARCHAR(255) UNIQUE NOT NULL
-- UNIQUE: значение не может повторяться
-- Два пользователя с одинаковым email — ошибка

age INTEGER
-- Без NOT NULL — поле необязательное (может быть NULL)

created_at TIMESTAMP DEFAULT NOW()
-- DEFAULT: значение по умолчанию
-- NOW(): текущая дата и время
```

### Примеры кода

```sql
-- Таблица товаров
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Удалить таблицу (осторожно — все данные пропадут!)
DROP TABLE products;

-- Удалить только если существует
DROP TABLE IF EXISTS products;
```

### Частые заблуждения

- "NULL и пустая строка — одно и то же" — нет. NULL означает "значение отсутствует". Пустая строка `''` — это значение, просто пустое.
- "PRIMARY KEY автоматически увеличивается" — нет, для этого нужен SERIAL (или GENERATED ALWAYS AS IDENTITY).

### Мини-проверка

1. Что делает ограничение NOT NULL?
2. Можно ли иметь два столбца с UNIQUE в одной таблице?
3. Что произойдет, если вставить запись без указания поля с DEFAULT?

---

## SELECT — получение данных

### Что это такое?

SELECT — самая частая команда в SQL. Она извлекает данные из таблицы. Ты описываешь, **что** хочешь получить и **откуда**.

### Как работает?

```sql
-- Получить все столбцы всех пользователей
SELECT * FROM users;

-- Получить только имена и email
SELECT name, email FROM users;

-- Получить с условием
SELECT * FROM users WHERE age > 25;
```

### WHERE — фильтрация

```sql
-- Точное совпадение
SELECT * FROM users WHERE name = 'Игорь';

-- Сравнение чисел
SELECT * FROM users WHERE age >= 18;
SELECT * FROM users WHERE age != 30;

-- Несколько условий
SELECT * FROM users WHERE age > 20 AND age < 30;
SELECT * FROM users WHERE name = 'Игорь' OR name = 'Анна';

-- Проверка на NULL
SELECT * FROM users WHERE age IS NULL;
SELECT * FROM users WHERE age IS NOT NULL;

-- Поиск по списку
SELECT * FROM users WHERE age IN (22, 25, 30);

-- Диапазон
SELECT * FROM users WHERE age BETWEEN 20 AND 30;

-- Поиск по шаблону
SELECT * FROM users WHERE name LIKE 'И%';    -- начинается на "И"
SELECT * FROM users WHERE email LIKE '%@mail.ru'; -- заканчивается на "@mail.ru"
SELECT * FROM users WHERE name LIKE '_горь';  -- _ = один любой символ
```

### ORDER BY — сортировка

```sql
-- По возрасту (по возрастанию — по умолчанию)
SELECT * FROM users ORDER BY age;

-- По возрасту (по убыванию)
SELECT * FROM users ORDER BY age DESC;

-- Сначала по возрасту, потом по имени
SELECT * FROM users ORDER BY age DESC, name ASC;
```

### LIMIT и OFFSET — ограничение результатов

```sql
-- Первые 10 записей
SELECT * FROM users LIMIT 10;

-- Пропустить 10 и взять следующие 10 (пагинация)
SELECT * FROM users LIMIT 10 OFFSET 10;

-- Самый молодой пользователь
SELECT * FROM users ORDER BY age ASC LIMIT 1;
```

### Примеры кода

```sql
-- Все совершеннолетние пользователи, отсортированные по имени
SELECT name, age
FROM users
WHERE age >= 18
ORDER BY name ASC;

-- Последние 5 зарегистрировавшихся
SELECT *
FROM users
ORDER BY created_at DESC
LIMIT 5;

-- Количество пользователей
SELECT COUNT(*) FROM users;

-- Уникальные возрасты
SELECT DISTINCT age FROM users;
```

### Частые заблуждения

- "WHERE age = NULL" — неправильно! Нужно `WHERE age IS NULL`. NULL — это не значение, а отсутствие значения.
- "LIKE чувствителен к регистру" — зависит от базы данных. В PostgreSQL есть ILIKE для регистронезависимого поиска.

### Мини-проверка

1. Как получить всех пользователей старше 25 лет?
2. Чем отличается LIMIT 5 от LIMIT 5 OFFSET 10?
3. Как найти пользователей, у которых не указан возраст?

---

## INSERT — добавление данных

### Что это такое?

INSERT добавляет новые строки в таблицу.

### Как работает?

```sql
-- Вставить одну запись
INSERT INTO users (name, email, age)
VALUES ('Игорь', 'igor@mail.ru', 25);

-- Вставить несколько записей сразу
INSERT INTO users (name, email, age)
VALUES
  ('Анна', 'anna@mail.ru', 30),
  ('Дмитрий', 'dima@mail.ru', 22),
  ('Мария', 'maria@mail.ru', 28);

-- Вставить и получить результат
INSERT INTO users (name, email, age)
VALUES ('Олег', 'oleg@mail.ru', 35)
RETURNING id, name;
-- Вернет: id = 5, name = 'Олег'
```

### Примеры кода

```sql
-- Вставить товар (description не указан — будет NULL)
INSERT INTO products (title, price)
VALUES ('Клавиатура', 2500.00);

-- Вставить с явным указанием всех полей
INSERT INTO products (title, price, description, in_stock)
VALUES ('Мышь', 1200.00, 'Беспроводная мышь', true);
```

### Частые заблуждения

- "Порядок VALUES должен совпадать с порядком столбцов в таблице" — нет, он должен совпадать с порядком столбцов в скобках после INSERT INTO.
- "SERIAL-поле нужно указывать" — нет, оно заполняется автоматически.

---

## UPDATE — изменение данных

### Что это такое?

UPDATE изменяет существующие записи. Всегда используй WHERE, иначе обновятся **все** строки.

### Как работает?

```sql
-- Изменить возраст конкретного пользователя
UPDATE users
SET age = 26
WHERE id = 1;

-- Изменить несколько полей
UPDATE users
SET name = 'Игорь Петров', age = 26
WHERE id = 1;

-- Увеличить цену всех товаров на 10%
UPDATE products
SET price = price * 1.10;
-- ОПАСНО! Без WHERE обновятся ВСЕ записи
```

### Частые заблуждения

- "UPDATE без WHERE обновит одну запись" — нет, обновит ВСЕ записи в таблице. Это самая частая причина потери данных.

---

## DELETE — удаление данных

### Что это такое?

DELETE удаляет строки из таблицы. Как и UPDATE, всегда используй WHERE.

### Как работает?

```sql
-- Удалить одного пользователя
DELETE FROM users WHERE id = 3;

-- Удалить всех с возрастом NULL
DELETE FROM users WHERE age IS NULL;

-- Удалить ВСЕ записи (таблица останется, но пустая)
DELETE FROM users;

-- Быстрое удаление всех записей (сбрасывает счетчик SERIAL)
TRUNCATE TABLE users;
```

### Частые заблуждения

- "DELETE удаляет таблицу" — нет, DELETE удаляет строки. Таблицу удаляет DROP TABLE.
- "TRUNCATE и DELETE — одно и то же" — TRUNCATE быстрее, сбрасывает счетчики, но не поддерживает WHERE.

### Мини-проверка

1. Что произойдет при `UPDATE users SET age = 0;` без WHERE?
2. Чем DELETE отличается от TRUNCATE?
3. Как вставить запись и сразу получить ее id?

---

## Итог

SQL — это язык общения с базой данных. Четыре основные операции (CRUD):

| Операция | SQL     | Что делает        |
|----------|---------|-------------------|
| Create   | INSERT  | Создает записи    |
| Read     | SELECT  | Читает данные     |
| Update   | UPDATE  | Изменяет записи   |
| Delete   | DELETE  | Удаляет записи    |

Ключевые правила:
- Всегда создавай PRIMARY KEY
- Всегда используй WHERE в UPDATE и DELETE
- NULL — это не значение, проверяй через IS NULL
- RETURNING помогает получить данные после INSERT/UPDATE

---

> [[sql/02-join-group|Следующая глава: JOIN и GROUP BY -->]]
> [[sql-fundamentals|<-- Назад к оглавлению SQL]]
