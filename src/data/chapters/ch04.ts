import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch04: Chapter = {
  id: "ch04",
  title: "Assertions & Special Syntax",
  lessons: [
    {
      id: "ch04-01",
      title: "Type Assertions",
      type: "explanation",
      content: `# Type Assertions

Una **type assertion** es cuando le decís a TypeScript: "Yo sé el tipo de esto, confía en mí."

\`\`\`typescript
const input = document.getElementById("email") as HTMLInputElement;
// TypeScript sabe que getElementById puede retornar null
// Vos sabés que ese elemento existe y es un input
// as HTMLInputElement le dice el tipo exacto
\`\`\`

La sintaxis es \`valor as Tipo\`. No convierte el valor en runtime - solo cambia lo que TypeScript cree sobre el tipo.

## Cuándo usarlas

Las assertions son apropiadas cuando **vos tenés información que TypeScript no puede deducir**:

\`\`\`typescript
// Una función retorna un tipo base - vos sabés que es un subtipo específico
const canvas = document.querySelector("#canvas") as HTMLCanvasElement;

// Datos externos que ya validaste
const user = JSON.parse(response) as User;
\`\`\`

## as any - el último recurso

\`as any\` elimina toda verificación de tipos:

\`\`\`typescript
// ✗ Mal - perdés protección para todo lo que siga
const error = err as any;
error.code;              // TypeScript no verifica nada
error.metodoInventado(); // TypeScript no dice nada - crash posible en runtime

// ✓ Mejor - aserción al tipo exacto
const error = err as ApiError;
error.code;              // TypeScript verifica que ApiError tiene .code
error.metodoInventado(); // Error: ApiError no tiene ese método ✓
\`\`\`

## Error común - doble aserción para mentirle a TypeScript

\`\`\`typescript
// ✗ Señal de alarma
const numero = "42" as unknown as number;
// Compiló, pero en runtime "42" sigue siendo un string

// Si necesitás doble as, el problema probablemente está en el diseño
\`\`\`

## La alternativa: narrowing

Cuando el tipo puede ser varias cosas, preferí narrowing sobre assertions:

\`\`\`typescript
function procesar(valor: unknown) {
    // ✗ Assertion - si valor no es string, crash silencioso
    return (valor as string).toUpperCase();

    // ✓ Narrowing - verificación real en runtime
    if (typeof valor === "string") {
        return valor.toUpperCase();
    }
    return "[no es string]";
}
\`\`\`
`,
    },
    {
      id: "ch04-02",
      title: "Errores de red",
      type: "exercise",
      instructions: `## Errores de red

La función \`formatError\` formatea errores de la API para mostrarlos en el cliente. Usa \`as any\` para acceder a las propiedades del error, lo que desactiva toda verificación de tipos.

Reemplazá \`as any\` por una aserción al tipo correcto. El tipo \`ApiError\` ya está definido en el código.`,
      starterCode: `type ApiError = {
    code: number;
    message: string;
    path: string;
};

function formatError(err: unknown): string {
    const error = err as any;
    return \`Error \${error.code} en \${error.path}: \${error.message}\`;
}

const notFound: ApiError = { code: 404, message: "Recurso no encontrado", path: "/api/products/42" };
const serverError: ApiError = { code: 500, message: "Error interno", path: "/api/orders" };

console.log(formatError(notFound));
console.log(formatError(serverError));`,
      solution: `type ApiError = {
    code: number;
    message: string;
    path: string;
};

function formatError(err: unknown): string {
    const error = err as ApiError;
    return \`Error \${error.code} en \${error.path}: \${error.message}\`;
}

const notFound: ApiError = { code: 404, message: "Recurso no encontrado", path: "/api/products/42" };
const serverError: ApiError = { code: 500, message: "Error interno", path: "/api/orders" };

console.log(formatError(notFound));
console.log(formatError(serverError));`,
      hint: "Reemplazá `as any` por `as` seguido del nombre del tipo que describe la estructura del error.",
      tests: [
        {
          name: "No usa 'as any'",
          run: (code) => !/\bas\s+any\b/.test(code),
        },
        {
          name: "Aserta al tipo ApiError",
          run: (code) => /\bas\s+ApiError\b/.test(code),
        },
        {
          name: "formatError retorna el formato correcto para 404",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("404") &&
              output[0]?.includes("/api/products/42")
            );
          },
        },
        {
          name: "formatError retorna el formato correcto para 500",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1]?.includes("500");
          },
        },
      ],
    },
    {
      id: "ch04-03",
      title: "as const",
      type: "explanation",
      content: `# as const - tipos literales y readonly

Cuando declarás con \`const\`, el valor no cambia. Pero TypeScript igual infiere un tipo general:

\`\`\`typescript
const status = "pending"; // TypeScript infiere: string (no "pending")
const retries = 3;        // TypeScript infiere: number (no 3)
\`\`\`

Con \`as const\`, TypeScript usa el valor exacto como tipo:

\`\`\`typescript
const status = "pending" as const; // tipo: "pending"
const retries = 3 as const;        // tipo: 3
\`\`\`

## En objetos

Sin \`as const\`, las propiedades tienen tipos generales:

\`\`\`typescript
const config = { theme: "dark", lang: "es" };
// config.theme: string - TypeScript permite config.theme = "cualquier string"
\`\`\`

Con \`as const\`, las propiedades tienen tipos literales y el objeto es readonly:

\`\`\`typescript
const config = { theme: "dark", lang: "es" } as const;
// config.theme: "dark" - solo puede ser "dark"
// config es readonly - TypeScript impide modificaciones
\`\`\`

## En arrays - derivar union types

Este patrón es muy práctico para derivar un tipo union desde un array:

\`\`\`typescript
// Sin as const: METHODS es string[], Method es string
const METHODS = ["GET", "POST", "PUT", "DELETE"];
type Method = typeof METHODS[number]; // string

// Con as const: METHODS es un tuple readonly, Method es el union correcto
const METHODS = ["GET", "POST", "PUT", "DELETE"] as const;
type Method = typeof METHODS[number]; // "GET" | "POST" | "PUT" | "DELETE"
\`\`\`

La ventaja: el array es la **fuente de verdad**. Si añadís \`"PATCH"\` al array, el tipo \`Method\` se actualiza automáticamente - sin tener que editar el tipo por separado.
`,
    },
    {
      id: "ch04-04",
      title: "Estados del pedido",
      type: "exercise",
      instructions: `## Estados del pedido

La función \`getStatusLabel\` retorna la etiqueta legible para cada estado de un pedido. El tipo \`OrderStatus\` se deriva del array \`STATUSES\` usando \`typeof STATUSES[number]\`.

El problema: como \`STATUSES\` es \`string[]\`, \`OrderStatus\` resulta \`string\` en lugar del union con los valores reales del array. Cualquier string pasaría el chequeo de tipos, sin importar si es un estado válido.

Añadí lo necesario para que TypeScript infiera los tipos literales correctos desde el array.`,
      starterCode: `const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
type OrderStatus = typeof STATUSES[number];

function getStatusLabel(status: OrderStatus): string {
    const labels: Record<string, string> = {
        pending: "Pendiente",
        processing: "Procesando",
        shipped: "Enviado",
        delivered: "Entregado",
        cancelled: "Cancelado"
    };
    return labels[status] ?? "Desconocido";
}

console.log(getStatusLabel("pending"));
console.log(getStatusLabel("delivered"));
console.log(getStatusLabel("shipped"));`,
      solution: `const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
type OrderStatus = typeof STATUSES[number];

function getStatusLabel(status: OrderStatus): string {
    const labels: Record<string, string> = {
        pending: "Pendiente",
        processing: "Procesando",
        shipped: "Enviado",
        delivered: "Entregado",
        cancelled: "Cancelado"
    };
    return labels[status] ?? "Desconocido";
}

console.log(getStatusLabel("pending"));
console.log(getStatusLabel("delivered"));
console.log(getStatusLabel("shipped"));`,
      hint: "El array necesita que TypeScript trate cada elemento como un tipo literal, no como string. Revisá cómo evitar que TypeScript generalice los valores del array.",
      tests: [
        {
          name: "Usa 'as const' en el array",
          run: (code) => /as\s+const/.test(code),
        },
        {
          name: "getStatusLabel('pending') retorna 'Pendiente'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "Pendiente";
          },
        },
        {
          name: "getStatusLabel('delivered') retorna 'Entregado'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "Entregado";
          },
        },
        {
          name: "getStatusLabel('shipped') retorna 'Enviado'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2] === "Enviado";
          },
        },
      ],
    },
    {
      id: "ch04-05",
      title: "Non-null assertion y satisfies",
      type: "explanation",
      content: `# Non-null assertion y \`satisfies\`

## Non-null assertion \`!\`

El operador \`!\` le dice a TypeScript que un valor no es \`null\` ni \`undefined\`:

\`\`\`typescript
const button = document.getElementById("submit"); // HTMLElement | null

button.addEventListener("click", fn);  // Error: button puede ser null
button!.addEventListener("click", fn); // ✓ - vos decís que no es null
\`\`\`

**Usalo raramente.** Si TypeScript no puede deducir que no es null, es porque el tipo dice que sí puede serlo.

La alternativa más segura:

\`\`\`typescript
if (button) {
    button.addEventListener("click", fn); // TypeScript sabe que no es null aquí
}
\`\`\`

Cuándo \`!\` es apropiado: cuando tenés certeza absoluta de que el valor existe y TypeScript no puede verificarlo - por ejemplo, después de crear el elemento vos mismo.

## \`satisfies\` - validar sin perder tipos

El problema con las anotaciones de tipo explícitas:

\`\`\`typescript
type Color = string | [number, number, number];

const palette: Record<string, Color> = {
    red: [255, 0, 0],
    green: "#00ff00"
};

palette.red;   // tipo: Color (string | [number, number, number]) - perdiste que es un array
palette.green; // tipo: Color - TypeScript no sabe que es string
\`\`\`

Con \`satisfies\`, TypeScript verifica que el objeto cumple el tipo, pero preserva el tipo inferido de cada propiedad:

\`\`\`typescript
const palette = {
    red: [255, 0, 0],
    green: "#00ff00"
} satisfies Record<string, Color>;

palette.red;   // tipo: number[] - TypeScript lo sabe
palette.green; // tipo: string - TypeScript lo sabe
\`\`\`

La diferencia clave:
- Anotación explícita \`: Tipo\` → TypeScript amplía el tipo de cada propiedad al tipo general
- \`satisfies Tipo\` → TypeScript valida la forma pero preserva el tipo inferido específico
`,
    },
    {
      id: "ch04-06",
      title: "Feature flags",
      type: "exercise",
      instructions: `## Feature flags

La plataforma usa feature flags para controlar funcionalidades. Algunos flags son un simple \`boolean\`, otros son un objeto con configuración de rollout.

Con la anotación actual, TypeScript trata todas las propiedades como \`FeatureFlag\` - el tipo más amplio. Eso hace que acceder a \`rolloutPercentage\` de \`betaSearch\` requiera un cast extra.

Refactorizá la declaración de \`FLAGS\` para que TypeScript valide que el objeto cumple \`Record<string, FeatureFlag>\` pero preserve el tipo específico de cada propiedad. Cuando lo hagas, también vas a poder eliminar el cast extra en la desestructuración.`,
      starterCode: `type FeatureFlag = boolean | { enabled: boolean; rolloutPercentage: number };

const FLAGS: Record<string, FeatureFlag> = {
    darkMode: true,
    betaSearch: { enabled: true, rolloutPercentage: 25 },
    newCheckout: false
};

const { rolloutPercentage } = FLAGS.betaSearch as { enabled: boolean; rolloutPercentage: number };
console.log(\`Beta search rollout: \${rolloutPercentage}%\`);
console.log(\`Dark mode: \${FLAGS.darkMode}\`);
console.log(\`New checkout: \${FLAGS.newCheckout}\`);`,
      solution: `type FeatureFlag = boolean | { enabled: boolean; rolloutPercentage: number };

const FLAGS = {
    darkMode: true,
    betaSearch: { enabled: true, rolloutPercentage: 25 },
    newCheckout: false
} satisfies Record<string, FeatureFlag>;

const { rolloutPercentage } = FLAGS.betaSearch;
console.log(\`Beta search rollout: \${rolloutPercentage}%\`);
console.log(\`Dark mode: \${FLAGS.darkMode}\`);
console.log(\`New checkout: \${FLAGS.newCheckout}\`);`,
      hint: "Cuando usás `satisfies`, TypeScript valida que el objeto cumpla el tipo sin generalizar el tipo inferido de sus propiedades. La sintaxis va después del objeto literal, no como anotación con `:`.",
      tests: [
        {
          name: "Usa 'satisfies'",
          run: (code) => /\bsatisfies\b/.test(code),
        },
        {
          name: "No usa anotación explícita en FLAGS",
          run: (code) => !/FLAGS\s*:\s*Record/.test(code),
        },
        {
          name: "El rollout de betaSearch es 25%",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("25%");
          },
        },
        {
          name: "darkMode y newCheckout tienen los valores correctos",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[1]?.includes("true") &&
              output[2]?.includes("false")
            );
          },
        },
      ],
    },
    {
      id: "ch04-07",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen - Assertions & Special Syntax

## Type Assertions (\`as\`)

| Forma | Cuándo usarla |
|-------|---------------|
| \`valor as Tipo\` | Cuando tenés más información que TypeScript sobre el tipo real |
| \`as any\` | Último recurso - apaga toda verificación para ese valor |
| \`as unknown as T\` | Señal de alarma - probablemente el diseño tiene un problema |

Preferí **narrowing** sobre assertions cuando sea posible. Narrowing verifica el tipo en runtime; las assertions solo convencen a TypeScript en compile time.

## \`as const\`

- Convierte tipos generales en literales: \`string\` → \`"dark"\`, \`number\` → \`3\`
- Hace el objeto o array **readonly** - TypeScript impide modificaciones
- Permite derivar union types desde arrays: \`typeof ARRAY[number]\`

## Non-null assertion (\`!\`)

- Afirma que un valor no es \`null\` ni \`undefined\`
- Usalo raramente - si podés usar narrowing, úsalo
- Apropiado solo cuando tenés certeza que TypeScript no puede verificar

## \`satisfies\`

- Valida que un objeto cumple un tipo sin ampliar el tipo inferido de sus propiedades
- Diferencia clave: la anotación explícita (\`: Tipo\`) amplía el tipo; \`satisfies\` valida sin cambiar la inferencia
- Disponible desde TypeScript 4.9

## Lo que viene

El próximo capítulo cubre **Combining Types** - union types (\`|\`), intersection types (\`&\`), type aliases, y el operador \`keyof\`.
`,
    },
  ],
};
