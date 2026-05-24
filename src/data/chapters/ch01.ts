import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch01: Chapter = {
  id: "ch01",
  title: "Intro to TypeScript",
  lessons: [
    {
      id: "ch01-01",
      title: "Introducción y Prerrequisitos",
      type: "explanation",
      content: `# Introducción y Prerrequisitos

Bienvenido al curso de **Aprende TypeScript en español**. Antes de empezar, hay algunas cosas que debes saber.

## ¿Qué vas a aprender?

Este curso cubre TypeScript desde cero hasta conceptos avanzados como generics, clases, y más. Al final, serás capaz de escribir código TypeScript en proyectos del mundo real.

## Prerrequisitos

Para aprovechar al máximo este curso necesitas:

- **JavaScript sólido** - variables, funciones, arrays, objetos, arrow functions, desestructuración
- **Un editor de código** - recomendamos [VS Code](https://code.visualstudio.com/), que tiene soporte nativo para TypeScript
- **Node.js instalado** - para compilar TypeScript fuera del navegador

## Formato del curso

Cada capítulo incluye:

- **Lecciones explicativas** (ícono de texto ≡) - aprende los conceptos con ejemplos
- **Ejercicios prácticos** (ícono de código ⟨/⟩) - aplica lo que aprendiste en un editor interactivo

El playground en los ejercicios compila TypeScript en tiempo real. Puedes ver los errores de TypeScript mientras escribes.

## Una nota sobre JavaScript vs TypeScript

> Cualquier código JavaScript válido es también código TypeScript válido.

Esto significa que puedes empezar con JavaScript puro y agregar tipos gradualmente. TypeScript es un *superconjunto* de JavaScript.

¡Empecemos!
`,
    },
    {
      id: "ch01-02",
      title: "Introducción a TypeScript",
      type: "explanation",
      content: `# Introducción a TypeScript

TypeScript es un lenguaje de programación creado por **Microsoft** que extiende JavaScript añadiendo un sistema de tipos estáticos.

## ¿Qué es un sistema de tipos?

Un sistema de tipos te permite especificar qué tipo de datos espera tu código. Por ejemplo, puedes decirle a TypeScript: *"este parámetro siempre será un número"*.

\`\`\`typescript
// JavaScript: sin tipos, cualquier cosa puede pasar
function double(n) {
    return n * 2;
}

// TypeScript: el parámetro n debe ser un número
function double(n: number) {
    return n * 2;
}
\`\`\`

## La sintaxis de tipos

La anotación de tipo se escribe con **dos puntos** (\`:\`) seguido del tipo:

\`\`\`typescript
function greet(name: string) {
    return "Hola, " + name;
}
\`\`\`

Aquí \`name: string\` le dice a TypeScript que el parámetro \`name\` siempre debe ser una cadena de texto.

## ¿Por qué es útil?

Si intentas llamar la función con el tipo incorrecto, TypeScript te mostrará un error **antes** de ejecutar el código:

\`\`\`typescript
greet(42); // Error: el argumento es de tipo 'number', pero se esperaba 'string'
\`\`\`

Esto detecta errores durante el desarrollo, no en producción. Es como tener un asistente que revisa tu código constantemente.

## TypeScript compila a JavaScript

Los navegadores no entienden TypeScript directamente. Por eso, TypeScript se **compila** a JavaScript:

\`\`\`
TypeScript → compilar → JavaScript → navegador lo ejecuta
\`\`\`

Los tipos desaparecen en la compilación. Son solo para ayudarte durante el desarrollo.
`,
    },
    {
      id: "ch01-03",
      title: "Parámetros tipados",
      type: "exercise",
      instructions: `## Parámetros tipados

Se te proporciona una función \`multiply\`. De forma predeterminada, el editor te está advirtiendo que los parámetros tienen implícitamente el tipo \`any\`. Lo explicaremos en el siguiente capítulo.

Por ahora, nos gustaría que proporciones el tipo de los parámetros \`x\` e \`y\`. Debe ser \`number\` para ambos. Asegúrate de que la \`n\` esté en minúscula.`,
      starterCode: `function multiply(x, y) {
    return x * y;
}

// Sample usage (do not modify)
console.log(multiply(2, 4)); // 8
console.log(multiply(5, 3)); // 15`,
      solution: `function multiply(x: number, y: number) {
    return x * y;
}

// Sample usage (do not modify)
console.log(multiply(2, 4)); // 8
console.log(multiply(5, 3)); // 15`,
      hint: "Añade `: number` después de cada parámetro: `multiply(x: number, y: number)`.",
      tests: [
        {
          name: "multiply's parameters are typed",
          run: (code) =>
            /multiply\s*\(\s*\w+\s*:\s*number\s*,\s*\w+\s*:\s*number/.test(code),
        },
        {
          name: "multiply still works as expected",
          run: (code) => {
            const { output, error } = runCode(
              code,
              `console.log(multiply(2, 4)); console.log(multiply(5, 3));`
            );
            return (
              !error &&
              output.some((o) => o.includes("8")) &&
              output.some((o) => o.includes("15"))
            );
          },
        },
        {
          name: "Extra checks",
          run: (code) => !/:\s*Number/.test(code),
        },
      ],
    },
    {
      id: "ch01-04",
      title: "¿Cómo funciona TypeScript?",
      type: "explanation",
      content: `# ¿Cómo funciona TypeScript?

TypeScript es un superconjunto de JavaScript que añade tipos al lenguaje.

Esto significa que cualquier código JavaScript válido es código TypeScript válido.

Esta es la razón por la que aprender JavaScript es un requisito previo para aprender TypeScript.

Los navegadores no son compatibles con TypeScript en este momento. TypeScript se compila a JavaScript para que el navegador pueda ejecutarlo.

## TypeScript se compila a JavaScript

Cuando escribes código TypeScript, necesitarás compilarlo a JavaScript puro para que el navegador pueda ejecutarlo. Esto significa que los tipos de TypeScript desaparecerán del JavaScript compilado.

Los tipos no pueden ser accedidos en tiempo de ejecución en tu código JavaScript.

## Beneficios de TypeScript

Aunque los tipos se eliminan en tiempo de compilación, TypeScript todavía tiene los siguientes beneficios:

- **Previene errores**: el uso de tipos ayuda a detectar errores relacionados con tipos durante el desarrollo. Si una función espera un número y la llamas con una cadena, tendrás un error durante el desarrollo.
- **Mejor autocompletado**: al usar editores compatibles como VS Code, te beneficiarás de una experiencia de autocompletado mejorada.
- **Mejor colaboración**: las anotaciones de tipo explícitas facilitan que los miembros del equipo comprendan y trabajen con la base de código.

## Desventajas de TypeScript

Los beneficios anteriores no vienen sin algún costo:

- **Curva de aprendizaje**: como con cualquier cosa nueva, lleva un poco de tiempo aprender TypeScript.
- **Sobrecarga para proyectos pequeños**: al principio puede sentirse que luchas mucho con TypeScript. Eso desaparece con la práctica.
- **Proyectos heredados más difíciles de migrar**: si tienes un proyecto JavaScript grande, migrarlo a TypeScript puede llevar tiempo.

## Resumen

- TypeScript es un superconjunto de JavaScript
- Se compila a JavaScript (los tipos desaparecen en compilación)
- Ayuda a prevenir errores, mejora el autocompletado y facilita la colaboración
`,
    },
    {
      id: "ch01-05",
      title: "Di hola",
      type: "exercise",
      instructions: `## Di hola

La función \`greet\` tiene un parámetro \`name\` pero sin tipo.

**Tu tarea:** Añade la anotación de tipo \`string\` al parámetro \`name\`.

\`\`\`typescript
// Antes (JavaScript)
function greet(name) { ... }

// Después (TypeScript)
function greet(name: string) { ... }
\`\`\`

Añade el tipo y haz clic en **Run** para verificar.`,
      starterCode: `function greet(name) {
    return \`Hola, \${name}!\`;
}

console.log(greet("María")); // Hola, María!
console.log(greet("Sam"));   // Hola, Sam!`,
      solution: `function greet(name: string) {
    return \`Hola, \${name}!\`;
}

console.log(greet("María")); // Hola, María!
console.log(greet("Sam"));   // Hola, Sam!`,
      hint: "Añade `: string` justo después del nombre del parámetro `name`.",
      tests: [
        {
          name: "greet('María') retorna 'Hola, María!'",
          run: (code) => {
            const { output, error } = runCode(
              code,
              `console.log(greet("María"));`
            );
            return !error && output.some((o) => o.includes("Hola, María!"));
          },
        },
        {
          name: "greet tiene anotación de tipo en el parámetro",
          run: (code) => /greet\s*\(\s*\w+\s*:\s*string/.test(code),
        },
      ],
    },
    {
      id: "ch01-06",
      title: "Plan roto",
      type: "exercise",
      instructions: `## Plan roto

El código de abajo tiene un **error de tipo**: se está llamando \`getPlanName\` con un número, pero el parámetro espera una cadena (\`string\`).

**Tu tarea:** Arregla el error cambiando el argumento incorrecto por un \`string\` válido.

Los planes disponibles son: \`"Pro"\`, \`"Trial"\`, \`"Free"\`.`,
      starterCode: `function getPlanName(plan: string) {
    return \`Estás en el plan \${plan}\`;
}

// Estos están bien:
console.log(getPlanName("Pro"));    // Estás en el plan Pro
console.log(getPlanName("Trial")); // Estás en el plan Trial

// Esta línea tiene el error - ¡arréglala!
console.log(getPlanName(5));`,
      solution: `function getPlanName(plan: string) {
    return \`Estás en el plan \${plan}\`;
}

console.log(getPlanName("Pro"));    // Estás en el plan Pro
console.log(getPlanName("Trial")); // Estás en el plan Trial
console.log(getPlanName("Free"));  // Estás en el plan Free`,
      hint: "Reemplaza el número `5` por un string de plan como `\"Free\"`.",
      tests: [
        {
          name: "No hay llamadas con argumentos numéricos",
          run: (code) => !/getPlanName\s*\(\s*\d/.test(code),
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
      id: "ch01-07",
      title: "Flashcards móviles",
      type: "exercise",
      instructions: `## Flashcards móviles

La función \`createFlashcard\` crea una tarjeta de estudio con tres parámetros, pero ninguno tiene tipo.

**Tu tarea:** Añade las anotaciones de tipo correctas:
- \`pregunta\` - texto de la pregunta (\`string\`)
- \`respuesta\` - texto de la respuesta (\`string\`)
- \`nivel\` - nivel de dificultad (\`number\`)`,
      starterCode: `function createFlashcard(pregunta, respuesta, nivel) {
    return \`[Nivel \${nivel}] \${pregunta} → \${respuesta}\`;
}

console.log(createFlashcard("¿Capital de Francia?", "París", 1));
// [Nivel 1] ¿Capital de Francia? → París

console.log(createFlashcard("¿Qué es TypeScript?", "Superconjunto de JS con tipos", 3));
// [Nivel 3] ¿Qué es TypeScript? → Superconjunto de JS con tipos`,
      solution: `function createFlashcard(pregunta: string, respuesta: string, nivel: number) {
    return \`[Nivel \${nivel}] \${pregunta} → \${respuesta}\`;
}

console.log(createFlashcard("¿Capital de Francia?", "París", 1));
console.log(createFlashcard("¿Qué es TypeScript?", "Superconjunto de JS con tipos", 3));`,
      hint: "Añade `: string` a `pregunta` y `respuesta`, y `: number` a `nivel`.",
      tests: [
        {
          name: "createFlashcard funciona correctamente",
          run: (code) => {
            const { output, error } = runCode(
              code,
              `console.log(createFlashcard("¿Hola?", "Mundo", 2));`
            );
            return !error && output.some((o) => o.includes("[Nivel 2]"));
          },
        },
        {
          name: "Los parámetros tienen anotaciones de tipo",
          run: (code) =>
            /pregunta\s*:\s*string/.test(code) &&
            /respuesta\s*:\s*string/.test(code) &&
            /nivel\s*:\s*number/.test(code),
        },
      ],
    },
  ],
};
