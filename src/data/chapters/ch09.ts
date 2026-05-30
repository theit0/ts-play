import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch09: Chapter = {
  id: "ch09",
  title: "Classes",
  lessons: [
    {
      id: "ch09-01",
      title: "Classes y Constructor Shorthand",
      type: "explanation",
      content: `# Classes y Constructor Shorthand

## Clase básica

Una clase agrupa datos y comportamiento relacionados:

\`\`\`typescript
class Product {
    name: string;
    price: number;

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }

    format(): string {
        return \`\${this.name}: $\${this.price.toFixed(2)}\`;
    }
}

const p = new Product("Laptop", 999);
p.format(); // "Laptop: $999.00"
\`\`\`

## Constructor Shorthand

TypeScript tiene una sintaxis abreviada: si añadís un modificador de visibilidad (\`public\`, \`private\`, \`protected\`, o \`readonly\`) a un parámetro del constructor, TypeScript declara la propiedad y la asigna automáticamente:

\`\`\`typescript
// Versión abreviada — equivalente a la anterior
class Product {
    constructor(
        public name: string,
        public price: number
    ) {}
    // TypeScript crea this.name y this.price automáticamente

    format(): string {
        return \`\${this.name}: $\${this.price.toFixed(2)}\`;
    }
}
\`\`\`

Eliminás la declaración de propiedades Y la asignación en el constructor — todo en una línea.

## Métodos y tipos de retorno

TypeScript anota los métodos igual que las funciones:

\`\`\`typescript
class OrderSummary {
    constructor(
        public orderId: string,
        private items: string[],
        private total: number
    ) {}

    itemCount(): number {
        return this.items.length;
    }

    describe(): string {
        return \`Pedido \${this.orderId}: \${this.itemCount()} ítems — $\${this.total.toFixed(2)}\`;
    }
}
\`\`\`
`,
    },
    {
      id: "ch09-02",
      title: "Ítem del carrito",
      type: "exercise",
      instructions: `## Ítem del carrito

La clase \`CartItem\` está escrita en el estilo verbose: declara las propiedades explícitamente y las asigna una a una en el cuerpo del constructor.

Refactorizá la clase para usar la sintaxis abreviada del constructor de TypeScript. El comportamiento debe quedar exactamente igual.`,
      starterCode: `class CartItem {
    name: string;
    price: number;
    quantity: number;

    constructor(name: string, price: number, quantity: number) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    total(): number {
        return this.price * this.quantity;
    }

    describe(): string {
        return \`\${this.name} x\${this.quantity} — $\${this.total().toFixed(2)}\`;
    }
}

const laptop = new CartItem("Laptop Pro", 1299.99, 2);
const mouse = new CartItem("Mouse", 49.99, 1);

console.log(laptop.describe());
console.log(mouse.describe());
console.log(\`Total: $\${(laptop.total() + mouse.total()).toFixed(2)}\`);`,
      solution: `class CartItem {
    constructor(
        public name: string,
        public price: number,
        public quantity: number
    ) {}

    total(): number {
        return this.price * this.quantity;
    }

    describe(): string {
        return \`\${this.name} x\${this.quantity} — $\${this.total().toFixed(2)}\`;
    }
}

const laptop = new CartItem("Laptop Pro", 1299.99, 2);
const mouse = new CartItem("Mouse", 49.99, 1);

console.log(laptop.describe());
console.log(mouse.describe());
console.log(\`Total: $\${(laptop.total() + mouse.total()).toFixed(2)}\`);`,
      hint: "Con el modificador de visibilidad en el parámetro del constructor, TypeScript crea la propiedad y la asigna automáticamente. El cuerpo del constructor queda vacío `{}`.",
      tests: [
        {
          name: "Usa constructor shorthand con modificadores de visibilidad",
          run: (code) =>
            /constructor\s*\(\s*(public|private|protected|readonly)\s+\w/.test(
              code
            ),
        },
        {
          name: "laptop.describe() retorna el formato correcto",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("Laptop Pro") &&
              output[0]?.includes("x2") &&
              output[0]?.includes("2599.98")
            );
          },
        },
        {
          name: "Total del carrito es correcto",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2]?.includes("2649.97");
          },
        },
      ],
    },
    {
      id: "ch09-03",
      title: "Access Modifiers",
      type: "explanation",
      content: `# Access Modifiers

Los modificadores de acceso controlan desde dónde se puede usar cada propiedad o método:

| Modificador | Accesible desde |
|-------------|-----------------|
| \`public\` | Cualquier lugar (default) |
| \`private\` | Solo dentro de la clase |
| \`protected\` | Dentro de la clase y sus subclases |
| \`readonly\` | Cualquier lugar, pero no se puede reasignar |

\`\`\`typescript
class BankAccount {
    private balance: number;       // solo dentro de BankAccount
    protected ownerId: number;     // BankAccount y subclases
    public accountId: string;      // desde cualquier lado
    readonly currency: string;     // accesible, pero inmutable

    constructor(id: string, owner: number, initial: number) {
        this.accountId = id;
        this.ownerId = owner;
        this.balance = initial;
        this.currency = "USD";
    }

    deposit(amount: number): void {
        this.balance += amount; // ✓ — desde adentro de la clase
    }

    getBalance(): number {
        return this.balance;
    }
}

const acc = new BankAccount("CTA-001", 1, 1000);
acc.deposit(500);           // ✓ — método público
acc.balance;                // Error: balance es private
acc.currency = "EUR";      // Error: currency es readonly
acc.getBalance();           // ✓ — a través del método público
\`\`\`

## TypeScript private vs JavaScript #

\`private\` en TypeScript es **compile-time only** — protege en el editor, pero en runtime el valor es accesible:

\`\`\`typescript
class A { private x = 1; }
(new A() as any).x; // 1 — accesible en runtime

// JavaScript private field — verdaderamente privado en runtime
class B { #x = 1; }
(new B() as any).#x; // SyntaxError
\`\`\`

Para aplicaciones críticas donde la privacidad en runtime importa, usá \`#\`. Para la mayoría de los casos, \`private\` de TypeScript es suficiente.

## readonly en el constructor

\`readonly\` se puede inicializar en el constructor, pero no después:

\`\`\`typescript
class Config {
    constructor(readonly env: string) {}
}

const c = new Config("production");
c.env = "development"; // Error: readonly
\`\`\`
`,
    },
    {
      id: "ch09-04",
      title: "Cuenta bancaria",
      type: "exercise",
      instructions: `## Cuenta bancaria

La clase \`BankAccount\` tiene un bug de diseño: \`balance\` es público, lo que significa que cualquier código externo puede modificarlo directamente sin pasar por \`deposit\` o \`withdraw\`.

Además, \`accountId\` debería ser inmutable — una vez asignado al crear la cuenta, no debería poder cambiarse.

Corregí los modificadores de acceso para que el diseño sea correcto.`,
      starterCode: `class BankAccount {
    balance: number;
    accountId: string;

    constructor(accountId: string, initialBalance: number) {
        this.accountId = accountId;
        this.balance = initialBalance;
    }

    deposit(amount: number): void {
        this.balance += amount;
    }

    withdraw(amount: number): void {
        if (amount > this.balance) throw new Error("Saldo insuficiente");
        this.balance -= amount;
    }

    getBalance(): number {
        return this.balance;
    }

    describe(): string {
        return \`Cuenta \${this.accountId}: $\${this.getBalance().toFixed(2)}\`;
    }
}

const acc = new BankAccount("CTA-001", 1000);
acc.deposit(500);
acc.withdraw(200);
console.log(acc.describe());
console.log(acc.getBalance());`,
      solution: `class BankAccount {
    private balance: number;
    readonly accountId: string;

    constructor(accountId: string, initialBalance: number) {
        this.accountId = accountId;
        this.balance = initialBalance;
    }

    deposit(amount: number): void {
        this.balance += amount;
    }

    withdraw(amount: number): void {
        if (amount > this.balance) throw new Error("Saldo insuficiente");
        this.balance -= amount;
    }

    getBalance(): number {
        return this.balance;
    }

    describe(): string {
        return \`Cuenta \${this.accountId}: $\${this.getBalance().toFixed(2)}\`;
    }
}

const acc = new BankAccount("CTA-001", 1000);
acc.deposit(500);
acc.withdraw(200);
console.log(acc.describe());
console.log(acc.getBalance());`,
      hint: "Pensá en qué propiedades deben ser controladas solo desde dentro de la clase, y cuáles no deberían poder cambiarse una vez inicializadas.",
      tests: [
        {
          name: "balance es private",
          run: (code) => /private\s+balance\b/.test(code),
        },
        {
          name: "accountId es readonly",
          run: (code) => /readonly\s+accountId\b/.test(code),
        },
        {
          name: "describe() retorna el saldo correcto después de operaciones",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("CTA-001") &&
              output[0]?.includes("1300.00")
            );
          },
        },
        {
          name: "getBalance() retorna el valor numérico correcto",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "1300";
          },
        },
      ],
    },
    {
      id: "ch09-05",
      title: "Abstract Classes e Inheritance",
      type: "explanation",
      content: `# Abstract Classes e Inheritance

## Abstract Classes

Una clase abstracta define un contrato para sus subclases. No se puede instanciar directamente:

\`\`\`typescript
abstract class Shape {
    constructor(public color: string) {}

    abstract area(): number; // las subclases DEBEN implementar esto

    describe(): string {    // implementación compartida
        return \`\${this.color}: área \${this.area().toFixed(2)}\`;
    }
}

new Shape("red"); // Error: no se puede instanciar una clase abstracta
\`\`\`

## extends — herencia

\`extends\` hereda toda la implementación de la clase base. El constructor de la subclase debe llamar a \`super()\` antes de acceder a \`this\`:

\`\`\`typescript
class Circle extends Shape {
    constructor(color: string, private radius: number) {
        super(color); // llama al constructor de Shape
    }

    area(): number {
        return Math.PI * this.radius ** 2;
    }
}

class Rectangle extends Shape {
    constructor(color: string, private width: number, private height: number) {
        super(color);
    }

    area(): number {
        return this.width * this.height;
    }
}

const c = new Circle("red", 5);
c.describe(); // "red: área 78.54" — usa Circle.area() + Shape.describe()
\`\`\`

## Method Override

Una subclase puede reemplazar un método de la clase base. Usá \`super\` para llamar a la implementación original:

\`\`\`typescript
class Circle extends Shape {
    area(): number { return Math.PI * this.radius ** 2; }

    describe(): string {
        return super.describe() + \` (radio: \${this.radius})\`;
        //     ^^^^^^^^^^^^^^^^^^^
        //     llama a Shape.describe() primero
    }
}
\`\`\`

## Polymorphism

El poder de las clases abstractas: podés tratar distintas subclases como el mismo tipo base:

\`\`\`typescript
const shapes: Shape[] = [
    new Circle("red", 5),
    new Rectangle("blue", 4, 6)
];

shapes.forEach(s => console.log(s.describe()));
// "red: área 78.54"
// "blue: área 24.00"
// — cada uno usa su propia implementación de area()
\`\`\`
`,
    },
    {
      id: "ch09-06",
      title: "Descuentos polimórficos",
      type: "exercise",
      instructions: `## Descuentos polimórficos

La tienda aplica distintas estrategias de descuento. La clase abstracta \`DiscountStrategy\` define el contrato: cada estrategia debe implementar \`calculate(price)\`, y el método \`apply()\` (ya implementado en la base) usa ese cálculo para generar el resumen.

Las subclases \`PercentageDiscount\` y \`FixedDiscount\` están definidas pero sus métodos \`calculate\` devuelven el precio sin cambios.

Implementá \`calculate\` en cada subclase:
- \`PercentageDiscount\`: retorna el precio menos el porcentaje de descuento
- \`FixedDiscount\`: retorna el precio menos el monto fijo (mínimo 0)`,
      starterCode: `abstract class DiscountStrategy {
    abstract calculate(price: number): number;

    apply(price: number): string {
        const discounted = this.calculate(price);
        return \`$\${discounted.toFixed(2)} (ahorro: $\${(price - discounted).toFixed(2)})\`;
    }
}

class PercentageDiscount extends DiscountStrategy {
    constructor(private percentage: number) {
        super();
    }

    calculate(price: number): number {
        return price;
    }
}

class FixedDiscount extends DiscountStrategy {
    constructor(private amount: number) {
        super();
    }

    calculate(price: number): number {
        return price;
    }
}

const laptop = 1299.99;
const percentOff = new PercentageDiscount(20);
const fixedOff = new FixedDiscount(100);

console.log(\`20% off: \${percentOff.apply(laptop)}\`);
console.log(\`$100 off: \${fixedOff.apply(laptop)}\`);`,
      solution: `abstract class DiscountStrategy {
    abstract calculate(price: number): number;

    apply(price: number): string {
        const discounted = this.calculate(price);
        return \`$\${discounted.toFixed(2)} (ahorro: $\${(price - discounted).toFixed(2)})\`;
    }
}

class PercentageDiscount extends DiscountStrategy {
    constructor(private percentage: number) {
        super();
    }

    calculate(price: number): number {
        return price * (1 - this.percentage / 100);
    }
}

class FixedDiscount extends DiscountStrategy {
    constructor(private amount: number) {
        super();
    }

    calculate(price: number): number {
        return Math.max(0, price - this.amount);
    }
}

const laptop = 1299.99;
const percentOff = new PercentageDiscount(20);
const fixedOff = new FixedDiscount(100);

console.log(\`20% off: \${percentOff.apply(laptop)}\`);
console.log(\`$100 off: \${fixedOff.apply(laptop)}\`);`,
      hint: "Cada subclase solo necesita implementar `calculate`. `apply` ya llama a `calculate` internamente — no tenés que tocar ese método.",
      tests: [
        {
          name: "Ambas subclases extienden DiscountStrategy",
          run: (code) =>
            /class\s+PercentageDiscount\s+extends\s+DiscountStrategy/.test(
              code
            ) &&
            /class\s+FixedDiscount\s+extends\s+DiscountStrategy/.test(code),
        },
        {
          name: "20% de descuento sobre $1299.99 resulta en $1039.99",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("1039.99");
          },
        },
        {
          name: "$100 de descuento sobre $1299.99 resulta en $1199.99",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1]?.includes("1199.99");
          },
        },
        {
          name: "El ahorro se muestra correctamente en ambos casos",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("260.00") &&
              output[1]?.includes("100.00")
            );
          },
        },
      ],
    },
    {
      id: "ch09-07",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen — Classes

## Constructor Shorthand

\`\`\`typescript
class Product {
    constructor(
        public name: string,    // declara + asigna automáticamente
        private price: number
    ) {}
}
\`\`\`

Añadir un modificador de visibilidad al parámetro del constructor crea y asigna la propiedad en un solo paso.

## Access Modifiers

| Modificador | Accesible desde |
|-------------|-----------------|
| \`public\` | Cualquier lugar (default) |
| \`private\` | Solo dentro de la clase |
| \`protected\` | Clase y subclases |
| \`readonly\` | Accesible, pero no reasignable |

\`private\` de TypeScript es compile-time. Para privacidad real en runtime, usá JavaScript private fields (\`#field\`).

## Abstract Classes

\`\`\`typescript
abstract class Base {
    abstract method(): ReturnType; // sin cuerpo — subclase lo implementa
    concrete(): string { return "compartido"; } // implementación heredada
}
\`\`\`

- No instanciable directamente
- Define el contrato que las subclases deben cumplir
- Puede tener métodos abstractos y concretos

## Inheritance y Polymorphism

- \`extends\` hereda propiedades y métodos
- \`super()\` en el constructor llama al padre (obligatorio antes de \`this\`)
- \`super.method()\` en un override llama a la implementación del padre
- Polymorphism: distintas subclasses tratadas como el mismo tipo base

## Lo que viene

El próximo capítulo cubre **Generics** — tipos que funcionan con cualquier tipo, con constraints para limitarlos.
`,
    },
  ],
};
