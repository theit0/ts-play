import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch09: Chapter = {
  id: "ch09",
  title: "Literal types",
  lessons: [
    {
      id: "ch09-01",
      title: "Tipos literales",
      type: "explanation",
      content: `# Tipos literales

Un **tipo literal** es un tipo que representa un valor específico, no una categoría de valores.

## Tipos literales de string

En lugar de decir "cualquier string", puedes decir "exactamente este string":

\`\`\`typescript
// Tipo string: acepta cualquier string
let direction: string = "norte";
direction = "cualquier cosa"; // ✓ válido

// Tipo literal: solo acepta ese valor exacto
let direction: "norte" = "norte";
direction = "sur"; // ✗ Error: '"sur"' no es asignable a '"norte"'
\`\`\`

## Tipos literales en uniones (el caso de uso real)

Los tipos literales son más útiles combinados con tipos de unión:

\`\`\`typescript
type Direction = "norte" | "sur" | "este" | "oeste";

function move(direction: Direction) {
    console.log(\`Moviéndose hacia \${direction}\`);
}

move("norte"); // ✓
move("sur");   // ✓
move("arriba"); // ✗ Error: "arriba" no es un Direction válido
\`\`\`

Esto es como tener un enum de strings - TypeScript solo acepta los valores que especificaste.

## Tipos literales de número

\`\`\`typescript
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

function rollDice(): DiceRoll {
    return Math.floor(Math.random() * 6) + 1 as DiceRoll;
}
\`\`\`

## \`const\` vs \`let\` y la inferencia de tipos literales

\`\`\`typescript
const direction = "norte";
// TypeScript infiere el tipo: "norte" (literal)
// porque const no puede cambiar, el valor siempre será "norte"

let direction = "norte";
// TypeScript infiere el tipo: string (NO literal)
// porque let puede cambiar a cualquier string
\`\`\`

Este es un comportamiento importante: \`const\` con un string crea un tipo literal, \`let\` crea un tipo \`string\` general.

## \`as const\`

Para forzar la inferencia de tipo literal en una variable \`let\` o en un objeto:

\`\`\`typescript
let direction = "norte" as const;
// Ahora el tipo es "norte" (literal), no string
\`\`\`

## Resumen

- Un tipo literal es un tipo que representa un valor exacto: \`"norte"\`, \`42\`, \`true\`
- Son más útiles en uniones: \`"norte" | "sur" | "este" | "oeste"\`
- \`const\` infiere tipos literales, \`let\` infiere tipos generales
`,
    },
    {
      id: "ch09-02",
      title: "Const roto",
      type: "exercise",
      instructions: `## Const roto

El código de abajo tiene un problema: \`direction\` es declarada con \`let\`, por lo que TypeScript infiere su tipo como \`string\` (no como el literal \`"norte"\`). Cuando se pasa a \`move\`, hay un error de tipo.

**Tu tarea:** Arregla el código. Hay dos opciones:
1. Cambia \`let\` por \`const\`
2. Añade \`as const\` al final de la declaración

Elige la que te parezca más limpia.`,
      starterCode: `type Direction = "norte" | "sur" | "este" | "oeste";

function move(direction: Direction) {
    console.log(\`Moviéndose hacia \${direction}\`);
}

// El problema está aquí:
let direction = "norte";
move(direction); // Error: Argument of type 'string' is not assignable to type 'Direction'`,
      solution: `type Direction = "norte" | "sur" | "este" | "oeste";

function move(direction: Direction) {
    console.log(\`Moviéndose hacia \${direction}\`);
}

const direction = "norte";
move(direction); // ✓`,
      hint: "Cambia `let` por `const`. TypeScript entonces infiere el tipo literal `\"norte\"`.",
      tests: [
        {
          name: "El código funciona sin errores",
          run: (code) => {
            const { error } = runCode(code);
            return !error;
          },
        },
        {
          name: "No usa let direction",
          run: (code) => !/let\s+direction/.test(code),
        },
      ],
    },
    {
      id: "ch09-03",
      title: "Pedir camisa",
      type: "exercise",
      instructions: `## Pedir camisa

Necesitas definir los tamaños de camisa disponibles como un tipo literal.

**Tu tarea:**
1. Define el type alias \`ShirtSize\` con los valores: \`"XS"\`, \`"S"\`, \`"M"\`, \`"L"\`, \`"XL"\`
2. Usa \`ShirtSize\` como tipo del parámetro en \`orderShirt\``,
      starterCode: `// Define ShirtSize aquí

function orderShirt(size: string) {
    console.log(\`Camisa talla \${size} pedida\`);
}

orderShirt("M"); // Camisa talla M pedida
orderShirt("L"); // Camisa talla L pedida`,
      solution: `type ShirtSize = "XS" | "S" | "M" | "L" | "XL";

function orderShirt(size: ShirtSize) {
    console.log(\`Camisa talla \${size} pedida\`);
}

orderShirt("M");
orderShirt("L");`,
      hint: "Define `type ShirtSize = \"XS\" | \"S\" | \"M\" | \"L\" | \"XL\"` y úsalo en el parámetro.",
      tests: [
        {
          name: "Existe el tipo ShirtSize",
          run: (code) => /type\s+ShirtSize\s*=/.test(code),
        },
        {
          name: "orderShirt funciona correctamente",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0]?.includes("M") && output[1]?.includes("L");
          },
        },
      ],
    },
    {
      id: "ch09-04",
      title: "H1 impuestos",
      type: "exercise",
      instructions: `## H1 impuestos

La función \`getTaxRate\` recibe un número de tramo fiscal (1, 2 o 3) y retorna el porcentaje de impuesto.

**Tu tarea:**
1. El parámetro \`bracket\` debe tener tipo literal numérico: \`1 | 2 | 3\`
2. Implementa la función:
   - Tramo 1: 15%
   - Tramo 2: 25%
   - Tramo 3: 35%`,
      starterCode: `function getTaxRate(bracket) {
    // Implementa aquí
    return 0;
}

console.log(getTaxRate(1)); // 15
console.log(getTaxRate(2)); // 25
console.log(getTaxRate(3)); // 35`,
      solution: `function getTaxRate(bracket: 1 | 2 | 3): number {
    if (bracket === 1) return 15;
    if (bracket === 2) return 25;
    return 35;
}

console.log(getTaxRate(1));
console.log(getTaxRate(2));
console.log(getTaxRate(3));`,
      hint: "El tipo literal numérico se escribe como `1 | 2 | 3`.",
      tests: [
        {
          name: "getTaxRate(1) retorna 15",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "15";
          },
        },
        {
          name: "getTaxRate(2) retorna 25",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "25";
          },
        },
        {
          name: "getTaxRate(3) retorna 35",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[2] === "35";
          },
        },
      ],
    },
    {
      id: "ch09-05",
      title: "Estallido del pasado",
      type: "exercise",
      instructions: `## Estallido del pasado

La función \`explodePlanet\` acepta un tipo \`Planet\`, pero se está llamando con un valor inválido.

**Tu tarea:** Arregla la llamada a \`explodePlanet\` para que use un planeta válido del tipo \`Planet\`.

Los planetas válidos son: \`"Mercurio"\`, \`"Venus"\`, \`"Tierra"\`, \`"Marte"\`, \`"Júpiter"\`, \`"Saturno"\`, \`"Urano"\`, \`"Neptuno"\`.`,
      starterCode: `type Planet = "Mercurio" | "Venus" | "Tierra" | "Marte" | "Júpiter" | "Saturno" | "Urano" | "Neptuno";

function explodePlanet(planet: Planet) {
    console.log(\`💥 \${planet} ha explotado!\`);
}

// Arregla el error:
explodePlanet("Plutón"); // Error: "Plutón" no es un Planet válido`,
      solution: `type Planet = "Mercurio" | "Venus" | "Tierra" | "Marte" | "Júpiter" | "Saturno" | "Urano" | "Neptuno";

function explodePlanet(planet: Planet) {
    console.log(\`💥 \${planet} ha explotado!\`);
}

explodePlanet("Marte"); // ✓`,
      hint: "Reemplaza `\"Plutón\"` por un planeta del tipo `Planet`, como `\"Marte\"`.",
      tests: [
        {
          name: "El código funciona sin errores",
          run: (code) => {
            const { error } = runCode(code);
            return !error;
          },
        },
        {
          name: "No usa 'Plutón'",
          run: (code) => !/"Plutón"/.test(code),
        },
      ],
    },
    {
      id: "ch09-06",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen - Literal types

En este capítulo aprendiste sobre los tipos literales en TypeScript.

## Puntos clave

- Un **tipo literal** representa un valor exacto, no una categoría.
- Los tipos literales son más útiles en combinación con tipos de unión.
- Se pueden usar strings, números y booleanos como tipos literales.
- \`const\` infiere tipos literales; \`let\` infiere tipos generales (\`string\`, \`number\`).
- Puedes usar \`as const\` para forzar la inferencia de tipo literal.

## Ejemplos rápidos

\`\`\`typescript
type Status = "activo" | "inactivo" | "pendiente";
type Priority = 1 | 2 | 3;
type Toggle = "on" | "off";

const dir = "norte" as const; // tipo: "norte"
const dir2: "norte" = "norte"; // tipo: "norte"
\`\`\`

## Lo que viene

En el próximo capítulo profundizamos en las **funciones** - tipos de retorno, parámetros opcionales, void, y más.
`,
    },
  ],
};
