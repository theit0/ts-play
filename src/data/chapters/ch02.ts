import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch02: Chapter = {
  id: "ch02",
  title: "The any type",
  lessons: [
    {
      id: "ch02-01",
      title: "El any type",
      type: "explanation",
      content: `# El tipo \`any\`

El tipo \`any\` es el escape hatch de TypeScript. Cuando asignas \`any\` a una variable o parámetro, le dices a TypeScript: *"no me importa el tipo, acepta cualquier cosa"*.

\`\`\`typescript
function logValue(value: any) {
    console.log(value);
}

logValue("hola");  // ✓
logValue(42);      // ✓
logValue(true);    // ✓
logValue([1,2,3]); // ✓ - any acepta todo
\`\`\`

## El problema con \`any\`

Aunque \`any\` parece conveniente, **deshabilita todas las verificaciones de TypeScript** para esa variable:

\`\`\`typescript
function double(n: any) {
    return n * 2;
}

double("hola"); // TypeScript no advierte nada, pero el resultado es NaN
\`\`\`

Usar \`any\` es como escribir JavaScript normal - pierdes todos los beneficios de TypeScript.

## \`any\` implícito

Si escribes una función **sin** anotaciones de tipo y TypeScript no puede inferir el tipo, automáticamente usa \`any\`. Esto se llama **any implícito**:

\`\`\`typescript
function greet(name) { // name tiene tipo 'any' implícito
    return "Hola " + name;
}
\`\`\`

Con la opción \`noImplicitAny: true\` en tu configuración (la veremos pronto), TypeScript te daría un error aquí.

## ¿Cuándo usar \`any\`?

Idealmente **nunca**. Pero hay algunos casos legítimos:
- Al migrar gradualmente de JavaScript a TypeScript
- Con datos de fuentes externas que no conocemos de antemano
- En casos muy específicos donde el tipo es genuinamente desconocido (en ese caso, mejor usar \`unknown\`)

## Regla general

> Si usas \`any\`, estás apagando TypeScript. Evítalo cuando puedas.
`,
    },
    {
      id: "ch02-02",
      title: "Registrar valor",
      type: "exercise",
      instructions: `## Registrar valor

La función \`logNumber\` usa \`any\` como tipo del parámetro, lo que anula las protecciones de TypeScript.

Reemplázalo con el tipo más específico y correcto.`,
      starterCode: `function logNumber(value: any) {
    console.log(value * 2);
}

logNumber(5);  // 10
logNumber(10); // 20
logNumber(7);  // 14`,
      solution: `function logNumber(value: number) {
    console.log(value * 2);
}

logNumber(5);  // 10
logNumber(10); // 20
logNumber(7);  // 14`,
      hint: "¿Qué operación se hace con `value`? ¿Qué tipos soportan esa operación?",
      tests: [
        {
          name: "No usa el tipo any",
          run: (code) => !/(:\s*any\b)/.test(code),
        },
        {
          name: "logNumber(5) imprime 10",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "10";
          },
        },
        {
          name: "logNumber(7) imprime 14",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2] === "14";
          },
        },
      ],
    },
    {
      id: "ch02-03",
      title: "tsconfig.json",
      type: "explanation",
      content: `# tsconfig.json

El archivo \`tsconfig.json\` es el archivo de configuración de TypeScript para tu proyecto. Controla cómo TypeScript compila tu código.

## Estructura básica

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true
  }
}
\`\`\`

## Opciones importantes

### \`strict\`

La opción más importante. Cuando está en \`true\`, activa un conjunto de verificaciones estrictas:

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

Esto incluye:
- **\`noImplicitAny\`**: Error si TypeScript infiere tipo \`any\` implícitamente
- **\`strictNullChecks\`**: \`null\` y \`undefined\` no son asignables a otros tipos
- Y otras verificaciones más

### \`noImplicitAny\`

Activa específicamente el error para \`any\` implícito:

\`\`\`json
{
  "compilerOptions": {
    "noImplicitAny": true
  }
}
\`\`\`

Con esta opción, TypeScript te daría un error en:

\`\`\`typescript
function greet(name) { // Error: 'name' tiene tipo implícito 'any'
    return "Hola " + name;
}
\`\`\`

### \`target\`

Especifica la versión de JavaScript a la que compilar:

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020"
  }
}
\`\`\`

## Recomendación

Para proyectos nuevos, siempre usa \`"strict": true\`. Te forzará a escribir código TypeScript de calidad desde el principio.

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
\`\`\`
`,
    },
    {
      id: "ch02-04",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen - The any type

En este capítulo aprendiste sobre el tipo \`any\` en TypeScript.

## Puntos clave

- El tipo \`any\` desactiva las verificaciones de TypeScript para esa variable o parámetro.
- Cuando TypeScript no puede inferir el tipo de un parámetro, lo asigna como \`any\` implícito.
- El archivo \`tsconfig.json\` configura el comportamiento del compilador de TypeScript.
- La opción \`strict: true\` activa verificaciones estrictas, incluyendo \`noImplicitAny\`.
- La opción \`noImplicitAny\` genera un error cuando TypeScript infiere tipo \`any\`.

## Regla de oro

> Siempre proporciona tipos explícitos y evita \`any\` cuando sea posible.

## Lo que viene

En el próximo capítulo aprenderemos sobre **TypeScript ESLint**, una herramienta que nos ayuda a mantener buenas prácticas en nuestro código TypeScript.
`,
    },
  ],
};
