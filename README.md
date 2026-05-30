# TS Play - Aprende TypeScript en español

Una plataforma web interactiva para aprender TypeScript en español, con un editor de código en tiempo real, ejercicios prácticos y seguimiento de progreso.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![CI](https://github.com/theit0/ts-play/actions/workflows/ci.yml/badge.svg)
![Vitest](https://img.shields.io/badge/Vitest-passing-6E9F18?style=flat&logo=vitest&logoColor=white)
---

## ¿De qué trata?

TS Play es una aplicación de aprendizaje estructurado de TypeScript diseñada para hispanohablantes. El contenido está organizado en capítulos que van desde los fundamentos hasta conceptos avanzados, con un enfoque práctico: cada tema se refuerza con ejercicios que el usuario resuelve directamente en el navegador.

La plataforma combina explicaciones claras en español con un entorno de código interactivo donde se puede escribir TypeScript real, ejecutarlo y ver los resultados al instante.

---

## Características

- **Editor Monaco integrado** - el mismo motor que usa VS Code, con resaltado de sintaxis TypeScript y detección de errores en tiempo real
- **Ejecución en el navegador** - el código TypeScript se transpila y ejecuta sin necesidad de un servidor backend
- **Visualización del JS compilado** - panel en tiempo real que muestra el JavaScript resultante de transpilar el código TypeScript del usuario
- **Sistema de tests automáticos** - cada ejercicio incluye tests que verifican si la solución es correcta
- **Progreso persistente** - el progreso y el código de cada ejercicio se guardan en `localStorage`
- **13 capítulos de contenido** - desde introducción hasta tipos avanzados y módulos, con más de 80 lecciones
- **Dos tipos de lecciones**: explicaciones teóricas con markdown enriquecido y ejercicios interactivos con playground
- **Diseño responsive** - interfaz adaptada para móviles con sidebar drawer y tab switcher en el editor
- **Diseño dark theme** - interfaz moderna orientada a desarrolladores

---

## Capítulos disponibles

| # | Capítulo | Contenido |
|---|----------|-----------|
| 1 | Introduction to TypeScript | TS vs JS, interoperabilidad, tsconfig, primera anotación |
| 2 | TypeScript ESLint | Reglas ESLint, `ban-ts-comment`, tipos prohibidos, `no-explicit-any` |
| 3 | TypeScript Types | Primitivos, arrays, tuples, enums, `any` vs `unknown`, `never`, inferencia |
| 4 | Assertions & Special Syntax | Type assertions, `as const`, non-null assertion, `satisfies` |
| 5 | Combining Types | Union types, intersection types, type aliases, `keyof` |
| 6 | Type Guards / Narrowing | `typeof`, truthiness, `instanceof`, type predicates |
| 7 | TypeScript Functions | Tipado de funciones, parámetros default y rest, overloading |
| 8 | TypeScript Interfaces | Interface declaration, extending, types vs interfaces |
| 9 | Classes | Constructor shorthand, access modifiers, abstract classes, herencia |
| 10 | Generics | Generic types, constraints, generic interfaces y clases |
| 11 | Utility Types | `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `ReturnType`, `Parameters` |
| 12 | Advanced Types | Mapped types, conditional types, template literal types, recursive types |
| 13 | TypeScript Modules | ES modules, declaration merging, namespaces, ambient modules |

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

## Arquitectura del playground

El playground funciona completamente en el cliente:

1. El usuario escribe TypeScript en el editor Monaco
2. El código se transpila en tiempo real con **Babel Standalone** - el JS resultante se muestra en el panel de visualización
3. Al hacer clic en **Run**, el código transpilado se ejecuta en un contexto aislado con `new Function()`, capturando el output de `console.log`
4. Los tests predefinidos de cada ejercicio analizan el código fuente y/o el output para determinar si la solución es correcta
5. El progreso se persiste en `localStorage`

---

## Autor

**Theo Pelegrina** - Frontend Engineer | Systems Engineer

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/theopelegrina)