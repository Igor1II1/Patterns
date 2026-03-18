// ==================================================
// Задание 1: Загрузка файлов в Next.js
// Уровень: 🟢 Лёгкий
// Тема: FormData, API route для загрузки файлов
// Ссылка: Глава отсутствует — основано на теме "File Upload"
// ==================================================
//
// 1. Создай форму загрузки файла (Client Component):
//    <form onSubmit={handleSubmit}>
//      <input type="file" accept="image/*" onChange={handleFileChange} />
//      <button type="submit">Загрузить</button>
//    </form>
//
// 2. Отправка файла через FormData:
//    async function handleSubmit(e) {
//      e.preventDefault()
//      const formData = new FormData()
//      formData.append("file", file)
//      const res = await fetch("/api/upload", { method: "POST", body: formData })
//    }
//
// 3. API Route для приёма файла:
//    export async function POST(request: NextRequest) {
//      const formData = await request.formData()
//      const file = formData.get("file") as File
//      const bytes = await file.arrayBuffer()
//      const buffer = Buffer.from(bytes)
//      // Сохранить в public/uploads/...
//    }
//
// 4. Валидация файла:
//    - Максимальный размер (5 MB)
//    - Допустимые типы (image/jpeg, image/png)
//
// 5. Напиши в комментарии:
//    - Что такое FormData?
//    - Почему нельзя отправить файл через JSON?
//
// Пиши код ниже:
// ==================================================
