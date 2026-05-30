import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch07: Chapter = {
  id: "ch07",
  title: "TypeScript Functions",
  lessons: [
    {
      id: "ch07-01",
      title: "Typing Functions",
      type: "explanation",
      content: `# Typing Functions

## Parámetros y retorno

La anotación básica de una función - tipos en los parámetros y en el retorno:

\`\`\`typescript
function add(a: number, b: number): number {
    return a + b;
}
\`\`\`

TypeScript puede **inferir el tipo de retorno** en la mayoría de los casos - no siempre es necesario anotarlo. Pero para funciones públicas o exportadas, la anotación explícita es buena práctica: documenta la intención y evita que un refactor cambie el contrato sin que TypeScript avise.

## void - sin retorno útil

Funciones que no retornan un valor (o retornan \`undefined\`) usan \`void\`:

\`\`\`typescript
function logEvent(event: string): void {
    console.log(\`[EVENT] \${event}\`);
}
\`\`\`

La diferencia con \`undefined\`: \`void\` expresa intención ("esta función no se usa por su retorno"), mientras que \`undefined\` es un valor literal.

## Funciones como tipos

Los callbacks y funciones de orden superior necesitan que tipés el tipo de la función:

\`\`\`typescript
// Tipo inline
function applyToAll(items: string[], fn: (item: string) => string): string[] {
    return items.map(fn);
}

// Type alias - más legible cuando el tipo se reutiliza
type Formatter = (item: string, index: number) => string;

function formatList(items: string[], formatter: Formatter): string[] {
    return items.map(formatter);
}
\`\`\`

## Parámetros opcionales

Un parámetro con \`?\` puede ser \`undefined\` - quien llama puede omitirlo:

\`\`\`typescript
function createSlug(text: string, separator?: string): string {
    const sep = separator ?? "-";
    return text.toLowerCase().replace(/\\s+/g, sep);
}

createSlug("Hello World");       // "hello-world"
createSlug("Hello World", "_");  // "hello_world"
\`\`\`

### Error común

Los parámetros opcionales deben ir **después** de los requeridos:

\`\`\`typescript
// ✗ Error: parámetro requerido después de opcional
function fn(label?: string, value: number) {}

// ✓ Opcional al final
function fn(value: number, label?: string) {}
\`\`\`
`,
    },
    {
      id: "ch07-02",
      title: "Notificaciones de pedido",
      type: "exercise",
      instructions: `## Notificaciones de pedido

La función \`createNotification\` genera notificaciones para eventos de la tienda. Acepta un callback opcional que se ejecuta cuando la notificación se crea.

Añadí las anotaciones de tipo correctas a todos los parámetros y al tipo de retorno. El parámetro \`onCreated\` es un callback opcional que recibe el ID del usuario y el texto de la notificación.`,
      starterCode: `function createNotification(userId, eventType, message, onCreated?) {
    const text = \`[\${eventType}] User \${userId}: \${message}\`;
    if (onCreated) onCreated(userId, text);
    return text;
}

const msg1 = createNotification(42, "ORDER_PLACED", "Pedido creado");
console.log(msg1);

const msg2 = createNotification(99, "PAYMENT_DONE", "Pago procesado", (id, text) => {
    console.log(\`Callback para user \${id}\`);
});
console.log(msg2);`,
      solution: `function createNotification(
    userId: number,
    eventType: string,
    message: string,
    onCreated?: (userId: number, text: string) => void
): string {
    const text = \`[\${eventType}] User \${userId}: \${message}\`;
    if (onCreated) onCreated(userId, text);
    return text;
}

const msg1 = createNotification(42, "ORDER_PLACED", "Pedido creado");
console.log(msg1);

const msg2 = createNotification(99, "PAYMENT_DONE", "Pago procesado", (id, text) => {
    console.log(\`Callback para user \${id}\`);
});
console.log(msg2);`,
      hint: "El tipo de una función como parámetro se escribe `(param: Tipo) => TipoRetorno`. Para un callback que no retorna nada, usá `void` como tipo de retorno.",
      tests: [
        {
          name: "userId y message tienen tipos primitivos correctos",
          run: (code) =>
            /userId\s*:\s*number/.test(code) &&
            /message\s*:\s*string/.test(code),
        },
        {
          name: "onCreated es un parámetro opcional con tipo función",
          run: (code) =>
            /onCreated\s*\?/.test(code) && /=>\s*void\b/.test(code),
        },
        {
          name: "createNotification retorna el texto correcto",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("ORDER_PLACED") &&
              output[0]?.includes("User 42")
            );
          },
        },
        {
          name: "El callback se ejecuta cuando se pasa",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1]?.includes("Callback para user 99");
          },
        },
      ],
    },
    {
      id: "ch07-03",
      title: "Default y Rest Parameters",
      type: "explanation",
      content: `# Default y Rest Parameters

## Parámetros con valor por defecto

Un parámetro con valor por defecto es opcional para quien llama - si no se pasa, usa el valor definido:

\`\`\`typescript
function paginate(data: string[], page = 1, pageSize = 10): string[] {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
}

paginate(items);         // page=1, pageSize=10
paginate(items, 2);      // page=2, pageSize=10
paginate(items, 3, 5);   // page=3, pageSize=5
\`\`\`

TypeScript infiere el tipo del parámetro desde el valor por defecto - no necesitás anotarlo explícitamente si el default es suficientemente específico.

### Default vs opcional

\`\`\`typescript
function a(x?: number) { return x; }          // x puede ser undefined
function b(x: number = 0) { return x; }       // x siempre es number
\`\`\`

Con \`?\`, el tipo dentro de la función es \`number | undefined\`. Con default, siempre es \`number\`.

## Rest parameters

Un rest parameter captura múltiples argumentos en un array. Solo puede haber uno y debe ser el último:

\`\`\`typescript
function joinStrings(separator: string, ...parts: string[]): string {
    return parts.join(separator);
}

joinStrings(", ", "Ana", "Luis", "María"); // "Ana, Luis, María"
joinStrings("-", "2024", "01", "15");      // "2024-01-15"
\`\`\`

El tipo \`...parts: string[]\` - siempre un array del tipo que declarás.

### Rest vs spread

Son conceptos relacionados pero distintos:
- **Rest** (\`...arr\` en parámetros): junta argumentos individuales en un array
- **Spread** (\`...arr\` en llamada): expande un array en argumentos individuales

\`\`\`typescript
const partes = ["Ana", "Luis", "María"];
joinStrings(", ", ...partes); // Spread: expande el array como argumentos individuales
\`\`\`
`,
    },
    {
      id: "ch07-04",
      title: "Constructor de queries",
      type: "exercise",
      instructions: `## Constructor de queries

La función \`buildQuery\` construye URLs para las solicitudes a la API. La firma actual requiere que todos los argumentos sean pasados explícitamente, incluido \`limit\` y un array de filtros.

Modificá la firma para que:
- \`limit\` tenga valor por defecto de \`10\`
- Los filtros se pasen como argumentos individuales en lugar de un array
- Las tres llamadas al final funcionen tal como están escritas`,
      starterCode: `function buildQuery(endpoint: string, limit: number, filters: string[]): string {
    const parts = [\`limit=\${limit}\`, ...filters];
    return \`\${endpoint}?\${parts.join("&")}\`;
}

console.log(buildQuery("/api/products"));
console.log(buildQuery("/api/orders", 5));
console.log(buildQuery("/api/users", 20, "active", "admin"));`,
      solution: `function buildQuery(endpoint: string, limit = 10, ...filters: string[]): string {
    const parts = [\`limit=\${limit}\`, ...filters];
    return \`\${endpoint}?\${parts.join("&")}\`;
}

console.log(buildQuery("/api/products"));
console.log(buildQuery("/api/orders", 5));
console.log(buildQuery("/api/users", 20, "active", "admin"));`,
      hint: "Dos cambios en la firma: (1) `limit` necesita un valor por defecto con `=`. (2) `filters` necesita capturar múltiples argumentos individuales - buscá la sintaxis para eso.",
      tests: [
        {
          name: "limit tiene valor por defecto de 10",
          run: (code) => /limit\s*=\s*10/.test(code),
        },
        {
          name: "filters es un rest parameter",
          run: (code) => /\.\.\.\w+\s*:\s*string\[\]/.test(code),
        },
        {
          name: "buildQuery('/api/products') usa limit=10 por defecto",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("limit=10");
          },
        },
        {
          name: "buildQuery con filtros individuales los une correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[2]?.includes("limit=20") &&
              output[2]?.includes("active") &&
              output[2]?.includes("admin")
            );
          },
        },
      ],
    },
    {
      id: "ch07-05",
      title: "Function Overloading",
      type: "explanation",
      content: `# Function Overloading

Los **function overloads** permiten definir múltiples call signatures para la misma función - distintos tipos de argumentos, distintos tipos de retorno.

## El problema sin overloads

\`\`\`typescript
// Sin overloads: el tipo de retorno siempre es la unión completa
function formatId(idOrIds: number | number[]): string | string[] {
    if (Array.isArray(idOrIds)) return idOrIds.map(id => \`#\${id}\`);
    return \`#\${idOrIds}\`;
}

const single = formatId(1);        // tipo: string | string[] - TypeScript no sabe cuál
const batch  = formatId([1, 2]);   // tipo: string | string[] - idem
single.toUpperCase();              // Error: string[] no tiene .toUpperCase()
\`\`\`

## Con overloads

Las **overload signatures** van antes de la implementación y no tienen cuerpo:

\`\`\`typescript
// Overload signatures (sin cuerpo)
function formatId(id: number): string;
function formatId(ids: number[]): string[];
// Implementación (debe manejar todos los casos)
function formatId(idOrIds: number | number[]): string | string[] {
    if (Array.isArray(idOrIds)) return idOrIds.map(id => \`#\${id}\`);
    return \`#\${idOrIds}\`;
}

const single = formatId(1);      // tipo: string ✓
const batch  = formatId([1, 2]); // tipo: string[] ✓
single.toUpperCase();            // ✓ TypeScript sabe que single es string
\`\`\`

La implementación es invisible para quien llama - solo ven las overload signatures.

## Cuándo usarlos

Los overloads son útiles cuando el **tipo de retorno depende del tipo del argumento**. Si tanto la entrada como la salida son uniones simples y no hay relación entre ellas, una firma normal con unión es suficiente.

\`\`\`typescript
// No necesita overloads - unión simple en ambos lados
function toString(value: string | number): string {
    return String(value);
}
\`\`\`

## Error común

La firma de implementación no es accesible desde afuera - debe ser compatible con todas las overloads pero no se usa directamente:

\`\`\`typescript
function process(x: string): string;
function process(x: number): number;
function process(x: string | number): string | number { // implementación
    return x;
}

// ✗ No podés llamar con string | number - esa firma no existe para callers
const value: string | number = "hola";
process(value); // Error
\`\`\`
`,
    },
    {
      id: "ch07-06",
      title: "Buscador del catálogo",
      type: "exercise",
      instructions: `## Buscador del catálogo

La función \`findProduct\` puede buscar por un ID individual o por un array de IDs, y retorna tipos distintos en cada caso. La implementación ya funciona correctamente, pero TypeScript no puede inferir el tipo de retorno específico para cada llamada - \`findProduct(1)\` debería retornar \`Product | undefined\`, y \`findProduct([2, 3])\` debería retornar \`Product[]\`.

Añadí las overload signatures necesarias para que TypeScript conozca el tipo exacto de retorno según el argumento.`,
      starterCode: `type Product = { id: number; name: string; price: number };

const catalog: Product[] = [
    { id: 1, name: "Laptop", price: 999 },
    { id: 2, name: "Mouse", price: 49 },
    { id: 3, name: "Teclado", price: 79 }
];

function findProduct(idOrIds: number | number[]): Product | undefined | Product[] {
    if (Array.isArray(idOrIds)) {
        return catalog.filter(p => idOrIds.includes(p.id));
    }
    return catalog.find(p => p.id === idOrIds);
}

const laptop = findProduct(1);
console.log(laptop?.name);

const peripherals = findProduct([2, 3]) as Product[];
console.log(peripherals.map(p => p.name).join(", "));`,
      solution: `type Product = { id: number; name: string; price: number };

const catalog: Product[] = [
    { id: 1, name: "Laptop", price: 999 },
    { id: 2, name: "Mouse", price: 49 },
    { id: 3, name: "Teclado", price: 79 }
];

function findProduct(id: number): Product | undefined;
function findProduct(ids: number[]): Product[];
function findProduct(idOrIds: number | number[]): Product | undefined | Product[] {
    if (Array.isArray(idOrIds)) {
        return catalog.filter(p => idOrIds.includes(p.id));
    }
    return catalog.find(p => p.id === idOrIds);
}

const laptop = findProduct(1);
console.log(laptop?.name);

const peripherals = findProduct([2, 3]);
console.log(peripherals.map(p => p.name).join(", "));`,
      hint: "Las overload signatures van antes de la implementación, sin cuerpo. Necesitás una para cuando el argumento es `number` y otra para cuando es `number[]`. Cada una tiene su tipo de retorno específico.",
      tests: [
        {
          name: "Tiene overload para ID individual que retorna Product | undefined",
          run: (code) =>
            /function findProduct\([^)]*number[^[\]]*\)\s*:\s*Product\s*\|\s*undefined/.test(
              code
            ),
        },
        {
          name: "Tiene overload para array de IDs que retorna Product[]",
          run: (code) =>
            /function findProduct\([^)]*number\[\][^)]*\)\s*:\s*Product\[\]/.test(
              code
            ),
        },
        {
          name: "findProduct(1) retorna 'Laptop'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "Laptop";
          },
        },
        {
          name: "findProduct([2, 3]) retorna 'Mouse, Teclado'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "Mouse, Teclado";
          },
        },
      ],
    },
    {
      id: "ch07-07",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen - TypeScript Functions

## Anotaciones básicas

\`\`\`typescript
function fn(param: Tipo, callback: (x: Tipo) => Retorno): Retorno {}
\`\`\`

- TypeScript infiere el tipo de retorno - la anotación explícita es mejor para APIs públicas
- \`void\`: función que no retorna un valor útil

## Parámetros opcionales y por defecto

| Sintaxis | Comportamiento |
|----------|----------------|
| \`param?: Tipo\` | Opcional - puede ser \`undefined\` dentro de la función |
| \`param: Tipo = valor\` | Tiene default - siempre es \`Tipo\` dentro de la función |

Los opcionales y los con default van **al final** de los parámetros requeridos.

## Rest parameters

\`\`\`typescript
function fn(fixed: string, ...rest: number[]): void {}
fn("a", 1, 2, 3); // rest = [1, 2, 3]
\`\`\`

Un solo rest parameter por función, siempre el último.

## Function Overloading

Permite definir múltiples call signatures con tipos de retorno distintos según el argumento. Las overload signatures van antes de la implementación, sin cuerpo. La implementación es invisible para quien llama.

Usá overloads cuando el tipo de retorno depende del tipo del argumento. Si la relación es un union simple en ambos lados, una firma normal es suficiente.

## Lo que viene

El próximo capítulo cubre **TypeScript Interfaces** - declaration, extends, declaration merging, y cuándo usar \`interface\` vs \`type\`.
`,
    },
  ],
};
