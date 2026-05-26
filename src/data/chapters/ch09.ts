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

El código falla porque TypeScript infiere un tipo demasiado amplio para \`direction\`, y no es compatible con lo que \`move\` espera.

Arréglalo. Puede haber más de una forma válida.`,
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
      hint: "Piensa en cómo TypeScript infiere tipos de forma distinta según cómo se declara una variable.",
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

Una tienda de ropa solo vende camisas en tallas específicas. Sin embargo, la función \`orderShirt\` actualmente acepta cualquier string — incluyendo tallas inválidas como \`"XXXL"\` o \`"gigante"\`.

Define el tipo \`ShirtSize\` que represente las tallas válidas, y úsalo para restringir el parámetro de la función.`,
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
      hint: "TypeScript permite crear tipos que representen un conjunto finito de valores string.",
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

Implementa la función \`getTaxRate\`, que recibe un tramo fiscal y retorna la tasa de impuesto correspondiente.

El parámetro solo debe aceptar tramos válidos — no cualquier número.

- Tramo 1 → 15%
- Tramo 2 → 25%
- Tramo 3 → 35%`,
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
      hint: "TypeScript puede usar valores literales como tipos, no solo categorías como `number`.",
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

El código intenta explotar un planeta que no existe en el sistema solar reconocido por el tipo \`Planet\`.

Corrígelo.`,
      starterCode: `type Planet = "Mercurio" | "Venus" | "Tierra" | "Marte" | "Júpiter" | "Saturno" | "Urano" | "Neptuno";

function explodePlanet(planet: Planet) {
    console.log(\`💥 \${planet} ha explotado!\`);
}

// Arregla el error:
explodePlanet("Plutón"); // Error: Plutón no es un Planet válido`,
      solution: `type Planet = "Mercurio" | "Venus" | "Tierra" | "Marte" | "Júpiter" | "Saturno" | "Urano" | "Neptuno";

function explodePlanet(planet: Planet) {
    console.log(\`💥 \${planet} ha explotado!\`);
}

explodePlanet("Marte"); // ✓`,
      hint: "El tipo `Planet` ya define qué valores son válidos. Léelo.",
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
