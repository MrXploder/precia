/**
 * Global type declarations for the Precia Vite app.
 *
 * `@mrxploder/saxvue` ships its own full type declarations — no augmentation
 * needed here. Only the CSS side-effect import path requires a manual
 * declaration because TypeScript does not recognise bare CSS imports without it.
 */

/// <reference types="vite/client" />

// Allow importing the SaxVue stylesheet as a side-effect.
declare module "@mrxploder/saxvue/dist/saxvue.css" {}
