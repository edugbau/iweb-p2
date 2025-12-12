/**
 * Componente de Loading/Spinner.
 */

interface Loading_Props {
    /** Mensaje a mostrar */
    message?: string;
}

/**
 * Indicador de carga con estilo glassmorphism.
 * @param props - Props del componente.
 * @returns Componente JSX del loader.
 */
export const Loading = ({ message = 'Cargando...' }: Loading_Props) => {
    return (
        <div
            className="flex flex-col items-center justify-center gap-4 p-8"
            role="status"
            aria-live="polite"
        >
            <div className="spinner" aria-hidden="true"></div>
            <p className="text-slate-600 font-medium">{message}</p>
        </div>
    );
};
