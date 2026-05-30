import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch06: Chapter = {
  id: "ch06",
  title: "Type Guards / Narrowing",
  lessons: [
    {
      id: "ch06-01",
      title: "typeof y Truthiness",
      type: "explanation",
      content: `# typeof y Truthiness Narrowing

**Narrowing** es el proceso por el que TypeScript reduce el tipo de una variable dentro de un bloque condicional. Es lo opuesto a una type assertion: TypeScript lo deduce solo, sin que vos intervengas.

## typeof

El operador \`typeof\` retorna un string con el tipo del valor. TypeScript entiende estos checks y estrecha el tipo en cada branch:

\`\`\`typescript
function formatValue(value: string | number): string {
    if (typeof value === "string") {
        return value.toUpperCase(); // TypeScript sabe: string
    }
    return value.toFixed(2); // TypeScript sabe: number
}
\`\`\`

Los strings que \`typeof\` puede retornar: \`"string"\`, \`"number"\`, \`"boolean"\`, \`"undefined"\`, \`"object"\`, \`"function"\`, \`"bigint"\`, \`"symbol"\`.

### El caso de null

\`typeof null === "object"\` - este es un bug histórico de JavaScript que no se va a corregir. Para verificar null, usá comparación directa:

\`\`\`typescript
function procesar(value: string | null): string {
    // ✗ Bug: typeof null es "object"
    if (typeof value === "object") {
        return "(nulo)"; // nunca llegarías a value.toUpperCase() - pero el tipo está mal
    }

    // ✓ Comparación directa para null
    if (value === null) return "(nulo)";
    return value.toUpperCase(); // TypeScript sabe: string
}
\`\`\`

## Truthiness Narrowing

Los valores **falsy** en JavaScript son: \`false\`, \`0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`. Todo lo demás es truthy.

TypeScript usa esta información para reducir tipos en condicionales:

\`\`\`typescript
function formatNote(note: string | null | undefined): string {
    if (!note) {
        return "(sin nota)"; // null, undefined, "" - todos falsy
    }
    return note.trim(); // TypeScript sabe: string (y no vacío)
}
\`\`\`

Esto es especialmente útil para eliminar \`null\` y \`undefined\` del tipo antes de usarlo.
`,
    },
    {
      id: "ch06-02",
      title: "Etiquetas del catálogo",
      type: "exercise",
      instructions: `## Etiquetas del catálogo

La función \`formatField\` genera etiquetas para mostrar propiedades de productos en el catálogo. Recibe el nombre del campo y su valor, que puede ser de tres tipos distintos.

Implementá la función según estas reglas:
- Si el valor es un **string**: \`label: "value"\` (con comillas)
- Si es un **number**: \`label: $X.XX\` (formateado a dos decimales)
- Si es un **boolean**: \`label: Sí\` o \`label: No\``,
      starterCode: `type FieldValue = string | number | boolean;

function formatField(label: string, value: FieldValue): string {
    // Implementá el formateo según el tipo de value
    return "";
}

const product = { name: "Laptop Pro", price: 1299.99, inStock: true };
console.log(formatField("Nombre", product.name));
console.log(formatField("Precio", product.price));
console.log(formatField("Disponible", product.inStock));`,
      solution: `type FieldValue = string | number | boolean;

function formatField(label: string, value: FieldValue): string {
    if (typeof value === "string") {
        return \`\${label}: "\${value}"\`;
    }
    if (typeof value === "number") {
        return \`\${label}: $\${value.toFixed(2)}\`;
    }
    return \`\${label}: \${value ? "Sí" : "No"}\`;
}

const product = { name: "Laptop Pro", price: 1299.99, inStock: true };
console.log(formatField("Nombre", product.name));
console.log(formatField("Precio", product.price));
console.log(formatField("Disponible", product.inStock));`,
      hint: "Usá `typeof` para verificar el tipo de `value` en cada branch. TypeScript sabrá el tipo exacto dentro de cada bloque condicional.",
      tests: [
        {
          name: "formatField con string muestra el valor entre comillas",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("Nombre") &&
              output[0]?.includes('"Laptop Pro"')
            );
          },
        },
        {
          name: "formatField con number muestra dos decimales",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1]?.includes("1299.99");
          },
        },
        {
          name: "formatField con boolean muestra Sí o No",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              (output[2]?.includes("Sí") || output[2]?.includes("Si"))
            );
          },
        },
      ],
    },
    {
      id: "ch06-03",
      title: "instanceof y Equality Narrowing",
      type: "explanation",
      content: `# instanceof y Equality Narrowing

## instanceof

\`instanceof\` verifica si un objeto es instancia de una clase. TypeScript estrecha el tipo en consecuencia:

\`\`\`typescript
class NetworkError {
    constructor(public statusCode: number) {}
}
class ValidationError {
    constructor(public field: string, public message: string) {}
}

type AppError = NetworkError | ValidationError;

function handleError(err: AppError): string {
    if (err instanceof NetworkError) {
        return \`Red: error \${err.statusCode}\`; // TypeScript sabe: NetworkError
    }
    return \`Validación en \${err.field}: \${err.message}\`; // TypeScript sabe: ValidationError
}
\`\`\`

\`instanceof\` solo funciona con **clases** - para objetos planos, usá type predicates (próxima lección).

## Equality Narrowing

Comparar con \`===\` o \`!==\` también estrecha el tipo. Es la base de los discriminated unions:

\`\`\`typescript
type Status = "active" | "inactive" | "suspended";

function getStatusMessage(status: Status): string {
    if (status === "active") return "Cuenta activa";
    if (status === "suspended") return "Cuenta suspendida";
    return "Cuenta inactiva"; // TypeScript sabe que solo puede ser "inactive"
}
\`\`\`

## switch - narrowing implícito

En un \`switch\`, TypeScript estrecha el tipo en cada \`case\`:

\`\`\`typescript
type ShapeType = "circle" | "square" | "triangle";

function describe(shape: ShapeType): string {
    switch (shape) {
        case "circle":   return "Figura redonda";
        case "square":   return "Cuatro lados iguales";
        case "triangle": return "Tres lados";
    }
}
\`\`\`

Si el tipo \`ShapeType\` tiene todos los casos cubiertos, TypeScript sabe que el \`switch\` es exhaustivo - no necesitás \`default\` (aunque podés añadir uno con el exhaustive check de \`never\` que vimos en ch03).
`,
    },
    {
      id: "ch06-04",
      title: "Costo de envío",
      type: "exercise",
      instructions: `## Costo de envío

La tienda tiene dos métodos de envío: tarifa fija (\`FlatShipping\`) y tarifa por peso (\`WeightBasedShipping\`). La función \`calculateShipping\` debería calcular el costo correcto según el método, pero actualmente solo maneja el caso de tarifa fija y retorna \`0\` para cualquier otro.

Completá la función para que maneje ambos tipos correctamente:
- \`FlatShipping\`: retorna el costo fijo
- \`WeightBasedShipping\`: retorna \`ratePerKg * weightKg\``,
      starterCode: `class FlatShipping {
    constructor(public cost: number) {}
}

class WeightBasedShipping {
    constructor(public ratePerKg: number) {}
}

type ShippingMethod = FlatShipping | WeightBasedShipping;

function calculateShipping(method: ShippingMethod, weightKg: number): number {
    if (method instanceof FlatShipping) {
        return method.cost;
    }
    return 0; // Bug: debería calcular según el peso
}

const flat = new FlatShipping(9.99);
const weight = new WeightBasedShipping(2.5);

console.log(\`Flat: $\${calculateShipping(flat, 2).toFixed(2)}\`);
console.log(\`Weight (2kg): $\${calculateShipping(weight, 2).toFixed(2)}\`);`,
      solution: `class FlatShipping {
    constructor(public cost: number) {}
}

class WeightBasedShipping {
    constructor(public ratePerKg: number) {}
}

type ShippingMethod = FlatShipping | WeightBasedShipping;

function calculateShipping(method: ShippingMethod, weightKg: number): number {
    if (method instanceof FlatShipping) {
        return method.cost;
    }
    return method.ratePerKg * weightKg;
}

const flat = new FlatShipping(9.99);
const weight = new WeightBasedShipping(2.5);

console.log(\`Flat: $\${calculateShipping(flat, 2).toFixed(2)}\`);
console.log(\`Weight (2kg): $\${calculateShipping(weight, 2).toFixed(2)}\`);`,
      hint: "Ya tenés el caso `FlatShipping` manejado. En el `else` (o después del `if`), TypeScript sabe que `method` es `WeightBasedShipping` - podés acceder a sus propiedades directamente.",
      tests: [
        {
          name: "Usa instanceof para el narrowing",
          run: (code) => /instanceof\s+\w+/.test(code),
        },
        {
          name: "calculateShipping con FlatShipping retorna $9.99",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("9.99");
          },
        },
        {
          name: "calculateShipping con WeightBasedShipping (2kg a $2.5/kg) retorna $5.00",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1]?.includes("5.00");
          },
        },
      ],
    },
    {
      id: "ch06-05",
      title: "Type Predicates",
      type: "explanation",
      content: `# Type Predicates

Un **type predicate** es una función que retorna \`boolean\` y le dice a TypeScript: "Si esto retorna \`true\`, el argumento es de este tipo."

## El problema que resuelven

\`typeof\` e \`instanceof\` no son suficientes para verificar la forma de un objeto arbitrario:

\`\`\`typescript
// Función de validación normal - TypeScript no estrecha el tipo después
function isProduct(value: unknown): boolean {
    return typeof value === "object" && value !== null && "name" in value;
}

function process(input: unknown) {
    if (isProduct(input)) {
        input.name; // Error: TypeScript todavía ve unknown
    }
}
\`\`\`

## La solución: \`value is Tipo\`

Cambiás el tipo de retorno de \`boolean\` a \`value is Tipo\`:

\`\`\`typescript
type Product = { name: string; price: number };

function isProduct(value: unknown): value is Product {
    return (
        typeof value === "object" &&
        value !== null &&
        "name" in value &&
        "price" in value
    );
}

function process(input: unknown) {
    if (isProduct(input)) {
        input.name;  // ✓ TypeScript sabe: Product
        input.price; // ✓
    }
}
\`\`\`

La función sigue retornando \`boolean\` en runtime - el type predicate solo afecta a TypeScript.

## Implementación típica

Para verificar un objeto con varias propiedades, el patrón habitual:

\`\`\`typescript
type Order = { id: string; total: number };

function isOrder(value: unknown): value is Order {
    if (typeof value !== "object" || value === null) return false;
    const obj = value as Record<string, unknown>;
    return typeof obj.id === "string" && typeof obj.total === "number";
}
\`\`\`

1. Verificar que es un objeto no-null
2. Hacer cast a \`Record<string, unknown>\` para acceder a las propiedades
3. Verificar el tipo de cada propiedad relevante

Cuándo usar type predicates: cuando tenés lógica de validación reutilizable y necesitás que TypeScript la reconozca, especialmente con datos externos (APIs, JSON, inputs de usuario).
`,
    },
    {
      id: "ch06-06",
      title: "Validador de pedido",
      type: "exercise",
      instructions: `## Validador de pedido

La función \`isOrder\` debe verificar si un valor desconocido tiene la forma de un \`Order\` válido. Actualmente siempre retorna \`false\`.

Un \`Order\` válido debe tener:
- \`id\` de tipo \`string\`
- \`total\` de tipo \`number\`
- \`status\` de tipo \`string\`

Implementá la lógica de verificación. Tené en cuenta que \`value\` puede ser cualquier cosa, incluido \`null\`.`,
      starterCode: `type Order = { id: string; total: number; status: string };

function isOrder(value: unknown): value is Order {
    // Implementá la verificación
    return false;
}

const valid   = { id: "ORD-001", total: 149.99, status: "pending" };
const noTotal = { id: "ORD-002", status: "shipped" };
const badId   = { id: 123, total: 50, status: "delivered" };

console.log(isOrder(valid));   // true
console.log(isOrder(noTotal)); // false
console.log(isOrder(null));    // false
console.log(isOrder(badId));   // false`,
      solution: `type Order = { id: string; total: number; status: string };

function isOrder(value: unknown): value is Order {
    if (typeof value !== "object" || value === null) return false;
    const obj = value as Record<string, unknown>;
    return (
        typeof obj.id === "string" &&
        typeof obj.total === "number" &&
        typeof obj.status === "string"
    );
}

const valid   = { id: "ORD-001", total: 149.99, status: "pending" };
const noTotal = { id: "ORD-002", status: "shipped" };
const badId   = { id: 123, total: 50, status: "delivered" };

console.log(isOrder(valid));
console.log(isOrder(noTotal));
console.log(isOrder(null));
console.log(isOrder(badId));`,
      hint: "Primero verificá que `value` es un objeto no-null. Después, hacé cast a `Record<string, unknown>` para acceder a las propiedades con seguridad y verificar el tipo de cada una.",
      tests: [
        {
          name: "El tipo de retorno es 'value is Order'",
          run: (code) => /value\s+is\s+Order/.test(code),
        },
        {
          name: "isOrder retorna true para un Order completo",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "true";
          },
        },
        {
          name: "isOrder retorna false si faltan propiedades",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "false";
          },
        },
        {
          name: "isOrder retorna false para null",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2] === "false";
          },
        },
        {
          name: "isOrder retorna false si las propiedades tienen tipos incorrectos",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[3] === "false";
          },
        },
      ],
    },
    {
      id: "ch06-07",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen - Type Guards / Narrowing

## Narrowing

TypeScript reduce el tipo de una variable dentro de un condicional - sin casts, sin assertions. Solo análisis del flujo del código.

## Técnicas de narrowing

| Técnica | Cuándo usarla |
|---------|---------------|
| \`typeof\` | Primitivos: string, number, boolean, undefined |
| Truthiness (\`if (value)\`) | Eliminar null/undefined/falsy del tipo |
| \`=== valor\` | Discriminated unions, comparar con valores literales |
| \`instanceof\` | Instancias de clases |
| Type predicate (\`value is T\`) | Objetos con forma específica, validación reutilizable |

## Cuidados

- \`typeof null === "object"\` - para null usá comparación directa: \`value === null\`
- \`instanceof\` solo funciona con clases, no con tipos de objeto plano
- Los type predicates son contratos - TypeScript confía en vos. Si la implementación es incorrecta, el narrowing va a mentir

## Lo que viene

El próximo capítulo cubre **TypeScript Functions** - cómo tipar parámetros, retorno, parámetros opcionales, rest params, y function overloading.
`,
    },
  ],
};
