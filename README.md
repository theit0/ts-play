# TS Play — Aprende TypeScript en español

Una plataforma web interactiva para aprender TypeScript en español, con un editor de código en tiempo real, ejercicios prácticos y seguimiento de progreso.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![CI](https://github.com/theit0/ts-play/actions/workflows/ci.yml/badge.svg)
![Vitest](https://img.shields.io/badge/Vitest-passing-6E9F18?style=flat&logo=vitest&logoColor=white)

![Performance](https://img.shields.io/lighthouse/performance/https/ts-play-online.vercel.app?label=Performance&style=flat)
![Accessibility](https://img.shields.io/lighthouse/accessibility/https/ts-play-online.vercel.app?label=Accessibility&style=flat)
![Best Practices](https://img.shields.io/lighthouse/best-practices/https/ts-play-online.vercel.app?label=Best%20Practices&style=flat)
![SEO](https://img.shields.io/lighthouse/seo/https/ts-play-online.vercel.app?label=SEO&style=flat)
---

## ¿De qué trata?

TS Play es una aplicación de aprendizaje estructurado de TypeScript diseñada para hispanohablantes. El contenido está organizado en capítulos que van desde los fundamentos hasta conceptos avanzados, con un enfoque práctico: cada tema se refuerza con ejercicios que el usuario resuelve directamente en el navegador.

La plataforma combina explicaciones claras en español con un entorno de código interactivo donde se puede escribir TypeScript real, ejecutarlo y ver los resultados al instante.

---

## Características

- **Editor Monaco integrado** — el mismo motor que usa VS Code, con resaltado de sintaxis TypeScript y detección de errores en tiempo real
- **Ejecución en el navegador** — el código TypeScript se transpila y ejecuta sin necesidad de un servidor backend
- **Visualización del JS compilado** — panel en tiempo real que muestra el JavaScript resultante de transpilar el código TypeScript del usuario
- **Sistema de tests automáticos** — cada ejercicio incluye tests que verifican si la solución es correcta
- **Progreso persistente** — el progreso y el código de cada ejercicio se guardan en `localStorage`
- **10 capítulos de contenido** — desde introducción hasta funciones avanzadas, con más de 50 lecciones
- **Dos tipos de lecciones**: explicaciones teóricas con markdown enriquecido y ejercicios interactivos con playground
- **Diseño responsive** — interfaz adaptada para móviles con sidebar drawer y tab switcher en el editor
- **Diseño dark theme** — interfaz moderna orientada a desarrolladores

---

## Capítulos disponibles

| # | Capítulo | Contenido |
|---|----------|-----------|
| 1 | Intro to TypeScript | Qué es TS, parámetros tipados, cómo funciona |
| 2 | The any type | El tipo `any`, tsconfig.json |
| 3 | TypeScript ESLint | Reglas ESLint, ban-ts-comment, tipos prohibidos |
| 4 | Primitive types | string, number, boolean, inferencia de tipos |
| 5 | Union types | Tipos de unión, type narrowing con `typeof` |
| 6 | The type alias | Aliases de tipos, reutilización |
| 7 | Arrays | Tipado de arrays, métodos |
| 8 | Tuples | Tuplas, tipos por posición |
| 9 | Literal types | Tipos literales, `const` vs `let` |
| 10 | Functions | Tipos de retorno, void, parámetros opcionales, arrow functions |
| 11 | Modules | import/export, import type |
| 12 | Objects | Tipos de objetos, duck typing, sistema estructural |
| 13 | Interfaces | Introducción a interfaces, declaration merging, extends |
| 14 | Type vs. Interface | Diferencias, cuándo usar cada uno |
| 15 | Real-life complex objects | Objetos complejos, optional chaining, propiedades anidadas |
| 16 | Callbacks | Tipado de callbacks, params y return types |
| 17 | Classes I | Clases, constructores, propiedades opcionales |
| 18 | Classes II | Visibility modifiers, parameter properties, readonly |
| 19 | Class implements | implements interface, descripción de instancias |
| 20 | Class extends | Herencia, substitutability |
| 21 | Polymorphism | Polimorfismo, refactoring con clases |
| 22 | Unknown and type narrowing | El tipo `unknown`, narrowing avanzado |
| 23 | Function overloads | Sobrecargas de función, firmas de sobrecarga |
| 24 | Misc concepts | Conceptos varios, tipos avanzados |
| 25 | Intro to generics | Problema y solución de generics, sintaxis |
| 26 | Generics (continued) | Técnica para resolver generics |
| 27 | Array generics | Generics con arrays |
| 28 | Object generics | Generics con objetos, paginado |
| 29 | Class generics | Clases genéricas, caché service |
| 30 | Generic default type | Tipos genéricos con valor por defecto |
| 31 | Multiple generic types | Múltiples parámetros de tipo |
| 32 | Generic constraints | Restricciones con `extends` |
| 33 | The keyof operator | `keyof`, acceso seguro a propiedades |
| 34 | Utility Types I | `Required`, `Partial`, `Pick`, `Omit` |
| 35 | Utility Types II | `typeof`, `ReturnType`, `Parameters`, `NonNullable` |
| 36 | Record | `Record<Keys, Type>`, casos de uso |
| 37 | Index signatures | Firmas de índice, tipos dinámicos |
| 38 | Intersection types | Tipos de intersección con `&` |
| 39 | Promises | Tipado de Promises, async/await |
| 40 | Fetch | Fetch API tipada |
| 41 | Practical fetch | Fetch práctico, uniones discriminadas |
| 42 | FetchWrapper | Clase genérica FetchWrapper |
| 43 | Intro to DOM | DOM con TypeScript, querySelector |
| 44 | HTMLElement | Interfaces HTMLElement, HTMLInputElement |
| 45 | querySelector generic | querySelector genérico tipado |
| 46 | Asserting elements | Non-null assertions, type assertions |
| 47 | querySelector deep dive | Sobrecargas de querySelector |
| 48 | querySelector summary | Proyecto registro, proyecto clima |
| 49 | querySelectorAll | `NodeListOf`, querySelectorAll genérico |
| 50 | DOM Misc | Eventos DOM, getElementById |
| 51 | DOM Projects | Proyectos DOM completos |
| 52 | Ambient modules | Módulos ambiente, extender interfaces globales |
| 53 | Migrating to TypeScript | Migración de JS a TS, proyecto final |

---

## Stack tecnológico

| Tecnología | Rol |
|-----------|-----|
| **React 18** | UI y gestión de componentes |
| **TypeScript** | Tipado estático en toda la app |
| **Vite** | Build tool y dev server |
| **React Router v6** | Navegación URL por lección (`/lesson/:lessonId`) |
| **Monaco Editor** | Editor de código embebido |
| **Babel Standalone** | Transpilación de TypeScript en el browser (carga lazy) |
| **Tailwind CSS** | Estilos utilitarios, dark theme |
| **Zustand** | Estado global (progreso, código guardado, sidebar) |
| **React Markdown** | Renderizado de contenido de lecciones |
| **ESLint + typescript-eslint** | Linting del código fuente |

---

## Correr localmente

```bash
# Clonar el repositorio
git clone https://github.com/theopelegrina/ts-play.git
cd ts-play

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

```bash
# Build para producción
npm run build

# Preview del build
npm run preview
```

---

## Estructura del proyecto

```
src/
├── components/         # Componentes React
│   ├── Sidebar.tsx     # Navegación lateral con capítulos y lecciones
│   ├── Header.tsx      # Barra superior con navegación entre lecciones
│   ├── ExplanationLesson.tsx  # Vista de lección teórica
│   └── ExerciseLesson.tsx     # Vista de ejercicio con editor + tests
├── data/
│   ├── types.ts        # Interfaces TypeScript del modelo de datos
│   ├── curriculum.ts   # Índice del currículo completo
│   └── chapters/       # Contenido por capítulo (ch01.ts – ch10.ts)
├── utils/
│   └── runner.ts       # Motor de transpilación y ejecución de código
└── store.ts            # Estado global con Zustand
```

---

## Arquitectura del playground

El playground funciona completamente en el cliente:

1. El usuario escribe TypeScript en el editor Monaco
2. El código se transpila en tiempo real con **Babel Standalone** — el JS resultante se muestra en el panel de visualización
3. Al hacer clic en **Run**, el código transpilado se ejecuta en un contexto aislado con `new Function()`, capturando el output de `console.log`
4. Los tests predefinidos de cada ejercicio analizan el código fuente y/o el output para determinar si la solución es correcta
5. El progreso se persiste en `localStorage`

---

## Autor

**Theo Pelegrina** — Frontend Engineer | Systems Engineer

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/theopelegrina)