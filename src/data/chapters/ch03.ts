import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch03: Chapter = {
  id: "ch03",
  title: "TypeScript ESLint",
  lessons: [
    {
      id: "ch03-01",
      title: "TypeScript ESLint: no any explícito",
      type: "explanation",
      content: `# TypeScript ESLint: sin \`any\` explícito

**ESLint** es una herramienta que analiza tu código en busca de problemas y hace cumplir buenas prácticas. Con el plugin **typescript-eslint**, puedes añadir reglas específicas para TypeScript.

## La regla \`@typescript-eslint/no-explicit-any\`

Esta regla prohíbe el uso explícito del tipo \`any\`. Si intentas escribir \`: any\` en tu código, ESLint te mostrará un error:

\`\`\`typescript
// ✗ Error de ESLint: Unexpected any. Specify a different type.
function getValue(input: any) {
    return input;
}

// ✓ Correcto: usa un tipo específico
function getValue(input: string) {
    return input;
}
\`\`\`

## ¿Por qué prohibir \`any\`?

Si estás trabajando en un proyecto con \`strict: true\` y la regla \`no-explicit-any\`, TypeScript te fuerza a pensar en los tipos correctos en lugar de tomar el camino fácil.

Esto lleva a código más seguro y mejor documentado.

## Configuración típica

\`\`\`json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error"
  }
}
\`\`\`

## Alternativas a \`any\`

Cuando no sabes el tipo de antemano, en lugar de \`any\` puedes usar:

- **\`unknown\`**: más seguro que \`any\`, requiere verificar el tipo antes de usarlo
- Un tipo **unión** específico: \`string | number | boolean\`
- **Generics**: para funciones que trabajan con múltiples tipos (lo veremos más adelante)
`,
    },
    {
      id: "ch03-02",
      title: "No explícito any",
      type: "exercise",
      instructions: `## No explícito any

La función \`getLength\` viola la regla \`@typescript-eslint/no-explicit-any\`.

Reemplaza \`any\` con el tipo correcto. Analiza el cuerpo de la función para determinarlo.`,
      starterCode: `function getLength(str: any): number {
    return str.length;
}

console.log(getLength("hola"));       // 4
console.log(getLength("TypeScript")); // 10`,
      solution: `function getLength(str: string): number {
    return str.length;
}

console.log(getLength("hola"));       // 4
console.log(getLength("TypeScript")); // 10`,
      hint: "Observa qué propiedad se accede en el parámetro. No todos los tipos la tienen.",
      tests: [
        {
          name: "@typescript-eslint: sin any explícito",
          run: (code) => !/(:\s*any\b)/.test(code),
        },
        {
          name: "getLength('hola') retorna 4",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "4";
          },
        },
      ],
    },
    {
      id: "ch03-03",
      title: "Ban Comentario TS",
      type: "explanation",
      content: `# Ban de comentarios \`@ts-\`

TypeScript permite silenciar sus advertencias con comentarios especiales. Sin embargo, esto puede ser problemático.

## Comentarios que TypeScript reconoce

\`\`\`typescript
// @ts-ignore     - ignora el error en la siguiente línea
// @ts-expect-error - espera un error en la siguiente línea
// @ts-nocheck   - desactiva TypeScript en todo el archivo
\`\`\`

## El problema con \`@ts-ignore\`

\`// @ts-ignore\` silencia cualquier error sin explicación:

\`\`\`typescript
function greet(name: string) {
    return "Hola " + name;
}

// @ts-ignore
greet(42); // TypeScript no dice nada, pero esto es un bug
\`\`\`

El problema es que estás ocultando un error real sin arreglarlo.

## La regla \`@typescript-eslint/ban-ts-comment\`

Esta regla prohíbe el uso de \`@ts-ignore\` y otros comentarios que suprimen errores:

\`\`\`typescript
// ✗ Error: Do not use "@ts-ignore" because it alters compilation errors
// @ts-ignore
greet(42);
\`\`\`

## La alternativa: \`@ts-expect-error\`

Si genuinamente necesitas suprimir un error (muy raramente), usa \`@ts-expect-error\` en su lugar:

\`\`\`typescript
// @ts-expect-error - este error es intencional para el test
greet(42);
\`\`\`

La diferencia: si el error desaparece, \`@ts-expect-error\` te avisa que ya no es necesario. \`@ts-ignore\` silencia en silencio aunque no haya error.

## Regla general

> En lugar de suprimir el error, **arréglalo**.
`,
    },
    {
      id: "ch03-04",
      title: "Silenciar un error",
      type: "exercise",
      instructions: `## Silenciar un error

El código suprime un error de TypeScript en lugar de arreglarlo. Eso es mala práctica.

Elimina el supresor y corrige el error subyacente.`,
      starterCode: `function multiply(n: number): number {
    return n * 3;
}

// @ts-ignore
console.log(multiply("cinco")); // Esto es un bug oculto`,
      solution: `function multiply(n: number): number {
    return n * 3;
}

console.log(multiply(5)); // 15`,
      hint: "Mira el tipo del parámetro de `multiply` y el tipo del argumento que se le pasa.",
      tests: [
        {
          name: "@typescript-eslint: sin @ts-ignore",
          run: (code) => !/@ts-ignore/.test(code),
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
      id: "ch03-05",
      title: "Prohibir TS Comment",
      type: "exercise",
      instructions: `## Prohibir TS Comment

Este archivo desactiva TypeScript completamente para ocultar un error real.

Quita el mecanismo de supresión y arregla el código para que funcione sin atajos.`,
      starterCode: `// @ts-nocheck
function greet(name: string) {
    console.log("Hola " + name);
}

greet(42); // Este es el error que estaba ocultando`,
      solution: `function greet(name: string) {
    console.log("Hola " + name);
}

greet("Mundo"); // Arreglado: argumento correcto`,
      hint: "Mira la firma de `greet` para entender qué tipo de argumento acepta.",
      tests: [
        {
          name: "@typescript-eslint: sin @ts-nocheck",
          run: (code) => !/@ts-nocheck/.test(code) && !/@ts-ignore/.test(code),
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
      id: "ch03-06",
      title: "Tipos de Ban",
      type: "explanation",
      content: `# Prohibición de tipos

Algunos tipos en TypeScript parecen correctos pero en realidad son problemáticos. La regla \`@typescript-eslint/ban-types\` prohíbe ciertos tipos que no deberían usarse.

## El problema con los tipos en mayúscula

JavaScript tiene objetos envolventes para los primitivos: \`String\`, \`Number\`, \`Boolean\`. Estos son **objetos**, no primitivos:

\`\`\`typescript
// ✗ Incorrecto: tipos de objeto (wrapper objects)
const nombre: String = "Ana";   // String con mayúscula
const edad: Number = 25;        // Number con mayúscula
const activo: Boolean = true;   // Boolean con mayúscula

// ✓ Correcto: tipos primitivos
const nombre: string = "Ana";   // string con minúscula
const edad: number = 25;        // number con minúscula
const activo: boolean = true;   // boolean con minúscula
\`\`\`

## ¿Por qué es un problema?

Los tipos en mayúscula (\`String\`, \`Number\`, \`Boolean\`) representan los objetos envolventes de JavaScript. Aunque funcionan en la mayoría de los casos, no son lo mismo que los primitivos y pueden causar confusión.

\`\`\`typescript
const a: string = "hola"; // primitivo
const b: String = "hola"; // objeto String

// Puedes asignar un primitivo a String, pero no al revés:
const c: string = b; // ✗ Error en TypeScript estricto
\`\`\`

## Regla general

> Siempre usa tipos primitivos en **minúscula**: \`string\`, \`number\`, \`boolean\`.

Lo mismo aplica para \`object\` vs \`Object\`, y \`symbol\` vs \`Symbol\`.
`,
    },
    {
      id: "ch03-07",
      title: "Prohibición de Tipos",
      type: "exercise",
      instructions: `## Prohibición de Tipos

La función \`describePerson\` usa tipos que la regla \`@typescript-eslint/ban-types\` prohíbe.

Corrígelos. TypeScript tiene alternativas más apropiadas para cada uno.`,
      starterCode: `function describePerson(name: String, age: Number, isActive: Boolean): String {
    const status = isActive ? "activo" : "inactivo";
    return \`\${name}, \${age} años, \${status}\`;
}

console.log(describePerson("Ana", 25, true));
// Ana, 25 años, activo`,
      solution: `function describePerson(name: string, age: number, isActive: boolean): string {
    const status = isActive ? "activo" : "inactivo";
    return \`\${name}, \${age} años, \${status}\`;
}

console.log(describePerson("Ana", 25, true));
// Ana, 25 años, activo`,
      hint: "Los tipos primitivos de TypeScript siempre van en minúscula.",
      tests: [
        {
          name: "@typescript-eslint: sin tipos String/Number/Boolean en mayúscula",
          run: (code) =>
            !/:\s*String\b/.test(code) &&
            !/:\s*Number\b/.test(code) &&
            !/:\s*Boolean\b/.test(code),
        },
        {
          name: "describePerson funciona correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("Ana");
          },
        },
      ],
    },
    {
      id: "ch03-08",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen - TypeScript ESLint

En este capítulo aprendiste sobre TypeScript ESLint y las reglas más importantes para mantener un código TypeScript de calidad.

## Reglas vistas

| Regla | Qué prohíbe |
|-------|-------------|
| \`no-explicit-any\` | Uso de \`: any\` explícito |
| \`ban-ts-comment\` | Comentarios \`@ts-ignore\` y \`@ts-nocheck\` |
| \`ban-types\` | Tipos wrapper como \`String\`, \`Number\`, \`Boolean\` |

## Puntos clave

- TypeScript ESLint es un plugin que añade reglas específicas de TypeScript a ESLint.
- \`@ts-ignore\` silencia errores sin arreglarlos - evítalo.
- Si necesitas suprimir un error de forma excepcional, usa \`@ts-expect-error\` con una explicación.
- Siempre usa tipos primitivos en minúscula: \`string\`, \`number\`, \`boolean\`.

## Lo que viene

En el próximo capítulo profundizamos en los **tipos primitivos** de TypeScript y aprendemos sobre inferencia de tipos.
`,
    },
  ],
};
