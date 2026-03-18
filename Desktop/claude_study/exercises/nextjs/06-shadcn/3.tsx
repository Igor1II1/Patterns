// ==================================================
// Задание 3: Form компоненты и валидация
// Уровень: 🟡 Средний
// Тема: Input, Label, Select, Form + React Hook Form + Zod
// Ссылка: notes/nextjs/06-shadcn.md — "Form"
// ==================================================
//
// 1. Создай простую форму с shadcn компонентами:
//    <div>
//      <Label htmlFor="email">Email</Label>
//      <Input id="email" type="email" placeholder="Введите email" />
//    </div>
//
// 2. Создай форму создания поста:
//    - Input для title
//    - Textarea для content
//    - Select для категории (React, Next.js, TypeScript)
//    - Button submit
//
// 3. Добавь Zod-валидацию (напиши схему):
//    const postSchema = z.object({
//      title: z.string().min(3, "Минимум 3 символа"),
//      content: z.string().min(10, "Минимум 10 символов"),
//      category: z.enum(["react", "nextjs", "typescript"]),
//    })
//
// 4. Подключи React Hook Form + Zod resolver:
//    const form = useForm<z.infer<typeof postSchema>>({
//      resolver: zodResolver(postSchema),
//    })
//
// 5. Покажи вывод ошибок валидации под полями.
//
// Пиши код ниже:
// ==================================================
