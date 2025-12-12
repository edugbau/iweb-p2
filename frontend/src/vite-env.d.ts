/// <reference types="vite/client" />

/**
 * Declaraciones de tipos para variables de entorno de Vite.
 */
interface ImportMetaEnv {
    readonly VITE_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

/**
 * Declaraciones para importar imágenes.
 */
declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.svg' {
    const value: string;
    export default value;
}
