import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch13: Chapter = {
  id: "ch13",
  title: "TypeScript Modules",
  lessons: [
    {
      id: "ch13-01",
      title: "ES Modules y Declaration Merging",
      type: "explanation",
      content: `# ES Modules y Declaration Merging

## ES Modules en TypeScript

TypeScript usa el mismo sistema de módulos que JavaScript moderno. Cada archivo con \`import\` o \`export\` es un módulo — su scope es local, no global.

\`\`\`typescript
// products.ts
export type Product = { id: number; name: string; price: number };
export function formatPrice(p: Product): string {
    return \`\${p.name}: $\${p.price.toFixed(2)}\`;
}
export default function createProduct(name: string, price: number): Product {
    return { id: Date.now(), name, price };
}

// app.ts
import createProduct, { formatPrice, type Product } from "./products";

const laptop: Product = createProduct("Laptop", 999);
console.log(formatPrice(laptop)); // "Laptop: $999.00"
\`\`\`

## import type — imports solo de tipo

Los imports de tipo son eliminados completamente por el compilador — no generan código JavaScript. Esto mejora el tree-shaking y evita dependencias circulares involuntarias:

\`\`\`typescript
import type { Product } from "./products";       // ✓ solo el tipo, cero runtime
import { type Product, formatPrice } from "./products"; // ✓ tipo inline
\`\`\`

## Re-exports

\`\`\`typescript
// index.ts — barrel file que re-exporta todo lo público
export { Product, formatPrice } from "./products";
export { Order, createOrder } from "./orders";
export type { Customer } from "./customers"; // re-export de solo tipo
\`\`\`

## Declaration Merging

TypeScript permite declarar la misma interface varias veces — las declaraciones se fusionan en una sola. Esto es especialmente útil para extender tipos de librerías externas sin modificar su código:

\`\`\`typescript
// Declaración original (de una librería)
interface Request {
    method: string;
    url: string;
}

// Tu extensión — en tu código, mismo nombre
interface Request {
    user?: { id: number; role: string };
}

// TypeScript fusiona ambas:
const req: Request = { method: "GET", url: "/api", user: { id: 1, role: "admin" } };
console.log(req.user?.role); // "admin"
\`\`\`

Las propiedades deben ser compatibles — si dos declaraciones tienen la misma propiedad con tipos distintos, TypeScript lo reporta como error.

## Error común

\`\`\`typescript
// ❌ Re-declarar una propiedad con tipo incompatible — error
interface Product { id: number; }
interface Product { id: string; } // Error: types incompatibles

// ✓ Agregar propiedades nuevas — esto sí funciona
interface Product { id: number; }
interface Product { category: string; } // OK — agrega category
\`\`\`
`,
    },
    {
      id: "ch13-02",
      title: "Extender una interfaz",
      type: "exercise",
      instructions: `## Extender una interfaz

La interfaz \`Product\` está declarada en un módulo externo que no podés modificar. Necesitás agregarle los campos \`category\` y \`inStock\` para tu aplicación.

Usá declaration merging — declarando \`interface Product\` una segunda vez — para agregarle esas propiedades sin tocar la declaración original.`,
      starterCode: `interface Product {
    id: number;
    name: string;
    price: number;
}

// Extendé Product con declaration merging (no modifiques el bloque de arriba)

function describe(p: Product): string {
    const stock = p.inStock ? "en stock" : "sin stock";
    return \`\${p.name} [\${p.category}] - $\${p.price.toFixed(2)} - \${stock}\`;
}

const laptop: Product = {
    id: 1,
    name: "Laptop",
    price: 999,
    category: "Electronics",
    inStock: true,
};
console.log(describe(laptop));`,
      solution: `interface Product {
    id: number;
    name: string;
    price: number;
}

interface Product {
    category: string;
    inStock: boolean;
}

function describe(p: Product): string {
    const stock = p.inStock ? "en stock" : "sin stock";
    return \`\${p.name} [\${p.category}] - $\${p.price.toFixed(2)} - \${stock}\`;
}

const laptop: Product = {
    id: 1,
    name: "Laptop",
    price: 999,
    category: "Electronics",
    inStock: true,
};
console.log(describe(laptop));`,
      hint: "Declaration merging funciona declarando `interface Product` una segunda vez con las propiedades nuevas. TypeScript fusiona automáticamente ambas declaraciones.",
      tests: [
        {
          name: "Hay al menos dos declaraciones de interface Product",
          run: (code) =>
            (code.match(/interface\s+Product/g) ?? []).length >= 2,
        },
        {
          name: "La segunda declaración agrega category: string",
          run: (code) => /category\s*:\s*string/.test(code),
        },
        {
          name: "La segunda declaración agrega inStock: boolean",
          run: (code) => /inStock\s*:\s*boolean/.test(code),
        },
        {
          name: "describe(laptop) imprime el formato correcto",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0] === "Laptop [Electronics] - $999.00 - en stock"
            );
          },
        },
      ],
    },
    {
      id: "ch13-03",
      title: "Namespaces y Ambient Modules",
      type: "explanation",
      content: `# Namespaces y Ambient Modules

## Namespaces

Los namespaces son la forma legacy de TypeScript para organizar código antes de que existieran los ES modules. Compilan a objetos JavaScript anidados:

\`\`\`typescript
namespace Validation {
    export interface StringValidator {
        isValid(s: string): boolean;
    }

    export function validate(value: string, validator: StringValidator): boolean {
        return validator.isValid(value);
    }
}

// Uso — se accede con notación de punto
const emailValidator: Validation.StringValidator = {
    isValid: (s) => s.includes("@"),
};

Validation.validate("user@example.com", emailValidator); // true
\`\`\`

TypeScript compila este código a un objeto JavaScript:

\`\`\`javascript
var Validation;
(function (Validation) {
    function validate(value, validator) {
        return validator.isValid(value);
    }
    Validation.validate = validate;
})(Validation || (Validation = {}));
\`\`\`

**Hoy en día:** usá ES modules (\`import/export\`) en código nuevo. El equivalente moderno es tipar un objeto \`const\` con una interface — mismo resultado, sin la sintaxis legacy.

## Equivalente moderno al namespace

\`\`\`typescript
// Con namespace (legacy)
namespace Catalog {
    export function findAll(): Product[] { return []; }
}

// Con objeto tipado (moderno)
interface CatalogModule {
    findAll(): Product[];
}
const Catalog: CatalogModule = {
    findAll() { return []; },
};
\`\`\`

## Ambient Modules — declarar tipos para librerías sin tipos

Cuando usás una librería JavaScript sin tipos (\`@types/...\` no existe), podés declarar sus tipos en un archivo \`.d.ts\`:

\`\`\`typescript
// types/mi-libreria.d.ts
declare module "mi-libreria" {
    export function calcular(valor: number): number;
    export const version: string;
}

// app.ts
import { calcular, version } from "mi-libreria"; // ✓ TypeScript conoce los tipos
\`\`\`

\`declare\` le dice a TypeScript "esto existe en runtime, solo estoy describiendo sus tipos." No genera código JavaScript.

## declare global — extender el scope global

\`\`\`typescript
// En un archivo .d.ts o en un módulo
declare global {
    interface Window {
        analyticsId: string;
    }
}

window.analyticsId = "UA-12345"; // ✓
\`\`\`

**Importante:** \`declare global\` solo funciona dentro de un módulo (archivo con \`import\` o \`export\`).
`,
    },
    {
      id: "ch13-04",
      title: "Módulo de catálogo tipado",
      type: "exercise",
      instructions: `## Módulo de catálogo tipado

La interfaz \`CatalogUtils\` define el contrato de un módulo de catálogo. El objeto \`Catalog\` implementa ese contrato, pero las dos funciones están incompletas.

Implementá \`findByCategory\` y \`cheapest\` para que el código funcione correctamente.`,
      starterCode: `type Category = "electronics" | "peripherals" | "accessories";

interface Product {
    id: number;
    name: string;
    price: number;
    category: Category;
}

interface CatalogUtils {
    findByCategory(products: Product[], category: Category): Product[];
    cheapest(products: Product[]): Product | undefined;
}

const Catalog: CatalogUtils = {
    findByCategory(products, category) {
        return []; // implementá
    },
    cheapest(products) {
        return undefined; // implementá
    },
};

const products: Product[] = [
    { id: 1, name: "Laptop",    price: 999, category: "electronics" },
    { id: 2, name: "Mouse",     price: 49,  category: "peripherals" },
    { id: 3, name: "Teclado",   price: 79,  category: "peripherals" },
    { id: 4, name: "Cable USB", price: 9,   category: "accessories" },
];

const peripherals = Catalog.findByCategory(products, "peripherals");
console.log(peripherals.length);
console.log(peripherals[0].name);
console.log(Catalog.cheapest(products)?.name);`,
      solution: `type Category = "electronics" | "peripherals" | "accessories";

interface Product {
    id: number;
    name: string;
    price: number;
    category: Category;
}

interface CatalogUtils {
    findByCategory(products: Product[], category: Category): Product[];
    cheapest(products: Product[]): Product | undefined;
}

const Catalog: CatalogUtils = {
    findByCategory(products, category) {
        return products.filter(p => p.category === category);
    },
    cheapest(products) {
        if (products.length === 0) return undefined;
        return products.reduce((min, p) => p.price < min.price ? p : min);
    },
};

const products: Product[] = [
    { id: 1, name: "Laptop",    price: 999, category: "electronics" },
    { id: 2, name: "Mouse",     price: 49,  category: "peripherals" },
    { id: 3, name: "Teclado",   price: 79,  category: "peripherals" },
    { id: 4, name: "Cable USB", price: 9,   category: "accessories" },
];

const peripherals = Catalog.findByCategory(products, "peripherals");
console.log(peripherals.length);
console.log(peripherals[0].name);
console.log(Catalog.cheapest(products)?.name);`,
      hint: "Para `findByCategory` usá `.filter()`. Para `cheapest` podés usar `.reduce()` comparando precios, o un loop que actualice el mínimo.",
      tests: [
        {
          name: "Catalog está tipado con CatalogUtils",
          run: (code) => /Catalog\s*:\s*CatalogUtils/.test(code),
        },
        {
          name: "findByCategory retorna los 2 periféricos",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "2";
          },
        },
        {
          name: "El primer periférico es 'Mouse'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "Mouse";
          },
        },
        {
          name: "cheapest retorna 'Cable USB' (el más barato)",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2] === "Cable USB";
          },
        },
      ],
    },
    {
      id: "ch13-05",
      title: "Namespace Augmentation",
      type: "explanation",
      content: `# Namespace Augmentation

## Extender un namespace existente

Al igual que con las interfaces, podés declarar el mismo namespace múltiples veces — las declaraciones se fusionan. Esto se llama **namespace augmentation** y es útil para añadir funcionalidad a un namespace de una librería externa:

\`\`\`typescript
// En la librería (no podés modificarlo)
namespace MathUtils {
    export function suma(a: number, b: number): number {
        return a + b;
    }
}

// En tu código — augmentás el namespace
namespace MathUtils {
    export function resta(a: number, b: number): number {
        return a - b;
    }
}

MathUtils.suma(10, 5);  // 15
MathUtils.resta(10, 5); // 5
\`\`\`

El equivalente moderno — declaration merging de la interface + extensión del objeto:

\`\`\`typescript
// Interfaz original
interface MathUtils { suma(a: number, b: number): number; }
const MathUtils: MathUtils = { suma: (a, b) => a + b };

// Extendés la interface y el objeto
interface MathUtils { resta(a: number, b: number): number; }
(MathUtils as any).resta = (a: number, b: number) => a - b;
\`\`\`

## Module Augmentation

Cuando la librería usa ES modules (no namespaces), el patrón de augmentation es distinto — usás \`declare module\`:

\`\`\`typescript
// express.d.ts — extendés el tipo Request de Express
declare module "express" {
    interface Request {
        currentUser?: {
            id: number;
            role: string;
        };
    }
}

// Ahora en cualquier handler de Express:
app.get("/profile", (req, res) => {
    console.log(req.currentUser?.role); // ✓ TypeScript lo conoce
});
\`\`\`

Este patrón es muy común en proyectos con Express, Fastify o cualquier framework que define tipos extensibles.

## Cuándo usar qué

| Situación | Herramienta |
|-----------|-------------|
| Agregar propiedades a una interface de librería | Declaration merging |
| Agregar propiedades a un módulo con exports | \`declare module "nombre"\` |
| Agregar al scope global (Window, etc.) | \`declare global { ... }\` |
`,
    },
    {
      id: "ch13-06",
      title: "Extender una interfaz de módulo",
      type: "exercise",
      instructions: `## Extender una interfaz de módulo

El objeto \`PriceUtils\` implementa la interfaz \`PriceFormatter\`. Necesitás añadirle dos funciones:

- \`withTax(price: number, taxRate: number): number\` — aplica el impuesto (ej: 999 con 0.21 → 1208.79)
- \`discount(price: number, percent: number): number\` — aplica descuento porcentual (ej: 999 con 10 → 899.1)

Usá declaration merging para extender \`PriceFormatter\` con esas dos firmas, e implementá las funciones en el objeto \`PriceUtils\`.`,
      starterCode: `interface PriceFormatter {
    format(price: number): string;
}

// Extendé PriceFormatter con declaration merging

const PriceUtils = {
    format(price: number): string {
        return \`$\${price.toFixed(2)}\`;
    },
    withTax(price: number, taxRate: number): number {
        return price; // implementá
    },
    discount(price: number, percent: number): number {
        return price; // implementá
    },
};

const basePrice = 999;

console.log(PriceUtils.format(basePrice));
console.log(PriceUtils.format(PriceUtils.withTax(basePrice, 0.21)));
console.log(PriceUtils.format(PriceUtils.discount(basePrice, 10)));`,
      solution: `interface PriceFormatter {
    format(price: number): string;
}

interface PriceFormatter {
    withTax(price: number, taxRate: number): number;
    discount(price: number, percent: number): number;
}

const PriceUtils = {
    format(price: number): string {
        return \`$\${price.toFixed(2)}\`;
    },
    withTax(price: number, taxRate: number): number {
        return price * (1 + taxRate);
    },
    discount(price: number, percent: number): number {
        return price * (1 - percent / 100);
    },
};

const basePrice = 999;

console.log(PriceUtils.format(basePrice));
console.log(PriceUtils.format(PriceUtils.withTax(basePrice, 0.21)));
console.log(PriceUtils.format(PriceUtils.discount(basePrice, 10)));`,
      hint: "Declaration merging: declarar `interface PriceFormatter` una segunda vez con las firmas de `withTax` y `discount`. Luego implementar las fórmulas correctas en el objeto.",
      tests: [
        {
          name: "PriceFormatter se declara al menos dos veces",
          run: (code) =>
            (code.match(/interface\s+PriceFormatter/g) ?? []).length >= 2,
        },
        {
          name: "PriceUtils.format(999) imprime '$999.00'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "$999.00";
          },
        },
        {
          name: "withTax(999, 0.21) calcula el precio con impuesto correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "$1208.79";
          },
        },
        {
          name: "discount(999, 10) aplica el 10% de descuento correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2] === "$899.10";
          },
        },
      ],
    },
    {
      id: "ch13-07",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen — TypeScript Modules

## ES Modules

TypeScript usa ES modules nativos. Las diferencias respecto a JavaScript:

\`\`\`typescript
import type { Product } from "./products";     // solo el tipo, cero runtime cost
import { type Product, formatPrice } from "./products"; // mezcla: tipo inline
export type { Product };                         // re-export de solo tipo
\`\`\`

## Declaration Merging

Declarar la misma interface múltiples veces fusiona las declaraciones:

\`\`\`typescript
interface Request { url: string; }
interface Request { user?: { id: number }; } // se fusionan — Request tiene url y user
\`\`\`

## Namespaces

Compilan a objetos JavaScript (usando el compilador TypeScript). El equivalente moderno es un objeto tipado con interface:

\`\`\`typescript
// Legacy
namespace Utils { export function fn() {} }

// Moderno
interface UtilsModule { fn(): void; }
const Utils: UtilsModule = { fn() {} };
\`\`\`

## Augmentation

| Patrón | Cuándo usarlo |
|--------|---------------|
| Segunda declaración \`interface Foo\` | Extender una interface existente |
| \`declare module "lib" { interface ... }\` | Extender tipos de módulos externos |
| \`declare global { interface Window { ... } }\` | Extender el scope global |

## Ambient Modules

Para librerías sin tipos propios:

\`\`\`typescript
// types/sin-tipos.d.ts
declare module "sin-tipos" {
    export function fn(x: number): string;
}
\`\`\`

## Lo que viene

El último capítulo cubre el **Ecosystem** — herramientas, librerías y recursos que complementan TypeScript en proyectos reales.
`,
    },
  ],
};
