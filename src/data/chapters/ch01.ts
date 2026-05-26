import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch01: Chapter = {
  id: "ch01",
  title: "Introduction to TypeScript",
  lessons: [
    {
      id: "ch01-01",
      title: "TypeScript vs JavaScript",
      type: "explanation",
      content: `# TypeScript vs JavaScript

TypeScript es un lenguaje creado por Microsoft que extiende JavaScript añadiendo un **sistema de tipos estáticos**.

## El problema que resuelve

JavaScript es dinámico: cualquier variable puede contener cualquier valor en cualquier momento. Eso es flexible, pero permite bugs que solo aparecen en producción:

\`\`\`javascript
// JavaScript — sin tipos, sin advertencias
function calcularDescuento(precio, porcentaje) {
    return precio - (precio * porcentaje / 100);
}

calcularDescuento(200, "15"); // retorna 185, pero "15" debería ser número
calcularDescuento("gratis", 10); // retorna NaN — bug silencioso
\`\`\`

\`\`\`typescript
// TypeScript — el error aparece antes de ejecutar
function calcularDescuento(precio: number, porcentaje: number): number {
    return precio - (precio * porcentaje / 100);
}

calcularDescuento(200, "15"); // Error: 'string' no es asignable a 'number'
calcularDescuento("gratis", 10); // Error: 'string' no es asignable a 'number'
\`\`\`

## Lo que TypeScript agrega

- **Tipos en parámetros y variables** — el compilador sabe qué tipo espera cada cosa
- **Detección de errores temprana** — antes de ejecutar, no en producción
- **Autocompletado inteligente** — el editor sabe qué propiedades tiene cada objeto
- **Refactoring seguro** — renombrar algo actualiza todas sus referencias

## Lo que TypeScript NO cambia

TypeScript **compila a JavaScript**. Los tipos desaparecen en el output:

\`\`\`
TypeScript (.ts) → compilar (tsc) → JavaScript (.js) → navegador / Node.js
\`\`\`

En runtime no existen los tipos. Son solo una herramienta para el desarrollador durante el desarrollo.

## La regla fundamental

> Todo JavaScript válido es TypeScript válido.

Puedes tomar cualquier archivo \`.js\`, renombrarlo a \`.ts\`, y funciona. Desde ahí añades tipos gradualmente.
`,
    },
    {
      id: "ch01-02",
      title: "Interoperabilidad TS y JS",
      type: "explanation",
      content: `# Interoperabilidad entre TypeScript y JavaScript

TypeScript está diseñado para **convivir con JavaScript**, no reemplazarlo de golpe.

## Inferencia de tipos automática

TypeScript puede deducir tipos sin que los declares:

\`\`\`typescript
const nombre = "Ana";     // TypeScript infiere: string
const edad = 25;          // TypeScript infiere: number
const activo = true;      // TypeScript infiere: boolean

nombre.toUpperCase();     // ✓ TypeScript sabe que nombre es string
edad.toUpperCase();       // Error: 'toUpperCase' no existe en 'number'
\`\`\`

No siempre necesitas escribir el tipo — TypeScript lo deduce del valor.

## Archivos de declaración (.d.ts)

Las librerías JavaScript no tienen tipos nativos, pero TypeScript las puede usar gracias a archivos \`.d.ts\`. Estos archivos describen los tipos sin contener lógica.

\`\`\`typescript
// lodash está escrito en JavaScript, pero @types/lodash provee los tipos
import _ from 'lodash';
_.chunk(['a', 'b', 'c'], 2);
// TypeScript sabe que retorna string[][]
\`\`\`

## @types — Tipos de la comunidad

El repositorio **DefinitelyTyped** tiene tipos para miles de librerías JS:

\`\`\`bash
npm install --save-dev @types/node      # tipos de Node.js
npm install --save-dev @types/express   # tipos de Express
\`\`\`

Después de instalarlos, el editor muestra autocompletado y errores de tipo para esas librerías.

## Migración gradual

No necesitas migrar todo el proyecto de una sola vez:

\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "allowJs": true  // acepta .js junto a .ts en el mismo proyecto
  }
}
\`\`\`

Estrategia común: renombrar archivos de \`.js\` a \`.ts\` uno por uno, añadiendo tipos donde más importa.
`,
    },
    {
      id: "ch01-03",
      title: "tsconfig.json",
      type: "explanation",
      content: `# tsconfig.json

El archivo \`tsconfig.json\` controla cómo TypeScript compila tu proyecto. Vive en la raíz del proyecto.

## Estructura básica

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "bundler"
  },
  "include": ["src"]
}
\`\`\`

## Opciones clave

### \`strict\`
La opción más importante. Activa un conjunto de verificaciones estrictas:

\`\`\`json
{ "compilerOptions": { "strict": true } }
\`\`\`

Incluye automáticamente:
- **\`noImplicitAny\`** — error si TypeScript infiere \`any\` para un parámetro
- **\`strictNullChecks\`** — \`null\` y \`undefined\` no son asignables a otros tipos
- **\`strictFunctionTypes\`** — verificación estricta en tipos de funciones
- Otras verificaciones de seguridad

### \`target\`
La versión de JavaScript que genera el compilador:

| target | compatibilidad |
|--------|---------------|
| \`ES5\`     | IE11 y similares |
| \`ES2020\`  | navegadores modernos |
| \`ESNext\`  | última versión del estándar |

### \`noImplicitAny\`
Exige tipos explícitos donde TypeScript no puede inferirlos:

\`\`\`typescript
// Con noImplicitAny: true
function greet(name) {           // Error: 'name' tiene tipo implícito 'any'
    return "Hola " + name;
}

function greet(name: string) {   // ✓ tipo explícito
    return "Hola " + name;
}
\`\`\`

### \`strictNullChecks\`
Separa \`null\` y \`undefined\` del resto de tipos:

\`\`\`typescript
let nombre: string = null;       // Error con strictNullChecks
let nombre: string | null = null; // ✓ unión explícita
\`\`\`

## Recomendación

Para proyectos nuevos, siempre usa \`"strict": true\`. Te fuerza a escribir TypeScript real desde el principio y evita que los problemas se acumulen.
`,
    },
    {
      id: "ch01-04",
      title: "Ejecutar TypeScript",
      type: "explanation",
      content: `# Ejecutar TypeScript

TypeScript no corre directamente en navegadores ni en Node.js. Necesita ser compilado primero.

## tsc — El compilador oficial

\`\`\`bash
# Compilar un archivo específico
npx tsc archivo.ts          # genera archivo.js

# Compilar el proyecto completo (usa tsconfig.json)
npx tsc

# Watch mode: recompila al guardar
npx tsc --watch
\`\`\`

El output de \`tsc\` son archivos \`.js\` normales que cualquier runtime puede ejecutar.

## ts-node — TypeScript directo en Node.js

Para desarrollo, \`ts-node\` ejecuta TypeScript sin compilar manualmente:

\`\`\`bash
npx ts-node archivo.ts
\`\`\`

Internamente compila y ejecuta en memoria. Más lento que Node.js puro, pero conveniente para scripts y desarrollo.

## Build tools — La forma más común en proyectos reales

Herramientas como Vite, webpack, o esbuild manejan TypeScript como parte del proceso de build:

\`\`\`typescript
// vite.config.ts — Vite entiende TypeScript nativo
import { defineConfig } from 'vite';

export default defineConfig({
  // No necesitas configurar TypeScript manualmente
  // Vite lo maneja con esbuild internamente
});
\`\`\`

No necesitas correr \`tsc\` manualmente: el bundler lo hace como parte de \`npm run dev\` o \`npm run build\`.

## TypeScript Playground

**typescriptlang.org/play** — entorno online oficial. Útil para:
- Experimentar con tipos sin instalar nada
- Compartir snippets de código
- Ver el JavaScript generado en tiempo real
- Probar diferentes versiones de TypeScript

---

En este curso, el playground está integrado en cada ejercicio. Escribes TypeScript y se ejecuta directamente.
`,
    },
    {
      id: "ch01-05",
      title: "Tu primera anotación",
      type: "exercise",
      instructions: `## Tu primera anotación

La función \`formatUser\` construye un string con los datos de un usuario, pero sus parámetros no tienen anotaciones de tipo. TypeScript no puede verificar que se usen correctamente.

Añade las anotaciones necesarias.`,
      starterCode: `function formatUser(name, age, isPremium) {
    const badge = isPremium ? "⭐ Premium" : "Free";
    return \`\${name} (\${age} años) — \${badge}\`;
}

console.log(formatUser("Ana", 28, true));
// Ana (28 años) — ⭐ Premium

console.log(formatUser("Luis", 35, false));
// Luis (35 años) — Free`,
      solution: `function formatUser(name: string, age: number, isPremium: boolean): string {
    const badge = isPremium ? "⭐ Premium" : "Free";
    return \`\${name} (\${age} años) — \${badge}\`;
}

console.log(formatUser("Ana", 28, true));
console.log(formatUser("Luis", 35, false));`,
      hint: "Cada parámetro se usa de forma distinta. Analiza qué operaciones se hacen con cada uno dentro de la función.",
      tests: [
        {
          name: "Los parámetros tienen anotaciones de tipo",
          run: (code) =>
            /\w+\s*:\s*string/.test(code) &&
            /\w+\s*:\s*number/.test(code) &&
            /\w+\s*:\s*boolean/.test(code),
        },
        {
          name: "formatUser funciona correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("Ana") &&
              output[0]?.includes("Premium") &&
              output[1]?.includes("Luis") &&
              output[1]?.includes("Free")
            );
          },
        },
      ],
    },
    {
      id: "ch01-06",
      title: "El bug silencioso",
      type: "exercise",
      instructions: `## El bug silencioso

El siguiente código tiene un error de tipo que JavaScript ejecutaría en silencio — produciendo un resultado incorrecto sin ninguna advertencia.

Identifica el problema y corrígelo. La función debe retornar \`15\`.`,
      starterCode: `function addNumbers(a: number, b: number): number {
    return a + b;
}

const x = "10";
const y = 5;

console.log(addNumbers(x, y));`,
      solution: `function addNumbers(a: number, b: number): number {
    return a + b;
}

const x = 10;
const y = 5;

console.log(addNumbers(x, y));`,
      hint: "JavaScript tiene coerción de tipos. ¿Qué pasa cuando sumas un string y un número con `+`?",
      tests: [
        {
          name: "addNumbers retorna 15",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "15";
          },
        },
        {
          name: "x es de tipo number, no string",
          run: (code) => !/const\s+x\s*=\s*["']/.test(code),
        },
      ],
    },
    {
      id: "ch01-07",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen — Introduction to TypeScript

## Puntos clave

- TypeScript extiende JavaScript añadiendo **tipos estáticos**
- Los tipos se verifican en tiempo de desarrollo, no en runtime — el output es JavaScript puro
- **Todo JavaScript válido es TypeScript válido** — la migración puede ser gradual
- TypeScript infiere tipos automáticamente cuando puede; los tipos explícitos son para los casos que no puede inferir
- \`tsconfig.json\` configura el compilador — usa siempre \`"strict": true\`
- \`tsc\` compila, \`ts-node\` ejecuta directamente, los build tools integran TypeScript en el workflow

## La sintaxis básica

\`\`\`typescript
// Anotar parámetros y valor de retorno
function nombre(param: Tipo): TipoRetorno {
    // ...
}

// TypeScript infiere el tipo de variables
const mensaje = "hola"; // string
const numero = 42;      // number

// Tipo explícito en variable (solo cuando sea necesario)
const lista: string[] = [];
\`\`\`

## Lo que viene

El próximo capítulo cubre **TypeScript ESLint** — reglas que hacen cumplir buenas prácticas más allá de lo que el compilador verifica por defecto.
`,
    },
  ],
};
