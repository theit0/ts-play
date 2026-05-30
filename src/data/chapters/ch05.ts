import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch05: Chapter = {
  id: "ch05",
  title: "Combining Types",
  lessons: [
    {
      id: "ch05-01",
      title: "Union Types",
      type: "explanation",
      content: `# Union Types

Un **union type** expresa que un valor puede ser uno de varios tipos. Se escribe con \`|\`:

\`\`\`typescript
type Discount = number | "no-discount";

function applyDiscount(price: number, discount: Discount): number {
    if (discount === "no-discount") return price;
    return price * (1 - discount);
}

applyDiscount(100, 0.15);          // 85
applyDiscount(100, "no-discount"); // 100
\`\`\`

## Narrowing obligatorio

Cuando una variable puede ser múltiples tipos, TypeScript te obliga a verificar el tipo antes de usar propiedades específicas:

\`\`\`typescript
function formatValue(value: string | number): string {
    value.toUpperCase(); // Error: number no tiene .toUpperCase()

    if (typeof value === "string") {
        return value.toUpperCase(); // ✓ — TypeScript sabe que es string aquí
    }
    return value.toFixed(2); // ✓ — TypeScript sabe que es number aquí
}
\`\`\`

## Discriminated unions — el patrón más poderoso

Cuando cada variante del union tiene una propiedad común con un valor literal distinto, TypeScript puede usar esa propiedad como **discriminante**:

\`\`\`typescript
type SuccessResult = { status: "success"; data: string[] };
type ErrorResult   = { status: "error"; code: number };
type SearchResult  = SuccessResult | ErrorResult;

function handleResult(result: SearchResult): string {
    if (result.status === "success") {
        return result.data.join(", "); // TypeScript sabe: SuccessResult
    }
    return \`Error \${result.code}\`;    // TypeScript sabe: ErrorResult
}
\`\`\`

TypeScript usa el valor de \`status\` para saber exactamente qué tipo es en cada branch. No necesitás casts ni assertions.

## Error común

\`\`\`typescript
type ApiResponse = { status: "success"; data: string } | { status: "error"; code: number };

function procesar(r: ApiResponse) {
    // ✗ Error: code no existe en SuccessResponse
    console.log(r.code);

    // ✓ Narrowing primero
    if (r.status === "error") {
        console.log(r.code); // TypeScript sabe que es ErrorResponse
    }
}
\`\`\`
`,
    },
    {
      id: "ch05-02",
      title: "Respuesta de la API",
      type: "exercise",
      instructions: `## Respuesta de la API

La función \`formatResponse\` procesa respuestas de la API de búsqueda. Tiene un bug: solo maneja el caso exitoso y falla silenciosamente cuando recibe un error.

Corregí la función para que maneje ambos casos. Para éxito, el formato es \`"✓ N items: data"\`. Para error, \`"✗ Error CODE: message"\`.`,
      starterCode: `type SuccessResponse = { status: "success"; data: string; itemCount: number };
type ErrorResponse   = { status: "error"; code: number; message: string };
type ApiResponse     = SuccessResponse | ErrorResponse;

function formatResponse(response: ApiResponse): string {
    // Bug: solo maneja el caso exitoso
    return \`Items encontrados: \${response.itemCount}\`;
}

console.log(formatResponse({ status: "success", data: "Laptop, Teclado", itemCount: 2 }));
console.log(formatResponse({ status: "error", code: 503, message: "Servicio no disponible" }));`,
      solution: `type SuccessResponse = { status: "success"; data: string; itemCount: number };
type ErrorResponse   = { status: "error"; code: number; message: string };
type ApiResponse     = SuccessResponse | ErrorResponse;

function formatResponse(response: ApiResponse): string {
    if (response.status === "success") {
        return \`✓ \${response.itemCount} items: \${response.data}\`;
    }
    return \`✗ Error \${response.code}: \${response.message}\`;
}

console.log(formatResponse({ status: "success", data: "Laptop, Teclado", itemCount: 2 }));
console.log(formatResponse({ status: "error", code: 503, message: "Servicio no disponible" }));`,
      hint: "Usá la propiedad `status` como discriminante para saber qué tipo de respuesta recibiste. Una vez dentro del `if`, TypeScript ya sabe el tipo exacto.",
      tests: [
        {
          name: "Usa el discriminante 'status' para el narrowing",
          run: (code) => /response\.status/.test(code),
        },
        {
          name: "formatResponse exitosa incluye cantidad y datos",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("2") &&
              output[0]?.includes("Laptop")
            );
          },
        },
        {
          name: "formatResponse de error incluye código y mensaje",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[1]?.includes("503") &&
              output[1]?.includes("Servicio no disponible")
            );
          },
        },
      ],
    },
    {
      id: "ch05-03",
      title: "Intersection Types y Type Aliases",
      type: "explanation",
      content: `# Intersection Types y Type Aliases

## Intersection Types

Donde el union type (\`|\`) expresa "uno o el otro", el intersection type (\`&\`) expresa "los dos a la vez":

\`\`\`typescript
type UserBase    = { id: number; name: string };
type Auditable   = { createdAt: string; updatedAt: string };
type UserRecord  = UserBase & Auditable;

// UserRecord necesita TODAS las propiedades de ambos tipos
const record: UserRecord = {
    id: 1,
    name: "Ana García",
    createdAt: "2024-01-15",
    updatedAt: "2024-03-20"
};
\`\`\`

El uso más común es **componer tipos pequeños y reutilizables** en lugar de definir un tipo grande desde cero.

### Error común — intersection de primitivos incompatibles

\`\`\`typescript
type Imposible = string & number; // tipo: never — no existe un valor que sea ambos
\`\`\`

El intersection de tipos que no pueden solaparse resulta en \`never\`. Solo tiene sentido con tipos de objeto.

## Type Aliases

La keyword \`type\` crea un alias — un nombre nuevo para cualquier tipo:

\`\`\`typescript
// Alias para un tipo primitivo
type Email = string;

// Alias para un union
type Status = "active" | "inactive" | "suspended";

// Alias para un objeto
type Coordinates = { lat: number; lng: number };

// Alias para un intersection
type AdminUser = UserBase & AdminPermissions;
\`\`\`

### \`type\` vs \`interface\`

Ambos pueden describir la forma de un objeto. La diferencia práctica más importante:

- \`type\` puede ser cualquier tipo: unions, intersections, primitivos, tuples
- \`interface\` solo describe objetos, pero soporta **declaration merging** (añadir propiedades después)

Para la mayoría de los casos, son intercambiables. Cubriremos \`interface\` en profundidad en el capítulo 8.
`,
    },
    {
      id: "ch05-04",
      title: "Rol de administrador",
      type: "exercise",
      instructions: `## Rol de administrador

El sistema tiene usuarios base y permisos de administrador definidos como tipos separados. La función \`describeAdmin\` espera un usuario con ambos conjuntos de propiedades.

El problema: \`AdminUser\` actualmente es solo un alias de \`UserBase\` — le faltan las propiedades de \`AdminPermissions\`. Arreglá la definición del tipo para que combine ambos.`,
      starterCode: `type UserBase = { id: number; name: string; email: string };
type AdminPermissions = { canDelete: boolean; canManageUsers: boolean; canViewLogs: boolean };

type AdminUser = UserBase;

function describeAdmin(user: AdminUser): string {
    const perms: string[] = [];
    if (user.canDelete) perms.push("eliminar");
    if (user.canManageUsers) perms.push("gestionar usuarios");
    if (user.canViewLogs) perms.push("ver logs");
    return \`\${user.name} (\${user.email}) — permisos: \${perms.join(", ")}\`;
}

const admin: AdminUser = {
    id: 1,
    name: "Ana García",
    email: "ana@empresa.com",
    canDelete: true,
    canManageUsers: true,
    canViewLogs: false
};

console.log(describeAdmin(admin));`,
      solution: `type UserBase = { id: number; name: string; email: string };
type AdminPermissions = { canDelete: boolean; canManageUsers: boolean; canViewLogs: boolean };

type AdminUser = UserBase & AdminPermissions;

function describeAdmin(user: AdminUser): string {
    const perms: string[] = [];
    if (user.canDelete) perms.push("eliminar");
    if (user.canManageUsers) perms.push("gestionar usuarios");
    if (user.canViewLogs) perms.push("ver logs");
    return \`\${user.name} (\${user.email}) — permisos: \${perms.join(", ")}\`;
}

const admin: AdminUser = {
    id: 1,
    name: "Ana García",
    email: "ana@empresa.com",
    canDelete: true,
    canManageUsers: true,
    canViewLogs: false
};

console.log(describeAdmin(admin));`,
      hint: "El tipo `AdminUser` necesita ser la combinación de dos tipos existentes. Buscá el operador que une tipos de objeto requiriendo todas sus propiedades.",
      tests: [
        {
          name: "AdminUser usa intersection con ambos tipos",
          run: (code) =>
            /type\s+AdminUser\s*=.*UserBase.*&.*AdminPermissions/.test(code) ||
            /type\s+AdminUser\s*=.*AdminPermissions.*&.*UserBase/.test(code),
        },
        {
          name: "describeAdmin retorna nombre y email correctos",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("Ana García") &&
              output[0]?.includes("ana@empresa.com")
            );
          },
        },
        {
          name: "describeAdmin lista los permisos correctos",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("eliminar") &&
              output[0]?.includes("gestionar usuarios")
            );
          },
        },
      ],
    },
    {
      id: "ch05-05",
      title: "El operador keyof",
      type: "explanation",
      content: `# El operador \`keyof\`

\`keyof T\` produce un union type con todos los nombres de propiedades de \`T\`:

\`\`\`typescript
type Product = { name: string; price: number; inStock: boolean };
type ProductKey = keyof Product; // "name" | "price" | "inStock"
\`\`\`

## Uso práctico — parámetros de clave seguros

El caso más común es tipar un parámetro que representa el nombre de una propiedad:

\`\`\`typescript
type Config = { theme: string; lang: string; fontSize: number };

// Sin keyof: acepta cualquier string — un typo no se detecta
function getConfig(config: Config, key: string): unknown {
    return (config as any)[key];
}

// Con keyof: solo acepta claves reales de Config
function getConfig(config: Config, key: keyof Config): string | number {
    return config[key]; // TypeScript sabe que key es una clave válida
}

getConfig(myConfig, "theme");    // ✓
getConfig(myConfig, "language"); // Error: "language" no es keyof Config
\`\`\`

## Acceso indexado — \`T[K]\`

Combinado con \`keyof\`, podés obtener el tipo exacto de una propiedad:

\`\`\`typescript
type Product = { name: string; price: number; inStock: boolean };

type NameType    = Product["name"];    // string
type PriceType   = Product["price"];   // number
type AnyPropType = Product[keyof Product]; // string | number | boolean
\`\`\`

Esto es la base para tipos genéricos avanzados — pero ya en esta forma simple es útil para funciones que trabajan sobre propiedades de un tipo específico.
`,
    },
    {
      id: "ch05-06",
      title: "Campo de producto",
      type: "exercise",
      instructions: `## Campo de producto

La función \`listField\` recorre un catálogo de productos y muestra el valor de un campo específico para cada uno. El parámetro \`field\` está tipado como \`string\`, lo que es inseguro — cualquier nombre inválido (un typo, una clave que no existe) pasaría el chequeo de tipos.

Cambiá el tipo de \`field\` para que TypeScript solo acepte nombres de propiedades reales de \`Product\`.`,
      starterCode: `type Product = { name: string; price: number; category: string };

function listField(products: Product[], field: string): void {
    products.forEach(p => {
        console.log(p[field as keyof Product]);
    });
}

const catalog: Product[] = [
    { name: "Laptop", price: 999, category: "electronics" },
    { name: "Desk", price: 299, category: "furniture" },
    { name: "Mouse", price: 49, category: "electronics" }
];

listField(catalog, "name");
listField(catalog, "price");`,
      solution: `type Product = { name: string; price: number; category: string };

function listField(products: Product[], field: keyof Product): void {
    products.forEach(p => {
        console.log(p[field]);
    });
}

const catalog: Product[] = [
    { name: "Laptop", price: 999, category: "electronics" },
    { name: "Desk", price: 299, category: "furniture" },
    { name: "Mouse", price: 49, category: "electronics" }
];

listField(catalog, "name");
listField(catalog, "price");`,
      hint: "El tipo de `field` debería expresar 'cualquier nombre de propiedad de Product'. Revisá el operador que genera ese union automáticamente desde un tipo.",
      tests: [
        {
          name: "field está tipado con keyof Product",
          run: (code) => /field\s*:\s*keyof\s+Product/.test(code),
        },
        {
          name: "listField('name') muestra los nombres correctos",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0] === "Laptop" &&
              output[1] === "Desk" &&
              output[2] === "Mouse"
            );
          },
        },
        {
          name: "listField('price') muestra los precios correctos",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[3] === "999" &&
              output[4] === "299" &&
              output[5] === "49"
            );
          },
        },
      ],
    },
    {
      id: "ch05-07",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen — Combining Types

## Union Types (\`|\`)

- Un valor puede ser **uno de varios tipos**
- TypeScript obliga a usar narrowing antes de acceder a propiedades específicas
- **Discriminated unions**: una propiedad con valor literal como discriminante permite narrowing preciso sin casts

## Intersection Types (\`&\`)

- Un valor debe cumplir **todos los tipos a la vez**
- Útil para componer tipos pequeños y reutilizables
- Solo tiene sentido con tipos de objeto — intersección de primitivos incompatibles resulta en \`never\`

## Type Aliases (\`type\`)

- Crea un nombre para cualquier tipo: primitivos, unions, intersections, objetos, tuples
- Más flexible que \`interface\` — puede representar cualquier forma de tipo
- Para objetos simples, \`type\` e \`interface\` son intercambiables (diferencias en capítulo 8)

## \`keyof\`

- \`keyof T\` produce el union de todos los nombres de propiedades de \`T\`
- Permite tipar parámetros de "nombre de campo" de forma segura
- \`T[K]\` da el tipo de la propiedad \`K\` en \`T\`

## Lo que viene

El próximo capítulo cubre **Type Guards / Narrowing** — las técnicas que TypeScript usa para reducir tipos dentro de un bloque: \`typeof\`, \`instanceof\`, equality checks, truthiness, y type predicates.
`,
    },
  ],
};
