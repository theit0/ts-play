import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch08: Chapter = {
  id: "ch08",
  title: "Tuples",
  lessons: [
    {
      id: "ch08-01",
      title: "Tuples",
      type: "explanation",
      content: `# Tuples

Un **tuple** (tupla) es un array de longitud fija donde cada posición tiene un tipo específico conocido de antemano.

## La diferencia con arrays normales

\`\`\`typescript
// Array normal: todos los elementos son del mismo tipo, longitud variable
const names: string[] = ["Ana", "Sam", "Carlos"]; // puede tener N elementos

// Tuple: posiciones fijas con tipos específicos
const pair: [string, number] = ["Ana", 25]; // exactamente 2 elementos
\`\`\`

## Sintaxis

\`\`\`typescript
type Coordinate = [number, number];
type UserInfo = [string, number, boolean]; // [nombre, edad, activo]

const position: Coordinate = [40.41, -3.70];
const user: UserInfo = ["Ana", 25, true];
\`\`\`

## Desestructuración de tuples

Los tuples se desestructuran igual que los arrays:

\`\`\`typescript
const [lat, lng] = position;
console.log(lat); // 40.41
console.log(lng); // -3.70

const [name, age, active] = user;
console.log(name);   // "Ana"
console.log(age);    // 25
console.log(active); // true
\`\`\`

## ¿Por qué usar tuples?

Los tuples son útiles cuando quieres retornar múltiples valores de una función sin crear un objeto:

\`\`\`typescript
function getMinMax(numbers: number[]): [number, number] {
    return [Math.min(...numbers), Math.max(...numbers)];
}

const [min, max] = getMinMax([3, 1, 4, 1, 5, 9]);
console.log(min); // 1
console.log(max); // 9
\`\`\`

Versus con un objeto:

\`\`\`typescript
function getMinMax(numbers: number[]): { min: number; max: number } {
    return { min: Math.min(...numbers), max: Math.max(...numbers) };
}
const { min, max } = getMinMax([3, 1, 4, 1, 5, 9]);
\`\`\`

Ambos son válidos — elige el que sea más claro para tu caso.

## Ejemplo de uso real: React's useState

Los tuples son muy usados en React:

\`\`\`typescript
// useState retorna un tuple [value, setter]
const [count, setCount] = useState(0);
// count es number, setCount es (n: number) => void
\`\`\`

## Resumen

- Un tuple es un array con longitud fija y tipos específicos por posición
- Sintaxis: \`[tipo1, tipo2, tipo3]\`
- Útil para retornar múltiples valores de una función
`,
    },
    {
      id: "ch08-02",
      title: "Coordenadas",
      type: "exercise",
      instructions: `## Coordenadas

La función \`getCenter\` recibe un punto y muestra sus coordenadas. El parámetro \`point\` debería ser un tuple \`[number, number]\` para representar \`[x, y]\`.

**Tu tarea:** Añade el tipo tuple \`[number, number]\` al parámetro \`point\`.`,
      starterCode: `function getCenter(point) {
    const [x, y] = point;
    return \`(\${x}, \${y})\`;
}

console.log(getCenter([10, 20])); // (10, 20)
console.log(getCenter([0, 0]));   // (0, 0)
console.log(getCenter([-5, 15])); // (-5, 15)`,
      solution: `function getCenter(point: [number, number]): string {
    const [x, y] = point;
    return \`(\${x}, \${y})\`;
}

console.log(getCenter([10, 20]));
console.log(getCenter([0, 0]));
console.log(getCenter([-5, 15]));`,
      hint: "El tipo tuple se escribe como `[number, number]`.",
      tests: [
        {
          name: "getCenter([10, 20]) retorna '(10, 20)'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "(10, 20)";
          },
        },
        {
          name: "Usa tipo tuple [number, number]",
          run: (code) => /\[number,\s*number\]/.test(code),
        },
      ],
    },
    {
      id: "ch08-03",
      title: "Tabla de Productos",
      type: "exercise",
      instructions: `## Tabla de Productos

Vas a trabajar con productos representados como tuples: \`[nombre, precio, disponible]\`.

**Tu tarea:**
1. Define el tipo \`Product\` como un tuple: \`[string, number, boolean]\`
2. Usa \`Product\` como tipo del parámetro en \`describeProduct\`
3. Usa \`Product[]\` como tipo del parámetro en \`printCatalog\``,
      starterCode: `// Define el type alias Product aquí

function describeProduct(product) {
    const [name, price, available] = product;
    const status = available ? "Disponible" : "Agotado";
    return \`\${name}: $\${price} (\${status})\`;
}

function printCatalog(products) {
    products.forEach(p => console.log(describeProduct(p)));
}

const catalog = [
    ["Laptop", 999, true],
    ["Mouse", 29, false],
    ["Teclado", 79, true],
];

printCatalog(catalog);`,
      solution: `type Product = [string, number, boolean];

function describeProduct(product: Product): string {
    const [name, price, available] = product;
    const status = available ? "Disponible" : "Agotado";
    return \`\${name}: $\${price} (\${status})\`;
}

function printCatalog(products: Product[]): void {
    products.forEach(p => console.log(describeProduct(p)));
}

const catalog: Product[] = [
    ["Laptop", 999, true],
    ["Mouse", 29, false],
    ["Teclado", 79, true],
];

printCatalog(catalog);`,
      hint: "Define `type Product = [string, number, boolean]` y úsalo en los parámetros.",
      tests: [
        {
          name: "Existe el type alias Product",
          run: (code) => /type\s+Product\s*=\s*\[/.test(code),
        },
        {
          name: "printCatalog funciona correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output.length === 3 && output[0]?.includes("Laptop");
          },
        },
      ],
    },
    {
      id: "ch08-04",
      title: "Ejercicio de sintaxis",
      type: "exercise",
      instructions: `## Ejercicio de sintaxis

Declara las siguientes variables con los tipos tuple correctos:

1. \`rgb\` — un color RGB: tres números para rojo, verde y azul (usa el valor \`[255, 128, 0]\`)
2. \`nameAge\` — nombre y edad: un string y un número (usa \`["Ana", 25]\`)
3. \`point3D\` — coordenada 3D: tres números (usa \`[1, 2, 3]\`)`,
      starterCode: `const rgb = [255, 128, 0];
const nameAge = ["Ana", 25];
const point3D = [1, 2, 3];

console.log(rgb, nameAge, point3D);`,
      solution: `const rgb: [number, number, number] = [255, 128, 0];
const nameAge: [string, number] = ["Ana", 25];
const point3D: [number, number, number] = [1, 2, 3];

console.log(rgb, nameAge, point3D);`,
      hint: "Añade la anotación de tipo tuple después del nombre de la variable: `const rgb: [number, number, number] = ...`",
      tests: [
        {
          name: "rgb tiene tipo [number, number, number]",
          run: (code) => /rgb\s*:\s*\[number,\s*number,\s*number\]/.test(code),
        },
        {
          name: "nameAge tiene tipo [string, number]",
          run: (code) => /nameAge\s*:\s*\[string,\s*number\]/.test(code),
        },
        {
          name: "El código funciona sin errores",
          run: (code) => {
            const { error } = runCode(code);
            return !error;
          },
        },
      ],
    },
    {
      id: "ch08-05",
      title: "Colección de coordenadas",
      type: "exercise",
      instructions: `## Colección de coordenadas

Tienes una función \`calculateDistance\` que trabaja con una colección de puntos.

**Tu tarea:**
1. El tipo del parámetro \`points\` debe ser un array de tuples: \`[number, number][]\`
2. Implementa la función para que retorne la cantidad de puntos`,
      starterCode: `function countPoints(points) {
    return points.length;
}

const route = [[0, 0], [3, 4], [6, 8], [9, 12]];

console.log(countPoints(route)); // 4`,
      solution: `function countPoints(points: [number, number][]): number {
    return points.length;
}

const route: [number, number][] = [[0, 0], [3, 4], [6, 8], [9, 12]];

console.log(countPoints(route));`,
      hint: "El tipo de un array de tuples es `[number, number][]`.",
      tests: [
        {
          name: "Usa tipo [number, number][]",
          run: (code) => /\[number,\s*number\]\[\]/.test(code),
        },
        {
          name: "countPoints retorna 4",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "4";
          },
        },
      ],
    },
    {
      id: "ch08-06",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen — Tuples

En este capítulo aprendiste sobre las tuplas en TypeScript.

## Puntos clave

- Un **tuple** es un array de longitud fija con tipos específicos por posición.
- Sintaxis: \`[tipo1, tipo2]\` — por ejemplo, \`[string, number]\`
- Un array de tuples se escribe como \`[string, number][]\`
- Se desestructuran igual que los arrays normales
- Son útiles para retornar múltiples valores de una función

## Ejemplos rápidos

\`\`\`typescript
type Point = [number, number];
type Entry = [string, number]; // [key, value]

const p: Point = [40.41, -3.70];
const [lat, lng] = p;

function getRange(nums: number[]): [number, number] {
    return [Math.min(...nums), Math.max(...nums)];
}
const [min, max] = getRange([3, 1, 5, 2]);
\`\`\`

## Lo que viene

En el próximo capítulo aprenderemos sobre los **literal types** — cuando el tipo no es solo "un string" sino "exactamente este string".
`,
    },
  ],
};
