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

TypeScript tiene seis tipos para valores simples. Si ya sabés JavaScript, ya los conocés - ahora les ponés nombre:

| Valor | Tipo |
|-------|------|
| \`true\`, \`false\` | \`boolean\` |
| \`42\`, \`3.14\`, \`-5\` | \`number\` |
| \`"hola"\`, \`\\\`texto\\\`\` | \`string\` |
| función sin return útil | \`void\` |
| variable sin inicializar | \`undefined\` |
| ausencia intencional de valor | \`null\` |

## Cómo se anotan

\`\`\`typescript
const activo: boolean = true;
const precio: number = 29.99;
const nombre: string = "Ana";

function logMensaje(msg: string): void {
    console.log(msg); // no retorna nada
}
\`\`\`

La sintaxis siempre es la misma: \`parametro: tipo\`.

## null y undefined

Con \`strict: true\`, \`null\` y \`undefined\` no caben en otros tipos:

\`\`\`typescript
let nombre: string = null;           // Error: null no es string
let nombre: string | null = null;    // ✓ - le dijiste que puede ser null
\`\`\`

Esto previene el error más clásico de JavaScript: *"Cannot read properties of null"*. TypeScript te obliga a verificar si algo puede ser null antes de usarlo.
`,
    },
    {
      id: "ch03-02",
      title: "Anotando un catálogo",
      type: "exercise",
      instructions: `## Anotando un catálogo

La función \`createProduct\` genera la descripción de un producto para un catálogo. TypeScript está reportando implicit \`any\` en todos sus parámetros porque no tienen anotaciones.

Añade las anotaciones correctas basándote en cómo se usa cada parámetro dentro de la función.`,
      starterCode: `function createProduct(name, price, inStock, quantity) {
    const status = inStock ? "en stock" : "agotado";
    return \`\${name}: \${price.toFixed(2)} - \${status} (\${quantity} unidades)\`;
}

console.log(createProduct("Laptop", 999.99, true, 15));
console.log(createProduct("Teclado", 49.90, false, 0));`,
      solution: `function createProduct(name: string, price: number, inStock: boolean, quantity: number): string {
    const status = inStock ? "en stock" : "agotado";
    return \`\${name}: \${price.toFixed(2)} - \${status} (\${quantity} unidades)\`;
}

console.log(createProduct("Laptop", 999.99, true, 15));
console.log(createProduct("Teclado", 49.90, false, 0));`,
      hint: "Analizá qué hace el código con cada parámetro. `.toFixed()` solo existe en ciertos tipos. El operador ternario `? :` espera cierto tipo en la condición.",
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
      id: "ch03-03",
      title: "Arrays, Tuples y Enum",
      type: "explanation",
      content: `# Arrays, Tuples y Enum

## Array

Un array de elementos del mismo tipo:

\`\`\`typescript
const nombres: string[] = ["Ana", "Luis", "María"];
const precios: number[] = [9.99, 19.99, 4.99];
\`\`\`

También existe la sintaxis genérica - es equivalente:

\`\`\`typescript
const nombres: Array<string> = ["Ana", "Luis", "María"];
\`\`\`

## Tuple

Un array de **longitud fija** donde cada posición tiene su propio tipo:

\`\`\`typescript
// Array: cantidad variable, todos del mismo tipo
const valores: number[] = [1, 2, 3, 4, 5]; // válido

// Tuple: cantidad fija, cada posición tiene su tipo
const punto: [number, number] = [40.7128, -74.0060]; // exactamente dos números
const entrada: [string, number] = ["Ana", 28];         // string en pos 0, number en pos 1
\`\`\`

Usás tuple cuando necesitás garantizar cuántos elementos hay y qué tipo va en cada posición.

## Enum

Un conjunto de constantes con nombre:

\`\`\`typescript
enum OrderStatus {
    Pending   = "pending",
    Shipped   = "shipped",
    Delivered = "delivered"
}

function getLabel(status: OrderStatus): string {
    return \`Estado: \${status}\`;
}

getLabel(OrderStatus.Pending); // ✓
getLabel("pending");           // Error: usa el enum, no el string directamente
\`\`\`

### ¿Enum o union literal?

Para la mayoría de los casos, un **union literal** es más simple:

\`\`\`typescript
// Más simple y directa - no requiere importar nada
type OrderStatus = "pending" | "shipped" | "delivered";
\`\`\`

Preferí union literals para casos simples. Usá \`enum\` solo cuando necesitás iterar sobre los valores en runtime o cuando el enum añade semántica clara al dominio.
`,
    },
    {
      id: "ch03-04",
      title: "Más que un array",
      type: "exercise",
      instructions: `## Más que un array

La función \`parseRGB\` descompone un color hexadecimal en sus tres componentes. Retorna \`number[]\`, pero ese tipo no garantiza nada sobre la longitud - TypeScript no sabe si el array tiene 1 elemento o 10.

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
      id: "ch03-05",
      title: "any vs unknown",
      type: "explanation",
      content: `# any vs unknown

Ambos tipos aceptan cualquier valor. La diferencia está en qué podés hacer con ellos después.

## any - TypeScript se calla

Con \`any\`, TypeScript deja de verificar ese valor completamente:

\`\`\`typescript
function procesar(valor: any) {
    valor.toUpperCase();      // TypeScript no dice nada - puede crashear
    valor.metodoInventado();  // TypeScript no dice nada - puede crashear
    valor();                  // TypeScript no dice nada - puede crashear
}
\`\`\`

\`any\` es contagioso: si lo asignás a otra variable tipada, esa variable también pierde su tipo.

## unknown - verificación obligatoria

\`unknown\` acepta cualquier valor, pero no podés usarlo hasta verificar qué es:

\`\`\`typescript
function procesar(valor: unknown) {
    valor.toUpperCase(); // Error: TypeScript no sabe si tiene .toUpperCase()

    if (typeof valor === "string") {
        valor.toUpperCase(); // ✓ - dentro del if, TypeScript sabe que es string
    }
}
\`\`\`

## ¿Cuándo usar cada uno?

- **\`unknown\`**: para datos externos - respuestas de APIs, JSON parseado, inputs del usuario. Aceptás cualquier cosa pero te obliga a verificar antes de usar.
- **\`any\`**: solo en migraciones de JavaScript legacy donde es imposible tipar correctamente.
- **Ninguno**: en código nuevo casi siempre hay un tipo más específico disponible.

**Regla:** \`any\` apaga TypeScript. \`unknown\` lo mantiene activo.
`,
    },
    {
      id: "ch03-06",
      title: "Datos del exterior",
      type: "exercise",
      instructions: `## Datos del exterior

La función \`parseAPIResponse\` recibe datos de una fuente externa. Usa \`any\`, lo que desactiva completamente la protección de TypeScript - si recibís un número o \`null\`, el código crashea sin ninguna advertencia.

Cambia el tipo a \`unknown\` y agregá la verificación necesaria. La función debe retornar el string en mayúsculas si recibe un string, o \`"[dato inválido]"\` para cualquier otro tipo.`,
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
      id: "ch03-07",
      title: "El tipo never",
      type: "explanation",
      content: `# El tipo never

\`never\` es el tipo de algo que **nunca puede tener un valor**. Suena raro, pero tiene dos usos muy concretos.

## Funciones que nunca retornan

Algunas funciones no terminan normalmente - siempre lanzan un error o entran en un loop infinito. Su tipo de retorno es \`never\`:

\`\`\`typescript
function lanzarError(mensaje: string): never {
    throw new Error(mensaje); // siempre lanza - nunca produce un valor de retorno
}

function loopInfinito(): never {
    while (true) {} // nunca termina
}
\`\`\`

Esto es útil porque TypeScript puede usar esa información para razonar sobre el flujo del código.

## Exhaustive checks - el uso más práctico

Cuando un \`switch\` cubre todos los casos de un union type, el \`default\` nunca debería ejecutarse. Podés aprovecharlo para que TypeScript avise si alguien añade un nuevo caso y olvida actualizar el switch:

\`\`\`typescript
type Color = "red" | "green" | "blue";

function getHex(color: Color): string {
    switch (color) {
        case "red":   return "#FF0000";
        case "green": return "#00FF00";
        case "blue":  return "#0000FF";
        default:
            const _check: never = color;
            throw new Error(\`Color no manejado: \${_check}\`);
    }
}
\`\`\`

¿Por qué funciona? Si el switch cubre todos los casos, en el \`default\` \`color\` tiene tipo \`never\` - TypeScript sabe que nunca llega ahí. Si alguien añade \`"yellow"\` al tipo \`Color\` y olvida el case, TypeScript marca error en la asignación a \`_check\`.
`,
    },
    {
      id: "ch03-08",
      title: "El switch infalible",
      type: "exercise",
      instructions: `## El switch infalible

La función \`getPaymentFee\` retorna la comisión para cada método de pago. Cubre todos los casos actuales, pero hay un problema: si alguien añade un nuevo método al tipo \`PaymentMethod\` y olvida actualizar el switch, TypeScript no avisa - el \`default: return 0\` lo absorbe en silencio.

Implementá un exhaustive check en el \`default\` usando \`never\` para que TypeScript detecte casos no manejados automáticamente.`,
      starterCode: `type PaymentMethod = "credit_card" | "debit_card" | "paypal";

function getPaymentFee(method: PaymentMethod): number {
    switch (method) {
        case "credit_card": return 2.5;
        case "debit_card":  return 1.0;
        case "paypal":      return 3.0;
        default:
            return 0; // Reemplazá esto con un exhaustive check
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
      hint: "Asigná el valor del `default` a una variable de tipo `never`. Si el switch cubre todos los casos, TypeScript acepta la asignación. Si falta un caso, marca error ahí.",
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
      id: "ch03-09",
      title: "Type Inference y Compatibility",
      type: "explanation",
      content: `# Type Inference y Type Compatibility

## Type Inference - TypeScript lee tu código

TypeScript puede deducir el tipo de la mayoría de las expresiones sin que lo declares:

\`\`\`typescript
const nombre = "Ana";   // TypeScript infiere: string
const edad = 28;        // TypeScript infiere: number
const activo = true;    // TypeScript infiere: boolean
\`\`\`

No tenés que anotar todo - TypeScript ya lo sabe.

### const vs let

\`const\` y \`let\` producen tipos distintos:

\`\`\`typescript
const dir = "norte";  // tipo: "norte" (el valor exacto - tipo literal)
let dir2 = "norte";   // tipo: string (cualquier string - tipo general)
\`\`\`

Por qué: \`const\` no puede cambiar, así que TypeScript sabe que siempre será \`"norte"\`. \`let\` puede cambiar a cualquier string.

Esto importa cuando pasás la variable a funciones que esperan un tipo literal:

\`\`\`typescript
type Direction = "norte" | "sur" | "este" | "oeste";
function mover(d: Direction) {}

const dir = "norte";  // tipo: "norte" → compatible con Direction ✓
let dir2 = "norte";   // tipo: string  → Error: string no es Direction
\`\`\`

### Retorno de funciones

TypeScript también infiere el tipo de retorno:

\`\`\`typescript
function doble(n: number) {
    return n * 2;        // TypeScript infiere retorno: number
}
function label(activo: boolean) {
    return activo ? "activo" : "inactivo"; // TypeScript infiere retorno: string
}
\`\`\`

## Type Compatibility - la forma importa, no el nombre

TypeScript verifica compatibilidad por **forma** (structural typing), no por nombre. Dos tipos son compatibles si tienen las mismas propiedades:

\`\`\`typescript
interface Punto      { x: number; y: number; }
interface Coordenada { x: number; y: number; }

const p: Punto = { x: 10, y: 20 };
const c: Coordenada = p; // ✓ - misma forma, TypeScript los acepta como compatibles
\`\`\`

Y si un objeto tiene más propiedades de las requeridas, sigue siendo compatible:

\`\`\`typescript
interface Usuario { nombre: string; edad: number; }

const empleado = { nombre: "Ana", edad: 28, empresa: "Acme" };
const u: Usuario = empleado; // ✓ - TypeScript solo verifica nombre y edad
\`\`\`

Esto refleja cómo funciona JavaScript: si un objeto tiene lo que necesitás, funciona.
`,
    },
    {
      id: "ch03-10",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen - TypeScript Types

## Tipos primitivos

| Tipo | Descripción |
|------|-------------|
| \`boolean\` | \`true\` / \`false\` |
| \`number\` | Enteros y decimales |
| \`string\` | Texto |
| \`void\` | Retorno sin valor útil |
| \`undefined\` / \`null\` | Ausencia de valor - separados con \`strict: true\` |

## Object types

- **\`Array\`** \`string[]\` - longitud variable, todos del mismo tipo
- **\`Tuple\`** \`[string, number]\` - longitud fija, tipo por posición
- **\`Enum\`** - constantes con nombre; para la mayoría de casos, preferir union literals

## Top & Bottom Types

| Tipo | Qué hace |
|------|---------|
| \`any\` | Apaga TypeScript para ese valor - evitar |
| \`unknown\` | Acepta todo, pero obliga a verificar antes de usar |
| \`never\` | Valor imposible - funciones que siempre lanzan, exhaustive checks |

## Type Inference

TypeScript infiere tipos automáticamente. \`const\` produce tipos literales; \`let\` produce tipos generales.

## Type Compatibility

TypeScript usa structural typing - la compatibilidad se basa en la forma del tipo, no en su nombre.

## Lo que viene

El próximo capítulo cubre **Assertions & Special Syntax** - \`as\`, \`as const\`, el operador non-null \`!\`, y el keyword \`satisfies\`.
`,
    },
  ],
};
