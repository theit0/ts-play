import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch12: Chapter = {
  id: "ch12",
  title: "Advanced Types",
  lessons: [
    {
      id: "ch12-01",
      title: "Mapped Types",
      type: "explanation",
      content: `# Mapped Types

## El problema que resuelven

A veces necesitás variantes de un tipo existente - todos los campos opcionales, todos readonly, todos convertidos a string. Sin mapped types, terminarías duplicando la definición cada vez:

\`\`\`typescript
type Product = { id: number; name: string; price: number };

// Sin mapped types - duplicación manual
type ReadonlyProduct = { readonly id: number; readonly name: string; readonly price: number };
type NullableProduct = { id: number | null; name: string | null; price: number | null };
\`\`\`

Los **mapped types** generan un tipo nuevo iterando sobre las claves de un tipo existente.

## Sintaxis básica

\`\`\`typescript
type Readonly<T> = {
    readonly [K in keyof T]: T[K];
//  ^^^^^^^^               ^^^^
//  modificador            valor del tipo para la clave K
//           ^^^^^^^^^^^^^^
//           itera sobre todas las claves de T
};
\`\`\`

- \`K in keyof T\` - itera sobre cada clave de T
- \`T[K]\` - el tipo del valor de la propiedad K en T
- Los modificadores \`readonly\` y \`?\` se pueden añadir antes de la clave

## Añadir y quitar modificadores

\`\`\`typescript
// Hace todos los campos opcionales
type Optional<T> = { [K in keyof T]?: T[K] };

// Hace todos los campos readonly
type Frozen<T> = { readonly [K in keyof T]: T[K] };

// Quita readonly de todos los campos (el - remueve el modificador)
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

// Quita el ? de todos los campos (los hace obligatorios)
type Concrete<T> = { [K in keyof T]-?: T[K] };
\`\`\`

## Transformar los valores

También podés cambiar el tipo de los valores:

\`\`\`typescript
// Convierte todos los valores a string
type Stringified<T> = { [K in keyof T]: string };

// Hace todos los valores nullable
type Nullable<T> = { [K in keyof T]: T[K] | null };

type Product = { id: number; name: string; price: number };
type NullableProduct = Nullable<Product>;
// { id: number | null; name: string | null; price: number | null }
\`\`\`

## Error común

\`\`\`typescript
// ❌ No iterás sobre T - el resultado es solo un objeto con clave T
type Wrong<T> = { [T]: string };

// ✓ Iterás con "in keyof"
type Correct<T> = { [K in keyof T]: string };
\`\`\`
`,
    },
    {
      id: "ch12-02",
      title: "Tipo mutable",
      type: "exercise",
      instructions: `## Tipo mutable

TypeScript viene con \`Readonly<T>\` incorporado, pero no tiene un \`Mutable<T>\` que haga lo opuesto.

Implementá \`Mutable<T>\` - un mapped type que toma cualquier tipo y elimina el modificador \`readonly\` de todas sus propiedades.`,
      starterCode: `type Mutable<T> = T; // implementá usando mapped type

type ReadonlyOrder = {
    readonly id: number;
    readonly status: string;
    readonly total: number;
};

const draft: Mutable<ReadonlyOrder> = {
    id: 1,
    status: "pending",
    total: 999,
};

draft.status = "processing";
draft.total = 899;
console.log(draft.status);
console.log(draft.total);`,
      solution: `type Mutable<T> = { -readonly [K in keyof T]: T[K] };

type ReadonlyOrder = {
    readonly id: number;
    readonly status: string;
    readonly total: number;
};

const draft: Mutable<ReadonlyOrder> = {
    id: 1,
    status: "pending",
    total: 999,
};

draft.status = "processing";
draft.total = 899;
console.log(draft.status);
console.log(draft.total);`,
      hint: "El prefijo `-` antes de un modificador lo elimina. Para quitar `readonly`, escribís `-readonly` justo antes de la clave en el mapped type.",
      tests: [
        {
          name: "Mutable usa la sintaxis de mapped type [K in keyof T]",
          run: (code) => /\[K\s+in\s+keyof\s+T\]/.test(code),
        },
        {
          name: "Mutable elimina el modificador readonly con -readonly",
          run: (code) => /-readonly/.test(code),
        },
        {
          name: "draft.status se actualiza a 'processing'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "processing";
          },
        },
        {
          name: "draft.total se actualiza a 899",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "899";
          },
        },
      ],
    },
    {
      id: "ch12-03",
      title: "Conditional Types",
      type: "explanation",
      content: `# Conditional Types

## Tipos que dependen de una condición

Un conditional type elige entre dos tipos según si \`T\` extiende \`U\`:

\`\`\`typescript
type IsString<T> = T extends string ? "sí" : "no";

type A = IsString<string>;  // "sí"
type B = IsString<number>;  // "no"
type C = IsString<"hola">;  // "sí" - "hola" extiende string
\`\`\`

La sintaxis es idéntica a un ternario de JavaScript, pero opera sobre tipos.

## infer - extraer un tipo interno

La palabra clave \`infer\` captura un tipo dentro de una estructura para usarlo en la rama verdadera:

\`\`\`typescript
// Extrae el tipo de elemento de un array
type ElementType<T> = T extends (infer U)[] ? U : never;

type A = ElementType<string[]>;  // string
type B = ElementType<number[]>;  // number
type C = ElementType<boolean>;   // never - no es un array
\`\`\`

\`infer U\` le dice a TypeScript: "si T encaja en esta forma, capturá el tipo en esa posición como U."

Otro ejemplo - extraer el tipo resuelto de una Promise:

\`\`\`typescript
type Awaited<T> = T extends Promise<infer U> ? U : T;

type A = Awaited<Promise<string>>;  // string
type B = Awaited<number>;           // number (no es Promise, retorna T)
\`\`\`

## Distributive conditional types

Cuando T es una union, el conditional type se aplica a cada miembro por separado:

\`\`\`typescript
type ToArray<T> = T extends any ? T[] : never;

type A = ToArray<string | number>;
// string extends any ? string[] : never → string[]
// number extends any ? number[] : never → number[]
// resultado: string[] | number[]
\`\`\`

Esto es **distributividad** - TypeScript distribuye el conditional type sobre cada miembro de la union.

## Error común

\`\`\`typescript
// ❌ infer fuera de extends - no tiene sentido
type Wrong<T> = infer U;

// ✓ infer solo dentro del extends de un conditional type
type Correct<T> = T extends (infer U)[] ? U : never;
\`\`\`
`,
    },
    {
      id: "ch12-04",
      title: "Tipo de elemento",
      type: "exercise",
      instructions: `## Tipo de elemento

Implementá \`ElementType<T>\` - un tipo que extrae el tipo de elemento de un array. Si T no es un array, debe evaluar a \`never\`.

\`\`\`
ElementType<string[]>  → string
ElementType<number[]>  → number
ElementType<boolean>   → never
\`\`\``,
      starterCode: `type ElementType<T> = T; // implementá usando conditional type con infer

const products = ["Laptop", "Mouse", "Teclado"];
const prices = [999, 49, 79];

function firstProduct(): ElementType<typeof products> {
    return products[0];
}

function firstPrice(): ElementType<typeof prices> {
    return prices[0];
}

console.log(firstProduct());
console.log(firstPrice());`,
      solution: `type ElementType<T> = T extends (infer U)[] ? U : never;

const products = ["Laptop", "Mouse", "Teclado"];
const prices = [999, 49, 79];

function firstProduct(): ElementType<typeof products> {
    return products[0];
}

function firstPrice(): ElementType<typeof prices> {
    return prices[0];
}

console.log(firstProduct());
console.log(firstPrice());`,
      hint: "Usá `infer` para capturar el tipo de elemento dentro de la condición. La forma de un array es `(infer U)[]` - si T encaja en esa forma, U es el tipo del elemento.",
      tests: [
        {
          name: "ElementType usa un conditional type (T extends)",
          run: (code) => /T\s+extends/.test(code),
        },
        {
          name: "ElementType usa infer para capturar el tipo de elemento",
          run: (code) => /infer\s+\w+/.test(code),
        },
        {
          name: "firstProduct() retorna 'Laptop'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "Laptop";
          },
        },
        {
          name: "firstPrice() retorna 999",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "999";
          },
        },
      ],
    },
    {
      id: "ch12-05",
      title: "Template Literal Types y Recursive Types",
      type: "explanation",
      content: `# Template Literal Types y Recursive Types

## Template Literal Types

Así como los template literals de JavaScript construyen strings en runtime, los template literal types construyen tipos de strings en compile time:

\`\`\`typescript
type Greeting = \`Hello, \${string}\`;
// cualquier string que empiece con "Hello, "

type EventName = \`on\${string}\`;
// "onClick", "onChange", "onSubmit", etc.
\`\`\`

## Combinar con unions

Cuando el tipo interpolado es una union, TypeScript genera todas las combinaciones posibles:

\`\`\`typescript
type OrderStatus = "pending" | "processing" | "shipped" | "delivered";
type OrderEvent = \`order_\${OrderStatus}\`;
// "order_pending" | "order_processing" | "order_shipped" | "order_delivered"

type Direction = "top" | "bottom" | "left" | "right";
type CSSPadding = \`padding-\${Direction}\`;
// "padding-top" | "padding-bottom" | "padding-left" | "padding-right"
\`\`\`

## String utilities incorporadas

TypeScript incluye tipos para transformar strings:

\`\`\`typescript
type U = Uppercase<"hello">;     // "HELLO"
type L = Lowercase<"HELLO">;     // "hello"
type C = Capitalize<"hello">;    // "Hello"
type Un = Uncapitalize<"Hello">; // "hello"

// Caso de uso: generar event handlers con nombre correcto
type Handler<T extends string> = \`on\${Capitalize<T>}\`;
type ClickHandler = Handler<"click">;  // "onClick"
\`\`\`

## Recursive Types

Los tipos recursivos se referencian a sí mismos en su propia definición. El caso canónico es \`JSONValue\` - cualquier valor válido en JSON:

\`\`\`typescript
type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue };

const config: JSONValue = {
    name: "app",
    version: 1,
    features: ["auth", "billing"],
    settings: { debug: false, timeout: 5000 }
};
\`\`\`

Otro ejemplo - una jerarquía de categorías anidadas:

\`\`\`typescript
type Category = {
    name: string;
    subcategories?: Category[];
};

const electronics: Category = {
    name: "Electronics",
    subcategories: [
        { name: "Laptops" },
        {
            name: "Peripherals",
            subcategories: [
                { name: "Keyboards" },
                { name: "Mice" }
            ]
        }
    ]
};
\`\`\`

TypeScript resuelve tipos recursivos de forma lazy - no los expande infinitamente, solo cuando los necesita.
`,
    },
    {
      id: "ch12-06",
      title: "Eventos de pedido",
      type: "exercise",
      instructions: `## Eventos de pedido

El sistema de eventos emite strings con el formato \`order_<estado>\` cada vez que un pedido cambia de estado. Actualmente \`OrderEvent\` es \`string\`, por lo que TypeScript acepta cualquier string - incluso valores incorrectos.

Derivá \`OrderEvent\` desde \`OrderStatus\` usando un template literal type para que solo se puedan emitir los cuatro eventos válidos.`,
      starterCode: `type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

type OrderEvent = string; // derivá este tipo de OrderStatus usando template literal type

function emit(event: OrderEvent, data: unknown): void {
    console.log(\`Emitted: \${event}\`);
}

emit("order_pending",    { orderId: 1 });
emit("order_processing", { orderId: 1, warehouse: "BUE" });
emit("order_shipped",    { orderId: 1, trackingId: "TR-001" });`,
      solution: `type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

type OrderEvent = \`order_\${OrderStatus}\`;

function emit(event: OrderEvent, data: unknown): void {
    console.log(\`Emitted: \${event}\`);
}

emit("order_pending",    { orderId: 1 });
emit("order_processing", { orderId: 1, warehouse: "BUE" });
emit("order_shipped",    { orderId: 1, trackingId: "TR-001" });`,
      hint: "La sintaxis de template literal type es igual a un template literal de JavaScript, pero a nivel de tipos. Interpolá `OrderStatus` dentro del pattern `order_...`.",
      tests: [
        {
          name: "OrderEvent usa un template literal type con OrderStatus",
          run: (code) => /`order_\$\{OrderStatus\}`/.test(code),
        },
        {
          name: "emit('order_pending') imprime el evento correcto",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "Emitted: order_pending";
          },
        },
        {
          name: "emit('order_processing') imprime el evento correcto",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "Emitted: order_processing";
          },
        },
        {
          name: "emit('order_shipped') imprime el evento correcto",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2] === "Emitted: order_shipped";
          },
        },
      ],
    },
    {
      id: "ch12-07",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen - Advanced Types

## Mapped Types

Generan un tipo nuevo iterando sobre las claves de un tipo existente:

\`\`\`typescript
// Añadir modificadores
type Frozen<T>  = { readonly [K in keyof T]: T[K] };
type Optional<T> = { [K in keyof T]?: T[K] };

// Quitar modificadores
type Mutable<T>  = { -readonly [K in keyof T]: T[K] };
type Concrete<T> = { [K in keyof T]-?: T[K] };

// Transformar valores
type Nullable<T> = { [K in keyof T]: T[K] | null };
\`\`\`

## Conditional Types

Eligen entre dos tipos según una condición:

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false;

// Con infer - extrae un tipo interno
type ElementType<T> = T extends (infer U)[] ? U : never;
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
\`\`\`

## Template Literal Types

Construyen tipos de strings combinando literales y unions:

\`\`\`typescript
type Status = "active" | "inactive";
type StatusKey = \`is_\${Status}\`;  // "is_active" | "is_inactive"
\`\`\`

## Recursive Types

Se referencian a sí mismos - útiles para estructuras de datos anidadas:

\`\`\`typescript
type JSONValue = string | number | boolean | null | JSONValue[] | { [k: string]: JSONValue };
\`\`\`

## Cómo se relacionan con Utility Types

Los Utility Types del capítulo anterior están implementados con estas mismas herramientas:

\`\`\`typescript
// Así están implementados internamente:
type Partial<T>  = { [K in keyof T]?: T[K] };           // mapped type
type Required<T> = { [K in keyof T]-?: T[K] };          // mapped type con -?
type ReturnType<F extends (...args: any) => any>
                 = F extends (...args: any) => infer R ? R : never; // conditional + infer
\`\`\`

## Lo que viene

El próximo capítulo cubre **Decorators** - metaprogramación en TypeScript 5.0+ para añadir comportamiento a clases y métodos de forma declarativa.
`,
    },
  ],
};
