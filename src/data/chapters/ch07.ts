import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch07: Chapter = {
  id: "ch07",
  title: "Arrays",
  lessons: [
    {
      id: "ch07-01",
      title: "Array type literal",
      type: "explanation",
      content: `# Array type literal

TypeScript sabe el tipo de cada elemento dentro de un array tipado. Esto le permite protegerte de errores y ofrecerte autocompletado preciso.

## Sintaxis

La forma más común de tipar un array es escribir el tipo del elemento seguido de \`[]\`:

\`\`\`typescript
const nombres: string[] = ["Ana", "Sam", "Carlos"];
const puntos: number[] = [95, 87, 73];
const activos: boolean[] = [true, false, true];
\`\`\`

## Inferencia

Si inicializas un array con valores, TypeScript infiere el tipo automáticamente:

\`\`\`typescript
const nombres = ["Ana", "Sam", "Carlos"]; // inferido: string[]
const puntos  = [95, 87, 73];             // inferido: number[]
\`\`\`

## Qué ganas con un array tipado

Cuando TypeScript sabe que \`nombres\` es \`string[]\`, sabe que cada elemento es un \`string\`. Eso significa que en el callback de \`.map()\` el parámetro tiene todos los métodos de string:

\`\`\`typescript
const nombres: string[] = ["ana", "sam"];
nombres.map(n => n.toUpperCase()); // ✓ toUpperCase existe en string
nombres.map(n => n.toFixed(2));    // ✗ Error: toFixed no existe en string
\`\`\`

## Arrays como parámetros y retornos

Puedes usar \`string[]\` (o cualquier \`tipo[]\`) donde sea que uses un tipo:

\`\`\`typescript
function primerNombre(nombres: string[]): string {
    return nombres[0];
}

function duplicar(nums: number[]): number[] {
    return nums.map(n => n * 2);
}
\`\`\`

## Resumen

- \`tipo[]\` es la sintaxis para declarar un array tipado.
- TypeScript infiere el tipo del array a partir de sus elementos iniciales.
- Con el tipo correcto, TypeScript protege todos los accesos a los elementos del array.
`,
    },
    {
      id: "ch07-02",
      title: "Sumar números",
      type: "exercise",
      instructions: `## Sumar números

Completa la función \`sumarNumeros\` para que acepte un array de números y retorne su suma.

**Tu tarea:**
1. Añade el tipo \`number[]\` al parámetro \`numeros\`
2. Añade el tipo de retorno \`number\`
3. Implementa la función (puedes usar \`.reduce\`)`,
      starterCode: `function sumarNumeros(numeros) {
    // Implementa la suma aquí
    return 0;
}

console.log(sumarNumeros([1, 2, 3]));       // 6
console.log(sumarNumeros([10, 20, 30]));    // 60
console.log(sumarNumeros([5, -3, 8, 2]));   // 12`,
      solution: `function sumarNumeros(numeros: number[]): number {
    return numeros.reduce((acc, n) => acc + n, 0);
}

console.log(sumarNumeros([1, 2, 3]));
console.log(sumarNumeros([10, 20, 30]));
console.log(sumarNumeros([5, -3, 8, 2]));`,
      hint: "Usa `numeros.reduce((acc, n) => acc + n, 0)` para sumar todos los elementos.",
      tests: [
        {
          name: "Usa el tipo number[]",
          run: (code) => /number\[\]/.test(code),
        },
        {
          name: "sumarNumeros([1, 2, 3]) retorna 6",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "6";
          },
        },
        {
          name: "sumarNumeros([10, 20, 30]) retorna 60",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "60";
          },
        },
        {
          name: "sumarNumeros([5, -3, 8, 2]) retorna 12",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2] === "12";
          },
        },
      ],
    },
    {
      id: "ch07-03",
      title: "Obtener primera entrada",
      type: "exercise",
      instructions: `## Obtener primera entrada

Completa la función \`primeraEntrada\` para que retorne el primer elemento de cualquier array de strings.

**Tu tarea:**
1. Añade el tipo \`string[]\` al parámetro \`entradas\`
2. Añade el tipo de retorno \`string\`
3. Implementa la función`,
      starterCode: `function primeraEntrada(entradas) {
    // Retorna el primer elemento
}

console.log(primeraEntrada(["a", "b", "c"]));     // a
console.log(primeraEntrada(["primero", "segundo"])); // primero`,
      solution: `function primeraEntrada(entradas: string[]): string {
    return entradas[0];
}

console.log(primeraEntrada(["a", "b", "c"]));
console.log(primeraEntrada(["primero", "segundo"]));`,
      hint: "Accede al índice 0 del array: `entradas[0]`.",
      tests: [
        {
          name: "Usa el tipo string[]",
          run: (code) => /string\[\]/.test(code),
        },
        {
          name: "primeraEntrada(['a','b','c']) retorna 'a'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "a";
          },
        },
        {
          name: "primeraEntrada(['primero','segundo']) retorna 'primero'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "primero";
          },
        },
      ],
    },
    {
      id: "ch07-04",
      title: "Contar valores truthy",
      type: "exercise",
      instructions: `## Contar valores truthy

Implementa \`contarTruthy\` para que cuente cuántos valores del array son **truthy** (es decir, no son \`false\`, \`0\`, \`""\`, \`null\`, \`undefined\` ni \`NaN\`).

**Tu tarea:**
1. Añade el tipo \`boolean[]\` al parámetro \`valores\`
2. Añade el tipo de retorno \`number\`
3. Implementa la lógica`,
      starterCode: `function contarTruthy(valores) {
    // Cuenta cuántos valores son truthy
    return 0;
}

console.log(contarTruthy([true, false, true, true]));   // 3
console.log(contarTruthy([false, false, false]));        // 0
console.log(contarTruthy([true, true]));                 // 2`,
      solution: `function contarTruthy(valores: boolean[]): number {
    return valores.filter(Boolean).length;
}

console.log(contarTruthy([true, false, true, true]));
console.log(contarTruthy([false, false, false]));
console.log(contarTruthy([true, true]));`,
      hint: "Usa `valores.filter(Boolean).length` para contar los truthy, o bien un `reduce`.",
      tests: [
        {
          name: "Usa el tipo boolean[]",
          run: (code) => /boolean\[\]/.test(code),
        },
        {
          name: "contarTruthy([true,false,true,true]) retorna 3",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "3";
          },
        },
        {
          name: "contarTruthy([false,false,false]) retorna 0",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "0";
          },
        },
        {
          name: "contarTruthy([true,true]) retorna 2",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2] === "2";
          },
        },
      ],
    },
    {
      id: "ch07-05",
      title: "Registro de temperaturas",
      type: "exercise",
      instructions: `## Registro de temperaturas

Tienes un sistema de registro de temperaturas. Necesitas dos funciones:

1. \`promedioTemp\` — recibe \`number[]\` y retorna el promedio como \`number\`
2. \`tempMaxima\` — recibe \`number[]\` y retorna la temperatura máxima como \`number\`

Añade los tipos correctos e implementa ambas funciones.`,
      starterCode: `function promedioTemp(temps) {
    // Calcula el promedio
    return 0;
}

function tempMaxima(temps) {
    // Retorna la temperatura más alta
    return 0;
}

const registro = [22.5, 24.1, 19.8, 25.3, 23.0];

console.log(promedioTemp(registro));  // 22.94
console.log(tempMaxima(registro));    // 25.3`,
      solution: `function promedioTemp(temps: number[]): number {
    const suma = temps.reduce((acc, t) => acc + t, 0);
    return Math.round((suma / temps.length) * 100) / 100;
}

function tempMaxima(temps: number[]): number {
    return Math.max(...temps);
}

const registro = [22.5, 24.1, 19.8, 25.3, 23.0];

console.log(promedioTemp(registro));
console.log(tempMaxima(registro));`,
      hint: "Para el promedio: suma todos y divide por `temps.length`. Para el máximo: `Math.max(...temps)`.",
      tests: [
        {
          name: "Usa el tipo number[]",
          run: (code) => /number\[\]/.test(code),
        },
        {
          name: "promedioTemp([22.5,24.1,19.8,25.3,23.0]) retorna 22.94",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "22.94";
          },
        },
        {
          name: "tempMaxima([22.5,24.1,19.8,25.3,23.0]) retorna 25.3",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "25.3";
          },
        },
      ],
    },
    {
      id: "ch07-06",
      title: "Array type literal continuación",
      type: "explanation",
      content: `# Array type literal — continuación

Ahora que conoces la sintaxis básica \`tipo[]\`, veamos más formas de usarla.

## Arrays de tipos personalizados

Puedes crear arrays de cualquier tipo, incluyendo tus propios type aliases:

\`\`\`typescript
type Fruta = "manzana" | "pera" | "naranja";

const cesta: Fruta[] = ["manzana", "pera", "manzana"];
// ✗ Error: "plátano" no es Fruta
// cesta.push("plátano");
\`\`\`

## Arrays de objetos

\`\`\`typescript
type Usuario = {
    nombre: string;
    edad: number;
};

const usuarios: Usuario[] = [
    { nombre: "Ana", edad: 25 },
    { nombre: "Sam", edad: 30 },
];
\`\`\`

## Arrays multidimensionales

Un array de arrays se escribe añadiendo otro \`[]\`:

\`\`\`typescript
const matriz: number[][] = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];
\`\`\`

## Arrays con uniones

Si un array puede contener strings o números:

\`\`\`typescript
const mixto: (string | number)[] = ["hola", 42, "mundo", 7];
\`\`\`

> Los paréntesis son necesarios: \`string | number[]\` significaría "string o array de números", no lo mismo.

## Funciones que retornan arrays

\`\`\`typescript
function obtenerNombres(usuarios: Usuario[]): string[] {
    return usuarios.map(u => u.nombre);
}
\`\`\`

## Resumen

- \`Tipo[]\` funciona con cualquier tipo: primitivos, aliases, objetos.
- Arrays de arrays: \`number[][]\`
- Arrays de unión: \`(string | number)[]\`
`,
    },
    {
      id: "ch07-07",
      title: "Visualizar tipos inferidos",
      type: "exercise",
      instructions: `## Visualizar tipos inferidos

TypeScript infiere el tipo de un array según sus elementos iniciales. Tu tarea es añadir anotaciones de tipo **explícitas** que coincidan con lo que TypeScript inferiría.

Añade el tipo correcto a cada variable:

1. \`colores\` — array de strings
2. \`precios\` — array de números
3. \`flags\` — array de booleanos
4. \`mixto\` — array de strings y números`,
      starterCode: `const colores = ["rojo", "verde", "azul"];
const precios = [9.99, 14.99, 4.50];
const flags = [true, false, true, false];
const mixto = ["hola", 42, "mundo", 7];

console.log(colores, precios, flags, mixto);`,
      solution: `const colores: string[] = ["rojo", "verde", "azul"];
const precios: number[] = [9.99, 14.99, 4.50];
const flags: boolean[] = [true, false, true, false];
const mixto: (string | number)[] = ["hola", 42, "mundo", 7];

console.log(colores, precios, flags, mixto);`,
      hint: "Para `mixto`, el tipo es `(string | number)[]` — con paréntesis.",
      tests: [
        {
          name: "colores tiene tipo string[]",
          run: (code) => /colores\s*:\s*string\[\]/.test(code),
        },
        {
          name: "precios tiene tipo number[]",
          run: (code) => /precios\s*:\s*number\[\]/.test(code),
        },
        {
          name: "flags tiene tipo boolean[]",
          run: (code) => /flags\s*:\s*boolean\[\]/.test(code),
        },
        {
          name: "mixto tiene tipo (string | number)[]",
          run: (code) => /mixto\s*:\s*\(string\s*\|\s*number\)\[\]/.test(code),
        },
      ],
    },
    {
      id: "ch07-08",
      title: "Procesar datos",
      type: "exercise",
      instructions: `## Procesar datos

Implementa dos funciones para procesar arrays de strings:

1. \`convertirMayusculas(palabras: string[]): string[]\` — retorna un nuevo array con todas las palabras en mayúsculas
2. \`filtrarLargas(palabras: string[], minLength: number): string[]\` — retorna solo las palabras con longitud mayor o igual a \`minLength\`

Añade todos los tipos correctos.`,
      starterCode: `function convertirMayusculas(palabras) {
    // Retorna las palabras en mayúsculas
    return [];
}

function filtrarLargas(palabras, minLength) {
    // Retorna palabras con longitud >= minLength
    return [];
}

const lista = ["gato", "elefante", "oso", "mariposa", "pez"];

console.log(convertirMayusculas(lista));
console.log(filtrarLargas(lista, 4));`,
      solution: `function convertirMayusculas(palabras: string[]): string[] {
    return palabras.map(p => p.toUpperCase());
}

function filtrarLargas(palabras: string[], minLength: number): string[] {
    return palabras.filter(p => p.length >= minLength);
}

const lista = ["gato", "elefante", "oso", "mariposa", "pez"];

console.log(convertirMayusculas(lista));
console.log(filtrarLargas(lista, 4));`,
      hint: "Usa `.map(p => p.toUpperCase())` y `.filter(p => p.length >= minLength)`.",
      tests: [
        {
          name: "Usa string[] como tipo de parámetro y retorno",
          run: (code) => (code.match(/string\[\]/g) ?? []).length >= 2,
        },
        {
          name: "convertirMayusculas funciona",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("GATO") && output[0]?.includes("ELEFANTE");
          },
        },
        {
          name: "filtrarLargas(['gato','elefante','oso','mariposa','pez'], 4) funciona",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1]?.includes("gato") && output[1]?.includes("elefante") && !output[1]?.includes("oso") && !output[1]?.includes("pez");
          },
        },
      ],
    },
    {
      id: "ch07-09",
      title: "Registro roto I",
      type: "exercise",
      instructions: `## Registro roto I

El siguiente código tiene errores de tipos. Corrígelos para que compile sin errores y funcione correctamente.

**Pistas:**
- Revisa qué tipo se esperan las funciones
- Revisa qué tipo retornan`,
      starterCode: `function obtenerEdades(usuarios: string[]): number[] {
    return usuarios;
}

function formatearNombres(nombres: number[]): string[] {
    return nombres.map(n => n.toUpperCase());
}

const nombres = ["ana", "sam", "carlos"];
console.log(formatearNombres(nombres));`,
      solution: `function obtenerEdades(edades: number[]): number[] {
    return edades;
}

function formatearNombres(nombres: string[]): string[] {
    return nombres.map(n => n.toUpperCase());
}

const nombres = ["ana", "sam", "carlos"];
console.log(formatearNombres(nombres));`,
      hint: "En `obtenerEdades` el parámetro dice `string[]` pero retorna `number[]` — los tipos deben coincidir. En `formatearNombres` el parámetro dice `number[]` pero `.toUpperCase()` solo existe en strings.",
      tests: [
        {
          name: "formatearNombres recibe string[]",
          run: (code) => /formatearNombres\s*\(\s*\w+\s*:\s*string\[\]/.test(code),
        },
        {
          name: "El código funciona sin errores",
          run: (code) => {
            const { error } = runCode(code);
            return !error;
          },
        },
        {
          name: "formatearNombres retorna mayúsculas",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("ANA") && output[0]?.includes("SAM");
          },
        },
      ],
    },
    {
      id: "ch07-10",
      title: "Tronco roto II",
      type: "exercise",
      instructions: `## Tronco roto II

Otro fragmento con errores. Corrígelos todos.

Los problemas pueden ser:
- Tipos incorrectos en parámetros
- Tipos de retorno que no coinciden con la implementación
- Intentar usar métodos que no existen en el tipo`,
      starterCode: `function duplicarTextos(textos: number[]): string[] {
    return textos.map(t => t + t);
}

function sumarStrings(nums: string[]): number {
    return nums.reduce((acc, n) => acc + n, 0);
}

console.log(duplicarTextos(["hola", "mundo"]));
console.log(sumarStrings([1, 2, 3]));`,
      solution: `function duplicarTextos(textos: string[]): string[] {
    return textos.map(t => t + t);
}

function sumarStrings(nums: number[]): number {
    return nums.reduce((acc, n) => acc + n, 0);
}

console.log(duplicarTextos(["hola", "mundo"]));
console.log(sumarStrings([1, 2, 3]));`,
      hint: "`duplicarTextos` trabaja con strings, no con números. `sumarStrings` en realidad suma números — cambia el nombre conceptual o el tipo del parámetro a `number[]`.",
      tests: [
        {
          name: "duplicarTextos recibe string[]",
          run: (code) => /duplicarTextos\s*\(\s*\w+\s*:\s*string\[\]/.test(code),
        },
        {
          name: "sumarStrings recibe number[]",
          run: (code) => /sumarStrings\s*\(\s*\w+\s*:\s*number\[\]/.test(code),
        },
        {
          name: "duplicarTextos(['hola','mundo']) funciona",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("holahola");
          },
        },
        {
          name: "sumarStrings([1,2,3]) retorna 6",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "6";
          },
        },
      ],
    },
    {
      id: "ch07-11",
      title: "Proyecto de aula",
      type: "exercise",
      instructions: `## Proyecto de aula

Estás construyendo un sistema de notas para un aula. Implementa las siguientes funciones con los tipos correctos:

1. \`calcularPromedio(notas: number[]): number\` — promedio de notas (redondeado a 2 decimales)
2. \`alumnosAprobados(nombres: string[], notas: number[]): string[]\` — retorna los nombres de alumnos con nota >= 60
3. \`resumen(nombres: string[], notas: number[]): string\` — retorna un string con el formato \`"Aprobados: X/Y"\``,
      starterCode: `function calcularPromedio(notas) {
    return 0;
}

function alumnosAprobados(nombres, notas) {
    return [];
}

function resumen(nombres, notas) {
    return "";
}

const nombres = ["Ana", "Sam", "Carlos", "María", "Luis"];
const notas   = [85, 42, 91, 58, 76];

console.log(calcularPromedio(notas));
console.log(alumnosAprobados(nombres, notas));
console.log(resumen(nombres, notas));`,
      solution: `function calcularPromedio(notas: number[]): number {
    const suma = notas.reduce((acc, n) => acc + n, 0);
    return Math.round((suma / notas.length) * 100) / 100;
}

function alumnosAprobados(nombres: string[], notas: number[]): string[] {
    return nombres.filter((_, i) => notas[i] >= 60);
}

function resumen(nombres: string[], notas: number[]): string {
    const aprobados = alumnosAprobados(nombres, notas).length;
    return \`Aprobados: \${aprobados}/\${nombres.length}\`;
}

const nombres = ["Ana", "Sam", "Carlos", "María", "Luis"];
const notas   = [85, 42, 91, 58, 76];

console.log(calcularPromedio(notas));
console.log(alumnosAprobados(nombres, notas));
console.log(resumen(nombres, notas));`,
      hint: "Para `alumnosAprobados` usa `nombres.filter((_, i) => notas[i] >= 60)` — el segundo parámetro del callback es el índice.",
      tests: [
        {
          name: "Usa number[] y string[] correctamente",
          run: (code) => /number\[\]/.test(code) && /string\[\]/.test(code),
        },
        {
          name: "calcularPromedio([85,42,91,58,76]) retorna 70.4",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "70.4";
          },
        },
        {
          name: "alumnosAprobados retorna Ana, Carlos y Luis",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1]?.includes("Ana") && output[1]?.includes("Carlos") && output[1]?.includes("Luis") && !output[1]?.includes("Sam");
          },
        },
        {
          name: "resumen retorna 'Aprobados: 3/5'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2] === "Aprobados: 3/5";
          },
        },
      ],
    },
    {
      id: "ch07-12",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen — Arrays

En este capítulo aprendiste a trabajar con arrays tipados en TypeScript.

## Puntos clave

- \`tipo[]\` es la sintaxis del **array type literal** — la forma más común de tipar arrays.
- TypeScript **infiere** el tipo del array a partir de sus elementos iniciales.
- Con el tipo correcto, TypeScript protege los accesos y el autocompletado es preciso.
- Funciona con cualquier tipo: primitivos, aliases, objetos, uniones.

## Cheat sheet

\`\`\`typescript
// Primitivos
const nombres: string[]  = ["Ana", "Sam"];
const precios: number[]  = [9.99, 14.99];
const flags:   boolean[] = [true, false];

// Unión
const mixto: (string | number)[] = ["hola", 42];

// Arrays de objetos
type Usuario = { nombre: string; edad: number };
const usuarios: Usuario[] = [{ nombre: "Ana", edad: 25 }];

// Multidimensional
const matriz: number[][] = [[1, 2], [3, 4]];

// En funciones
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
