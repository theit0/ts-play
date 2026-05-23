import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch07: Chapter = {
  id: "ch07",
  title: "Arrays",
  lessons: [
    {
      id: "ch07-01",
      title: "Arrays en TypeScript",
      type: "explanation",
      content: `# Arrays en TypeScript

Los arrays en TypeScript se tipan especificando el tipo de sus elementos.

## Dos sintaxis equivalentes

Hay dos formas de escribir el tipo de un array:

\`\`\`typescript
// Sintaxis 1: tipo[]
const names: string[] = ["Ana", "Sam", "Carlos"];
const scores: number[] = [95, 87, 73];

// Sintaxis 2: Array<tipo>  (sintaxis genérica)
const names: Array<string> = ["Ana", "Sam", "Carlos"];
const scores: Array<number> = [95, 87, 73];
\`\`\`

Ambas son equivalentes. La primera (\`string[]\`) es más común y concisa.

## Ejemplo práctico

\`\`\`typescript
function getFirstItem(items: string[]): string {
    return items[0];
}

getFirstItem(["Ana", "Sam"]); // "Ana" ✓
getFirstItem([1, 2, 3]);      // ✗ Error: number[] no es string[]
\`\`\`

## Arrays de unión

Puedes tener arrays que acepten múltiples tipos:

\`\`\`typescript
const mixed: (string | number)[] = ["hola", 42, "mundo", 7];
\`\`\`

## Inferencia en arrays

TypeScript infiere el tipo de un array a partir de sus elementos:

\`\`\`typescript
const names = ["Ana", "Sam", "Carlos"]; // inferido: string[]
const scores = [95, 87, 73];             // inferido: number[]
const mixed = ["hola", 42];             // inferido: (string | number)[]
\`\`\`

## Arrays de tipos complejos

\`\`\`typescript
type UserPlan = "Pro" | "Trial" | "Free";
const plans: UserPlan[] = ["Pro", "Trial", "Free"];
\`\`\`

## Métodos de array

Con tipos correctos, el autocompletado en el editor sabe qué métodos están disponibles:

\`\`\`typescript
const names: string[] = ["Carlos", "Ana", "Sam"];

names.map(n => n.toUpperCase()); // ✓ toUpperCase es un método de string
names.filter(n => n.length > 3); // ✓
names.sort();                     // ✓

const scores: number[] = [95, 87, 73];
scores.reduce((acc, n) => acc + n, 0); // ✓ suma: 255
\`\`\`

## Resumen

- \`string[]\` y \`Array<string>\` son equivalentes.
- Un array tipado solo puede contener elementos del tipo especificado.
- TypeScript infiere el tipo del array de sus elementos iniciales.
`,
    },
    {
      id: "ch07-02",
      title: "Lista de nombres",
      type: "exercise",
      instructions: `## Lista de nombres

La función \`getNames\` retorna un array, pero sin tipo de retorno explícito.

**Tu tarea:**
1. Añade la anotación de tipo \`string[]\` a la variable \`names\`
2. Añade el tipo de retorno \`: string[]\` a la función

Además, la función \`getFirstLetter\` recibe un array pero sin tipo — añádele el tipo correcto.`,
      starterCode: `function getNames() {
    const names = ["Ana", "Sam", "Carlos", "María"];
    return names;
}

function getFirstLetter(names) {
    return names.map(n => n[0]);
}

console.log(getNames());
console.log(getFirstLetter(["Ana", "Sam", "Carlos"]));`,
      solution: `function getNames(): string[] {
    const names: string[] = ["Ana", "Sam", "Carlos", "María"];
    return names;
}

function getFirstLetter(names: string[]): string[] {
    return names.map(n => n[0]);
}

console.log(getNames());
console.log(getFirstLetter(["Ana", "Sam", "Carlos"]));`,
      hint: "Añade `: string[]` como tipo de retorno de `getNames` y como tipo del parámetro `names`.",
      tests: [
        {
          name: "Usa el tipo string[]",
          run: (code) => /string\[\]/.test(code),
        },
        {
          name: "getNames() retorna el array correcto",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("Ana");
          },
        },
        {
          name: "getFirstLetter funciona",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1]?.includes("A") && output[1]?.includes("S");
          },
        },
      ],
    },
    {
      id: "ch07-03",
      title: "Función con array",
      type: "exercise",
      instructions: `## Función con array

Implementa dos funciones que trabajan con arrays de números:

1. \`sumNumbers(numbers: number[]): number\` — suma todos los números del array
2. \`average(numbers: number[]): number\` — calcula el promedio

Asegúrate de que los parámetros y tipos de retorno estén correctamente tipados.`,
      starterCode: `function sumNumbers(numbers) {
    // Suma todos los números
    return 0; // Reemplaza esto
}

function average(numbers) {
    // Calcula el promedio
    return 0; // Reemplaza esto
}

console.log(sumNumbers([1, 2, 3, 4, 5])); // 15
console.log(average([10, 20, 30]));        // 20`,
      solution: `function sumNumbers(numbers: number[]): number {
    return numbers.reduce((acc, n) => acc + n, 0);
}

function average(numbers: number[]): number {
    return sumNumbers(numbers) / numbers.length;
}

console.log(sumNumbers([1, 2, 3, 4, 5])); // 15
console.log(average([10, 20, 30]));        // 20`,
      hint: "Usa `numbers.reduce((acc, n) => acc + n, 0)` para sumar. Para el promedio, divide la suma por `numbers.length`.",
      tests: [
        {
          name: "sumNumbers([1,2,3,4,5]) retorna 15",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "15";
          },
        },
        {
          name: "average([10,20,30]) retorna 20",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "20";
          },
        },
        {
          name: "Usa tipo number[]",
          run: (code) => /number\[\]/.test(code),
        },
      ],
    },
    {
      id: "ch07-04",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen — Arrays

En este capítulo aprendiste cómo tipar arrays en TypeScript.

## Puntos clave

- Hay dos sintaxis equivalentes: \`string[]\` y \`Array<string>\`
- La sintaxis \`tipo[]\` es más común y concisa
- TypeScript infiere el tipo de un array de sus elementos iniciales
- Con tipos correctos, obtienes autocompletado para todos los métodos del array

## Ejemplos rápidos

\`\`\`typescript
const nombres: string[] = ["Ana", "Sam"];
const edades: number[] = [25, 30];
const mixto: (string | number)[] = ["hola", 42];

function primero(items: string[]): string {
    return items[0];
}
\`\`\`

## Lo que viene

En el próximo capítulo aprenderemos sobre los **tuples** — arrays de longitud fija donde cada posición tiene un tipo específico.
`,
    },
  ],
};
