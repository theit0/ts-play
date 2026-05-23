import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch10: Chapter = {
  id: "ch10",
  title: "Functions",
  lessons: [
    {
      id: "ch10-01",
      title: "Tipo de retorno de función",
      type: "explanation",
      content: `# Tipo de retorno de función

Hasta ahora hemos tipado los parámetros de funciones. También podemos tipar el **valor de retorno**.

## Sintaxis

El tipo de retorno se escribe después de los paréntesis, antes de las llaves:

\`\`\`typescript
function nombre(params): TipoRetorno {
    // ...
    return valor;
}
\`\`\`

## Ejemplo

\`\`\`typescript
// Sin tipo de retorno (TypeScript lo infiere)
function double(n: number) {
    return n * 2; // TypeScript infiere: number
}

// Con tipo de retorno explícito
function double(n: number): number {
    return n * 2;
}
\`\`\`

## ¿Cuándo especificar el tipo de retorno?

TypeScript puede inferir el tipo de retorno en muchos casos. Sin embargo, es buena práctica especificarlo porque:

1. **Claridad**: sirve como documentación de la función
2. **Detección temprana de errores**: si tu función devuelve el tipo incorrecto, TypeScript te avisa dentro de la función misma (no donde la llamas)

\`\`\`typescript
function getUsername(id: number): string {
    if (id === 1) return "Ana";
    return 42; // ✗ Error: Type 'number' is not assignable to type 'string'
}
\`\`\`

## Ejemplos de tipos de retorno

\`\`\`typescript
function greet(name: string): string {
    return \`Hola, \${name}!\`;
}

function isAdult(age: number): boolean {
    return age >= 18;
}

function getCoords(city: string): [number, number] {
    if (city === "Madrid") return [40.41, -3.70];
    return [0, 0];
}
\`\`\`

## Funciones arrow

El tipo de retorno funciona igual con funciones arrow:

\`\`\`typescript
const double = (n: number): number => n * 2;
const greet = (name: string): string => \`Hola, \${name}!\`;
\`\`\`
`,
    },
    {
      id: "ch10-02",
      title: "Obtener extensión de archivo",
      type: "exercise",
      instructions: `## Obtener extensión de archivo

La función \`getExtension\` obtiene la extensión de un nombre de archivo (la parte después del último punto).

**Tu tarea:** Añade el tipo de parámetro \`: string\` y el tipo de retorno \`: string\`.`,
      starterCode: `function getExtension(filename) {
    return filename.split(".").pop() || "";
}

console.log(getExtension("photo.jpg"));    // jpg
console.log(getExtension("script.ts"));   // ts
console.log(getExtension("style.css"));   // css`,
      solution: `function getExtension(filename: string): string {
    return filename.split(".").pop() || "";
}

console.log(getExtension("photo.jpg"));
console.log(getExtension("script.ts"));
console.log(getExtension("style.css"));`,
      hint: "Añade `: string` después del parámetro `filename` y `: string` como tipo de retorno.",
      tests: [
        {
          name: "getExtension('photo.jpg') retorna 'jpg'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "jpg";
          },
        },
        {
          name: "getExtension('script.ts') retorna 'ts'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "ts";
          },
        },
        {
          name: "Tiene tipo de retorno string",
          run: (code) => /\)\s*:\s*string\s*\{/.test(code),
        },
      ],
    },
    {
      id: "ch10-03",
      title: "Obtener coordenadas I",
      type: "exercise",
      instructions: `## Obtener coordenadas I

La función \`getCoordinates\` retorna un array de coordenadas, pero sin tipo de retorno.

**Tu tarea:** Añade el tipo de retorno \`: number[]\` a la función.`,
      starterCode: `function getCoordinates(city: string) {
    if (city === "Madrid") return [40.4168, -3.7038];
    if (city === "París") return [48.8566, 2.3522];
    if (city === "Londres") return [51.5074, -0.1278];
    return [0, 0];
}

console.log(getCoordinates("Madrid"));
console.log(getCoordinates("París"));`,
      solution: `function getCoordinates(city: string): number[] {
    if (city === "Madrid") return [40.4168, -3.7038];
    if (city === "París") return [48.8566, 2.3522];
    if (city === "Londres") return [51.5074, -0.1278];
    return [0, 0];
}

console.log(getCoordinates("Madrid"));
console.log(getCoordinates("París"));`,
      hint: "Añade `: number[]` después del paréntesis de cierre, antes de `{`.",
      tests: [
        {
          name: "Tiene tipo de retorno number[]",
          run: (code) => /\)\s*:\s*number\[\]/.test(code),
        },
        {
          name: "getCoordinates funciona correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("40.4168");
          },
        },
      ],
    },
    {
      id: "ch10-04",
      title: "Obtener coordenadas II",
      type: "exercise",
      instructions: `## Obtener coordenadas II

Ahora vas a mejorar la función de coordenadas para que retorne un **tuple** \`[number, number]\` en lugar de \`number[]\`.

La diferencia es que un tuple garantiza exactamente dos elementos con tipos específicos.

**Tu tarea:** Cambia el tipo de retorno de \`number[]\` a \`[number, number]\`.`,
      starterCode: `function getCoordinates(city: string): number[] {
    if (city === "Madrid") return [40.4168, -3.7038];
    if (city === "París") return [48.8566, 2.3522];
    return [0, 0];
}

const [lat, lng] = getCoordinates("Madrid");
console.log(\`Latitud: \${lat}, Longitud: \${lng}\`);`,
      solution: `function getCoordinates(city: string): [number, number] {
    if (city === "Madrid") return [40.4168, -3.7038];
    if (city === "París") return [48.8566, 2.3522];
    return [0, 0];
}

const [lat, lng] = getCoordinates("Madrid");
console.log(\`Latitud: \${lat}, Longitud: \${lng}\`);`,
      hint: "Cambia `number[]` por `[number, number]`.",
      tests: [
        {
          name: "Tipo de retorno es [number, number]",
          run: (code) => /\)\s*:\s*\[number,\s*number\]/.test(code),
        },
        {
          name: "La función funciona correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("Latitud: 40.4168");
          },
        },
      ],
    },
    {
      id: "ch10-05",
      title: "Visualizar tipo literal inferido",
      type: "explanation",
      content: `# Tipos de retorno inferidos

TypeScript puede inferir el tipo de retorno de una función a partir de su implementación.

## Inferencia de tipo de retorno literal

\`\`\`typescript
// TypeScript infiere el tipo de retorno
function getStatus() {
    return "activo"; // tipo inferido: string
}

// Con const, TypeScript infiere el tipo literal
const getStatus = () => "activo" as const; // tipo inferido: "activo"
\`\`\`

## Ejemplo práctico

\`\`\`typescript
function getDirection(input: number) {
    if (input > 0) return "derecha";
    if (input < 0) return "izquierda";
    return "centro";
}
// Tipo inferido: "derecha" | "izquierda" | "centro"
\`\`\`

Cuando TypeScript ve múltiples return statements con valores literales, infiere un tipo unión de todos esos literales.

## Cuándo confiar en la inferencia vs especificar

**Confía en la inferencia cuando:**
- La función es simple y el tipo de retorno es obvio
- La función es privada/interna

**Especifica el tipo de retorno cuando:**
- La función es parte de una API pública
- El tipo inferido es complejo o sorprendente
- Quieres que TypeScript te avise dentro de la función si retornas el tipo incorrecto

## Recomendación

Para funciones en la interfaz pública de tu código (exportadas, de alto nivel), **siempre especifica el tipo de retorno**. Para funciones utilitarias internas pequeñas, la inferencia es suficiente.
`,
    },
    {
      id: "ch10-06",
      title: "El void type",
      type: "explanation",
      content: `# El tipo \`void\`

El tipo \`void\` se usa para funciones que **no retornan ningún valor**.

## Sintaxis

\`\`\`typescript
function logMessage(message: string): void {
    console.log(message);
    // no hay return, o hay return sin valor
}
\`\`\`

## ¿Por qué usar \`void\`?

\`void\` comunica la intención: esta función existe por sus efectos secundarios (log, modificar estado, etc.), no por su valor de retorno.

\`\`\`typescript
// ✓ void es correcto aquí
function saveToDatabase(data: string): void {
    // guarda en la base de datos
    // no retorna nada
}

// ✗ void incorrecto: la función SÍ retorna algo
function calculateTotal(prices: number[]): void { // debería ser number
    return prices.reduce((a, b) => a + b, 0);
}
\`\`\`

## \`void\` vs \`undefined\`

\`\`\`typescript
// void: la función no debe retornar nada significativo
function logValue(value: string): void {
    console.log(value);
}

// undefined: la función retorna explícitamente undefined
function getNothing(): undefined {
    return undefined;
}
\`\`\`

En la práctica, usa \`void\` para funciones que no retornan valores.

## \`void\` en callbacks

\`void\` también es común como tipo de retorno en callbacks:

\`\`\`typescript
function forEach(items: string[], callback: (item: string) => void) {
    items.forEach(callback);
}
\`\`\`
`,
    },
    {
      id: "ch10-07",
      title: "Visualizar tipo inferido",
      type: "explanation",
      content: `# Inferencia de tipos en funciones complejas

TypeScript es bastante inteligente al inferir tipos. Veamos algunos ejemplos más complejos.

## Inferencia con operaciones

\`\`\`typescript
function multiply(a: number, b: number) {
    return a * b; // TypeScript infiere: number
}

function repeat(str: string, times: number) {
    return str.repeat(times); // TypeScript infiere: string
}

function getFirst(arr: string[]) {
    return arr[0]; // TypeScript infiere: string
}
\`\`\`

## Inferencia con condicionales

\`\`\`typescript
function getMessage(isError: boolean) {
    if (isError) {
        return "Error ocurrido"; // string
    }
    return 0; // number
}
// TypeScript infiere el tipo: string | number
\`\`\`

## Cuándo la inferencia falla

\`\`\`typescript
function processData(data: string[]) {
    const result = []; // TypeScript infiere: never[] (array vacío)
    // Necesitas anotar:
    const result2: string[] = [];

    for (const item of data) {
        result2.push(item.toUpperCase());
    }
    return result2; // Ahora TypeScript infiere: string[]
}
\`\`\`

## Recomendación práctica

Haz hover sobre las funciones en tu editor para ver qué tipo infiere TypeScript. Si el tipo inferido es correcto y claro, no necesitas anotarlo. Si es incorrecto o confuso, anótalo explícitamente.
`,
    },
    {
      id: "ch10-08",
      title: "Anularlo",
      type: "exercise",
      instructions: `## Anularlo

La función \`logPurchase\` registra una compra en consola. No retorna ningún valor.

**Tu tarea:** Añade el tipo de retorno \`: void\` a la función y asegúrate de que los parámetros también tengan tipos.`,
      starterCode: `function logPurchase(product, price, quantity) {
    const total = price * quantity;
    console.log(\`Compra: \${product} x\${quantity} = $\${total}\`);
}

logPurchase("Laptop", 999, 1);   // Compra: Laptop x1 = $999
logPurchase("Mouse", 29, 3);     // Compra: Mouse x3 = $87`,
      solution: `function logPurchase(product: string, price: number, quantity: number): void {
    const total = price * quantity;
    console.log(\`Compra: \${product} x\${quantity} = $\${total}\`);
}

logPurchase("Laptop", 999, 1);
logPurchase("Mouse", 29, 3);`,
      hint: "Añade `: string` a `product`, `: number` a `price` y `quantity`, y `: void` como tipo de retorno.",
      tests: [
        {
          name: "Tiene tipo de retorno void",
          run: (code) => /\)\s*:\s*void/.test(code),
        },
        {
          name: "logPurchase funciona correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("$999") && output[1]?.includes("$87");
          },
        },
      ],
    },
    {
      id: "ch10-09",
      title: "Parámetros opcionales",
      type: "explanation",
      content: `# Parámetros opcionales

A veces quieres que un parámetro sea **opcional** — que la función pueda llamarse con o sin él.

## Sintaxis

Añade \`?\` después del nombre del parámetro para hacerlo opcional:

\`\`\`typescript
function greet(name: string, greeting?: string) {
    // greeting es string | undefined aquí
}
\`\`\`

## Manejo del valor undefined

Dentro de la función, el parámetro opcional puede ser \`undefined\`. Necesitas manejarlo:

\`\`\`typescript
function greet(name: string, greeting?: string): string {
    const saludo = greeting ?? "Hola"; // usa "Hola" si greeting es undefined
    return \`\${saludo}, \${name}!\`;
}

greet("Ana");            // "Hola, Ana!"
greet("Ana", "Buenos días"); // "Buenos días, Ana!"
\`\`\`

El operador \`??\` (nullish coalescing) retorna el lado derecho si el izquierdo es \`null\` o \`undefined\`.

## Parámetros con valor por defecto

Otra opción es usar un valor por defecto:

\`\`\`typescript
function greet(name: string, greeting = "Hola"): string {
    return \`\${greeting}, \${name}!\`;
}

greet("Ana");                 // "Hola, Ana!"
greet("Ana", "Buenos días"); // "Buenos días, Ana!"
\`\`\`

Con valores por defecto, el parámetro es implícitamente opcional y no puede ser \`undefined\`.

## Regla: parámetros opcionales al final

Los parámetros opcionales deben ir **después** de los requeridos:

\`\`\`typescript
// ✓ Correcto: requerido primero, opcional después
function f(required: string, optional?: number) {}

// ✗ Incorrecto: opcional antes de requerido
function f(optional?: number, required: string) {}
\`\`\`
`,
    },
    {
      id: "ch10-10",
      title: "Bienvenido Usuario I",
      type: "exercise",
      instructions: `## Bienvenido Usuario I

La función \`welcomeUser\` actualmente requiere dos parámetros. Necesitas hacer que \`greeting\` sea opcional.

**Tu tarea:** Añade \`?\` al parámetro \`greeting\` para hacerlo opcional.

Cuando \`greeting\` es \`undefined\`, la función debe usar \`"Hola"\` como saludo por defecto.`,
      starterCode: `function welcomeUser(name: string, greeting: string): string {
    return \`\${greeting}, \${name}!\`;
}

console.log(welcomeUser("Ana", "Hola"));         // Hola, Ana!
console.log(welcomeUser("Sam", "Buenos días")); // Buenos días, Sam!
// Esta línea debe funcionar también:
console.log(welcomeUser("Carlos"));               // Hola, Carlos!`,
      solution: `function welcomeUser(name: string, greeting?: string): string {
    const saludo = greeting ?? "Hola";
    return \`\${saludo}, \${name}!\`;
}

console.log(welcomeUser("Ana", "Hola"));
console.log(welcomeUser("Sam", "Buenos días"));
console.log(welcomeUser("Carlos"));`,
      hint: "Cambia `greeting: string` por `greeting?: string` y usa `greeting ?? \"Hola\"` para el valor por defecto.",
      tests: [
        {
          name: "welcomeUser con greeting funciona",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "Hola, Ana!";
          },
        },
        {
          name: "welcomeUser sin greeting usa default",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2] === "Hola, Carlos!";
          },
        },
        {
          name: "greeting es parámetro opcional (?)",
          run: (code) => /greeting\?/.test(code),
        },
      ],
    },
    {
      id: "ch10-11",
      title: "Bienvenido Usuario II",
      type: "exercise",
      instructions: `## Bienvenido Usuario II

Refactoriza \`welcomeUser\` para usar un **valor por defecto** en lugar del operador \`??\`.

**Tu tarea:** Cambia \`greeting?: string\` por \`greeting = "Hola"\` (parámetro con valor por defecto).`,
      starterCode: `function welcomeUser(name: string, greeting?: string): string {
    const saludo = greeting ?? "Hola";
    return \`\${saludo}, \${name}!\`;
}

console.log(welcomeUser("Ana", "Buenos días")); // Buenos días, Ana!
console.log(welcomeUser("Sam"));                 // Hola, Sam!`,
      solution: `function welcomeUser(name: string, greeting = "Hola"): string {
    return \`\${greeting}, \${name}!\`;
}

console.log(welcomeUser("Ana", "Buenos días"));
console.log(welcomeUser("Sam"));`,
      hint: "Cambia `greeting?: string` por `greeting = \"Hola\"`. Ya no necesitas el `?? \"Hola\"`.",
      tests: [
        {
          name: "Usa valor por defecto (= 'Hola')",
          run: (code) => /greeting\s*=\s*["']Hola["']/.test(code),
        },
        {
          name: "welcomeUser('Sam') retorna 'Hola, Sam!'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "Hola, Sam!";
          },
        },
      ],
    },
    {
      id: "ch10-12",
      title: "Sintaxis de resumen de pedido",
      type: "exercise",
      instructions: `## Sintaxis de resumen de pedido

La función \`orderSummary\` genera un resumen de compra, pero le faltan tipos en todos lados.

**Tu tarea:** Añade tipos completos:
- \`customerName: string\`
- \`count: number\`
- \`total: number\`
- Tipo de retorno: \`string\``,
      starterCode: `function orderSummary(customerName, count, total) {
    return \`\${customerName} ordenó \${count} artículo(s) por $\${total.toFixed(2)}\`;
}

console.log(orderSummary("Ana", 3, 45.99));
// Ana ordenó 3 artículo(s) por $45.99

console.log(orderSummary("Sam", 1, 129.00));
// Sam ordenó 1 artículo(s) por $129.00`,
      solution: `function orderSummary(customerName: string, count: number, total: number): string {
    return \`\${customerName} ordenó \${count} artículo(s) por $\${total.toFixed(2)}\`;
}

console.log(orderSummary("Ana", 3, 45.99));
console.log(orderSummary("Sam", 1, 129.00));`,
      hint: "Añade `: string`, `: number`, `: number` a los parámetros y `: string` como tipo de retorno.",
      tests: [
        {
          name: "orderSummary('Ana', 3, 45.99) correcto",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("$45.99");
          },
        },
        {
          name: "Tiene tipos completos",
          run: (code) =>
            /customerName\s*:\s*string/.test(code) &&
            /count\s*:\s*number/.test(code) &&
            /total\s*:\s*number/.test(code),
        },
      ],
    },
    {
      id: "ch10-13",
      title: "Sintaxis de las funciones flecha",
      type: "exercise",
      instructions: `## Sintaxis de las funciones flecha

Las funciones flecha se tipan de la misma forma que las funciones normales.

**Tu tarea:** Convierte las funciones de declaración a funciones flecha manteniendo los tipos.

Ejemplo:
\`\`\`typescript
// Declaración
function add(a: number, b: number): number { return a + b; }
// Flecha
const add = (a: number, b: number): number => a + b;
\`\`\``,
      starterCode: `function multiply(a: number, b: number): number {
    return a * b;
}

function greet(name: string): string {
    return \`Hola, \${name}!\`;
}

function isEven(n: number): boolean {
    return n % 2 === 0;
}

console.log(multiply(3, 4));  // 12
console.log(greet("Ana"));    // Hola, Ana!
console.log(isEven(6));       // true`,
      solution: `const multiply = (a: number, b: number): number => a * b;

const greet = (name: string): string => \`Hola, \${name}!\`;

const isEven = (n: number): boolean => n % 2 === 0;

console.log(multiply(3, 4));
console.log(greet("Ana"));
console.log(isEven(6));`,
      hint: "Usa `const nombre = (params: tipos): retorno => expresión;`",
      tests: [
        {
          name: "multiply(3, 4) retorna 12",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "12";
          },
        },
        {
          name: "greet('Ana') retorna 'Hola, Ana!'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "Hola, Ana!";
          },
        },
        {
          name: "Usa sintaxis de función flecha (=>)",
          run: (code) =>
            /const\s+multiply\s*=/.test(code) &&
            /=>/.test(code),
        },
      ],
    },
    {
      id: "ch10-14",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen — Functions

¡Excelente trabajo! En este capítulo aprendiste todo sobre las funciones en TypeScript.

## Puntos clave

- El **tipo de retorno** se escribe después del paréntesis: \`function f(): string { ... }\`
- TypeScript puede inferir el tipo de retorno, pero especificarlo es buena práctica
- El tipo \`void\` indica que la función no retorna ningún valor
- Los **parámetros opcionales** se marcan con \`?\`: \`greeting?: string\`
- Los **valores por defecto** también hacen el parámetro opcional: \`greeting = "Hola"\`
- Las funciones flecha tienen la misma sintaxis de tipos

## Sintaxis rápida

\`\`\`typescript
// Función declarativa con tipo de retorno
function greet(name: string, title?: string): string {
    return \`\${title ?? "Hola"}, \${name}!\`;
}

// Función flecha
const double = (n: number): number => n * 2;

// void
const log = (msg: string): void => console.log(msg);
\`\`\`

## ¿Qué sigue?

En el capítulo 11 aprenderemos sobre los **módulos** (import/export) — cómo organizar el código TypeScript en múltiples archivos.

¡Sigue así, vas muy bien! 🎉
`,
    },
  ],
};
