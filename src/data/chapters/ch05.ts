import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch05: Chapter = {
  id: "ch05",
  title: "Union types",
  lessons: [
    {
      id: "ch05-01",
      title: "Tipos de unión",
      type: "explanation",
      content: `# Tipos de unión

¡Las cosas finalmente están empezando a ponerse interesantes!

Digamos que tenemos la siguiente función:

\`\`\`typescript
function orderSummary(customerName: string, count: number) {
    return \`\${customerName} ordenó \${count} artículo(s)\`;
}

orderSummary("Sam", 5); // "Sam ordenó 5 artículo(s)"
\`\`\`

Pero, ¿qué pasa si queremos poder usar la cadena \`"cinco"\` en lugar del dígito numérico \`5\`?

Podemos instruir a TypeScript que esperamos **o un \`number\` o un \`string\`**. La sintaxis usa el carácter barra vertical \`|\`:

\`\`\`typescript
number | string
\`\`\`

Esto se llama un **tipo unión**. Combina diferentes tipos en uno que puede representar cualquiera de los tipos individuales.

\`\`\`typescript
function orderSummary(customerName: string, count: number | string) {
    return \`\${customerName} ordenó \${count} artículo(s)\`;
}

orderSummary("Sam", 5);       // ✓ "Sam ordenó 5 artículo(s)"
orderSummary("Sam", "cinco"); // ✓ "Sam ordenó cinco artículo(s)"
\`\`\`

## El nombre

El nombre *tipo unión* viene de que combina diferentes tipos en uno. Pero recuerda: aunque se llama "unión", el valor eventualmente **será solo uno** de los tipos. Es un "o", no un "y".

## El orden no importa

\`number | string\` es equivalente a \`string | number\`.

## Usos en variables

Los tipos unión pueden usarse en declaraciones de variables y con más de dos tipos:

\`\`\`typescript
let value: string | number | undefined = 0;
value = "algún valor"; // ✓
value = undefined;      // ✓
value = true;           // ✗ Error
\`\`\`

## Resumen

- Un tipo unión se crea con \`|\`: \`string | number\`
- Significa "puede ser uno **u** otro tipo"
- El orden no importa: \`string | number\` ≡ \`number | string\`
- Puedes unir más de dos tipos: \`string | number | boolean\`
`,
    },
    {
      id: "ch05-02",
      title: "Plan de usuario predeterminado",
      type: "exercise",
      instructions: `## Plan de usuario predeterminado

La función \`getUserPlan\` actualmente solo acepta \`boolean\` como argumento.

**Tu tarea:** Actualiza el tipo del parámetro \`hasPaid\` para que también acepte \`undefined\`.

Cuando \`hasPaid\` es \`undefined\`, la función debe retornar \`"Trial"\` (igual que cuando es \`false\`).`,
      starterCode: `function getUserPlan(hasPaid: boolean) {
    if (hasPaid === true) {
        return "Pro";
    }
    return "Trial";
}

// Sample usage (do not modify)
console.log(getUserPlan(true));       // "Pro"
console.log(getUserPlan(false));      // "Trial"
console.log(getUserPlan(undefined));  // "Trial" — Esto debe funcionar`,
      solution: `function getUserPlan(hasPaid: boolean | undefined) {
    if (hasPaid === true) {
        return "Pro";
    }
    return "Trial";
}

console.log(getUserPlan(true));       // "Pro"
console.log(getUserPlan(false));      // "Trial"
console.log(getUserPlan(undefined));  // "Trial"`,
      hint: "Cambia el tipo de `hasPaid` a `boolean | undefined`.",
      tests: [
        {
          name: "getUserPlan works as expected",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "Pro" && output[1] === "Trial" && output[2] === "Trial";
          },
        },
        {
          name: "@typescript-eslint",
          run: (code) => /boolean\s*\|\s*undefined|undefined\s*\|\s*boolean/.test(code),
        },
      ],
    },
    {
      id: "ch05-03",
      title: "Tipo de usuario",
      type: "exercise",
      instructions: `## Tipo de usuario

La función \`getRolePermissions\` recibe un rol de usuario y devuelve sus permisos, pero el parámetro no tiene tipo.

**Tu tarea:** Añade un tipo unión al parámetro \`role\` que solo acepte los valores válidos: \`"admin"\`, \`"editor"\`, y \`"viewer"\`.`,
      starterCode: `function getRolePermissions(role) {
    if (role === "admin") return "leer, escribir, eliminar";
    if (role === "editor") return "leer, escribir";
    return "solo leer";
}

console.log(getRolePermissions("admin"));   // leer, escribir, eliminar
console.log(getRolePermissions("editor"));  // leer, escribir
console.log(getRolePermissions("viewer"));  // solo leer`,
      solution: `function getRolePermissions(role: "admin" | "editor" | "viewer") {
    if (role === "admin") return "leer, escribir, eliminar";
    if (role === "editor") return "leer, escribir";
    return "solo leer";
}

console.log(getRolePermissions("admin"));
console.log(getRolePermissions("editor"));
console.log(getRolePermissions("viewer"));`,
      hint: "El tipo unión usa strings literales: `\"admin\" | \"editor\" | \"viewer\"`.",
      tests: [
        {
          name: "getRolePermissions funciona correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("eliminar") && output[1]?.includes("escribir");
          },
        },
        {
          name: "El parámetro tiene tipo unión",
          run: (code) => /role\s*:\s*("|').+("|')\s*\|/.test(code),
        },
      ],
    },
    {
      id: "ch05-04",
      title: "Type narrowing",
      type: "explanation",
      content: `# Type narrowing (estrechamiento de tipos)

Cuando tienes un tipo unión, TypeScript no sabe exactamente cuál de los tipos tienes en un momento dado. El *type narrowing* (estrechamiento de tipos) es la técnica para **acotar** el tipo a uno específico dentro de un bloque de código.

## El problema

\`\`\`typescript
function printValue(value: string | number) {
    console.log(value.toUpperCase());
    // ✗ Error: 'toUpperCase' no existe en 'number'
}
\`\`\`

TypeScript no puede garantizar que \`value\` sea un string, por lo que no permite llamar a métodos que solo existen en strings.

## La solución: \`typeof\`

Usando \`typeof\`, puedes verificar el tipo en tiempo de ejecución y TypeScript "estrecha" el tipo dentro del bloque:

\`\`\`typescript
function printValue(value: string | number) {
    if (typeof value === "string") {
        // Aquí TypeScript sabe que value es string
        console.log(value.toUpperCase()); // ✓
    } else {
        // Aquí TypeScript sabe que value es number
        console.log(value.toFixed(2)); // ✓
    }
}
\`\`\`

## ¿Por qué funciona?

TypeScript analiza el flujo de tu código. Dentro del bloque \`if (typeof value === "string")\`, sabe con certeza que \`value\` es un \`string\`. Fuera de ese bloque, sigue siendo \`string | number\`.

## Otros métodos de narrowing

\`\`\`typescript
// Verificar null/undefined
if (value !== null) { /* value no es null aquí */ }
if (value !== undefined) { /* value no es undefined aquí */ }

// instanceof para clases
if (value instanceof Date) { /* value es un Date aquí */ }

// Truthy/falsy check
if (value) { /* value no es null, undefined, 0, "", false */ }
\`\`\`

## Resumen

- El narrowing acota el tipo dentro de un bloque de código.
- \`typeof\` es la herramienta más común para hacer narrowing con primitivos.
- TypeScript analiza el flujo de código para entender qué tipo aplica en cada parte.
`,
    },
    {
      id: "ch05-05",
      title: "Estrechamiento básico de tipos",
      type: "exercise",
      instructions: `## Estrechamiento básico de tipos

La función \`formatValue\` recibe un \`string | number\` y debe devolver:
- Si es **string**: el texto en **MAYÚSCULAS**
- Si es **number**: el número con el **símbolo \`$\`** delante

**Tu tarea:** Implementa la función usando \`typeof\` para hacer narrowing.`,
      starterCode: `function formatValue(value: string | number): string {
    // Si value es string, retorna en mayúsculas
    // Si value es number, retorna con símbolo $
    return ""; // Reemplaza esto
}

console.log(formatValue("hola"));  // HOLA
console.log(formatValue(100));     // $100
console.log(formatValue("mundo")); // MUNDO`,
      solution: `function formatValue(value: string | number): string {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return \`$\${value}\`;
}

console.log(formatValue("hola"));  // HOLA
console.log(formatValue(100));     // $100
console.log(formatValue("mundo")); // MUNDO`,
      hint: "Usa `if (typeof value === \"string\") { ... }` para el narrowing.",
      tests: [
        {
          name: "formatValue('hola') retorna 'HOLA'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "HOLA";
          },
        },
        {
          name: "formatValue(100) retorna '$100'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "$100";
          },
        },
        {
          name: "Usa typeof para narrowing",
          run: (code) => /typeof\s+\w+\s*===/.test(code),
        },
      ],
    },
    {
      id: "ch05-06",
      title: "Formatear valor",
      type: "exercise",
      instructions: `## Formatear valor

La función \`describe\` recibe un valor que puede ser \`string\`, \`number\` o \`boolean\`, y debe retornar una descripción del valor y su tipo.

**Tu tarea:** Implementa la función para que produzca el formato correcto:
- String: \`"El texto es: hola"\`
- Number: \`"El número es: 42"\`
- Boolean: \`"Es verdadero"\` o \`"Es falso"\``,
      starterCode: `function describe(value: string | number | boolean): string {
    // Implementa aquí usando typeof
    return "";
}

console.log(describe("hola"));  // El texto es: hola
console.log(describe(42));      // El número es: 42
console.log(describe(true));    // Es verdadero
console.log(describe(false));   // Es falso`,
      solution: `function describe(value: string | number | boolean): string {
    if (typeof value === "string") {
        return \`El texto es: \${value}\`;
    }
    if (typeof value === "number") {
        return \`El número es: \${value}\`;
    }
    return value ? "Es verdadero" : "Es falso";
}

console.log(describe("hola"));
console.log(describe(42));
console.log(describe(true));
console.log(describe(false));`,
      hint: "Usa múltiples bloques `if (typeof value === ...)` para cada caso.",
      tests: [
        {
          name: "describe('hola') correcto",
          run: (code) => {
            const { output } = runCode(code);
            return output[0] === "El texto es: hola";
          },
        },
        {
          name: "describe(42) correcto",
          run: (code) => {
            const { output } = runCode(code);
            return output[1] === "El número es: 42";
          },
        },
        {
          name: "describe(true/false) correcto",
          run: (code) => {
            const { output } = runCode(code);
            return output[2] === "Es verdadero" && output[3] === "Es falso";
          },
        },
      ],
    },
    {
      id: "ch05-07",
      title: "Convertir número",
      type: "exercise",
      instructions: `## Convertir número

La función \`toNumber\` debe convertir su argumento siempre a un \`number\`:
- Si recibe un \`number\`, lo retorna directamente.
- Si recibe un \`string\`, lo convierte a número con \`parseFloat\`.

**Tu tarea:** Implementa la función con el tipo de parámetro correcto.`,
      starterCode: `function toNumber(value: string | number): number {
    // Implementa aquí
    return 0;
}

console.log(toNumber("42"));    // 42
console.log(toNumber(10));      // 10
console.log(toNumber("3.14")); // 3.14`,
      solution: `function toNumber(value: string | number): number {
    if (typeof value === "string") {
        return parseFloat(value);
    }
    return value;
}

console.log(toNumber("42"));
console.log(toNumber(10));
console.log(toNumber("3.14"));`,
      hint: "Si `typeof value === \"string\"`, usa `parseFloat(value)`. Si no, retorna `value` directamente.",
      tests: [
        {
          name: "toNumber('42') retorna 42",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "42";
          },
        },
        {
          name: "toNumber(10) retorna 10",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "10";
          },
        },
        {
          name: "toNumber('3.14') retorna 3.14",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2] === "3.14";
          },
        },
      ],
    },
    {
      id: "ch05-08",
      title: "Visualizar estrechamiento de tipos",
      type: "explanation",
      content: `# Visualizar el estrechamiento de tipos

Cuando usas un tipo unión y aplicas narrowing, TypeScript cambia el tipo de la variable dependiendo del contexto. Esto se puede ver claramente en el editor.

## Ejemplo visual

\`\`\`typescript
function process(value: string | number) {
    // Aquí: value es string | number

    if (typeof value === "string") {
        // Aquí: TypeScript sabe que value es string
        value.toUpperCase(); // ✓ Solo métodos de string disponibles
    }

    // Aquí: value sigue siendo string | number
}
\`\`\`

## Narrowing con múltiples condiciones

Puedes combinar checks para narrowing más complejo:

\`\`\`typescript
function processValue(value: string | number | null) {
    if (value === null) {
        console.log("Sin valor");
        return;
    }
    // Aquí: value es string | number (null fue eliminado)

    if (typeof value === "string") {
        console.log("String:", value.toUpperCase());
    } else {
        // Aquí: value es definitivamente number
        console.log("Número:", value.toFixed(2));
    }
}
\`\`\`

## La técnica del "early return"

El ejemplo anterior usa una técnica común: retornar temprano para eliminar casos:

1. Verificas el caso "extraño" primero (\`null\`) y retornas
2. El resto del código ya no necesita considerar ese caso

TypeScript entiende esto y estrecha el tipo automáticamente.

## Autocompletado inteligente

En VS Code, al escribir dentro de un bloque de narrowing, el autocompletado solo mostrará métodos válidos para ese tipo específico. Esto hace el código mucho más fácil de escribir correctamente.
`,
    },
    {
      id: "ch05-09",
      title: "Proyecto de variaciones de nombres",
      type: "exercise",
      instructions: `## Proyecto: variaciones de nombres

Una función \`getFullName\` debe aceptar nombres en dos formatos posibles:
1. Un **string** simple: \`"Ana López"\`
2. Un **objeto** con propiedades \`first\` y \`last\`: \`{ first: "Ana", last: "López" }\`

En ambos casos debe retornar el nombre completo como string.

**Tu tarea:** Implementa la función. Usa \`typeof\` para el narrowing.`,
      starterCode: `function getFullName(name: string | { first: string; last: string }): string {
    // Si name es string, retórnalo directamente
    // Si name es objeto, combina first y last
    return "";
}

console.log(getFullName("Ana López"));
// Ana López

console.log(getFullName({ first: "Sam", last: "García" }));
// Sam García`,
      solution: `function getFullName(name: string | { first: string; last: string }): string {
    if (typeof name === "string") {
        return name;
    }
    return \`\${name.first} \${name.last}\`;
}

console.log(getFullName("Ana López"));
console.log(getFullName({ first: "Sam", last: "García" }));`,
      hint: "Usa `typeof name === \"string\"` para saber si es un string. Si no lo es, entonces es el objeto.",
      tests: [
        {
          name: "Acepta string simple",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "Ana López";
          },
        },
        {
          name: "Acepta objeto {first, last}",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "Sam García";
          },
        },
      ],
    },
    {
      id: "ch05-10",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen — Union types

En este capítulo aprendiste sobre los tipos de unión y el estrechamiento de tipos en TypeScript.

## Puntos clave

- Un **tipo unión** se crea con \`|\`: \`string | number\` significa "puede ser string o número".
- Los tipos unión se pueden usar en parámetros, variables y tipos de retorno.
- El **type narrowing** (estrechamiento de tipos) es la técnica para acotar el tipo dentro de un bloque.
- \`typeof\` es la herramienta más común para hacer narrowing con primitivos.
- TypeScript analiza el flujo de código para entender qué tipo aplica en cada contexto.

## Síntaxis rápida

\`\`\`typescript
// Tipo unión básico
function greet(name: string | null) { ... }

// Narrowing con typeof
if (typeof value === "string") {
    // value es definitivamente string aquí
}
\`\`\`

## Lo que viene

En el próximo capítulo aprenderemos sobre los **type aliases** — cómo darle nombre a tipos complejos para reutilizarlos.
`,
    },
  ],
};
