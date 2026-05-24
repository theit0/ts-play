import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch04: Chapter = {
  id: "ch04",
  title: "Primitive types",
  lessons: [
    {
      id: "ch04-01",
      title: "Tipos primitivos",
      type: "explanation",
      content: `# Tipos primitivos

En la lección anterior aprendimos sobre el tipo \`number\`. En esta lección, aprenderemos sobre todos los tipos primitivos de TypeScript.

## Los siete tipos primitivos de JavaScript

JavaScript tiene siete tipos primitivos, y TypeScript tiene un tipo para cada uno:

| Tipo | Descripción | Ejemplos |
|------|-------------|----------|
| \`string\` | Cadenas de texto | \`"hola"\`, \`\`template\`\` |
| \`number\` | Números (enteros y decimales) | \`42\`, \`3.14\`, \`-5\` |
| \`boolean\` | Verdadero o falso | \`true\`, \`false\` |
| \`undefined\` | Variable no inicializada | \`undefined\` |
| \`null\` | Ausencia deliberada de valor | \`null\` |
| \`bigint\` | Números enteros grandes | \`9007199254740991n\` |
| \`symbol\` | Identificadores únicos | \`Symbol("id")\` |

Los más usados son los primeros tres. Los últimos dos (\`bigint\` y \`symbol\`) son menos comunes.

## Anotando variables

Puedes anotar variables de la misma forma que los parámetros:

\`\`\`typescript
const username: string = "sam";
const isActive: boolean = true;
let age: number = 20;
age = age + 1;
console.log(age); // 21

let config: null = null;
let data: undefined = undefined;
\`\`\`

## Inferencia de tipos

Muchas veces TypeScript puede **inferir** el tipo automáticamente:

\`\`\`typescript
const username = "sam";    // TypeScript infiere: string
const isActive = true;     // TypeScript infiere: boolean
let age = 20;              // TypeScript infiere: number
\`\`\`

¿Cuándo necesitas anotar? Cuando TypeScript no puede inferir el tipo solo.

\`\`\`typescript
// TypeScript infiere correctamente: no necesitas el tipo
const nombre = "Ana"; // tipo: string (inferido)

// TypeScript necesita ayuda: el valor inicial no determina el tipo final
let resultado; // tipo: any (sin anotación, TypeScript no sabe qué será)
let resultado2: string | number; // mejor: indica lo que puede ser
\`\`\`

## \`null\` vs \`undefined\`

Como regla general:
- \`undefined\`: variable a la que aún no se le ha asignado un valor
- \`null\`: ausencia deliberada de un valor

\`\`\`typescript
let usuario: string | null = null; // todavía sin usuario
usuario = "Ana"; // ahora tiene un valor
\`\`\`

## Resumen

- TypeScript tiene un tipo para cada primitivo de JavaScript.
- Puedes anotar variables con la misma sintaxis que los parámetros: \`const x: string = "hola"\`.
- TypeScript puede inferir tipos automáticamente cuando el valor inicial deja claro el tipo.
`,
    },
    {
      id: "ch04-02",
      title: "Aplicar descuento",
      type: "exercise",
      instructions: `## Aplicar descuento

La función \`applyDiscount\` calcula el precio final después de aplicar un descuento, pero sus parámetros no tienen tipos.

**Tu tarea:** Añade las anotaciones de tipo correctas a los parámetros:
- \`price\` - el precio original (\`number\`)
- \`discountPercent\` - el porcentaje de descuento (\`number\`)

La función debe retornar un \`number\`.`,
      starterCode: `function applyDiscount(price, discountPercent) {
    return price * (1 - discountPercent / 100);
}

console.log(applyDiscount(100, 20)); // 80
console.log(applyDiscount(50, 10));  // 45
console.log(applyDiscount(200, 25)); // 150`,
      solution: `function applyDiscount(price: number, discountPercent: number): number {
    return price * (1 - discountPercent / 100);
}

console.log(applyDiscount(100, 20)); // 80
console.log(applyDiscount(50, 10));  // 45
console.log(applyDiscount(200, 25)); // 150`,
      hint: "Añade `: number` a cada parámetro. El tipo de retorno también puede ser `: number`.",
      tests: [
        {
          name: "applyDiscount(100, 20) retorna 80",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "80";
          },
        },
        {
          name: "applyDiscount(50, 10) retorna 45",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "45";
          },
        },
        {
          name: "Los parámetros tienen anotaciones de tipo number",
          run: (code) =>
            /price\s*:\s*number/.test(code) &&
            /discountPercent\s*:\s*number/.test(code),
        },
      ],
    },
    {
      id: "ch04-03",
      title: "Visualizar tipos inferidos",
      type: "exercise",
      instructions: `## Visualizar tipos inferidos

El código de abajo tiene anotaciones de tipo **redundantes** - TypeScript puede inferirlas automáticamente a partir de los valores asignados.

**Tu tarea:** Elimina las anotaciones de tipo explícitas donde TypeScript puede inferirlas por sí mismo. El código debe seguir funcionando igual.

> **Regla:** Si el valor inicial hace obvio el tipo, la anotación es redundante.`,
      starterCode: `const firstName: string = "Ana";
const lastName: string = "García";
const age: number = 28;
const isActive: boolean = true;
const score: number = 9.5;

const greeting: string = \`Hola, \${firstName} \${lastName}!\`;
console.log(greeting);
console.log(age, isActive, score);`,
      solution: `const firstName = "Ana";
const lastName = "García";
const age = 28;
const isActive = true;
const score = 9.5;

const greeting = \`Hola, \${firstName} \${lastName}!\`;
console.log(greeting);
console.log(age, isActive, score);`,
      hint: "Cuando asignas `const x: string = \"valor\"`, TypeScript ya sabe que es string. La anotación es redundante.",
      tests: [
        {
          name: "No hay anotaciones de tipo redundantes",
          run: (code) =>
            !/const\s+\w+\s*:\s*(string|number|boolean)\s*=\s*["'`\d]/.test(
              code
            ),
        },
        {
          name: "El código funciona igual",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("Hola, Ana García!");
          },
        },
      ],
    },
    {
      id: "ch04-04",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen - Tipos primitivos

En este capítulo aprendiste sobre los tipos primitivos de TypeScript.

## Puntos clave

- JavaScript tiene 7 tipos primitivos: \`string\`, \`number\`, \`boolean\`, \`undefined\`, \`null\`, \`bigint\`, \`symbol\`.
- TypeScript tiene un tipo para cada uno de ellos.
- Puedes anotar variables con la sintaxis \`const x: string = "valor"\`.
- TypeScript puede inferir tipos automáticamente cuando el valor inicial lo deja claro.
- Cuando la inferencia funciona, **no necesitas** escribir la anotación - es redundante.
- Usa \`undefined\` para variables sin valor asignado, y \`null\` para ausencia intencional de valor.

## Cuándo anotar y cuándo no

| Situación | ¿Anotar? | Ejemplo |
|-----------|----------|---------|
| Valor literal claro | No | \`const x = "hola"\` |
| Parámetro de función | Sí | \`function f(x: string)\` |
| Variable que cambia de tipo | Sí | \`let x: string \\| number\` |
| Variable sin valor inicial | Sí | \`let result: string\` |

## Lo que viene

En el próximo capítulo aprenderemos sobre los **tipos de unión** - cómo indicar que algo puede ser uno de varios tipos.
`,
    },
  ],
};
