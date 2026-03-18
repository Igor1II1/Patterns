# Загрузка файлов: Cloudinary и S3

> [[backend/05-protected-routes|<-- Предыдущая: Защита маршрутов]] | [[backend/07-deploy|Следующая: Деплой -->]]
> [[backend-fundamentals|<-- Назад к оглавлению Backend]]

---

## Зачем эта тема существует?

Пользователи загружают аватары, фотографии, документы. Хранить файлы в базе данных — плохая идея (база раздуется). Хранить на своем сервере — рабочий, но не масштабируемый вариант. Облачные хранилища (Cloudinary, AWS S3) — стандартное решение: они хранят файлы, оптимизируют изображения и раздают через CDN по всему миру.

---

## Загрузка файлов через API Route

### Что это такое?

Next.js API Route принимает файлы через FormData. Файл приходит как бинарные данные, и ты решаешь — сохранить локально или отправить в облако.

### Как работает?

```typescript
// app/api/upload/route.ts — базовая загрузка
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Файл не передан' }, { status: 400 })
    }

    // Преобразуем File в Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Создаем уникальное имя файла
    const uniqueName = `${Date.now()}-${file.name}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')

    // Создаем директорию если нет
    await mkdir(uploadDir, { recursive: true })

    // Сохраняем файл
    const filePath = path.join(uploadDir, uniqueName)
    await writeFile(filePath, buffer)

    return NextResponse.json({
      url: `/uploads/${uniqueName}`,
      name: file.name,
      size: file.size,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 })
  }
}
```

```typescript
// Клиентский компонент для загрузки
'use client'
import { useState } from 'react'

export function FileUpload() {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      // НЕ устанавливай Content-Type! Браузер сделает это сам с boundary
    })

    const data = await response.json()
    setImageUrl(data.url)
    setUploading(false)
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {uploading && <p>Загрузка...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" width={200} />}
    </div>
  )
}
```

### Частые заблуждения

- "Можно указать Content-Type: multipart/form-data вручную" — нет! Браузер сам поставит правильный Content-Type с boundary. Если указать вручную — сервер не сможет разобрать данные.
- "Хранить файлы в public/ — хорошее решение" — только для разработки. На продакшне файлы в public/ потеряются при повторном деплое на Vercel.

---

## Валидация файлов

### Что это такое?

Нельзя принимать любые файлы. Нужно проверять тип, размер и содержимое.

### Как работает?

```typescript
// lib/file-validation.ts
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024  // 5 МБ

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Проверка типа
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Допустимые форматы: ${ALLOWED_TYPES.map(t => t.split('/')[1]).join(', ')}`,
    }
  }

  // Проверка размера
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `Максимальный размер: ${MAX_SIZE / 1024 / 1024} МБ`,
    }
  }

  return { valid: true }
}
```

```typescript
// Использование в API
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Файл не передан' }, { status: 400 })
  }

  const validation = validateFile(file)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 422 })
  }

  // Файл прошел валидацию, можно загружать
}
```

### Частые заблуждения

- "Проверки расширения файла достаточно" — нет, расширение можно подменить. Проверяй MIME-тип и, в идеале, первые байты файла (magic bytes).

### Мини-проверка

1. Почему нельзя доверять расширению файла?
2. Какой максимальный размер файла разумно ставить для аватаров?
3. Почему нельзя указывать Content-Type вручную для FormData?

---

## Cloudinary

### Что это такое?

Cloudinary — облачный сервис для хранения и обработки изображений. Бесплатный план включает 25 ГБ хранилища и автоматическую оптимизацию. Популярный выбор для стартапов и учебных проектов.

### Как работает?

```bash
npm install cloudinary
```

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export { cloudinary }
```

```env
# .env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```typescript
// app/api/upload/route.ts — загрузка в Cloudinary
import { NextRequest, NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Файл не передан' }, { status: 400 })
    }

    // Конвертируем в base64 для Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Загружаем в Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'avatars',                // папка в Cloudinary
      transformation: [
        { width: 400, height: 400, crop: 'fill' },  // обрезка
        { quality: 'auto' },                          // авто-качество
        { format: 'webp' },                           // формат webp
      ],
    })

    return NextResponse.json({
      url: result.secure_url,       // https://res.cloudinary.com/...
      publicId: result.public_id,   // avatars/abc123
      width: result.width,
      height: result.height,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 })
  }
}
```

### Трансформации изображений

```typescript
// Cloudinary умеет трансформировать изображения "на лету"
// Просто меняем URL:

// Оригинал
// https://res.cloudinary.com/demo/image/upload/sample.jpg

// Ресайз до 300x200
// https://res.cloudinary.com/demo/image/upload/w_300,h_200,c_fill/sample.jpg

// В коде:
const thumbnailUrl = cloudinary.url(publicId, {
  width: 150,
  height: 150,
  crop: 'thumb',
  gravity: 'face',  // фокус на лице
  format: 'webp',
  quality: 'auto',
})
```

### Удаление файла

```typescript
// Удалить из Cloudinary
await cloudinary.uploader.destroy('avatars/abc123')
```

### Частые заблуждения

- "Cloudinary бесплатен без ограничений" — нет, бесплатный план ограничен: 25 credit/месяц (примерно 25 000 трансформаций или 25 ГБ хранилища).

---

## AWS S3

### Что это такое?

Amazon S3 (Simple Storage Service) — промышленный стандарт для хранения файлов. Используется крупными компаниями. Сложнее в настройке, но масштабируется неограниченно.

### Как работает?

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

```typescript
// lib/s3.ts
import { S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})
```

```typescript
// app/api/upload/s3/route.ts — загрузка в S3
import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@/lib/s3'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Файл не передан' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const key = `uploads/${randomUUID()}-${file.name}`

    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }))

    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

    return NextResponse.json({ url, key })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 })
  }
}
```

### Presigned URLs — безопасная загрузка напрямую

```typescript
// Вместо загрузки через сервер — клиент загружает напрямую в S3
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// API генерирует подписанный URL
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fileName = searchParams.get('fileName')!
  const fileType = searchParams.get('fileType')!

  const key = `uploads/${randomUUID()}-${fileName}`

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  })

  // URL действителен 60 секунд
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 })

  return NextResponse.json({ uploadUrl: signedUrl, key })
}
```

```typescript
// Клиент загружает файл напрямую в S3
async function uploadToS3(file: File) {
  // 1. Получаем подписанный URL
  const res = await fetch(`/api/upload/presign?fileName=${file.name}&fileType=${file.type}`)
  const { uploadUrl, key } = await res.json()

  // 2. Загружаем напрямую в S3
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })

  return key
}
```

### Частые заблуждения

- "S3 — это только для Amazon" — есть S3-совместимые сервисы: DigitalOcean Spaces, MinIO, Backblaze B2. Код останется почти тем же.

### Мини-проверка

1. Чем Cloudinary лучше S3 для изображений?
2. Что такое presigned URL и зачем он нужен?
3. Почему загрузка через presigned URL эффективнее?

---

## Оптимизация изображений

### Что это такое?

Необработанные изображения замедляют сайт. Next.js имеет встроенный компонент Image для оптимизации.

### Как работает?

```typescript
// Использование next/image с внешними URL (Cloudinary/S3)
import Image from 'next/image'

// next.config.js — разрешить внешние домены
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
    ],
  },
}

// Компонент
export function Avatar({ url, name }: { url: string; name: string }) {
  return (
    <Image
      src={url}
      alt={name}
      width={100}
      height={100}
      className="rounded-full"
      // Next.js автоматически:
      // - конвертирует в WebP/AVIF
      // - создает разные размеры для разных экранов
      // - лениво загружает (lazy loading)
    />
  )
}
```

---

## Итог

| Решение | Плюсы | Минусы | Когда использовать |
|---------|-------|--------|-------------------|
| Локальное хранение | Просто | Не масштабируется | Только разработка |
| Cloudinary | Оптимизация, CDN, бесплатный план | Лимиты | Изображения, стартапы |
| AWS S3 | Безлимитно, промышленный стандарт | Сложнее настройка | Большие проекты, любые файлы |

Ключевые правила:
- Всегда валидируй файлы (тип, размер)
- Не устанавливай Content-Type вручную для FormData
- Используй presigned URLs для больших файлов
- Оптимизируй изображения (next/image, Cloudinary transforms)

---

> [[backend/05-protected-routes|<-- Предыдущая: Защита маршрутов]] | [[backend/07-deploy|Следующая: Деплой -->]]
> [[backend-fundamentals|<-- Назад к оглавлению Backend]]
