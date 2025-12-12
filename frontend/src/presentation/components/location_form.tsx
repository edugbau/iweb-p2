/**
 * Formulario para crear/editar ubicaciones.
 * Incluye campos para título, descripción, dirección e imagen.
 */

import { useState, FormEvent, useRef } from 'react';

/**
 * Props del formulario de ubicación.
 */
interface Location_Form_Props {
    /** Callback cuando se envía el formulario */
    on_submit: (title: string, address: string, description?: string, image?: File) => Promise<void>;
    /** Indica si está procesando */
    is_loading?: boolean;
    /** Callback para cerrar el formulario */
    on_close?: () => void;
}

/**
 * Formulario glassmorphism para crear ubicaciones.
 * @param props - Props del componente.
 * @returns Componente JSX del formulario.
 */
export const LocationForm = ({ on_submit, is_loading, on_close }: Location_Form_Props) => {
    const [title, set_title] = useState('');
    const [address, set_address] = useState('');
    const [description, set_description] = useState('');
    const [image, set_image] = useState<File | null>(null);
    const [preview, set_preview] = useState<string | null>(null);
    const [error, set_error] = useState<string | null>(null);
    const file_input_ref = useRef<HTMLInputElement>(null);

    /**
     * Maneja el cambio de imagen.
     * @param e - Evento de cambio del input file.
     */
    const handle_image_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            set_image(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                set_preview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    /**
     * Maneja el envío del formulario.
     * @param e - Evento del formulario.
     */
    const handle_submit = async (e: FormEvent) => {
        e.preventDefault();
        set_error(null);

        if (!title.trim() || !address.trim()) {
            set_error('El título y la dirección son obligatorios');
            return;
        }

        try {
            await on_submit(title, address, description || undefined, image || undefined);
            // Limpiar formulario
            set_title('');
            set_address('');
            set_description('');
            set_image(null);
            set_preview(null);
            on_close?.();
        } catch (err) {
            set_error('Error al crear la ubicación. Verifica la dirección e intenta de nuevo.');
        }
    };

    return (
        <form
            onSubmit={handle_submit}
            className="glass-card p-6 space-y-4"
            aria-label="Formulario para crear ubicación"
        >
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-map-pin text-indigo-600" aria-hidden="true"></i>
                Nueva ubicación
            </h2>

            {/* Campo Título */}
            <div>
                <label htmlFor="location-title" className="form-label">
                    Título *
                </label>
                <input
                    id="location-title"
                    type="text"
                    value={title}
                    onChange={(e) => set_title(e.target.value)}
                    className="glass-input"
                    placeholder="Ej: Mi cafetería favorita"
                    required
                    aria-required="true"
                />
            </div>

            {/* Campo Dirección */}
            <div>
                <label htmlFor="location-address" className="form-label">
                    Dirección *
                </label>
                <input
                    id="location-address"
                    type="text"
                    value={address}
                    onChange={(e) => set_address(e.target.value)}
                    className="glass-input"
                    placeholder="Ej: Calle Gran Vía 42, Madrid"
                    required
                    aria-required="true"
                    aria-describedby="address-help"
                />
                <p id="address-help" className="text-xs text-slate-500 mt-1">
                    Se geocodificará automáticamente para obtener las coordenadas
                </p>
            </div>

            {/* Campo Descripción */}
            <div>
                <label htmlFor="location-description" className="form-label">
                    Descripción
                </label>
                <textarea
                    id="location-description"
                    value={description}
                    onChange={(e) => set_description(e.target.value)}
                    className="glass-input resize-none"
                    rows={3}
                    placeholder="Describe este lugar..."
                />
            </div>

            {/* Campo Imagen */}
            <div>
                <label htmlFor="location-image" className="form-label">
                    Imagen
                </label>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => file_input_ref.current?.click()}
                        className="btn-secondary text-sm"
                        aria-label="Seleccionar imagen"
                    >
                        <i className="fas fa-image" aria-hidden="true"></i>
                        {image ? 'Cambiar imagen' : 'Subir imagen'}
                    </button>
                    <input
                        ref={file_input_ref}
                        id="location-image"
                        type="file"
                        accept="image/*"
                        onChange={handle_image_change}
                        className="hidden"
                        aria-describedby="image-help"
                    />
                    {image && (
                        <span className="text-sm text-slate-600">{image.name}</span>
                    )}
                </div>
                <p id="image-help" className="text-xs text-slate-500 mt-1">
                    Formatos: JPG, PNG, WebP. Máximo 5MB.
                </p>

                {/* Preview de imagen */}
                {preview && (
                    <div className="mt-3 relative">
                        <img
                            src={preview}
                            alt="Vista previa"
                            className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={() => { set_image(null); set_preview(null); }}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            aria-label="Eliminar imagen"
                        >
                            <i className="fas fa-times" aria-hidden="true"></i>
                        </button>
                    </div>
                )}
            </div>

            {/* Mensaje de error */}
            {error && (
                <div
                    className="error-message flex items-center gap-2 p-3 bg-red-50 rounded-lg"
                    role="alert"
                >
                    <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                    {error}
                </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={is_loading}
                    aria-busy={is_loading}
                >
                    {is_loading ? (
                        <>
                            <div className="spinner w-5 h-5 border-2" aria-hidden="true"></div>
                            Creando...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-plus" aria-hidden="true"></i>
                            Crear ubicación
                        </>
                    )}
                </button>

                {on_close && (
                    <button
                        type="button"
                        onClick={on_close}
                        className="btn-secondary"
                        aria-label="Cancelar"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};
