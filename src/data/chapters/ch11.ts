import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch11: Chapter = {
  id: "ch11",
  title: "Utility Types",
  lessons: [
    {
      id: "ch11-01",
      title: "Partial, Required, Readonly",
      type: "explanation",
      content: `# Partial, Required, Readonly

## El problema de reutilizar tipos

El mismo concepto aparece en múltiples formas a lo largo de una aplicación: un \`Product\` completo para la base de datos, uno parcial para actualizaciones, uno inmutable para la configuración. Sin utility types, terminarías duplicando el tipo manualmente cada vez que cambia su forma.

Los **Utility Types** son genéricos incorporados en TypeScript que derivan tipos nuevos a partir de tipos existentes — sin copiar ni redefinir.

## Partial<T>

Hace todos los campos opcionales. El caso de uso más común es una función de actualización donde solo querés modificar algunos campos:

\`\`\`typescript
type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
};

// Sin Partial — tenés que pasar el objeto completo aunque solo cambie el precio
function updateProduct(id: number, data: Product) { /* ... */ }
updateProduct(1, { id: 1, name: "Laptop", price: 899, stock: 5 }); // ✓ pero tedioso

// Con Partial — solo los campos que cambian
function patchProduct(id: number, changes: Partial<Product>) { /* ... */ }
patchProduct(1, { price: 899 });              // ✓ solo el precio
patchProduct(2, { stock: 0, name: "Mouse" }); // ✓ varios campos
\`\`\`

## Required<T>

Lo opuesto de \`Partial\` — hace todos los campos obligatorios. Útil cuando un borrador tiene campos opcionales pero la versión final publicada no puede tener ninguno faltante:

\`\`\`typescript
type DraftProduct = {
    name?: string;
    price?: number;
    description?: string;
};

type PublishedProduct = Required<DraftProduct>;
// { name: string; price: number; description: string }

function publish(product: PublishedProduct) { /* ... */ }
publish({ name: "Laptop" }); // Error: falta price y description
\`\`\`

## Readonly<T>

Hace todos los campos \`readonly\` — el objeto no puede modificarse después de crearse. Útil para configuración y para evitar que una función mute accidentalmente sus argumentos:

\`\`\`typescript
type AppConfig = Readonly<{
    apiUrl: string;
    timeout: number;
    maxRetries: number;
}>;

const config: AppConfig = { apiUrl: "https://api.example.com", timeout: 5000, maxRetries: 3 };
config.timeout = 3000; // Error: Cannot assign to 'timeout' because it is a read-only property
\`\`\`

## Error común

\`\`\`typescript
// ❌ Redefinir el tipo manualmente — se desincroniza cuando Product cambia
type ProductUpdate = {
    name?: string;
    price?: number;
};

// ✓ Derivar del tipo base — siempre sincronizado con Product
type ProductUpdate = Partial<Product>;
\`\`\`
`,
    },
    {
      id: "ch11-02",
      title: "Actualización de producto",
      type: "exercise",
      instructions: `## Actualización de producto

El módulo de gestión de productos tiene dos funciones que necesitan mejor tipado:

1. \`patchProduct\` recibe los cambios a aplicar sobre un producto. Actualmente requiere el objeto completo, pero debería aceptar solo los campos que cambiaron.

2. \`getProductSummary\` expone un producto para la vista pública. Actualmente declara que retorna \`Product\` completo, pero solo retorna \`name\` y \`price\`.

Corregí los tipos usando los utility types apropiados.`,
      starterCode: `type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    stock: number;
};

const catalog: Product[] = [
    { id: 1, name: "Laptop", price: 999, description: "Laptop Pro 15 pulgadas", stock: 5 },
    { id: 2, name: "Mouse", price: 49, description: "Mouse inalámbrico", stock: 20 },
];

function patchProduct(id: number, changes: Product): Product | undefined {
    const index = catalog.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    catalog[index] = { ...catalog[index], ...changes };
    return catalog[index];
}

function getProductSummary(product: Product): Product {
    return { name: product.name, price: product.price };
}

const updated = patchProduct(1, { price: 899 });
console.log(updated?.name);
console.log(updated?.price);

const summary = getProductSummary(catalog[1]);
console.log(summary.name);
console.log(summary.price);`,
      solution: `type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    stock: number;
};

const catalog: Product[] = [
    { id: 1, name: "Laptop", price: 999, description: "Laptop Pro 15 pulgadas", stock: 5 },
    { id: 2, name: "Mouse", price: 49, description: "Mouse inalámbrico", stock: 20 },
];

function patchProduct(id: number, changes: Partial<Product>): Product | undefined {
    const index = catalog.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    catalog[index] = { ...catalog[index], ...changes };
    return catalog[index];
}

function getProductSummary(product: Product): Pick<Product, "name" | "price"> {
    return { name: product.name, price: product.price };
}

const updated = patchProduct(1, { price: 899 });
console.log(updated?.name);
console.log(updated?.price);

const summary = getProductSummary(catalog[1]);
console.log(summary.name);
console.log(summary.price);`,
      hint: "Hay dos utility types relevantes: uno convierte todos los campos de un tipo en opcionales, y otro selecciona un subconjunto de propiedades por nombre.",
      tests: [
        {
          name: "patchProduct usa Partial<Product> para el parámetro changes",
          run: (code) => /changes\s*:\s*Partial\s*<\s*Product\s*>/.test(code),
        },
        {
          name: "getProductSummary usa Pick<Product para el tipo de retorno",
          run: (code) => /Pick\s*<\s*Product\s*,/.test(code),
        },
        {
          name: "patchProduct(1, { price: 899 }) retorna el nombre del producto",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "Laptop";
          },
        },
        {
          name: "El precio actualizado es 899",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "899";
          },
        },
        {
          name: "getProductSummary retorna name y price correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2] === "Mouse" && output[3] === "49";
          },
        },
      ],
    },
    {
      id: "ch11-03",
      title: "Pick, Omit, Record y más",
      type: "explanation",
      content: `# Pick, Omit, Record y más

## Pick<T, K>

Selecciona un subconjunto de propiedades de un tipo. Útil para exponer solo los campos seguros de un objeto en una API pública o vista:

\`\`\`typescript
type Product = { id: number; name: string; price: number; internalCost: number };

type ProductPreview = Pick<Product, "name" | "price">;
// { name: string; price: number }
// internalCost no se expone
\`\`\`

## Omit<T, K>

Lo opuesto de \`Pick\` — elimina propiedades específicas. Más cómodo cuando querés conservar casi todo el tipo:

\`\`\`typescript
// Para crear un producto nuevo, no queremos que el cliente envíe el id
type NewProduct = Omit<Product, "id" | "internalCost">;
// { name: string; price: number }
\`\`\`

**Regla práctica:** si eliminás pocas propiedades usá \`Omit\`, si seleccionás pocas usá \`Pick\`.

## Record<K, V>

Crea un tipo de objeto con claves de tipo \`K\` y valores de tipo \`V\`. Garantiza que un objeto cubre exactamente las claves que debería cubrir:

\`\`\`typescript
type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

type StatusConfig = Record<OrderStatus, { label: string; color: string }>;

const statusConfig: StatusConfig = {
    pending:    { label: "Pendiente",  color: "gray"   },
    processing: { label: "En proceso", color: "blue"   },
    shipped:    { label: "Enviado",    color: "orange" },
    delivered:  { label: "Entregado", color: "green"  },
    // Si olvidás algún estado, TypeScript lo detecta
};
\`\`\`

## Exclude<T, U>

Elimina de una union los miembros que extienden \`U\`:

\`\`\`typescript
type Status = "pending" | "active" | "deleted";
type ActiveStatus = Exclude<Status, "deleted">;  // "pending" | "active"
\`\`\`

## Extract<T, U>

Mantiene solo los miembros de la union que extienden \`U\` — lo opuesto de \`Exclude\`:

\`\`\`typescript
type Input = string | number | boolean | null;
type StringInput = Extract<Input, string | number>;  // string | number
\`\`\`

## NonNullable<T>

Elimina \`null\` y \`undefined\` de un tipo:

\`\`\`typescript
type MaybeProduct = Product | null | undefined;
type DefiniteProduct = NonNullable<MaybeProduct>;  // Product

// Útil cuando sabés que un valor ya fue validado
function processProduct(p: NonNullable<MaybeProduct>) { /* p nunca es null */ }
\`\`\`

## Error común

\`\`\`typescript
// ❌ Record con Record<string, any> — pierde información de tipos
const config: Record<string, any> = { ... };

// ✓ Record con tipos específicos — TypeScript valida claves y valores
const config: Record<OrderStatus, StatusConfig> = { ... };
\`\`\`
`,
    },
    {
      id: "ch11-04",
      title: "Inventario por categoría",
      type: "exercise",
      instructions: `## Inventario por categoría

La función \`groupByCategory\` agrupa productos por categoría en un objeto. Actualmente usa \`any\` tanto en la variable interna como en el tipo de retorno — TypeScript no puede verificar que el resultado tiene la forma correcta ni que cubre exactamente las categorías definidas.

Reemplazá los dos usos de \`any\` con el tipo correcto usando \`Record\`.`,
      starterCode: `type Category = "electronics" | "peripherals" | "accessories";

type Product = {
    id: number;
    name: string;
    category: Category;
    price: number;
};

const products: Product[] = [
    { id: 1, name: "Laptop",    category: "electronics",  price: 999 },
    { id: 2, name: "Mouse",     category: "peripherals",  price: 49  },
    { id: 3, name: "Teclado",   category: "peripherals",  price: 79  },
    { id: 4, name: "Cable USB", category: "accessories",  price: 9   },
];

function groupByCategory(items: Product[]): any {
    const result: any = {};
    for (const item of items) {
        if (!result[item.category]) result[item.category] = [];
        result[item.category].push(item);
    }
    return result;
}

const inventory = groupByCategory(products);
console.log(inventory["electronics"].length);
console.log(inventory["peripherals"].length);
console.log(inventory["accessories"][0].name);`,
      solution: `type Category = "electronics" | "peripherals" | "accessories";

type Product = {
    id: number;
    name: string;
    category: Category;
    price: number;
};

const products: Product[] = [
    { id: 1, name: "Laptop",    category: "electronics",  price: 999 },
    { id: 2, name: "Mouse",     category: "peripherals",  price: 49  },
    { id: 3, name: "Teclado",   category: "peripherals",  price: 79  },
    { id: 4, name: "Cable USB", category: "accessories",  price: 9   },
];

function groupByCategory(items: Product[]): Record<Category, Product[]> {
    const result = {} as Record<Category, Product[]>;
    for (const item of items) {
        if (!result[item.category]) result[item.category] = [];
        result[item.category].push(item);
    }
    return result;
}

const inventory = groupByCategory(products);
console.log(inventory["electronics"].length);
console.log(inventory["peripherals"].length);
console.log(inventory["accessories"][0].name);`,
      hint: "El tipo que necesitás describe un objeto donde las claves son exactamente los valores de `Category` y los valores son arrays de `Product`. Revisá la sintaxis de Record.",
      tests: [
        {
          name: "groupByCategory usa Record<Category en lugar de any",
          run: (code) => /Record\s*<\s*Category\s*,/.test(code),
        },
        {
          name: "No queda ningún uso de : any",
          run: (code) => !/:\s*any\b/.test(code),
        },
        {
          name: "electronics tiene 1 producto",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "1";
          },
        },
        {
          name: "peripherals tiene 2 productos",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "2";
          },
        },
        {
          name: "El primer accesorio es 'Cable USB'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2] === "Cable USB";
          },
        },
      ],
    },
    {
      id: "ch11-05",
      title: "Parameters, ReturnType y más",
      type: "explanation",
      content: `# Parameters, ReturnType y más

Estos utility types extraen información de tipos que ya existen — funciones, clases, promesas — sin tener que redefinir nada a mano.

## ReturnType<F>

Extrae el tipo de retorno de una función usando \`typeof\`:

\`\`\`typescript
function createOrder(productId: number, quantity: number, price: number) {
    return { id: 1, productId, quantity, total: quantity * price };
}

type Order = ReturnType<typeof createOrder>;
// { id: number; productId: number; quantity: number; total: number }
\`\`\`

El tipo se mantiene sincronizado automáticamente: si cambia el tipo de retorno de \`createOrder\`, \`Order\` se actualiza sin tocar nada más.

## Parameters<F>

Extrae los tipos de los parámetros como una tupla:

\`\`\`typescript
type CreateOrderArgs = Parameters<typeof createOrder>;
// [productId: number, quantity: number, price: number]

// Útil para reutilizar argumentos de forma tipada
const args: CreateOrderArgs = [1, 3, 999];
createOrder(...args); // ✓
\`\`\`

## Combinarlos

\`ReturnType\` y \`Parameters\` se usan frecuentemente juntos para adaptadores y middlewares:

\`\`\`typescript
// Wrapper que loguea una llamada sin conocer los tipos de la función
function withLogging<F extends (...args: any[]) => any>(fn: F) {
    return (...args: Parameters<F>): ReturnType<F> => {
        console.log("Llamando con:", args);
        return fn(...args);
    };
}
\`\`\`

## Awaited<T>

Desenvuelve el tipo de una \`Promise\`. Útil cuando trabajás con funciones async y querés el tipo del valor resuelto:

\`\`\`typescript
async function fetchProduct(id: number): Promise<{ id: number; name: string }> {
    return { id, name: "Laptop" };
}

type FetchedProduct = Awaited<ReturnType<typeof fetchProduct>>;
// { id: number; name: string }
// Sin Awaited, ReturnType daría Promise<{ id: number; name: string }>
\`\`\`

## InstanceType<C>

Extrae el tipo de instancia de una clase. Útil cuando pasás la clase como valor (no como tipo) y necesitás referirte al tipo de sus instancias:

\`\`\`typescript
class OrderRepository {
    findById(id: number) { return { id, status: "pending" }; }
    findAll() { return []; }
}

type RepoInstance = InstanceType<typeof OrderRepository>;
// OrderRepository — el tipo de lo que retorna \`new OrderRepository()\`

function useRepo(repo: RepoInstance) {
    return repo.findAll();
}
\`\`\`

## Error común

\`\`\`typescript
// ❌ Duplicar tipos manualmente — se desincroniza
function getUser() { return { id: 1, name: "Ana", role: "admin" }; }
type User = { id: number; name: string; role: string }; // copia manual

// ✓ Derivar del tipo real
type User = ReturnType<typeof getUser>; // siempre sincronizado
\`\`\`
`,
    },
    {
      id: "ch11-06",
      title: "Tipos de funciones existentes",
      type: "exercise",
      instructions: `## Tipos de funciones existentes

La función \`formatPrice\` ya existe y tiene sus tipos definidos. En lugar de duplicar esos tipos manualmente, usá \`ReturnType\` y \`Parameters\` para extraerlos directamente de la función.

Reemplazá los tipos \`any\` de \`FormatResult\` y \`FormatArgs\` con los utility types correctos.`,
      starterCode: `type Product = { id: number; name: string; price: number };

function formatPrice(product: Product, currency: string, discount: number): string {
    const finalPrice = product.price * (1 - discount);
    return \`\${product.name}: \${currency}\${finalPrice.toFixed(2)}\`;
}

// Extraé los tipos usando ReturnType y Parameters
type FormatResult = any;
type FormatArgs = any[];

const product: Product = { id: 1, name: "Laptop", price: 999 };
const args: FormatArgs = [product, "$", 0.1];
const result: FormatResult = formatPrice(...args);
console.log(result);`,
      solution: `type Product = { id: number; name: string; price: number };

function formatPrice(product: Product, currency: string, discount: number): string {
    const finalPrice = product.price * (1 - discount);
    return \`\${product.name}: \${currency}\${finalPrice.toFixed(2)}\`;
}

type FormatResult = ReturnType<typeof formatPrice>;
type FormatArgs = Parameters<typeof formatPrice>;

const product: Product = { id: 1, name: "Laptop", price: 999 };
const args: FormatArgs = [product, "$", 0.1];
const result: FormatResult = formatPrice(...args);
console.log(result);`,
      hint: "Ambos utility types toman `typeof nombreFuncion` como argumento — no el tipo directamente, sino la función misma referenciada con `typeof`.",
      tests: [
        {
          name: "FormatResult usa ReturnType<typeof formatPrice>",
          run: (code) =>
            /ReturnType\s*<\s*typeof\s+formatPrice\s*>/.test(code),
        },
        {
          name: "FormatArgs usa Parameters<typeof formatPrice>",
          run: (code) =>
            /Parameters\s*<\s*typeof\s+formatPrice\s*>/.test(code),
        },
        {
          name: "formatPrice(product, '$', 0.1) imprime el precio con descuento",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "Laptop: $899.10";
          },
        },
      ],
    },
    {
      id: "ch11-07",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen — Utility Types

Los utility types son genéricos incorporados que derivan tipos nuevos a partir de tipos existentes. Eliminan la duplicación y mantienen el código sincronizado automáticamente.

## Transformar todas las propiedades

\`\`\`typescript
Partial<T>   // todos los campos opcionales — actualizaciones parciales
Required<T>  // todos los campos obligatorios — validar completitud
Readonly<T>  // todos los campos readonly — prevenir mutaciones
\`\`\`

## Seleccionar o eliminar propiedades

\`\`\`typescript
Pick<T, "a" | "b">  // solo las propiedades listadas
Omit<T, "a" | "b">  // todas excepto las listadas
Record<K, V>         // objeto con claves K y valores V
\`\`\`

## Filtrar unions

\`\`\`typescript
Exclude<T, U>    // quita de T los miembros que extienden U
Extract<T, U>    // mantiene en T solo los que extienden U
NonNullable<T>   // quita null y undefined
\`\`\`

## Inferir de funciones y clases

\`\`\`typescript
ReturnType<typeof fn>    // tipo de retorno de fn
Parameters<typeof fn>    // tipos de parámetros como tupla
Awaited<T>               // desenvuelve Promise<T> → T
InstanceType<typeof C>   // tipo de instancia de la clase C
\`\`\`

## Cuándo usar cada uno

| Situación | Utility type |
|-----------|-------------|
| Función de actualización parcial | \`Partial<T>\` |
| Exponer solo algunos campos | \`Pick<T, K>\` |
| Excluir campos sensibles | \`Omit<T, K>\` |
| Mapeo tipado por clave de union | \`Record<K, V>\` |
| Sincronizar tipo con función existente | \`ReturnType\` / \`Parameters\` |

## Lo que viene

El próximo capítulo cubre **Advanced Types** — tipos mapeados, condicionales, template literal types y tipos recursivos. Son la base de cómo se construyen los utility types que acabás de aprender.
`,
    },
  ],
};
