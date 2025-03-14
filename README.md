Ё# Шаблоны проектирования

повторяемая архитектурная конструкция в сфере проектирования программного обеспечения, предлагающая решение проблемы проектирования в рамках некоторого часто возникающего контекста.

## плюсы

1.Снижение сложности разработки за счёт готовых абстракций для решения целого класса проблем.

2.Даёт решению своё имя, что облегчает коммуникацию между разработчиками, позволяя ссылаться на известные шаблоны.

3.Снижается количество ошибок.

## минусы

1.Слепое следование некоторому выбранному шаблону может привести к усложнению программы.

2.У разработчика может возникнуть желание попробовать некоторый шаблон в деле без особых оснований.

### Одиночка (Singleton)

Одиночка — это порождающий паттерн проектирования, который гарантирует, что у класса есть только один экземпляр, и предоставляет к нему глобальную точку доступа.

#### плюсы

1.Гарантирует наличие единственного экземпляра класса.

2.Предоставляет к нему глобальную точку доступа.

3.Реализует отложенную инициализацию объекта-одиночки.

#### минусы

1.Нарушает принцип единственной ответственности класса.

2.Маскирует плохой дизайн.

3.Проблемы мультипоточности.

4.Требует постоянного создания Mock-объектов при юнит-тестировании

#### применимость

Когда в программе должен быть единственный экземпляр какого-то класса, доступный всем клиентам (например, общий доступ к базе данных из разных частей программы).

Когда вам хочется иметь больше контроля над глобальными переменными.

### пример кода

```class Singleton {
    // Приватное статическое поле для хранения единственного экземпляра
    private static instance: Singleton;

    // Приватный конструктор, чтобы предотвратить создание экземпляров извне
    private constructor() {}

    // Статический метод для получения экземпляра
    public static getInstance(): Singleton {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }

    // Пример метода экземпляра
    public someMethod(): void {
        console.log("Метод экземпляра Singleton");
    }
}

// Использование
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

console.log(instance1 === instance2); // true, потому что это один и тот же экземпляр

instance1.someMethod(); // Выведет: "Метод экземпляра Singleton"
```

### Фабричный метод Factory Method

Фабричный метод — это порождающий паттерн проектирования, который определяет общий интерфейс для создания объектов в суперклассе, позволяя подклассам изменять тип создаваемых объектов.

#### кода использовать:

1.Когда вы заранее не знаете, объекты каких типов вам нужно создавать. Фабричный метод позволяет выбирать тип создаваемого объекта во время выполнения программы.

2.Когда вы хотите, чтобы код создания объектов был отделен от основного кода. Это упрощает поддержку и расширение системы.

3.Когда вы хотите предоставить возможность подклассам изменять тип создаваемых объектов. Это полезно в иерархиях классов, где каждый подкласс может создавать объекты своего типа.

#### ~~когда не использовать~~

1.Когда создание объектов простое и не требует сложной логики. В этом случае использование фабричного метода может излишне усложнить код.

2.Когда вы точно знаете, какие объекты вам нужно создавать, и их типы не изменяются. В таких случаях можно обойтись прямым созданием объектов.

#### плюсы

Гибкость: Позволяет легко добавлять новые типы объектов, не изменяя существующий код.

Разделение ответственности: Код создания объектов отделен от основного кода, что упрощает поддержку и тестирование.

Расширяемость: Подклассы могут изменять тип создаваемых объектов, что делает систему более гибкой.

#### минусы

Сложность: Добавляет дополнительные классы и интерфейсы, что может усложнить структуру программы.

Избыточность: Для простых случаев использование фабричного метода может быть излишним.

### пример кода

```// Абстрактный класс Creator
abstract class DocumentCreator {
    public abstract createDocument(): Document;

    public openDocument(): void {
        const document = this.createDocument();
        document.open();
    }
}

// Абстрактный класс Product
abstract class Document {
    public abstract open(): void;
}

// Конкретные продукты
class PDFDocument extends Document {
    public open(): void {
        console.log("Opening PDF document...");
    }
}

class WordDocument extends Document {
    public open(): void {
        console.log("Opening Word document...");
    }
}

// Конкретные создатели
class PDFDocumentCreator extends DocumentCreator {
    public createDocument(): Document {
        return new PDFDocument();
    }
}

class WordDocumentCreator extends DocumentCreator {
    public createDocument(): Document {
        return new WordDocument();
    }
}

// Использование
const pdfCreator = new PDFDocumentCreator();
pdfCreator.openDocument(); // Opening PDF document...

const wordCreator = new WordDocumentCreator();
wordCreator.openDocument(); // Opening Word document...
```

# Строитель (Builder)

## Описание шаблона

#### Строитель

это порождающий шаблон проектирования, который позволяет создавать сложные объекты пошагово. Он отделяет конструирование сложного объекта от его представления, так что один и тот же процесс конструирования может создавать разные представления.

### Когда использовать:

1.Когда объект имеет много параметров, и некоторые из них являются необязательными. Строитель позволяет упростить процесс создания объекта, избегая необходимости передавать множество параметров в конструктор.

2.Когда вам нужно создавать разные представления одного и того же объекта. Строитель позволяет изменять внутреннее представление объекта, не изменяя код, который его создает.

3.Когда процесс создания объекта сложен и состоит из нескольких этапов. Строитель позволяет разбить процесс создания на отдельные шаги, что делает код более читаемым и поддерживаемым.

### ~~Когда не использовать~~:

1.Когда объект простой и не имеет множества параметров. В этом случае использование строителя может излишне усложнить код.

2.Когда процесс создания объекта не требует гибкости и изменения представления. В таких случаях можно обойтись обычным конструктором.

#### Плюсы:

1.Упрощает создание сложных объектов: Позволяет создавать объекты пошагово, что упрощает процесс конструирования.

2.Разделение ответственности: Отделяет процесс создания объекта от его представления, что делает код более модульным.

3.Гибкость: Позволяет создавать разные представления одного и того же объекта.

#### Минусы:

1.Сложность: Добавляет дополнительные классы и интерфейсы, что может усложнить структуру программы.

2.Избыточность: Для простых объектов использование строителя может быть излишним.

```class House {
    public walls: string;
    public roof: string;
    public windows: number;
    public doors: number;

    constructor() {
        this.walls = '';
        this.roof = '';
        this.windows = 0;
        this.doors = 0;
    }

    public describe(): void {
        console.log(`House with ${this.walls} walls, ${this.roof} roof, ${this.windows} windows, and ${this.doors} doors.`);
    }
}

interface HouseBuilder {
    buildWalls(): void;
    buildRoof(): void;
    buildWindows(): void;
    buildDoors(): void;
    getResult(): House;
}

class ConcreteHouseBuilder implements HouseBuilder {
    private house: House;

    constructor() {
        this.house = new House();
    }

    public buildWalls(): void {
        this.house.walls = 'brick';
    }

    public buildRoof(): void {
        this.house.roof = 'tile';
    }

    public buildWindows(): void {
        this.house.windows = 4;
    }

    public buildDoors(): void {
        this.house.doors = 2;
    }

    public getResult(): House {
        return this.house;
    }
}

class Director {
    private builder: HouseBuilder;

    constructor(builder: HouseBuilder) {
        this.builder = builder;
    }

    public construct(): void {
        this.builder.buildWalls();
        this.builder.buildRoof();
        this.builder.buildWindows();
        this.builder.buildDoors();
    }
}

// Использование
const builder = new ConcreteHouseBuilder();
const director = new Director(builder);

director.construct();
const house = builder.getResult();
house.describe(); // House with brick walls, tile roof, 4 windows, and 2 doors.
```

# Прототип (Prototype)

## Описание шаблона

#### Прототип —

это порождающий шаблон проектирования, который позволяет создавать новые объекты путем копирования существующих объектов, вместо создания новых объектов через конструктор. Этот шаблон полезен, когда создание объекта требует больших ресурсов или когда объекты имеют сложную структуру.

### Когда использовать:

1.Когда создание объекта требует больших ресурсов (например, время, память, вычислительные ресурсы). Прототип позволяет избежать повторного выполнения дорогостоящих операций.

2.Когда объекты имеют сложную структуру, и их создание через конструктор затруднено. Прототип позволяет копировать объекты, не вникая в их внутреннюю структуру.

3.Когда нужно создавать объекты, которые должны быть похожи на существующие объекты, но с небольшими изменениями. Прототип позволяет клонировать объекты и затем модифицировать их.

### ~~Когда не использовать~~:

1.Когда объекты простые и их создание не требует больших ресурсов. В этом случае использование прототипа может быть излишним.

2.Когда объекты имеют уникальное состояние, которое не должно копироваться. Прототип может привести к нежелательному копированию состояния.

#### Плюсы:

1.Экономия ресурсов: Позволяет избежать повторного выполнения дорогостоящих операций при создании объектов.

2.Упрощение создания сложных объектов: Позволяет копировать объекты, не вникая в их внутреннюю структуру.

3.Гибкость: Позволяет создавать объекты, которые похожи на существующие, но с небольшими изменениями.

#### Минусы:

1.Сложность клонирования: Клонирование объектов с глубокой вложенностью может быть сложным и требовать дополнительных усилий.

2.Проблемы с уникальным состоянием: Если объекты имеют уникальное состояние, копирование может привести к нежелательным последствиям.

### пример кода

```class Car {
    public model: string;
    public color: string;
    public features: string[];

    constructor(model: string, color: string, features: string[]) {
        this.model = model;
        this.color = color;
        this.features = features;
    }

    public clone(): Car {
        return new Car(this.model, this.color, [...this.features]);
    }

    public describe(): void {
        console.log(`Car: ${this.model}, Color: ${this.color}, Features: ${this.features.join(', ')}`);
    }
}

// Использование
const originalCar = new Car('Tesla Model S', 'Red', ['Autopilot', 'Ludicrous Mode']);
originalCar.describe(); // Car: Tesla Model S, Color: Red, Features: Autopilot, Ludicrous Mode

const clonedCar = originalCar.clone();
clonedCar.color = 'Blue';
clonedCar.features.push('Sunroof');
clonedCar.describe(); // Car: Tesla Model S, Color: Blue, Features: Autopilot, Ludicrous Mode, Sunroof
```

# Адаптер (Adapter)

## Описание шаблона

#### Адаптер —

это структурный шаблон проектирования, который позволяет объектам с несовместимыми интерфейсами работать вместе. Адаптер преобразует интерфейс одного класса в интерфейс, ожидаемый клиентом, обеспечивая совместную работу классов, которые иначе не могли бы работать вместе из-за несовместимости интерфейсов.

### Когда использовать:

1.Когда нужно интегрировать новый класс в существующую систему, но его интерфейс не совместим с интерфейсами, ожидаемыми клиентом.

2.Когда нужно использовать сторонний класс или библиотеку, но их интерфейс не соответствует вашим требованиям.

3.Когда нужно обеспечить взаимодействие между несколькими классами, которые имеют разные интерфейсы, но должны работать вместе.

### ~~Когда не использовать~~:

1.Когда интерфейсы классов уже совместимы. В этом случае использование адаптера будет излишним.

2.Когда можно изменить интерфейс одного из классов, чтобы сделать его совместимым с другим. В таких случаях лучше изменить интерфейс, чем добавлять дополнительный слой в виде адаптера.

### Плюсы:

1.Совместимость: Позволяет работать с классами, которые имеют несовместимые интерфейсы.

2.Гибкость: Позволяет интегрировать новые классы в существующую систему без изменения существующего кода.

3.Разделение ответственности: Отделяет код, отвечающий за преобразование интерфейсов, от основного кода.

### Минусы:

1.Сложность: Добавляет дополнительные классы и интерфейсы, что может усложнить структуру программы.

2.Производительность: Введение дополнительного слоя может привести к небольшим накладным расходам.

## Пример кода

```// Целевой интерфейс, который ожидает клиент
interface EuropeanSocket {
    plugIn(): void;
}

// Класс, который нужно адаптировать
class AmericanSocket {
    public connect(): void {
        console.log("American socket is connected.");
    }
}

// Адаптер, который преобразует AmericanSocket в EuropeanSocket
class AmericanToEuropeanAdapter implements EuropeanSocket {
    private americanSocket: AmericanSocket;

    constructor(americanSocket: AmericanSocket) {
        this.americanSocket = americanSocket;
    }

    public plugIn(): void {
        this.americanSocket.connect();
    }
}

// Использование
const americanSocket = new AmericanSocket();
const adapter = new AmericanToEuropeanAdapter(americanSocket);

adapter.plugIn(); // American socket is connected.
```

# Декоратор (Decorator)

## Описание шаблона

#### Декоратор —

это структурный шаблон проектирования, который позволяет динамически добавлять объектам новые поведения или обязанности, не изменяя их исходный код. Декоратор оборачивает объект в другой объект, который добавляет или изменяет его функциональность. Это позволяет гибко расширять поведение объектов без необходимости создания подклассов.

### Когда использовать:

1.Когда нужно динамически добавлять объектам новые функции без изменения их исходного кода.

2.Когда нужно расширить функциональность объекта, но создание подклассов невозможно или нецелесообразно.

3.Когда нужно добавлять или удалять обязанности объектов во время выполнения программы.

### ~~Когда не использовать~~:

1.Когда функциональность объекта статична и не требует изменений. В этом случае использование декоратора может быть излишним.

2.Когда добавление новых функций требует значительного изменения структуры кода. В таких случаях лучше рассмотреть другие подходы, такие как наследование или композиция.

### Плюсы:

1.Гибкость: Позволяет динамически добавлять или изменять поведение объектов.

2.Расширяемость: Позволяет добавлять новые функции без изменения существующего кода.

3.Разделение ответственности: Каждый декоратор отвечает за одну конкретную функцию, что делает код более модульным.

### Минусы:

1.Сложность: Может привести к созданию большого количества маленьких классов, что усложняет структуру программы.

2.Трудности с отладкой: Цепочка декораторов может затруднить понимание и отладку кода.

### Пример кода

```// Базовый интерфейс компонента
interface Beverage {
    getDescription(): string;
    getCost(): number;
}

// Конкретный компонент
class Coffee implements Beverage {
    public getDescription(): string {
        return "Coffee";
    }

    public getCost(): number {
        return 5;
    }
}

// Базовый декоратор
abstract class BeverageDecorator implements Beverage {
    protected beverage: Beverage;

    constructor(beverage: Beverage) {
        this.beverage = beverage;
    }

    public getDescription(): string {
        return this.beverage.getDescription();
    }

    public getCost(): number {
        return this.beverage.getCost();
    }
}

// Конкретный декоратор
class MilkDecorator extends BeverageDecorator {
    public getDescription(): string {
        return `${this.beverage.getDescription()}, Milk`;
    }

    public getCost(): number {
        return this.beverage.getCost() + 2;
    }
}

// Еще один конкретный декоратор
class SugarDecorator extends BeverageDecorator {
    public getDescription(): string {
        return `${this.beverage.getDescription()}, Sugar`;
    }

    public getCost(): number {
        return this.beverage.getCost() + 1;
    }
}

// Использование
let beverage: Beverage = new Coffee();
console.log(`${beverage.getDescription()} costs $${beverage.getCost()}`); // Coffee costs $5

beverage = new MilkDecorator(beverage);
console.log(`${beverage.getDescription()} costs $${beverage.getCost()}`); // Coffee, Milk costs $7

beverage = new SugarDecorator(beverage);
console.log(`${beverage.getDescription()} costs $${beverage.getCost()}`); // Coffee, Milk, Sugar costs $8
```

# Фасад (Facade)

## Описание шаблона

#### Фасад —

это структурный шаблон проектирования, который предоставляет простой интерфейс для работы со сложной подсистемой, скрывая её внутренние детали. Фасад упрощает взаимодействие с подсистемой, предоставляя высокоуровневый интерфейс, который делает использование подсистемы более удобным и понятным.

### Когда использовать:

1.Когда нужно упростить взаимодействие с сложной подсистемой. Фасад предоставляет простой интерфейс для выполнения сложных операций.

2.Когда нужно уменьшить зависимость клиентского кода от подсистемы. Фасад скрывает детали реализации подсистемы, что делает клиентский код более независимым.

3.Когда нужно предоставить высокоуровневый интерфейс для работы с подсистемой. Это особенно полезно, если подсистема имеет множество компонентов и сложную логику.

### ~~Когда не использовать~~:

1.Когда подсистема проста и не требует упрощения взаимодействия. В этом случае использование фасада может быть излишним.

2.Когда клиентский код должен иметь полный контроль над подсистемой. Фасад может ограничивать доступ к некоторым функциям подсистемы.

### Плюсы:

1.Упрощение взаимодействия: Предоставляет простой интерфейс для работы со сложной подсистемой.

2.Снижение зависимостей: Уменьшает зависимость клиентского кода от подсистемы.

3.Улучшение читаемости: Делает код более понятным и читаемым, скрывая сложные детали реализации.

### Минусы:

**Ограниченный доступ**: Фасад может ограничивать доступ к некоторым функциям подсистемы, что может быть нежелательно в некоторых случаях.

**Дополнительный слой**: Добавляет дополнительный слой в архитектуру, что может привести к небольшим накладным расходам.

### Пример кода

```// Подсистема: Аудио система
class AudioSystem {
    public turnOn(): void {
        console.log("Audio system is turned on.");
    }

    public setVolume(volume: number): void {
        console.log(`Volume set to ${volume}.`);
    }

    public turnOff(): void {
        console.log("Audio system is turned off.");
    }
}

// Подсистема: Видео система
class VideoSystem {
    public turnOn(): void {
        console.log("Video system is turned on.");
    }

    public playMovie(movie: string): void {
        console.log(`Playing movie: ${movie}.`);
    }

    public turnOff(): void {
        console.log("Video system is turned off.");
    }
}

// Подсистема: Освещение
class Lighting {
    public dimLights(): void {
        console.log("Lights are dimmed.");
    }

    public turnOffLights(): void {
        console.log("Lights are turned off.");
    }
}

// Фасад: Мультимедийная система
class MultimediaFacade {
    private audioSystem: AudioSystem;
    private videoSystem: VideoSystem;
    private lighting: Lighting;

    constructor() {
        this.audioSystem = new AudioSystem();
        this.videoSystem = new VideoSystem();
        this.lighting = new Lighting();
    }

    public watchMovie(movie: string): void {
        this.audioSystem.turnOn();
        this.audioSystem.setVolume(10);
        this.videoSystem.turnOn();
        this.videoSystem.playMovie(movie);
        this.lighting.dimLights();
    }

    public turnOff(): void {
        this.audioSystem.turnOff();
        this.videoSystem.turnOff();
        this.lighting.turnOffLights();
    }
}

// Использование
const multimediaFacade = new MultimediaFacade();
multimediaFacade.watchMovie("Inception");
// Audio system is turned on.
// Volume set to 10.
// Video system is turned on.
// Playing movie: Inception.
// Lights are dimmed.

multimediaFacade.turnOff();
// Audio system is turned off.
// Video system is turned off.
// Lights are turned off.
```

# Компоновщик (Composite)

## Описание шаблона

#### Компоновщик —

это структурный шаблон проектирования, который позволяет сгруппировать объекты в древовидные структуры и работать с ними как с единым объектом. Компоновщик позволяет клиентам единообразно обрабатывать как отдельные объекты, так и их композиции, что упрощает работу с иерархическими структурами.

### Когда использовать:

1.Когда нужно представить иерархию объектов в виде дерева. Компоновщик позволяет работать с отдельными объектами и их группами одинаково.

2.Когда нужно упростить взаимодействие с сложной структурой объектов. Клиентский код может работать с композицией объектов, не заботясь о том, является ли объект отдельным элементом или группой.

3.Когда нужно добавить или удалить элементы из структуры динамически. Компоновщик позволяет легко изменять структуру дерева.

###~~Когда не использовать~~:

1.Когда структура объектов проста и не требует иерархии. В этом случае использование компоновщика может быть излишним.

2.Когда объекты в структуре имеют сильно различающиеся интерфейсы. Компоновщик предполагает, что все объекты в структуре имеют общий интерфейс.

### Плюсы:

1.Упрощение кода: Клиентский код может работать с композицией объектов, не заботясь о том, является ли объект отдельным элементом или группой.

2.Гибкость: Позволяет легко добавлять или удалять элементы из структуры.

3.Единообразие: Позволяет обрабатывать как отдельные объекты, так и их композиции одинаково.

### Минусы:

1.Сложность: Может усложнить структуру программы, особенно если объекты в структуре имеют сильно различающиеся интерфейсы.

2.Ограничения: Не всегда возможно обеспечить общий интерфейс для всех объектов в структуре.

```// Базовый интерфейс компонента
interface FileSystemComponent {
    getName(): string;
    getSize(): number;
    print(): void;
}

// Листовой компонент: Файл
class File implements FileSystemComponent {
    private name: string;
    private size: number;

    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
    }

    public getName(): string {
        return this.name;
    }

    public getSize(): number {
        return this.size;
    }

    public print(): void {
        console.log(`File: ${this.name}, Size: ${this.size} bytes`);
    }
}

// Композитный компонент: Папка
class Folder implements FileSystemComponent {
    private name: string;
    private children: FileSystemComponent[] = [];

    constructor(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public getSize(): number {
        return this.children.reduce((total, child) => total + child.getSize(), 0);
    }

    public add(component: FileSystemComponent): void {
        this.children.push(component);
    }

    public remove(component: FileSystemComponent): void {
        this.children = this.children.filter(child => child !== component);
    }

    public print(): void {
        console.log(`Folder: ${this.name}, Size: ${this.getSize()} bytes`);
        this.children.forEach(child => child.print());
    }
}

// Использование
const rootFolder = new Folder("Root");

const folder1 = new Folder("Folder 1");
folder1.add(new File("File1.txt", 100));
folder1.add(new File("File2.txt", 200));

const folder2 = new Folder("Folder 2");
folder2.add(new File("File3.txt", 300));

rootFolder.add(folder1);
rootFolder.add(folder2);

rootFolder.print();
// Folder: Root, Size: 600 bytes
// Folder: Folder 1, Size: 300 bytes
// File: File1.txt, Size: 100 bytes
// File: File2.txt, Size: 200 bytes
// Folder: Folder 2, Size: 300 bytes
// File: File3.txt, Size: 300 bytes
```

# Шаблон "Заместитель" (Proxy)

## Описание

Шаблон "Заместитель" предоставляет суррогатный или заместительный объект для другого объекта, чтобы контролировать доступ к нему. Это позволяет добавлять дополнительный уровень управления и функциональности при взаимодействии с целевым объектом.

## Где и когда использовать

- Когда необходимо контролировать доступ к какому-либо ресурсу (например, к объекту, которому требуется значительная инициализация или ресурсы).
- Когда вы хотите добавить дополнительные функции перед или после вызова методов целевого объекта (например, ведение логов).
- Когда необходимо реализовать ленивую загрузку объектов, то есть загружать объект по мере необходимости.

## Где и когда не нужно

- Когда у вас нет необходимости в контроле доступа к объектам.
- Когда простой доступ к объекту более предпочтителен, чем добавление дополнительного уровня абстракции.
- Когда производительность критически важна и более медлительные операции с прокси неприемлемы.

## Плюсы и минусы шаблона

### Плюсы

- Позволяет добавлять дополнительное поведение к объектам без изменения их кода.
- Упрощает управление сложными объектами, предоставляя простой интерфейс для доступа.
- Полезен для глобального управления функциональностью (например, ведение логов, кэширование и т. д.).

### Минусы

- Добавляет уровень абстракции, что может затруднить понимание кода.
- Может негативно сказаться на производительности из-за дополнительных вызовов методов.
- Более высокие затраты на поддержку, если прокси используется неправильно.

### пример кода

```// Интерфейс, который описывает целевой объект
interface Subject {
    request(): void;
}
// Конкретный субъект, реализующий интерфейс Subject
class RealSubject implements Subject {
    public request(): void {
        console.log("Выполнение запроса из RealSubject.");
    }
}

// Прокси, который контролирует доступ к RealSubject
class Proxy implements Subject {
    private realSubject: RealSubject;

    constructor() {
        this.realSubject = new RealSubject();
    }

    public request(): void {
        // Здесь можно добавить дополнительную логику
        console.log("Proxy: Проверка доступа к RealSubject.");
        this.realSubject.request();
    }
}

// Использование прокси
const proxy = new Proxy();
proxy.request(); // Выводит "Proxy: Проверка доступа к RealSubject." и "Выполнение запроса из RealSubject."
```

# Шаблон проектирования "Стратегия" (Strategy)

## Описание

Шаблон "Стратегия" позволяет определить набор алгоритмов, инкапсулировать каждую стратегию и сделать их взаимозаменяемыми. Этот шаблон позволяет изменять алгоритмы независимо от клиентов, которые их используют.

## Где и когда использовать

- Когда есть несколько взаимозаменяемых алгоритмов, и вы хотите использовать их независимо от клиента.
- Когда алгоритмы могут изменяться во время выполнения.
- Когда нужно избегать больших условных операторов.

## Где и когда не нужно

- Когда алгоритмы слишком просты, и использование шаблона добавляет ненужные сложности.
- Когда новые алгоритмы редко добавляются или существующие редко изменяются.

## Плюсы и минусы шаблона

### Плюсы

- Упрощает замену и добавление новых алгоритмов.
- Изолирует код алгоритма от клиента.
- Лучше структурирует код.

### Минусы

- Увеличение количества классов.
- Требует знания клиента о стратегиях, доступных для выбора.

## Пример реализации (TypeScript)

```typescript
interface Strategy {
  execute(a: number, b: number): number;
}
class AddStrategy implements Strategy {
  execute(a: number, b: number): number {
    return a + b;
  }
}

class SubtractStrategy implements Strategy {
  execute(a: number, b: number): number {
    return a - b;
  }
}

class Context {
  private strategy: Strategy;

  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  executeStrategy(a: number, b: number): number {
    return this.strategy.execute(a, b);
  }
}

// Использование стратегии
const context = new Context(new AddStrategy());
console.log(context.executeStrategy(5, 3)); // 8

context.setStrategy(new SubtractStrategy());
console.log(context.executeStrategy(5, 3)); // 2
```

# Шаблон проектирования "Команда" (Command)

## Описание

Шаблон "Команда" инкапсулирует запрос как объект, позволяя параметризовать клиентов с различными запросами, ставить запросы в очередь или логировать их, а также поддерживать отмену операций.

## Где и когда использовать

- Когда вы хотите параметризовать объекты с действиями.
- Когда необходимо поддерживать сложные операции, такие как отмена или повтор.

## Где и когда не нужно

- Когда задачи слишком просты, и не требуется создание дополнительных объектов.
- Когда есть только несколько операций, которые не меняются.

## Плюсы и минусы шаблона

### Плюсы

- Разделяет отправителя и получателя запросов.
- Позволяет поддерживать отмену операций.

### Минусы

- Увеличивает количество классов.
- Может привести к излишней сложности.

## Пример реализации (TypeScript)

```interface Command {
    execute(): void;
}
class ConcreteCommand implements Command {
    private receiver: Receiver;

    constructor(receiver: Receiver) {
        this.receiver = receiver;
    }

    execute(): void {
        this.receiver.action();
    }
}

class Receiver {
    action(): void {
        console.log("Выполнение действия Receiver.");
    }
}

class Invoker {
    private command: Command;

    setCommand(command: Command) {
        this.command = command;
    }

    executeCommand(): void {
        this.command.execute();
    }
}

// Использование команды
const receiver = new Receiver();
const command = new ConcreteCommand(receiver);
const invoker = new Invoker();

invoker.setCommand(command);
invoker.executeCommand(); // Выполнение действия Receiver.
```

# Шаблон проектирования "Наблюдатель" (Observer)

## Описание

Шаблон "Наблюдатель" определяет зависимость "один ко многим" между объектами, так что при изменении состояния одного объекта все зависящие от него объекты уведомляются и обновляются автоматически.

## Где и когда использовать

- Когда изменение состояния одного объекта требует изменения состояния других объектов.
- Когда множество объектов требуется для отслеживания изменений другого объекта.

## Где и когда не нужно

- Когда не требуется уведомление других объектов о изменениях.
- Когда количество подписчиков на изменения большое, что создаёт значительное влияние на производительность.

## Плюсы и минусы шаблона

### Плюсы

- Понижает связанность между объектами.
- Упрощает добавление подписчиков.

### Минусы

- Может вызвать проблемы производительности при большом количестве подписчиков.
- Усложняет отладку.

## Пример реализации (TypeScript)

```interface Observer {
    update(data: any): void;
}
class ConcreteObserver implements Observer {
    update(data: any): void {
        console.log(Observer получил данные: ${data});
    }
}

class Subject {
    private observers: Observer[] = [];

    attach(observer: Observer): void {
        this.observers.push(observer);
    }

    detach(observer: Observer): void {
        this.observers = this.observers.filter(o => o !== observer);
    }

    notify(data: any): void {
        for (const observer of this.observers) {
            observer.update(data);
        }
    }
}

// Использование наблюдателя
const subject = new Subject();
const observer1 = new ConcreteObserver();
const observer2 = new ConcreteObserver();

subject.attach(observer1);
subject.attach(observer2);
subject.notify("Новое обновление!"); // Уведомляет всех наблюдателей
```

# Шаблон проектирования "Состояние" (State)

## Описание

Шаблон "Состояние" позволяет объекту изменять свое поведение в зависимости от состояния. Производит впечатление, что объект изменил свой класс.

## Где и когда использовать

- Когда состояние объекта влияет на его поведение.
- Когда необходимо избежать множества условных операторов при управлении состоянием.

## Где и когда не нужно

- Если количество состояний небольшое и не меняется со временем.
- Когда сложность управления состоянием не оправдана для задачи.

## Плюсы и минусы шаблона

### Плюсы

- Упрощает логику состояния в коде.
- Изолирует состояния в отдельные классы.

### Минусы

- Увеличивает количество классов и сложности в общем проекте.
- Можно усложнить понимание кода.

## Пример реализации (TypeScript)

```interface State {
    handleRequest(): void;
}
class ConcreteStateA implements State {
    handleRequest(): void {
        console.log("Обработка в состоянии A");
    }
}

class ConcreteStateB implements State {
    handleRequest(): void {
        console.log("Обработка в состоянии B");
    }
}

class Context {
    private state: State;

    constructor(state: State) {
        this.state = state;
    }

    setState(state: State): void {
        this.state = state;
    }

    request(): void {
        this.state.handleRequest();
    }
}

// Использование состояния
const context = new Context(new ConcreteStateA());
context.request(); // Обработка в состоянии A

context.setState(new ConcreteStateB());
context.request(); // Обработка в состоянии B
```

# Шаблон проектирования "Шаблонный метод" (Template Method)

## Описание

Шаблон "Шаблонный метод" определяетSkeleton of an algorithm in a method, deferring some steps to subclasses. Шаблон позволяет подклассам переопределять определенные шаги алгоритма, не изменяя его структуру.

## Где и когда использовать

- Когда алгоритм включает в себя фиксированные шаги, которые могут быть переопределены.
- Когда нужно избежать дублирования кода.

## Где и когда не нужно

- Когда структура алгоритма меняется слишком часто.
- Когда детали реализации слишком сложны для построения общего алгоритма.

## Плюсы и минусы шаблона

### Плюсы

- Упрощает поддержку кода, изолируя его структуру.
- Позволяет изменять только нужные части алгоритма.

### Минусы

- Ограничивает гибкость, поскольку структура фиксирована.
- Можно запутаться, если алгоритм сложен.

## Пример реализации (TypeScript)

```abstract class AbstractClass {
    templateMethod(): void {
        this.baseOperation1();
        this.primitiveOperation1();
        this.baseOperation2();
        this.primitiveOperation2();
    }
    baseOperation1(): void {
        console.log("Базовая операция 1");
    }

    baseOperation2(): void {
        console.log("Базовая операция 2");
    }

    protected abstract primitiveOperation1(): void;
    protected abstract primitiveOperation2(): void;
}

class ConcreteClass extends AbstractClass {
    protected primitiveOperation1(): void {
        console.log("Конкретная реализация операции 1");
    }

    protected primitiveOperation2(): void {
        console.log("Конкретная реализация операции 2");
    }
}

// Использование шаблона
const concreteClass = new ConcreteClass();
concreteClass.templateMethod();
```

# Шаблон проектирования "Итератор" (Iterator)

## Описание

Шаблон "Итератор" позволяет последовательно обходить элементы коллекции без раскрытия ее внутреннего представления.

## Где и когда использовать

- Когда нужны различные способы обхода одной и той же структуры данных.
- Когда вы хотите избежать мотивации из-за обширных операций на коллекции.

## Где и когда не нужно

- Когда нет необходимости в нескольких способах обхода или структуры данных достаточно просты.
- Когда объем данных минимален.

## Плюсы и минусы шаблона

### Плюсы

- Позволяет обойти коллекцию без ее раскрытия.
- Поддерживает различные способы обхода с помощью отдельных итераторов.

### Минусы

- Увеличивает количество классов.
- Может усложнить реализацию.

## Пример реализации (TypeScript)

```interface Iterator {
    next(): T;
    hasNext(): boolean;
}
interface IterableCollection {
    createIterator(): Iterator;
}

class ConcreteIterator implements Iterator {
    private items: T[];
    private index: number = 0;

    constructor(items: T[]) {
        this.items = items;
    }

    next(): T {
        return this.items[this.index++];
    }

    hasNext(): boolean {
        return this.index < this.items.length;
    }
}

class ConcreteCollection implements IterableCollection {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    createIterator(): Iterator {
        return new ConcreteIterator(this.items);
    }
}

// Использование итератора
const collection = new ConcreteCollection();
collection.add(1);
collection.add(2);
collection.add(3);

const iterator = collection.createIterator();
while (iterator.hasNext()) {
    console.log(iterator.next()); // 1, 2, 3
}
```
