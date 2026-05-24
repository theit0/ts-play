import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch06: Chapter = {
  id: "ch06",
  title: "The type alias",
  lessons: [
    {
      id: "ch06-01",
      title: "El type alias",
      type: "explanation",
      content: `# El type alias

Un **type alias** (alias de tipo) te permite darle un nombre a un tipo para reutilizarlo en múltiples lugares.

## Sintaxis

\`\`\`typescript
type NombreDelAlias = TipoAquí;
\`\`\`

## Ejemplo básico

Sin alias, si tienes una función que acepta un plan de usuario:

\`\`\`typescript
function getDiscount(plan: "Pro" | "Trial" | "Free") {
    // ...
}

function displayPlan(plan: "Pro" | "Trial" | "Free") {
    // ...
}
\`\`\`

Estás repitiendo \`"Pro" | "Trial" | "Free"\` en dos lugares. Si añades un nuevo plan, tienes que actualizarlo en todos lados.

Con un alias:

\`\`\`typescript
type UserPlan = "Pro" | "Trial" | "Free";

function getDiscount(plan: UserPlan) {
    // ...
}

function displayPlan(plan: UserPlan) {
    // ...
}
\`\`\`

Ahora, si añades un nuevo plan (\`"Enterprise"\`), solo lo cambias en un lugar.

## Aliases para tipos primitivos

También puedes crear aliases para tipos simples:

\`\`\`typescript
type Username = string;
type UserId = number;
type IsActive = boolean;

function getUser(id: UserId): Username {
    return "Ana";
}
\`\`\`

Esto hace el código más legible - cuando ves \`UserId\`, sabes exactamente para qué sirve ese número.

## Aliases complejos

Los aliases pueden representar tipos más complejos:

\`\`\`typescript
type Coordinate = [number, number];
type StringOrNumber = string | number;
type MaybeString = string | null | undefined;

function getLocation(): Coordinate {
    return [40.41, -3.70];
}
\`\`\`

## Regla general

> Cuando uses el mismo tipo complejo en más de un lugar, crea un alias.

Esto hace tu código más legible, mantenible y fácil de refactorizar.
`,
    },
    {
      id: "ch06-02",
      title: "Alias básico",
      type: "exercise",
      instructions: `## Alias básico

El código de abajo repite el tipo \`string | null\` en dos lugares.

**Tu tarea:**
1. Crea un type alias llamado \`MaybeString\` para \`string | null\`
2. Usa \`MaybeString\` en ambas funciones

Además, crea un alias \`Username\` para \`string\` y úsalo en \`createUser\`.`,
      starterCode: `function getUsername(id: number): string | null {
    if (id === 1) return "Ana";
    return null;
}

function formatUsername(name: string | null): string {
    if (name === null) return "Anónimo";
    return name.toUpperCase();
}

function createUser(name: string): string {
    return \`Usuario: \${name}\`;
}

console.log(formatUsername(getUsername(1)));  // ANA
console.log(formatUsername(getUsername(99))); // Anónimo`,
      solution: `type MaybeString = string | null;
type Username = string;

function getUsername(id: number): MaybeString {
    if (id === 1) return "Ana";
    return null;
}

function formatUsername(name: MaybeString): string {
    if (name === null) return "Anónimo";
    return name.toUpperCase();
}

function createUser(name: Username): string {
    return \`Usuario: \${name}\`;
}

console.log(formatUsername(getUsername(1)));
console.log(formatUsername(getUsername(99)));`,
      hint: "Define `type MaybeString = string | null;` antes de las funciones.",
      tests: [
        {
          name: "Usa type alias MaybeString",
          run: (code) => /type\s+MaybeString\s*=/.test(code),
        },
        {
          name: "El código funciona correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "ANA" && output[1] === "Anónimo";
          },
        },
      ],
    },
    {
      id: "ch06-03",
      title: "Alias de unión",
      type: "exercise",
      instructions: `## Alias de unión

Vas a crear un type alias para los días de la semana y usarlo en una función.

**Tu tarea:**
1. Crea un type alias \`Weekday\` con los días laborables: \`"lunes" | "martes" | "miércoles" | "jueves" | "viernes"\`
2. Crea un type alias \`Day\` que incluya también el fin de semana: \`Weekday | "sábado" | "domingo"\`
3. Usa \`Day\` como tipo del parámetro en \`isWeekend\``,
      starterCode: `// Define los type aliases aquí

function isWeekend(day: string): boolean {
    return day === "sábado" || day === "domingo";
}

console.log(isWeekend("lunes"));   // false
console.log(isWeekend("sábado")); // true
console.log(isWeekend("domingo")); // true`,
      solution: `type Weekday = "lunes" | "martes" | "miércoles" | "jueves" | "viernes";
type Day = Weekday | "sábado" | "domingo";

function isWeekend(day: Day): boolean {
    return day === "sábado" || day === "domingo";
}

console.log(isWeekend("lunes"));
console.log(isWeekend("sábado"));
console.log(isWeekend("domingo"));`,
      hint: "Define `type Weekday = ...` primero, luego `type Day = Weekday | ...`.",
      tests: [
        {
          name: "Existe el type alias Weekday",
          run: (code) => /type\s+Weekday\s*=/.test(code),
        },
        {
          name: "Existe el type alias Day",
          run: (code) => /type\s+Day\s*=/.test(code),
        },
        {
          name: "isWeekend funciona correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "false" && output[1] === "true";
          },
        },
      ],
    },
    {
      id: "ch06-04",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen - The type alias

En este capítulo aprendiste a crear y usar type aliases en TypeScript.

## Puntos clave

- Un **type alias** da un nombre a un tipo usando la sintaxis \`type Nombre = Tipo\`.
- Los aliases hacen el código más **legible**, **mantenible** y fácil de refactorizar.
- Puedes crear aliases para cualquier tipo: primitivos, uniones, tuples, objetos, etc.
- Los aliases pueden referenciar otros aliases.

## Ejemplos rápidos

\`\`\`typescript
type Username = string;
type UserId = number;
type UserPlan = "Pro" | "Trial" | "Free";
type MaybeString = string | null;
type Coordinate = [number, number];
\`\`\`

## Cuándo usar aliases

- Cuando el mismo tipo complejo aparece en **más de un lugar**
- Cuando el nombre del alias hace el código más **explícito**
- Para **agrupar** valores relacionados (como un enum)

## Lo que viene

En el próximo capítulo aprenderemos sobre los **arrays** en TypeScript - cómo tipamos listas de elementos.
`,
    },
  ],
};
