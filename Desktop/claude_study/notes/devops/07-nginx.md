# Nginx: reverse proxy и HTTPS

> [[devops/06-docker|<-- Предыдущая: Docker]] | [[devops/08-cicd|Следующая: CI/CD -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]

---

## Зачем эта тема существует?

Node.js-сервер может обрабатывать запросы, но он не предназначен для раздачи статики, балансировки нагрузки и HTTPS. Nginx — это высокопроизводительный веб-сервер, который ставится перед твоим приложением. Он принимает все входящие запросы, раздает статические файлы сам, а динамические — передает Node.js. На продакшне Nginx (или аналог) есть почти у каждого серьезного проекта.

---

## Что такое Reverse Proxy

### Что это такое?

Reverse proxy — сервер-посредник между клиентом и приложением. Клиент обращается к Nginx, а Nginx передает запрос Node.js-серверу.

### Как работает?

```
Без Nginx:
Клиент --> Node.js (порт 3000)
  - Нет HTTPS
  - Статику раздает Node.js (медленно)
  - Один сервер = одна точка отказа

С Nginx:
Клиент --> Nginx (порт 80/443) --> Node.js (порт 3000)
  - HTTPS на Nginx
  - Статику раздает Nginx (быстро)
  - Можно балансировать между несколькими Node.js
```

### Преимущества Nginx

```
1. Производительность — раздает статику в 10-100 раз быстрее Node.js
2. HTTPS — управление SSL-сертификатами
3. Сжатие — gzip/brotli сжатие ответов
4. Кеширование — кеширование статики и ответов
5. Балансировка — распределение нагрузки между серверами
6. Безопасность — защита от DDoS, rate limiting
```

### Частые заблуждения

- "Nginx — это замена Node.js" — нет, Nginx дополняет Node.js. Node.js обрабатывает бизнес-логику, Nginx — все остальное.
- "Nginx нужен только для больших проектов" — даже для маленького проекта HTTPS и раздача статики через Nginx — хорошая практика.

### Мини-проверка

1. Что такое reverse proxy?
2. Почему Nginx раздает статику быстрее Node.js?
3. Какие порты обычно использует Nginx?

---

## Базовая конфигурация Nginx

### Что это такое?

Конфигурация Nginx — файл, описывающий как обрабатывать запросы.

### Как работает?

```nginx
# nginx.conf — базовая конфигурация

# Количество рабочих процессов (auto = по количеству ядер CPU)
worker_processes auto;

events {
    # Максимальное количество соединений на процесс
    worker_connections 1024;
}

http {
    # Типы файлов
    include       mime.types;
    default_type  application/octet-stream;

    # Оптимизация передачи файлов
    sendfile on;

    # Таймауты
    keepalive_timeout 65;

    # Сжатие
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_min_length 1000;

    # Сервер
    server {
        listen 80;
        server_name myapp.com www.myapp.com;

        # Проксирование на Node.js
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Статические файлы — раздает Nginx напрямую
        location /_next/static {
            alias /app/.next/static;
            expires 365d;
            access_log off;
        }

        location /public {
            alias /app/public;
            expires 30d;
            access_log off;
        }
    }
}
```

### Разбор ключевых директив

```nginx
listen 80;
# Слушать порт 80 (HTTP)

server_name myapp.com;
# Доменное имя (Nginx может обслуживать несколько доменов)

location / {
    proxy_pass http://localhost:3000;
}
# Все запросы на / передаются на Node.js (порт 3000)

proxy_set_header X-Real-IP $remote_addr;
# Передать реальный IP клиента в Node.js
# Без этого Node.js видит IP = 127.0.0.1 (Nginx)

location /_next/static {
    expires 365d;
}
# Статика Next.js кешируется на год (файлы имеют хеш в имени)
```

### Частые заблуждения

- "proxy_pass и redirect — одно и то же" — нет. proxy_pass передает запрос внутри сервера (клиент не знает). redirect отправляет клиента на другой URL.

---

## HTTPS с Let's Encrypt

### Что это такое?

HTTPS шифрует трафик между клиентом и сервером. Let's Encrypt — бесплатный центр сертификации, который автоматически выдает SSL-сертификаты.

### Как работает?

```bash
# Установка Certbot (инструмент для Let's Encrypt)
# Ubuntu/Debian:
sudo apt install certbot python3-certbot-nginx

# Получить сертификат и автоматически настроить Nginx
sudo certbot --nginx -d myapp.com -d www.myapp.com

# Certbot автоматически:
# 1. Получает сертификат
# 2. Настраивает Nginx для HTTPS
# 3. Добавляет редирект HTTP -> HTTPS
```

### Конфигурация после Certbot

```nginx
server {
    listen 80;
    server_name myapp.com www.myapp.com;

    # Редирект HTTP -> HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name myapp.com www.myapp.com;

    # SSL-сертификаты (добавлены Certbot)
    ssl_certificate /etc/letsencrypt/live/myapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myapp.com/privkey.pem;

    # Рекомендуемые настройки SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Заголовки безопасности
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Автообновление сертификата

```bash
# Сертификат Let's Encrypt действителен 90 дней
# Certbot добавляет cron-задачу для автообновления

# Проверить автообновление
sudo certbot renew --dry-run

# Ручное обновление
sudo certbot renew
```

### Частые заблуждения

- "HTTPS нужен только для банков и магазинов" — нет, Google понижает в поиске сайты без HTTPS. Браузеры показывают предупреждение "Небезопасно".
- "SSL-сертификат стоит денег" — Let's Encrypt бесплатен и доверен всеми браузерами.

### Мини-проверка

1. Что делает `return 301 https://$host$request_uri`?
2. Как часто нужно обновлять сертификат Let's Encrypt?
3. Зачем нужен заголовок Strict-Transport-Security?

---

## Nginx в Docker

### Как работает?

```yaml
# docker-compose.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/letsencrypt:ro
    depends_on:
      - app
    restart: unless-stopped

  app:
    build: .
    expose:
      - '3000'  # expose, не ports — доступен только внутри Docker network
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb

volumes:
  postgres_data:
```

```nginx
# nginx.conf для Docker
# Вместо localhost:3000 используем имя сервиса (app)
upstream backend {
    server app:3000;
}

server {
    listen 80;
    server_name myapp.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Балансировка нагрузки

### Что это такое?

Когда одного сервера не хватает, Nginx распределяет запросы между несколькими копиями приложения.

### Как работает?

```nginx
# Несколько серверов приложения
upstream backend {
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

# Алгоритмы балансировки:
upstream backend {
    # Round-robin (по умолчанию) — по очереди
    server app1:3000;
    server app2:3000;

    # Least connections — на сервер с наименьшим количеством соединений
    least_conn;

    # IP hash — один клиент всегда на одном сервере
    ip_hash;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

```yaml
# docker-compose.yml — масштабирование
services:
  app:
    build: .
    deploy:
      replicas: 3  # Три копии приложения
```

```bash
# Или через docker compose
docker compose up -d --scale app=3
```

---

## Итог

| Функция Nginx | Зачем |
|-------------|-------|
| Reverse Proxy | Передача запросов в Node.js |
| Static Files | Быстрая раздача статики |
| HTTPS | Шифрование трафика |
| Gzip | Сжатие ответов |
| Load Balancing | Распределение нагрузки |
| Security Headers | Защита от атак |

Ключевые правила:
- Nginx перед Node.js на продакшне — стандартная практика
- HTTPS обязателен (Let's Encrypt бесплатен)
- Статику раздавай через Nginx, не через Node.js
- В Docker используй имена сервисов вместо localhost

---

> [[devops/06-docker|<-- Предыдущая: Docker]] | [[devops/08-cicd|Следующая: CI/CD -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]
