import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faUpload, 
    faSpinner, 
    faMapMarkerAlt,
    faStore,
    faImage,
    faTrash
} from '@fortawesome/free-solid-svg-icons';
import { StarRating } from './StarRating';

interface ReviewFormProps {
    /** Si el formulario está visible */
    is_open: boolean;
    /** Callback para cerrar el formulario */
    on_close: () => void;
    /** Callback cuando se envía el formulario */
    on_submit: (form_data: FormData) => Promise<void>;
    /** Si el formulario está procesando */
    is_loading?: boolean;
}

/**
 * Formulario modal para crear nuevas reseñas.
 * Incluye campos para nombre, dirección, valoración e imágenes.
 * @param props Propiedades del componente.
 * @returns Formulario modal de creación de reseña.
 */
export const ReviewForm = ({ is_open, on_close, on_submit, is_loading = false }: ReviewFormProps) => {
    const [establishment_name, set_establishment_name] = useState('');
    const [address, set_address] = useState('');
    const [rating, set_rating] = useState(3);
    const [images, set_images] = useState<File[]>([]);
    const [image_previews, set_image_previews] = useState<string[]>([]);
    const [error, set_error] = useState<string | null>(null);
    const file_input_ref = useRef<HTMLInputElement>(null);

    /**
     * Maneja la selección de archivos de imagen.
     * @param e Evento de cambio del input file.
     */
    const handle_file_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length > 5) {
            set_error('Máximo 5 imágenes permitidas');
            return;
        }
        
        set_images(prev => [...prev, ...files]);
        
        // Crear previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                set_image_previews(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
        set_error(null);
    };

    /**
     * Elimina una imagen de la lista.
     * @param index Índice de la imagen a eliminar.
     */
    const remove_image = (index: number) => {
        set_images(prev => prev.filter((_, i) => i !== index));
        set_image_previews(prev => prev.filter((_, i) => i !== index));
    };

    /**
     * Maneja el envío del formulario.
     * @param e Evento de submit del formulario.
     */
    const handle_submit = async (e: React.FormEvent) => {
        e.preventDefault();
        set_error(null);
        
        if (!establishment_name.trim()) {
            set_error('El nombre del establecimiento es obligatorio');
            return;
        }
        if (!address.trim()) {
            set_error('La dirección es obligatoria');
            return;
        }

        const form_data = new FormData();
        form_data.append('establishment_name', establishment_name);
        form_data.append('address', address);
        form_data.append('rating', rating.toString());
        
        images.forEach((image) => {
            form_data.append('images', image);
        });

        try {
            await on_submit(form_data);
            // Reset form
            set_establishment_name('');
            set_address('');
            set_rating(3);
            set_images([]);
            set_image_previews([]);
            on_close();
        } catch (err: any) {
            set_error(err.response?.data?.detail || 'Error al crear la reseña');
        }
    };

    /**
     * Cierra el modal y resetea el formulario.
     */
    const handle_close = () => {
        set_establishment_name('');
        set_address('');
        set_rating(3);
        set_images([]);
        set_image_previews([]);
        set_error(null);
        on_close();
    };

    if (!is_open) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && handle_close()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
        >
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/20 border border-white/40">
                {/* Header */}
                <div className="sticky top-0 bg-white/90 backdrop-blur-lg px-6 py-4 border-b border-slate-200/60 rounded-t-3xl flex items-center justify-between z-10">
                    <h2 id="form-title" className="text-xl font-bold text-slate-800 tracking-tight">
                        Nueva Reseña
                    </h2>
                    <button
                        onClick={handle_close}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        aria-label="Cerrar formulario"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handle_submit} className="p-6 space-y-5">
                    {/* Error message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Establishment Name */}
                    <div>
                        <label htmlFor="establishment_name" className="block text-sm font-semibold text-slate-700 mb-2">
                            <FontAwesomeIcon icon={faStore} className="mr-2 text-indigo-500" />
                            Nombre del Establecimiento *
                        </label>
                        <input
                            type="text"
                            id="establishment_name"
                            value={establishment_name}
                            onChange={(e) => set_establishment_name(e.target.value)}
                            placeholder="Ej: Casa Lola"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none transition-all text-slate-700"
                            required
                            maxLength={200}
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-indigo-500" />
                            Dirección Postal *
                        </label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => set_address(e.target.value)}
                            placeholder="Ej: Calle Granada 46, Málaga"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none transition-all text-slate-700"
                            required
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            Las coordenadas GPS se calcularán automáticamente
                        </p>
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Valoración *
                        </label>
                        <StarRating 
                            rating={rating} 
                            editable 
                            on_change={set_rating}
                            size="lg"
                        />
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            <FontAwesomeIcon icon={faImage} className="mr-2 text-indigo-500" />
                            Imágenes (opcional, máx. 5)
                        </label>
                        
                        <input
                            ref={file_input_ref}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handle_file_change}
                            className="hidden"
                            aria-describedby="image-help"
                        />
                        
                        <button
                            type="button"
                            onClick={() => file_input_ref.current?.click()}
                            disabled={images.length >= 5}
                            className="w-full py-3 px-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <FontAwesomeIcon icon={faUpload} />
                            <span>Seleccionar Imágenes</span>
                        </button>
                        <p id="image-help" className="mt-1 text-xs text-slate-500">
                            Formatos: JPEG, PNG, WebP
                        </p>

                        {/* Image Previews */}
                        {image_previews.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {image_previews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => remove_image(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label={`Eliminar imagen ${index + 1}`}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={is_loading}
                        className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                    >
                        {is_loading ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                <span>Creando...</span>
                            </>
                        ) : (
                            <span>Crear Reseña</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
