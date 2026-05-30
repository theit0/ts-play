import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch08: Chapter = {
  id: "ch08",
  title: "TypeScript Interfaces",
  lessons: [
    {
      id: "ch08-01",
      title: "Interface Declaration",
      type: "explanation",
      content: `# Interface Declaration

Una **interface** describe la forma de un objeto - qué propiedades tiene y de qué tipo son:

\`\`\`typescript
interface Product {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
}
\`\`\`

A diferencia de \`type\`, no necesitás el signo \`=\` - el cuerpo va directo después del nombre.

## Propiedades opcionales y readonly

\`\`\`typescript
interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;    // opcional - puede estar ausente
    readonly sku: string;    // readonly - no se puede modificar después de crear el objeto
}
\`\`\`

Con \`readonly\`, TypeScript impide la reasignación:

\`\`\`typescript
const p: Product = { id: 1, name: "Laptop", price: 999, sku: "LAP-001" };
p.price = 899; // ✓ - price no es readonly
p.sku = "LAP-002"; // Error: no se puede reasignar una propiedad readonly
\`\`\`

## Métodos en interfaces

Las interfaces también pueden describir métodos:

\`\`\`typescript
interface ProductRepository {
    find(id: number): Product | undefined;
    findAll(inStockOnly?: boolean): Product[];
    save(product: Product): void;
}
\`\`\`

## Index signatures

Para objetos con claves dinámicas:

\`\`\`typescript
interface Catalog {
    [sku: string]: Product; // cualquier clave string mapea a un Product
}

const store: Catalog = {
    "LAP-001": { id: 1, name: "Laptop", price: 999, sku: "LAP-001" },
    "MOU-001": { id: 2, name: "Mouse", price: 49, sku: "MOU-001" }
};
\`\`\`
`,
    },
    {
      id: "ch08-02",
      title: "Catálogo de productos",
      type: "exercise",
      instructions: `## Catálogo de productos

La función \`displayProduct\` muestra la información de un producto en el catálogo, pero el parámetro \`product\` no tiene tipo - TypeScript está reportando implicit \`any\`.

Definí una interface \`Product\` con las siguientes propiedades:
- \`name\` - string
- \`price\` - number
- \`inStock\` - boolean
- \`quantity\` - number
- \`description\` - string, pero no todos los productos la tienen

Luego anotá el parámetro \`product\` con esa interface.`,
      starterCode: `function displayProduct(product) {
    console.log(\`\${product.name} - $\${product.price.toFixed(2)}\`);
    console.log(\`Stock: \${product.inStock ? "Disponible" : "Agotado"} (\${product.quantity} unidades)\`);
    if (product.description) {
        console.log(product.description);
    }
}

const laptop = {
    name: "Laptop Pro",
    price: 1299.99,
    inStock: true,
    quantity: 15,
    description: "Intel Core i7, 16GB RAM"
};

const keyboard = {
    name: "Teclado Mecánico",
    price: 79.99,
    inStock: false,
    quantity: 0
};

displayProduct(laptop);
displayProduct(keyboard);`,
      solution: `interface Product {
    name: string;
    price: number;
    inStock: boolean;
    quantity: number;
    description?: string;
}

function displayProduct(product: Product) {
    console.log(\`\${product.name} - $\${product.price.toFixed(2)}\`);
    console.log(\`Stock: \${product.inStock ? "Disponible" : "Agotado"} (\${product.quantity} unidades)\`);
    if (product.description) {
        console.log(product.description);
    }
}

const laptop = {
    name: "Laptop Pro",
    price: 1299.99,
    inStock: true,
    quantity: 15,
    description: "Intel Core i7, 16GB RAM"
};

const keyboard = {
    name: "Teclado Mecánico",
    price: 79.99,
    inStock: false,
    quantity: 0
};

displayProduct(laptop);
displayProduct(keyboard);`,
      hint: "Mirá cómo se usa cada propiedad en la función. ¿Cuál puede estar ausente? Esa va con `?`.",
      tests: [
        {
          name: "Tiene una interface Product",
          run: (code) => /interface\s+Product\b/.test(code),
        },
        {
          name: "description es una propiedad opcional",
          run: (code) => /description\s*\?/.test(code),
        },
        {
          name: "product está anotado como Product",
          run: (code) => /product\s*:\s*Product\b/.test(code),
        },
        {
          name: "displayProduct muestra nombre y precio correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("Laptop Pro") &&
              output[0]?.includes("1299.99")
            );
          },
        },
        {
          name: "displayProduct sin description no imprime la tercera línea",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && !output[3]?.includes("undefined");
          },
        },
      ],
    },
    {
      id: "ch08-03",
      title: "Extending Interfaces",
      type: "explanation",
      content: `# Extending Interfaces

## extends - heredar propiedades

Una interface puede extender otra - hereda todas sus propiedades y añade las propias:

\`\`\`typescript
interface User {
    id: number;
    name: string;
    email: string;
}

interface Customer extends User {
    loyaltyPoints: number;
    shippingAddress: string;
}

// Customer tiene: id, name, email, loyaltyPoints, shippingAddress
const c: Customer = {
    id: 1,
    name: "Ana García",
    email: "ana@mail.com",
    loyaltyPoints: 250,
    shippingAddress: "Av. Corrientes 1234"
};
\`\`\`

Podés extender múltiples interfaces al mismo tiempo:

\`\`\`typescript
interface Auditable {
    createdAt: string;
    updatedAt: string;
}

interface AdminUser extends User, Auditable {
    permissions: string[];
}
// AdminUser tiene: id, name, email, createdAt, updatedAt, permissions
\`\`\`

## Declaration Merging

Podés declarar la misma interface varias veces - TypeScript **fusiona** las declaraciones automáticamente:

\`\`\`typescript
interface Config {
    theme: string;
}

interface Config {
    lang: string;
}

// Resultado: Config tiene theme y lang
const c: Config = { theme: "dark", lang: "es" }; // ✓
\`\`\`

Esto es especialmente útil para **augmentar tipos de librerías externas** sin modificar el código fuente:

\`\`\`typescript
// Añadir una propiedad al tipo global Window de TypeScript
declare global {
    interface Window {
        analytics: AnalyticsClient;
    }
}
\`\`\`

## extends vs & (intersection)

Ambos combinan tipos de objeto, pero hay diferencias:

\`\`\`typescript
// interface extends - solo funciona con interfaces/clases
interface AdminUser extends User {
    permissions: string[];
}

// type & - más flexible, funciona con cualquier tipo
type AdminUser = User & { permissions: string[] };
\`\`\`

En la práctica, para extender interfaces usá \`extends\`. Para combinar types o mezclar interfaces con types, usá \`&\`.
`,
    },
    {
      id: "ch08-04",
      title: "Jerarquía de usuarios",
      type: "exercise",
      instructions: `## Jerarquía de usuarios

El sistema tiene tres tipos de usuarios: \`User\` (base), \`Customer\` y \`AdminUser\`. Las últimas dos interfaces funcionan, pero tienen un problema de diseño: duplican todas las propiedades de \`User\` en lugar de extenderla.

Refactorizá \`Customer\` y \`AdminUser\` para que extiendan \`User\` y solo declaren sus propiedades específicas.`,
      starterCode: `interface User {
    id: number;
    name: string;
    email: string;
}

interface Customer {
    id: number;
    name: string;
    email: string;
    loyaltyPoints: number;
    shippingAddress: string;
}

interface AdminUser {
    id: number;
    name: string;
    email: string;
    permissions: string[];
    lastLogin: string;
}

function describeCustomer(c: Customer): string {
    return \`\${c.name} (\${c.email}) - \${c.loyaltyPoints} puntos\`;
}

function describeAdmin(a: AdminUser): string {
    return \`\${a.name} - permisos: \${a.permissions.join(", ")}\`;
}

const customer: Customer = {
    id: 1, name: "Ana García", email: "ana@mail.com",
    loyaltyPoints: 250, shippingAddress: "Av. Corrientes 1234"
};
const admin: AdminUser = {
    id: 2, name: "Luis Pérez", email: "luis@empresa.com",
    permissions: ["read", "write"], lastLogin: "2024-03-15"
};

console.log(describeCustomer(customer));
console.log(describeAdmin(admin));`,
      solution: `interface User {
    id: number;
    name: string;
    email: string;
}

interface Customer extends User {
    loyaltyPoints: number;
    shippingAddress: string;
}

interface AdminUser extends User {
    permissions: string[];
    lastLogin: string;
}

function describeCustomer(c: Customer): string {
    return \`\${c.name} (\${c.email}) - \${c.loyaltyPoints} puntos\`;
}

function describeAdmin(a: AdminUser): string {
    return \`\${a.name} - permisos: \${a.permissions.join(", ")}\`;
}

const customer: Customer = {
    id: 1, name: "Ana García", email: "ana@mail.com",
    loyaltyPoints: 250, shippingAddress: "Av. Corrientes 1234"
};
const admin: AdminUser = {
    id: 2, name: "Luis Pérez", email: "luis@empresa.com",
    permissions: ["read", "write"], lastLogin: "2024-03-15"
};

console.log(describeCustomer(customer));
console.log(describeAdmin(admin));`,
      hint: "Cuando una interface ya tiene las propiedades que otra necesita, hay una keyword para reutilizarlas sin copiarlas.",
      tests: [
        {
          name: "Customer extiende User",
          run: (code) => /interface\s+Customer\s+extends\s+User\b/.test(code),
        },
        {
          name: "AdminUser extiende User",
          run: (code) => /interface\s+AdminUser\s+extends\s+User\b/.test(code),
        },
        {
          name: "describeCustomer retorna el formato correcto",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("Ana García") &&
              output[0]?.includes("250 puntos")
            );
          },
        },
        {
          name: "describeAdmin lista los permisos correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[1]?.includes("Luis Pérez") &&
              output[1]?.includes("read, write")
            );
          },
        },
      ],
    },
    {
      id: "ch08-05",
      title: "Types vs Interfaces",
      type: "explanation",
      content: `# Types vs Interfaces

Ambos pueden describir la forma de un objeto. La pregunta práctica es: ¿cuándo usar cada uno?

## Lo que solo \`type\` puede hacer

\`type\` es más flexible - puede representar cualquier tipo, no solo objetos:

\`\`\`typescript
// Union type - imposible con interface
type PaymentMethod = "cash" | "card" | "paypal";

// Tipo función - imposible con interface como alias
type Comparator = (a: number, b: number) => number;

// Tuple
type RGB = [number, number, number];

// Intersection con tipos no-objeto
type MaybeString = string | null;
\`\`\`

## Lo que solo \`interface\` puede hacer

\`interface\` soporta **declaration merging** - fusionar múltiples declaraciones del mismo nombre. Esto es lo que hace posible augmentar tipos de librerías externas.

\`\`\`typescript
// ✓ Interface: se pueden fusionar
interface Config { theme: string; }
interface Config { lang: string; }
// Resultado: Config tiene theme y lang

// ✗ Type: segunda declaración es un error
type Config = { theme: string; };
type Config = { lang: string; }; // Error: identificador duplicado
\`\`\`

## Para objetos - son equivalentes en la práctica

\`\`\`typescript
// Ambos son válidos y funcionan igual para objetos simples:
interface Product { name: string; price: number; }
type Product = { name: string; price: number; };
\`\`\`

### Guía práctica

- Usá **\`interface\`** para formas de objetos que podrían extenderse o que son parte de una API pública
- Usá **\`type\`** para unions, intersections, funciones, tuples, y cualquier cosa que no sea un objeto simple
- Si no estás seguro, \`interface\` para objetos es una buena convención por defecto

## Hybrid Types (FYI)

Una interface puede describir un objeto que también es callable - útil para ciertos patrones de librerías:

\`\`\`typescript
interface Greeter {
    (name: string): string;  // callable
    language: string;        // propiedad
}

const greet = ((name) => \`Hello, \${name}!\`) as Greeter;
greet.language = "en";

greet("Ana");   // "Hello, Ana!"
greet.language; // "en"
\`\`\`

En código moderno es poco común - las clases o closures suelen ser más claras para este patrón.
`,
    },
    {
      id: "ch08-06",
      title: "Métodos de pago",
      type: "exercise",
      instructions: `## Métodos de pago

La función \`formatPayment\` formatea la información de un pago, pero referencia los tipos \`PaymentMethod\` y \`Payment\` que todavía no existen.

Definí ambos tipos:
- \`PaymentMethod\`: union de \`"cash"\`, \`"card"\` y \`"paypal"\`
- \`Payment\`: un objeto con \`id\`, \`amount\`, \`method\` (usando \`PaymentMethod\`) y \`paidAt\` (que no siempre está presente)

Usá la herramienta correcta para cada caso.`,
      starterCode: `function formatPayment(payment: Payment): string {
    const method = payment.method.toUpperCase();
    const date = payment.paidAt ?? "pendiente";
    return \`\${payment.id}: \${method} - $\${payment.amount.toFixed(2)} (\${date})\`;
}

console.log(formatPayment({ id: "PAY-001", amount: 149.99, method: "card", paidAt: "2024-03-15" }));
console.log(formatPayment({ id: "PAY-002", amount: 29.99, method: "paypal" }));`,
      solution: `type PaymentMethod = "cash" | "card" | "paypal";

interface Payment {
    id: string;
    amount: number;
    method: PaymentMethod;
    paidAt?: string;
}

function formatPayment(payment: Payment): string {
    const method = payment.method.toUpperCase();
    const date = payment.paidAt ?? "pendiente";
    return \`\${payment.id}: \${method} - $\${payment.amount.toFixed(2)} (\${date})\`;
}

console.log(formatPayment({ id: "PAY-001", amount: 149.99, method: "card", paidAt: "2024-03-15" }));
console.log(formatPayment({ id: "PAY-002", amount: 29.99, method: "paypal" }));`,
      hint: "Un union de valores string literales no puede representarse con `interface` - necesita `type`. Para el objeto, ambas herramientas son válidas.",
      tests: [
        {
          name: "PaymentMethod es un type alias con union literal",
          run: (code) =>
            /type\s+PaymentMethod\s*=/.test(code) &&
            /["']cash["']/.test(code) &&
            /["']card["']/.test(code) &&
            /["']paypal["']/.test(code),
        },
        {
          name: "Payment define la forma del objeto de pago",
          run: (code) =>
            /interface\s+Payment\b/.test(code) ||
            /type\s+Payment\s*=\s*\{/.test(code),
        },
        {
          name: "paidAt es opcional en Payment",
          run: (code) => /paidAt\s*\?/.test(code),
        },
        {
          name: "formatPayment con paidAt muestra fecha",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("CARD") &&
              output[0]?.includes("149.99") &&
              output[0]?.includes("2024-03-15")
            );
          },
        },
        {
          name: "formatPayment sin paidAt muestra 'pendiente'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1]?.includes("pendiente");
          },
        },
      ],
    },
    {
      id: "ch08-07",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen - TypeScript Interfaces

## Interface Declaration

\`\`\`typescript
interface Product {
    name: string;
    price: number;
    description?: string;   // opcional
    readonly sku: string;   // inmutable
}
\`\`\`

- Sin \`=\` - el cuerpo va directo después del nombre
- \`?\`: propiedad opcional (puede estar ausente)
- \`readonly\`: no se puede reasignar después de crear el objeto

## Extending Interfaces

\`\`\`typescript
interface AdminUser extends User {
    permissions: string[];
}
\`\`\`

- Hereda todas las propiedades de la interfaz base
- Puede extender múltiples interfaces: \`extends A, B\`
- \`extends\` solo funciona con interfaces/clases; para types usá \`&\`

## Declaration Merging

Múltiples declaraciones del mismo nombre se fusionan. Útil para augmentar tipos de librerías externas. Solo funciona con \`interface\`, no con \`type\`.

## Types vs Interfaces

| Característica | \`type\` | \`interface\` |
|----------------|----------|---------------|
| Objeto simple | ✓ | ✓ |
| Union / Tuple | ✓ | ✗ |
| Función | ✓ | Solo como hybrid |
| extends | Con \`&\` | Con \`extends\` |
| Declaration merging | ✗ | ✓ |

**Guía práctica**: \`interface\` para formas de objetos que se extienden; \`type\` para todo lo demás.

## Lo que viene

El próximo capítulo cubre **Classes** - constructores, access modifiers (\`public\`, \`private\`, \`protected\`, \`readonly\`), clases abstractas, y herencia.
`,
    },
  ],
};
