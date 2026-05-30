import type { Chapter } from "../types";
import { runCode } from "../../utils/runner";

export const ch10: Chapter = {
  id: "ch10",
  title: "Generics",
  lessons: [
    {
      id: "ch10-01",
      title: "Generic Types",
      type: "explanation",
      content: `# Generic Types

## El problema con \`any\`

Si una función trabaja con múltiples tipos, la solución naive es \`any\` - pero eso pierde toda la información de tipos:

\`\`\`typescript
function primero(arr: any[]): any {
    return arr[0];
}

const nombre = primero(["Ana", "Luis"]); // tipo: any - TypeScript olvidó que es string
nombre.toUpperCase();                    // TypeScript no verifica nada
\`\`\`

## La solución: type parameters

Los **generics** son parámetros de tipo - un placeholder que TypeScript rellena según lo que le pasás:

\`\`\`typescript
function primero<T>(arr: T[]): T {
    return arr[0];
}

const nombre = primero(["Ana", "Luis"]); // T se infiere como string
nombre.toUpperCase();                    // ✓ TypeScript sabe que es string

const precio = primero([9.99, 19.99]);   // T se infiere como number
precio.toFixed(2);                       // ✓
\`\`\`

La \`T\` es solo una convención - podés usar cualquier nombre, pero \`T\` (de *Type*), \`K\` (*Key*), \`V\` (*Value*) son los más comunes.

## Múltiples type parameters

\`\`\`typescript
function par<A, B>(primero: A, segundo: B): [A, B] {
    return [primero, segundo];
}

const p = par("hola", 42); // tipo: [string, number]
\`\`\`

## Inferencia vs explícito

TypeScript infiere los type parameters desde los argumentos. También podés especificarlos explícitamente:

\`\`\`typescript
primero<string>(["Ana", "Luis"]); // explícito
primero(["Ana", "Luis"]);         // inferido - TypeScript deduce T = string
\`\`\`

En la práctica, casi siempre dejás que TypeScript infiera. Solo especificás explícitamente cuando la inferencia falla o cuando el código es ambiguo.

## Funciones genéricas en la práctica

\`\`\`typescript
// Filtra por una condición y retorna el mismo tipo
function filtrar<T>(items: T[], predicado: (item: T) => boolean): T[] {
    return items.filter(predicado);
}

const productos = ["Laptop", "Mouse", "Teclado"];
const largos = filtrar(productos, s => s.length > 5); // string[]
// ["Laptop", "Teclado"]
\`\`\`
`,
    },
    {
      id: "ch10-02",
      title: "Paginador genérico",
      type: "exercise",
      instructions: `## Paginador genérico

La función \`paginate\` divide cualquier array en páginas. Actualmente usa \`any[]\` para los ítems, lo que hace que el campo \`data\` del resultado pierda su tipo - TypeScript no sabe qué tipo de elementos contiene.

Hacé la función genérica para que \`data\` preserve el tipo del array de entrada.`,
      starterCode: `function paginate(items: any[], page: number, pageSize: number) {
    const start = (page - 1) * pageSize;
    return {
        data: items.slice(start, start + pageSize),
        total: items.length,
        page
    };
}

const products = ["Laptop", "Mouse", "Teclado", "Monitor", "Auriculares"];
const result = paginate(products, 1, 3);

console.log(result.data.join(", "));
console.log(\`Total: \${result.total}, Página: \${result.page}\`);`,
      solution: `function paginate<T>(items: T[], page: number, pageSize: number) {
    const start = (page - 1) * pageSize;
    return {
        data: items.slice(start, start + pageSize),
        total: items.length,
        page
    };
}

const products = ["Laptop", "Mouse", "Teclado", "Monitor", "Auriculares"];
const result = paginate(products, 1, 3);

console.log(result.data.join(", "));
console.log(\`Total: \${result.total}, Página: \${result.page}\`);`,
      hint: "Añadí un type parameter `<T>` a la función y usalo en lugar de `any`. TypeScript inferirá `T` automáticamente desde el array que se pase.",
      tests: [
        {
          name: "paginate tiene un type parameter genérico",
          run: (code) => /function\s+paginate\s*<\w+>/.test(code),
        },
        {
          name: "items usa el type parameter en lugar de any",
          run: (code) =>
            !/items\s*:\s*any\[\]/.test(code) &&
            /items\s*:\s*\w+\[\]/.test(code),
        },
        {
          name: "result.data contiene los primeros 3 productos",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[0]?.includes("Laptop") &&
              output[0]?.includes("Mouse") &&
              output[0]?.includes("Teclado")
            );
          },
        },
        {
          name: "Total y página son correctos",
          run: (code) => {
            const { output, error } = runCode(code);
            return (
              !error &&
              output[1]?.includes("5") &&
              output[1]?.includes("1")
            );
          },
        },
      ],
    },
    {
      id: "ch10-03",
      title: "Generic Constraints",
      type: "explanation",
      content: `# Generic Constraints

Sin constraints, TypeScript no sabe nada sobre \`T\` - y eso puede ser un problema:

\`\`\`typescript
function getLongitud<T>(value: T): number {
    return value.length; // Error: T no tiene .length
}
\`\`\`

## extends - limitar qué puede ser T

Con \`extends\`, le decís a TypeScript qué debe tener \`T\` como mínimo:

\`\`\`typescript
function getLongitud<T extends { length: number }>(value: T): number {
    return value.length; // ✓ TypeScript sabe que T tiene .length
}

getLongitud("hola");    // ✓ string tiene .length
getLongitud([1, 2, 3]); // ✓ array tiene .length
getLongitud(42);        // Error: number no tiene .length
\`\`\`

\`T extends { length: number }\` significa: "T puede ser cualquier tipo, siempre y cuando tenga una propiedad \`length\` de tipo \`number\`."

## Constraint con una interface

\`\`\`typescript
interface Identifiable {
    id: number;
    name: string;
}

function buscar<T extends Identifiable>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}

// Funciona con cualquier tipo que tenga id y name
buscar(productos, 1); // T = Product
buscar(clientes, 2);  // T = Customer
\`\`\`

La función es genérica - acepta \`Product[]\`, \`Customer[]\`, o cualquier array de objetos con \`id\` y \`name\`. Y el tipo de retorno es \`T | undefined\`, no \`any\`.

## Constraint con keyof

Combinando generics con \`keyof\` podés crear funciones que acceden a propiedades de forma completamente tipada:

\`\`\`typescript
function getPropiedad<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { name: "Ana", age: 28, email: "ana@mail.com" };
getPropiedad(user, "name");   // tipo: string
getPropiedad(user, "age");    // tipo: number
getPropiedad(user, "ciudad"); // Error: no es una clave de user
\`\`\`

El tipo de retorno \`T[K]\` es el tipo exacto de la propiedad \`K\` en \`T\` - TypeScript lo infiere automáticamente.
`,
    },
    {
      id: "ch10-04",
      title: "Búsqueda tipada",
      type: "exercise",
      instructions: `## Búsqueda tipada

La función \`findItem\` busca en cualquier array por \`id\`, pero usa \`any\` - el resultado pierde su tipo y TypeScript no puede verificar nada sobre lo que retorna.

Refactorizá la función para que sea genérica. Debe aceptar cualquier tipo de ítem, siempre que tenga al menos una propiedad \`id\` de tipo \`number\`.`,
      starterCode: `function findItem(items: any[], id: number): any {
    return items.find(item => item.id === id);
}

type Product = { id: number; name: string; price: number };
type Customer = { id: number; name: string; email: string };

const products: Product[] = [
    { id: 1, name: "Laptop", price: 999 },
    { id: 2, name: "Mouse", price: 49 }
];

const customers: Customer[] = [
    { id: 1, name: "Ana García", email: "ana@mail.com" },
    { id: 2, name: "Luis Pérez", email: "luis@mail.com" }
];

console.log(findItem(products, 1)?.name);
console.log(findItem(customers, 2)?.name);`,
      solution: `function findItem<T extends { id: number }>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}

type Product = { id: number; name: string; price: number };
type Customer = { id: number; name: string; email: string };

const products: Product[] = [
    { id: 1, name: "Laptop", price: 999 },
    { id: 2, name: "Mouse", price: 49 }
];

const customers: Customer[] = [
    { id: 1, name: "Ana García", email: "ana@mail.com" },
    { id: 2, name: "Luis Pérez", email: "luis@mail.com" }
];

console.log(findItem(products, 1)?.name);
console.log(findItem(customers, 2)?.name);`,
      hint: "Necesitás un type parameter con un constraint que garantice que el tipo tiene la propiedad `id`. La sintaxis de constraint va con `extends` después del nombre del type parameter.",
      tests: [
        {
          name: "findItem tiene un type parameter con constraint",
          run: (code) =>
            /function\s+findItem\s*<\w+\s+extends/.test(code),
        },
        {
          name: "El constraint requiere la propiedad id",
          run: (code) => /extends\s*\{[^}]*id\s*:\s*number/.test(code),
        },
        {
          name: "findItem(products, 1) retorna 'Laptop'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "Laptop";
          },
        },
        {
          name: "findItem(customers, 2) retorna 'Luis Pérez'",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "Luis Pérez";
          },
        },
      ],
    },
    {
      id: "ch10-05",
      title: "Generic Interfaces y Clases",
      type: "explanation",
      content: `# Generic Interfaces y Clases

## Generic Interfaces

Las interfaces también pueden tener type parameters:

\`\`\`typescript
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

// T se especifica al usar la interface
const productResponse: ApiResponse<Product> = {
    data: { id: 1, name: "Laptop", price: 999 },
    status: 200,
    message: "OK"
};

const listResponse: ApiResponse<Product[]> = {
    data: [{ id: 1, name: "Laptop", price: 999 }],
    status: 200,
    message: "OK"
};
\`\`\`

## Generic Classes

Las clases también pueden ser genéricas:

\`\`\`typescript
class Pair<A, B> {
    constructor(public first: A, public second: B) {}

    swap(): Pair<B, A> {
        return new Pair(this.second, this.first);
    }

    toArray(): [A, B] {
        return [this.first, this.second];
    }
}

const p = new Pair("hola", 42);
p.first;           // tipo: string
p.second;          // tipo: number

const swapped = p.swap();
swapped.first;     // tipo: number
swapped.second;    // tipo: string
\`\`\`

## implements con generic interface

\`\`\`typescript
interface Repository<T> {
    findById(id: number): T | undefined;
    findAll(): T[];
    save(entity: T): void;
}

class ProductRepository implements Repository<Product> {
    private items: Product[] = [];

    findById(id: number): Product | undefined {
        return this.items.find(p => p.id === id);
    }

    findAll(): Product[] { return [...this.items]; }
    save(product: Product): void { this.items.push(product); }
}
\`\`\`

\`Repository<T>\` define el contrato. \`ProductRepository\` implementa ese contrato para \`Product\` - si mañana necesitás un \`CustomerRepository\`, implementás la misma interface para \`Customer\`.
`,
    },
    {
      id: "ch10-06",
      title: "Stack genérico",
      type: "exercise",
      instructions: `## Stack genérico

La clase \`Stack\` implementa una pila (LIFO - el último en entrar es el primero en salir). Funciona, pero está tipada con \`any\` en todas partes - al hacer \`pop()\` o \`peek()\`, TypeScript no sabe qué tipo de valor va a recibir.

Hacé la clase genérica para que preserve el tipo de los elementos que se almacenan.`,
      starterCode: `class Stack {
    private items: any[] = [];

    push(item: any): void {
        this.items.push(item);
    }

    pop(): any {
        return this.items.pop();
    }

    peek(): any {
        return this.items[this.items.length - 1];
    }

    size(): number {
        return this.items.length;
    }
}

const numbers = new Stack();
numbers.push(10);
numbers.push(20);
numbers.push(30);
console.log(numbers.peek());
console.log(numbers.pop());
console.log(numbers.size());

const messages = new Stack();
messages.push("primer evento");
messages.push("segundo evento");
console.log(messages.pop());`,
      solution: `class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    size(): number {
        return this.items.length;
    }
}

const numbers = new Stack<number>();
numbers.push(10);
numbers.push(20);
numbers.push(30);
console.log(numbers.peek());
console.log(numbers.pop());
console.log(numbers.size());

const messages = new Stack<string>();
messages.push("primer evento");
messages.push("segundo evento");
console.log(messages.pop());`,
      hint: "Añadí el type parameter `<T>` a la declaración de la clase y usalo en lugar de `any`. Al instanciar, podés especificarlo explícitamente: `new Stack<number>()`.",
      tests: [
        {
          name: "Stack es una clase genérica",
          run: (code) => /class\s+Stack\s*<\w+>/.test(code),
        },
        {
          name: "items usa el type parameter en lugar de any",
          run: (code) =>
            !/items\s*:\s*any\[\]/.test(code) &&
            /items\s*:\s*\w+\[\]/.test(code),
        },
        {
          name: "peek() retorna el último elemento sin sacarlo",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[0] === "30";
          },
        },
        {
          name: "pop() retorna y elimina el último elemento",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[1] === "30" && output[2] === "2";
          },
        },
        {
          name: "Stack funciona también con strings",
          run: (code) => {
            const { output, error } = runCode(code);
            return !error && output[3] === "segundo evento";
          },
        },
      ],
    },
    {
      id: "ch10-07",
      title: "Resumen del capítulo",
      type: "explanation",
      content: `# Resumen - Generics

## Por qué generics

Los generics permiten escribir código que funciona con múltiples tipos **sin perder la información de tipos**. Son la alternativa tipada a \`any\`.

## Sintaxis básica

\`\`\`typescript
// Función genérica
function primero<T>(arr: T[]): T { return arr[0]; }

// Type parameter explícito
primero<string>(["a", "b"]);

// Type parameter inferido (más común)
primero(["a", "b"]); // T = string
\`\`\`

## Generic Constraints

\`\`\`typescript
// T debe tener las propiedades especificadas como mínimo
function buscar<T extends { id: number }>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}
\`\`\`

## Generic Interfaces y Clases

\`\`\`typescript
interface Caja<T> { contenido: T; }
class Pila<T> { private items: T[] = []; }
\`\`\`

## Cuándo usar generics

- La función trabaja con colecciones de cualquier tipo (\`T[]\`)
- Necesitás que el tipo de retorno dependa del tipo del argumento
- Estás creando estructuras de datos reutilizables (Stack, Queue, Repository)
- Con \`any\` perderías información que deberías preservar

## Lo que viene

El próximo capítulo cubre **Utility Types** - los tipos genéricos que TypeScript trae incorporados: \`Partial\`, \`Pick\`, \`Omit\`, \`Record\`, \`ReturnType\`, y más.
`,
    },
  ],
};
