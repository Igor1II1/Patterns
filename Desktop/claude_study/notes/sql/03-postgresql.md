# PostgreSQL: установка, настройка и работа

> [[sql/02-join-group|<-- Предыдущая: JOIN и GROUP BY]]
> [[sql-fundamentals|<-- Назад к оглавлению SQL]]

---

## Зачем эта тема существует?

PostgreSQL — одна из самых мощных и популярных open-source баз данных. Ее используют компании от стартапов до Netflix и Instagram. Для Junior Fullstack Developer умение работать с PostgreSQL — обязательный навык. Эта глава научит тебя устанавливать PostgreSQL, работать через терминал и pgAdmin, создавать базы данных и понимать основы производительности.

---

## Установка PostgreSQL

### Что это такое?

PostgreSQL — это сервер базы данных. Он работает как фоновый процесс (служба) на твоем компьютере и ждет подключений.

### Как работает?

#### Windows

1. Скачай установщик с [postgresql.org](https://www.postgresql.org/download/windows/)
2. Запусти, выбери компоненты: PostgreSQL Server, pgAdmin, Command Line Tools
3. Укажи пароль для пользователя `postgres` (запомни его!)
4. Порт по умолчанию: 5432
5. После установки PostgreSQL запускается автоматически как служба

#### Через Docker (рекомендуется для разработки)

```bash
# Запустить PostgreSQL в контейнере
docker run --name my-postgres \
  -e POSTGRES_PASSWORD=mypassword \
  -p 5432:5432 \
  -d postgres:16

# Подключиться к контейнеру
docker exec -it my-postgres psql -U postgres
```

### Проверка установки

```bash
# Проверить версию
psql --version
# psql (PostgreSQL) 16.2

# Подключиться
psql -U postgres
# Введи пароль, который задал при установке
```

### Частые заблуждения

- "PostgreSQL и MySQL — одно и то же" — нет. PostgreSQL строже следует стандарту SQL, поддерживает больше типов данных и возможностей.
- "Нужен отдельный сервер" — нет, PostgreSQL отлично работает на локальном компьютере для разработки.

---

## psql — работа в терминале

### Что это такое?

psql — это CLI-клиент для PostgreSQL. Через него ты подключаешься к базе и выполняешь SQL-запросы прямо в терминале.

### Как работает?

```bash
# Подключиться к базе данных
psql -U postgres                    # к базе по умолчанию
psql -U postgres -d mydb            # к конкретной базе
psql -U postgres -h localhost -p 5432  # с явным хостом и портом

# Строка подключения (connection string)
psql "postgresql://postgres:password@localhost:5432/mydb"
```

### Основные команды psql

```
\l          — список всех баз данных
\c mydb     — переключиться на базу mydb
\dt         — список таблиц в текущей базе
\d users    — описание таблицы users (столбцы, типы)
\d+ users   — подробное описание (с размерами и комментариями)
\du         — список пользователей (ролей)
\di         — список индексов
\q          — выход из psql
\?          — справка по командам psql
\h SELECT   — справка по SQL-команде SELECT
\timing     — включить/выключить отображение времени выполнения
```

### Примеры кода

```sql
-- Создать базу данных
CREATE DATABASE myapp;

-- Переключиться на нее
\c myapp

-- Создать таблицу
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Проверить структуру
\d users

-- Вставить данные
INSERT INTO users (name, email) VALUES ('Игорь', 'igor@mail.ru');

-- Проверить
SELECT * FROM users;

-- Удалить базу данных (сначала отключись от нее!)
\c postgres
DROP DATABASE myapp;
```

### Частые заблуждения

- "psql — единственный способ работать с PostgreSQL" — нет, есть pgAdmin, DBeaver, DataGrip и другие GUI-клиенты.
- "Нужно заканчивать команды psql точкой с запятой" — нет, команды psql (начинающиеся с `\`) не требуют `;`. А вот SQL-запросы — требуют.

### Мини-проверка

1. Как посмотреть список таблиц в текущей базе?
2. Как переключиться на другую базу данных?
3. Чем команда `\d` отличается от `\dt`?

---

## pgAdmin — графический интерфейс

### Что это такое?

pgAdmin — это веб-приложение для управления PostgreSQL через графический интерфейс. Устанавливается вместе с PostgreSQL на Windows.

### Как работает?

1. Открой pgAdmin (ищи в меню Пуск)
2. При первом запуске задай мастер-пароль для pgAdmin
3. В дереве слева найди Servers -> PostgreSQL
4. Введи пароль от пользователя postgres

Основные действия в pgAdmin:
- **Создать базу**: правый клик на Databases -> Create -> Database
- **Создать таблицу**: Schemas -> public -> Tables -> Create -> Table
- **Выполнить запрос**: Tools -> Query Tool (или иконка молнии)
- **Просмотр данных**: правый клик на таблицу -> View/Edit Data

### Когда что использовать

| Задача | psql | pgAdmin |
|--------|------|---------|
| Быстрый запрос | Удобнее | Можно |
| Сложный запрос с отладкой | Можно | Удобнее |
| Просмотр структуры БД | `\d` | Визуально нагляднее |
| Экспорт/импорт данных | Можно | Удобнее |
| Миграции в продакшн | Через скрипты | Не рекомендуется |

---

## Создание базы данных и таблиц

### Что это такое?

Правильное проектирование базы данных — основа хорошего приложения. Здесь мы разберем типичную структуру для веб-приложения.

### Примеры кода

```sql
-- Создаем базу данных для приложения
CREATE DATABASE bookstore;
\c bookstore

-- Таблица авторов
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица книг (связана с авторами)
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  author_id INTEGER NOT NULL REFERENCES authors(id),
  isbn VARCHAR(13) UNIQUE,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  pages INTEGER CHECK (pages > 0),
  published_at DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица категорий
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- Связь многие-ко-многим (книга может быть в нескольких категориях)
CREATE TABLE book_categories (
  book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, category_id)
);
```

### Ограничения (Constraints)

```sql
-- NOT NULL — поле обязательно
name VARCHAR(100) NOT NULL

-- UNIQUE — значение уникально
email VARCHAR(255) UNIQUE

-- CHECK — проверка условия
price DECIMAL(10, 2) CHECK (price > 0)
age INTEGER CHECK (age >= 0 AND age <= 150)

-- REFERENCES — внешний ключ (связь с другой таблицей)
author_id INTEGER REFERENCES authors(id)

-- ON DELETE CASCADE — при удалении автора удалятся и его книги
author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE

-- ON DELETE SET NULL — при удалении автора поле станет NULL
author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL

-- DEFAULT — значение по умолчанию
status VARCHAR(20) DEFAULT 'active'
```

### Изменение таблиц (ALTER TABLE)

```sql
-- Добавить столбец
ALTER TABLE books ADD COLUMN rating DECIMAL(3, 2);

-- Удалить столбец
ALTER TABLE books DROP COLUMN rating;

-- Переименовать столбец
ALTER TABLE books RENAME COLUMN title TO book_title;

-- Изменить тип столбца
ALTER TABLE books ALTER COLUMN pages TYPE BIGINT;

-- Добавить ограничение
ALTER TABLE books ADD CONSTRAINT positive_price CHECK (price > 0);

-- Удалить ограничение
ALTER TABLE books DROP CONSTRAINT positive_price;
```

### Частые заблуждения

- "CASCADE удалит всю связанную цепочку" — да, и это может быть опасно. Используй CASCADE осторожно.
- "ALTER TABLE не блокирует таблицу" — некоторые операции (смена типа столбца) блокируют таблицу для записи. На больших таблицах это может вызвать проблемы.

### Мини-проверка

1. Что делает ON DELETE CASCADE?
2. Чем CHECK отличается от NOT NULL?
3. Как добавить новый столбец в существующую таблицу?

---

## Индексы

### Что это такое?

Индекс — это структура данных, которая ускоряет поиск в таблице. Работает как алфавитный указатель в книге: вместо чтения всех страниц ты сразу находишь нужную.

### Как работает?

Без индекса PostgreSQL читает **каждую** строку таблицы (Sequential Scan). С индексом — сразу находит нужные строки (Index Scan).

```sql
-- Создать индекс
CREATE INDEX idx_books_author ON books(author_id);

-- Составной индекс (по нескольким столбцам)
CREATE INDEX idx_books_author_title ON books(author_id, title);

-- Уникальный индекс (как UNIQUE, но явный)
CREATE UNIQUE INDEX idx_books_isbn ON books(isbn);

-- Посмотреть индексы таблицы
\di

-- Удалить индекс
DROP INDEX idx_books_author;
```

### Когда создавать индексы

```sql
-- Столбцы в WHERE — индексируй
SELECT * FROM books WHERE author_id = 5;
-- Нужен индекс на author_id

-- Столбцы в JOIN — индексируй
SELECT * FROM books b JOIN authors a ON b.author_id = a.id;
-- Нужен индекс на books.author_id

-- Столбцы в ORDER BY — индексируй
SELECT * FROM books ORDER BY published_at DESC;
-- Индекс на published_at ускорит сортировку

-- НЕ нужен индекс на:
-- маленькие таблицы (< 1000 строк)
-- столбцы с малой уникальностью (boolean, status с 3 значениями)
-- таблицы, куда часто пишут (индексы замедляют INSERT/UPDATE)
```

### EXPLAIN — анализ запроса

```sql
-- Показать план выполнения запроса
EXPLAIN SELECT * FROM books WHERE author_id = 5;

-- С реальным временем выполнения
EXPLAIN ANALYZE SELECT * FROM books WHERE author_id = 5;
```

Пример вывода:

```
Seq Scan on books  (cost=0.00..25.00 rows=5 width=100)
  Filter: (author_id = 5)
```

`Seq Scan` — полный перебор, плохо для больших таблиц. После добавления индекса:

```
Index Scan using idx_books_author on books  (cost=0.15..8.20 rows=5 width=100)
  Index Cond: (author_id = 5)
```

`Index Scan` — быстрый поиск по индексу.

### Частые заблуждения

- "Индексы нужно создавать на все столбцы" — нет! Каждый индекс замедляет INSERT, UPDATE, DELETE и занимает место на диске.
- "PRIMARY KEY не создает индекс" — создает автоматически. UNIQUE тоже.
- "Индекс на (a, b) заменяет индекс на (a)" — да, составной индекс работает для поиска по первому столбцу. Но не работает для поиска только по второму.

### Мини-проверка

1. Что делает EXPLAIN ANALYZE?
2. Чем Seq Scan отличается от Index Scan?
3. Почему нельзя индексировать все столбцы?

---

## Основы производительности

### Что это такое?

Производительность — это скорость выполнения запросов. Плохо написанный запрос может работать секунды вместо миллисекунд. Вот основные правила оптимизации.

### Правила хорошей производительности

```sql
-- 1. Не используй SELECT * в продакшне
-- Плохо:
SELECT * FROM books;
-- Хорошо:
SELECT id, title, price FROM books;

-- 2. Используй LIMIT для больших таблиц
SELECT id, title FROM books ORDER BY created_at DESC LIMIT 20;

-- 3. Индексируй столбцы в WHERE и JOIN
CREATE INDEX idx_orders_user ON orders(user_id);

-- 4. Используй COUNT аккуратно
-- Медленно на больших таблицах:
SELECT COUNT(*) FROM books;
-- Быстрая оценка (приблизительная):
SELECT reltuples FROM pg_class WHERE relname = 'books';

-- 5. EXPLAIN ANALYZE — твой друг
EXPLAIN ANALYZE SELECT * FROM books WHERE price > 1000;

-- 6. Используй пагинацию
-- Страница 3 по 20 записей:
SELECT * FROM books ORDER BY id LIMIT 20 OFFSET 40;

-- 7. Транзакции для нескольких операций
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- Если что-то пошло не так:
ROLLBACK;
```

### Транзакции

```sql
-- Транзакция — группа операций, которые выполняются целиком или не выполняются вовсе
BEGIN;
  INSERT INTO orders (user_id, total) VALUES (1, 5000);
  UPDATE products SET stock = stock - 1 WHERE id = 42;
COMMIT;

-- Если между BEGIN и COMMIT произойдет ошибка —
-- все изменения откатятся автоматически
```

### Бэкапы

```bash
# Создать бэкап базы
pg_dump -U postgres mydb > backup.sql

# Восстановить из бэкапа
psql -U postgres mydb < backup.sql

# Бэкап в сжатом формате
pg_dump -U postgres -Fc mydb > backup.dump

# Восстановить сжатый бэкап
pg_restore -U postgres -d mydb backup.dump
```

### Частые заблуждения

- "Оптимизировать нужно с самого начала" — нет, сначала пиши правильный код, потом оптимизируй по результатам EXPLAIN.
- "Транзакции нужны только для банковских операций" — нет, любой набор связанных изменений должен быть в транзакции.

### Мини-проверка

1. Почему SELECT * плохо для производительности?
2. Что такое транзакция и зачем она нужна?
3. Как сделать бэкап базы данных?

---

## Итог

PostgreSQL — мощная, надежная база данных для веб-приложений:

| Инструмент | Назначение |
|-----------|-----------|
| psql | CLI-клиент для быстрой работы |
| pgAdmin | Графический интерфейс |
| CREATE DATABASE | Создание базы |
| CREATE INDEX | Ускорение запросов |
| EXPLAIN ANALYZE | Анализ производительности |
| pg_dump / pg_restore | Бэкапы |

Ключевые правила:
- Создавай индексы на столбцы в WHERE и JOIN
- Используй EXPLAIN ANALYZE для диагностики
- Оборачивай связанные операции в транзакции
- Делай бэкапы регулярно

---

> [[sql/02-join-group|<-- Предыдущая: JOIN и GROUP BY]]
> [[sql-fundamentals|<-- Назад к оглавлению SQL]]
