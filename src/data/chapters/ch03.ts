import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch03: Chapter = {
  id: "ch03",
  title: "TypeScript Types",
  lessons: [
    {
      id: "ch03-01",
      title: "Primitive Types",
      type: "explanation",
      content: `# Primitive Types

TypeScript hereda los tipos primitivos de JavaScript y añade control estático sobre ellos.

## boolean

\`\`\`typescript
const isActive: boolean = true;
const hasPermission: boolean = false;
\`\`\`

## number

TypeScript usa \`number\` para todos los números — enteros y decimales. No existe \`int\` ni \`float\`.

\`\`\`typescript
const price: number = 29.99;
const quantity: number = 100;
const temperature: number = -5;
const hex: number = 0xFF;        // hexadecimal — sigue siendo number
\`\`\`

## string

\`\`\`typescript
const username: string = "ana_garcia";
const greeting: string = \`Hola, \${username}\`; // template literals también son string
\`\`\`

## void

Representa la ausencia de valor de retorno. Se usa en funciones que no retornan nada útil:

\`\`\`typescript
function logMessage(msg: string): void {
    console.log(msg);
    // no retorna nada
}
\`\`\`

## undefined y null

\`undefined\` es el valor de algo no inicializado. \`null\` es la ausencia intencional de un valor.

Con \`"strict": true\` en el tsconfig, **no son asignables a otros tipos**:

\`\`\`typescript
let name: string = null;           // Error: null no es string
let name: string | null = null;    // ✓ unión explícita

let count: number = undefined;     // Error
let count: number | undefined = undefined; // ✓
\`\`\`

Este comportamiento — llamado \`strictNullChecks\` — previene el error más común en JavaScript: *"Cannot read properties of null"*. TypeScript te fuerza a verificar si un valor puede ser null antes de usarlo.
`,
    },
    {
      id: "ch03-02",
      title: "Object Types",
      type: "explanation",
      content: `# Object Types

Además de los primitivos, TypeScript tiene tipos para estructuras más complejas.

## Array

Dos sintaxis equivalentes:

\`\`\`typescript
const names: string[] = ["Ana", "Luis", "María"];
const prices: Array<number> = [9.99, 19.99, 4.99]; // sintaxis genérica
\`\`\`

Para arrays que mezclan tipos:

\`\`\`typescript
const mixed: (string | number)[] = ["Ana", 28, "Luis", 35];
\`\`\`

## Tuple

Un array de **longitud fija** donde cada posición tiene un tipo específico:

\`\`\`typescript
const coordinate: [number, number] = [40.7128, -74.0060]; // [lat, lng]
const entry: [string, number] = ["Ana", 28];              // [name, age]
\`\`\`

TypeScript 4.0+ permite nombrar las posiciones:

\`\`\`typescript
const coordinate: [latitude: number, longitude: number] = [40.7128, -74.0060];
\`\`\`

La diferencia clave con \`number[]\`: TypeScript sabe exactamente cuántos elementos tiene el tuple y qué tipo ocupa cada posición. Con un array, solo sabe el tipo de los elementos.

## Enum

Define un conjunto de constantes con nombre:

\`\`\`typescript
// String enum — el más recomendado
enum OrderStatus {
    Pending   = "pending",
    Shipped   = "shipped",
    Delivered = "delivered",
    Cancelled = "cancelled"
}

function processOrder(status: OrderStatus) {
    if (status === OrderStatus.Pending) { /* ... */ }
}

processOrder(OrderStatus.Pending); // ✓
processOrder("pending");           // Error: usa el enum, no el string directamente
\`\`\`

### const enum

Los \`const enum\` se reemplazan inline en el JavaScript compilado — no generan un objeto en runtime:

\`\`\`typescript
const enum Direction { Up = "UP", Down = "DOWN", Left = "LEFT", Right = "RIGHT" }
\`\`\`

### Enum vs union literal

Para casos simples, los **union literals** son más directos y no requieren importar nada:

\`\`\`typescript
// Más simple para la mayoría de casos
type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";
\`\`\`

Usa \`enum\` cuando necesites iterar sobre los valores o cuando el nombre del enum añade claridad semántica al dominio.

## object

El tipo \`object\` (lowercase) representa cualquier no-primitivo. En la práctica, rara vez lo usas directamente — las interfaces y types son más precisas:

\`\`\`typescript
// Evitar: demasiado amplio, TypeScript no sabe qué propiedades tiene
function process(data: object) { ... }

// Preferir: describe exactamente la forma esperada
function process(data: { id: number; name: string }) { ... }
\`\`\`
`,
    },
    {
      id: "ch03-03",
      title: "Top & Bottom Types",
      type: "explanation",
      content: `# Top & Bottom Types

TypeScript tiene tipos especiales que representan los extremos del sistema de tipos.

## Top Types — aceptan cualquier valor

### any

Opt-out completo del sistema de tipos. TypeScript deja de verificar ese valor:

\`\`\`typescript
let value: any = "hola";
value = 42;              // ✓ sin error
value.metodoInventado(); // ✓ sin error — TypeScript no verifica nada
value();                 // ✓ sin error — puede crashear en runtime
\`\`\`

\`any\` es contagioso: al asignarlo a otra variable, esa variable también pierde su tipo. Úsalo solo para migraciones de código JavaScript legacy.

### unknown

La versión segura de \`any\`. Acepta cualquier valor, pero **TypeScript no te deja usarlo hasta que verifiques su tipo**:

\`\`\`typescript
function processInput(value: unknown) {
    value.toUpperCase(); // Error: TypeScript no sabe si value es string

    if (typeof value === "string") {
        value.toUpperCase(); // ✓ dentro del if, TypeScript sabe que es string
    }
}
\`\`\`

**Regla:** si necesitas aceptar "cualquier tipo" (datos de API, JSON externo, inputs del usuario), usa \`unknown\` en lugar de \`any\`. Fuerza que quien usa el valor lo verifique antes.

## Bottom Type — ningún valor posible

### never

\`never\` representa un valor que **nunca puede existir**. Aparece en dos situaciones:

**1. Funciones que nunca retornan:**

\`\`\`typescript
function throwError(message: string): never {
    throw new Error(message); // siempre lanza, nunca retorna
}

function infiniteLoop(): never {
    while (true) {} // nunca termina
}
\`\`\`

**2. Exhaustive checks en switch:**

Cuando un switch cubre todos los casos de un union type, el \`default\` tiene tipo \`never\`. Puedes usarlo para que TypeScript detecte cuando alguien añade un caso y olvida actualizar el switch:

\`\`\`typescript
type PaymentMethod = "card" | "paypal" | "crypto";

function getFee(method: PaymentMethod): number {
    switch (method) {
        case "card":   return 2.5;
        case "paypal": return 3.0;
        case "crypto": return 1.0;
        default:
            const _never: never = method; // TypeScript marca error si hay caso no manejado
            throw new Error(\`Método no manejado: \${_never}\`);
    }
}
\`\`\`

Si alguien añade \`"bank_transfer"\` al union y olvida el case, TypeScript marcará error en la asignación a \`never\`. Sin este patrón, el \`default\` pasaría en silencio.
`,
    },
    {
      id: "ch03-04",
      title: "Type Inference",
      type: "explanation",
      content: `# Type Inference

TypeScript puede deducir el tipo de una expresión sin que lo declares explícitamente. Esto reduce el ruido en el código sin perder seguridad.

## Variables

\`\`\`typescript
const name = "Ana";    // TypeScript infiere: string
const age = 28;        // TypeScript infiere: number
const active = true;   // TypeScript infiere: boolean
const items = [];      // TypeScript infiere: never[] (array vacío — sin info)
const items2 = ["a", "b"]; // TypeScript infiere: string[]
\`\`\`

## const vs let — widening

\`const\` y \`let\` producen tipos diferentes:

\`\`\`typescript
const direction = "norte";
// Tipo inferido: "norte" (tipo literal)
// Porque const no puede cambiar — el valor siempre será "norte"

let direction = "norte";
// Tipo inferido: string (tipo general, "widened")
// Porque let puede cambiar a cualquier string más adelante
\`\`\`

Esto importa cuando una función espera un tipo literal:

\`\`\`typescript
type Direction = "norte" | "sur" | "este" | "oeste";
function move(d: Direction) { ... }

const dir = "norte";  // tipo: "norte" — ✓ compatible con Direction
let dir2 = "norte";   // tipo: string — Error: string no es Direction
\`\`\`

## Retorno de funciones

TypeScript infiere el tipo de retorno a partir de los \`return\` statements:

\`\`\`typescript
function double(n: number) {
    return n * 2; // TypeScript infiere: number
}

function getLabel(active: boolean) {
    return active ? "activo" : "inactivo"; // TypeScript infiere: string
}
\`\`\`

Anotar el tipo de retorno explícitamente es opcional, pero útil en APIs públicas: si cambias la implementación y el tipo de retorno cambia, TypeScript te avisa si callers esperaban el tipo anterior.

## Contextual typing

TypeScript usa el contexto para inferir tipos en callbacks:

\`\`\`typescript
const numbers = [1, 2, 3];

numbers.map(n => n * 2);         // n inferido como number ✓
numbers.filter(n => n > 2);      // n inferido como number ✓
numbers.forEach(n => {
    n.toUpperCase();             // Error: n es number, no tiene toUpperCase
});
\`\`\`

TypeScript sabe que \`.map()\` en \`number[]\` pasa \`number\` a cada callback.

## Cuándo anotar tipos explícitamente

- **Parámetros de función**: TypeScript no puede inferirlos
- **Variables con array vacío inicial**: \`const items: string[] = []\`
- **APIs públicas exportadas**: la anotación sirve de documentación y contrato
- **Cuando el tipo inferido es más amplio de lo que quieres**: anota para restringir
`,
    },
    {
      id: "ch03-05",
      title: "Type Compatibility",
      type: "explanation",
      content: `# Type Compatibility — Structural Typing

TypeScript usa un sistema de tipos **estructural** (también llamado duck typing): dos tipos son compatibles si tienen la misma "forma", independientemente de su nombre.

## Structural vs Nominal

En lenguajes con tipado **nominal** (Java, C#), el nombre del tipo determina la compatibilidad:

\`\`\`java
// Java: Point y Coordinate son tipos distintos aunque sean idénticos
class Point { int x; int y; }
class Coordinate { int x; int y; }

Point p = new Coordinate(); // Error en Java — tipos distintos
\`\`\`

TypeScript no funciona así:

\`\`\`typescript
// TypeScript: compatibles porque tienen la misma forma
interface Point { x: number; y: number; }
interface Coordinate { x: number; y: number; }

const c: Coordinate = { x: 10, y: 20 };
const p: Point = c; // ✓ misma forma — compatible
\`\`\`

## Propiedades extra son permitidas

Si un objeto tiene más propiedades de las requeridas, sigue siendo compatible:

\`\`\`typescript
interface User {
    name: string;
    age: number;
}

const employee = {
    name: "Ana",
    age: 28,
    department: "Engineering", // propiedad extra
    salary: 75000              // propiedad extra
};

const user: User = employee; // ✓ employee "cumple" con User — tiene name y age
\`\`\`

Nota: el **excess property check** sí marca error cuando asignas un object literal directamente con propiedades extra, como protección contra typos. Pero si el objeto viene de una variable, las propiedades extra se ignoran.

\`\`\`typescript
const user: User = { name: "Ana", age: 28, role: "admin" }; // Error: excess property
const user: User = employee; // ✓ la variable employee puede tener más propiedades
\`\`\`

## Compatibilidad en funciones

Para que una función sea asignable a un tipo función, sus parámetros y retorno deben ser compatibles:

\`\`\`typescript
type Handler = (event: string) => void;

const h1: Handler = (e) => console.log(e);          // ✓
const h2: Handler = (e, extra) => console.log(e);   // Error: parámetro extra
\`\`\`

## Por qué structural typing

JavaScript es inherentemente duck-typed: si un objeto tiene los métodos y propiedades que necesitas, funciona. TypeScript refleja esa realidad en lugar de imponer un sistema nominal que sería más rígido y menos compatible con cómo realmente se usa JavaScript.
`,
    },
    {
      id: "ch03-06",
      title: "Anotando un catálogo",
      type: "exercise",
      instructions: `## Anotando un catálogo

La función \`createProduct\` genera la descripción de un producto para un catálogo. TypeScript está reportando implicit \`any\` en todos sus parámetros porque no tienen anotaciones.

Añade las anotaciones correctas basándote en cómo se usa cada parámetro dentro de la función.`,
      starterCode: `function createProduct(name, price, inStock, quantity) {
    return \`\${name}: $\${price.toFixed(2)} — \${inStock ? "en stock" : "agotado"} (\${quantity} unidades)\`;
}

console.log(createProduct("Laptop", 999.99, true, 15));
console.log(createProduct("Teclado", 49.90, false, 0));`,
      solution: `function createProduct(name: string, price: number, inStock: boolean, quantity: number): string {
    return \`\${name}: $\${price.toFixed(2)} — \${inStock ? "en stock" : "agotado"} (\${quantity} unidades)\`;
}

console.log(createProduct("Laptop", 999.99, true, 15));
console.log(createProduct("Teclado", 49.90, false, 0));`,
      hint: "Analiza qué hace el código con cada parámetro. `.toFixed()` solo existe en ciertos tipos. El operador ternario `? :` espera cierto tipo en la condición.",
      tests: [
        {
          name: "Los parámetros tienen anotaciones de tipo",
          run: (code) =>
            /\bname\s*:\s*string/.test(code) &&
            /\bprice\s*:\s*number/.test(code) &&
            /\binStock\s*:\s*boolean/.test(code) &&
            /\bquantity\s*:\s*number/.test(code),
        },
        {
          name: "createProduct('Laptop', 999.99, true, 15) genera el formato correcto",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("Laptop") &&
              output[0]?.includes("999.99") &&
              output[0]?.includes("en stock")
            );
          },
        },
        {
          name: "createProduct('Teclado', 49.90, false, 0) indica agotado",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1]?.includes("agotado");
          },
        },
      ],
    },
    {
      id: "ch03-07",
      title: "Más que un array",
      type: "exercise",
      instructions: `## Más que un array

La función \`parseRGB\` descompone un color hexadecimal en sus tres componentes. Retorna \`number[]\`, pero ese tipo no garantiza nada sobre la longitud — TypeScript no sabe si el array tiene 1 elemento o 10.

Cambia el tipo de retorno para expresar exactamente que siempre retorna tres números: rojo, verde y azul.`,
      starterCode: `function parseRGB(hex: string): number[] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

const [red, green, blue] = parseRGB("#FF5733");
console.log(\`R:\${red} G:\${green} B:\${blue}\`);`,
      solution: `function parseRGB(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

const [red, green, blue] = parseRGB("#FF5733");
console.log(\`R:\${red} G:\${green} B:\${blue}\`);`,
      hint: "Un tuple expresa longitud fija y tipo por posición. La sintaxis es `[Tipo1, Tipo2, Tipo3]` como tipo de retorno de la función.",
      tests: [
        {
          name: "El tipo de retorno es un tuple de tres números",
          run: (code) =>
            /\)\s*:\s*\[number\s*,\s*number\s*,\s*number\]/.test(code),
        },
        {
          name: "parseRGB('#FF5733') retorna R:255 G:87 B:51",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("R:255") &&
              output[0]?.includes("G:87") &&
              output[0]?.includes("B:51")
            );
          },
        },
      ],
    },
    {
      id: "ch03-08",
      title: "Datos del exterior",
      type: "exercise",
      instructions: `## Datos del exterior

La función \`parseAPIResponse\` recibe datos de una fuente externa. Usa \`any\`, lo que desactiva completamente la protección de TypeScript — si recibes un número o \`null\`, el código crashea en silencio.

Cambia el tipo a \`unknown\` y agrega la verificación necesaria. La función debe retornar el string en mayúsculas si recibe un string, o \`"[dato inválido]"\` para cualquier otro tipo.`,
      starterCode: `function parseAPIResponse(data: any): string {
    return data.toUpperCase();
}

console.log(parseAPIResponse("éxito"));  // ÉXITO
console.log(parseAPIResponse(404));      // [dato inválido]
console.log(parseAPIResponse(null));     // [dato inválido]`,
      solution: `function parseAPIResponse(data: unknown): string {
    if (typeof data === "string") {
        return data.toUpperCase();
    }
    return "[dato inválido]";
}

console.log(parseAPIResponse("éxito"));
console.log(parseAPIResponse(404));
console.log(parseAPIResponse(null));`,
      hint: "Con `unknown`, TypeScript exige que verifiques el tipo antes de usar el valor. `typeof data === 'string'` es la forma más directa.",
      tests: [
        {
          name: "No usa 'any'",
          run: (code) => !/(:\s*any\b)/.test(code),
        },
        {
          name: "Usa 'unknown' para el parámetro",
          run: (code) => /:\s*unknown\b/.test(code),
        },
        {
          name: "parseAPIResponse('éxito') retorna 'ÉXITO'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "ÉXITO";
          },
        },
        {
          name: "parseAPIResponse(404) retorna '[dato inválido]'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "[dato inválido]";
          },
        },
      ],
    },
    {
      id: "ch03-09",
      title: "El switch infalible",
      type: "exercise",
      instructions: `## El switch infalible

La función \`getPaymentFee\` retorna la comisión para cada método de pago y cubre todos los casos actuales. El problema: si alguien añade un nuevo método al tipo \`PaymentMethod\` y olvida actualizar el switch, TypeScript no avisa — el \`default: return 0\` lo absorbe silenciosamente.

Implementa un exhaustive check en el \`default\` usando \`never\` para que TypeScript detecte casos no manejados automáticamente.`,
      starterCode: `type PaymentMethod = "credit_card" | "debit_card" | "paypal";

function getPaymentFee(method: PaymentMethod): number {
    switch (method) {
        case "credit_card": return 2.5;
        case "debit_card":  return 1.0;
        case "paypal":      return 3.0;
        default:
            return 0; // Reemplaza esto con un exhaustive check
    }
}

console.log(getPaymentFee("credit_card")); // 2.5
console.log(getPaymentFee("paypal"));      // 3`,
      solution: `type PaymentMethod = "credit_card" | "debit_card" | "paypal";

function getPaymentFee(method: PaymentMethod): number {
    switch (method) {
        case "credit_card": return 2.5;
        case "debit_card":  return 1.0;
        case "paypal":      return 3.0;
        default:
            const _never: never = method;
            throw new Error(\`Método de pago no manejado: \${_never}\`);
    }
}

console.log(getPaymentFee("credit_card"));
console.log(getPaymentFee("paypal"));`,
      hint: "Asignar el valor del `default` a una variable de tipo `never` es la convención. Si todos los casos están cubiertos, TypeScript acepta la asignación. Si falta un caso, marca error ahí.",
      tests: [
        {
          name: "Usa 'never' para el exhaustive check",
          run: (code) => /:\s*never\b/.test(code),
        },
        {
          name: "getPaymentFee('credit_card') retorna 2.5",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "2.5";
          },
        },
        {
          name: "getPaymentFee('paypal') retorna 3",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "3";
          },
        },
      ],
    },
    {
      id: "ch03-10",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen — TypeScript Types

## Tipos primitivos

| Tipo | Descripción |
|------|-------------|
| \`boolean\` | \`true\` / \`false\` |
| \`number\` | Enteros y decimales |
| \`string\` | Texto |
| \`void\` | Retorno de función sin valor útil |
| \`undefined\` | Variable sin inicializar |
| \`null\` | Ausencia intencional de valor |

Con \`strict: true\`, \`null\` y \`undefined\` no son asignables a otros tipos — debes usar una unión explícita: \`string | null\`.

## Object types

- **Array** \`string[]\` — colección de elementos del mismo tipo, longitud variable
- **Tuple** \`[string, number]\` — longitud fija, cada posición tiene su tipo
- **Enum** — constantes con nombre; para casos simples, preferir union literals
- **object** — rara vez útil directamente; usar interfaces/types en su lugar

## Top & Bottom Types

| Tipo | Descripción |
|------|-------------|
| \`any\` | Opt-out del type system — evitar |
| \`unknown\` | Acepta todo pero requiere narrowing antes de usar |
| \`never\` | Valor que nunca puede existir — funciones que tiran error, exhaustive checks |

**Regla:** \`any\` apaga TypeScript. \`unknown\` lo mantiene activo y te fuerza a verificar.

## Type Inference

TypeScript infiere tipos automáticamente:
- Variables: del valor inicial
- Funciones: del \`return\`
- Callbacks: del contexto

\`const\` infiere tipo literal; \`let\` infiere tipo general.

## Type Compatibility

TypeScript es **structuralmente tipado**: la compatibilidad depende de la forma, no del nombre. Un objeto con más propiedades es compatible con un tipo que tiene menos.

## Lo que viene

El próximo capítulo cubre **Assertions & Special Syntax** — \`as\`, \`as const\`, el operador non-null \`!\`, y el keyword \`satisfies\`.
`,
    },
  ],
};
