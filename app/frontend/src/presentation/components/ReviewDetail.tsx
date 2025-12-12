import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faMapMarkerAlt, 
    faUser, 
    faCalendar, 
    faKey,
    faClock,
    faEnvelope,
    faChevronLeft,
    faChevronRight,
    faTrash
} from '@fortawesome/free-solid-svg-icons';
import { StarRating } from './StarRating';
import type { Review_Model } from '../../domain/models/Review';

interface ReviewDetailProps {
    /** Reseña a mostrar */
    review: Review_Model | null;
    /** Callback para cerrar el detalle */
    on_close: () => void;
    /** Callback para eliminar la reseña */
    on_delete?: (id: string) => void;
    /** Email del usuario actual para mostrar botón eliminar */
    current_user_email?: string;
}

/**
 * Componente modal para mostrar el detalle completo de una reseña.
 * Incluye galería de imágenes, información del autor y token OAuth.
 * @param props Propiedades del componente.
 * @returns Modal con detalle de reseña.
 */
export const ReviewDetail = ({ 
    review, 
    on_close, 
    on_delete,
    current_user_email 
}: ReviewDetailProps) => {
    const [current_image_index, set_current_image_index] = useState(0);
    const [confirm_delete, set_confirm_delete] = useState(false);

    if (!review) return null;

    /**
     * Formatea una fecha a formato legible con hora.
     * @param date Fecha a formatear.
     * @returns Fecha y hora formateadas en español.
     */
    const format_date_time = (date: Date | string): string => {
        const d = new Date(date);
        return d.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    /**
     * Navega a la imagen anterior.
     */
    const prev_image = () => {
        set_current_image_index((prev) => 
            prev === 0 ? review.image_urls.length - 1 : prev - 1
        );
    };

    /**
     * Navega a la siguiente imagen.
     */
    const next_image = () => {
        set_current_image_index((prev) => 
            prev === review.image_urls.length - 1 ? 0 : prev + 1
        );
    };

    /**
     * Maneja la confirmación de eliminación.
     */
    const handle_delete = () => {
        if (confirm_delete && on_delete) {
            on_delete(review.id);
            on_close();
        } else {
            set_confirm_delete(true);
        }
    };

    const can_delete = current_user_email === review.author_email;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && on_close()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
        >
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/20 border border-white/40">
                {/* Close Button */}
                <button
                    onClick={on_close}
                    className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white/80 text-slate-500 hover:text-slate-700 hover:bg-white transition-colors shadow-lg"
                    aria-label="Cerrar detalle"
                >
                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>

                {/* Image Gallery */}
                {review.image_urls && review.image_urls.length > 0 ? (
                    <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-3xl bg-slate-100">
                        <img
                            src={review.image_urls[current_image_index]}
                            alt={`${review.establishment_name} - Imagen ${current_image_index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        
                        {review.image_urls.length > 1 && (
                            <>
                                <button
                                    onClick={prev_image}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 text-slate-700 hover:bg-white transition-colors shadow-lg"
                                    aria-label="Imagen anterior"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                <button
                                    onClick={next_image}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 text-slate-700 hover:bg-white transition-colors shadow-lg"
                                    aria-label="Siguiente imagen"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {review.image_urls.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => set_current_image_index(idx)}
                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                idx === current_image_index 
                                                    ? 'bg-white' 
                                                    : 'bg-white/50 hover:bg-white/70'
                                            }`}
                                            aria-label={`Ver imagen ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-t-3xl" />
                )}

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Title and Rating */}
                    <div>
                        <h2 id="detail-title" className="text-2xl font-bold text-slate-800 tracking-tight mb-2">
                            {review.establishment_name}
                        </h2>
                        <StarRating rating={review.rating} size="lg" />
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3 p-4 bg-slate-50/80 rounded-xl">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-500 text-xl mt-0.5" />
                        <div>
                            <p className="font-semibold text-slate-700">{review.address}</p>
                            <p className="text-sm text-slate-500 font-mono mt-1">
                                Lon: {review.longitude.toFixed(7)}, Lat: {review.latitude.toFixed(7)}
                            </p>
                        </div>
                    </div>

                    {/* Author Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-slate-50/80 rounded-xl">
                            <FontAwesomeIcon icon={faUser} className="text-indigo-500 text-lg" />
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Autor</p>
                                <p className="font-semibold text-slate-700">{review.author_name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50/80 rounded-xl">
                            <FontAwesomeIcon icon={faEnvelope} className="text-indigo-500 text-lg" />
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                                <p className="font-semibold text-slate-700 text-sm truncate">
                                    {review.author_email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-slate-50/80 rounded-xl">
                            <FontAwesomeIcon icon={faCalendar} className="text-indigo-500 text-lg" />
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Fecha Creación</p>
                                <time 
                                    dateTime={new Date(review.created_at).toISOString()}
                                    className="font-semibold text-slate-700 text-sm"
                                >
                                    {format_date_time(review.created_at)}
                                </time>
                            </div>
                        </div>
                        {review.expires_at && (
                            <div className="flex items-center gap-3 p-4 bg-slate-50/80 rounded-xl">
                                <FontAwesomeIcon icon={faClock} className="text-amber-500 text-lg" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Caducidad Token</p>
                                    <time 
                                        dateTime={new Date(review.expires_at).toISOString()}
                                        className="font-semibold text-slate-700 text-sm"
                                    >
                                        {format_date_time(review.expires_at)}
                                    </time>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* OAuth Token */}
                    {review.auth_token && (
                        <div className="p-4 bg-slate-50/80 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <FontAwesomeIcon icon={faKey} className="text-indigo-500" />
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Token OAuth</p>
                            </div>
                            <div className="bg-slate-100 rounded-lg p-3 font-mono text-xs text-slate-600 break-all max-h-24 overflow-y-auto">
                                {review.auth_token}
                            </div>
                        </div>
                    )}

                    {/* Delete Button (only for owner) */}
                    {can_delete && on_delete && (
                        <div className="pt-4 border-t border-slate-200">
                            <button
                                onClick={handle_delete}
                                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                                    confirm_delete
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                                }`}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                <span>{confirm_delete ? 'Confirmar Eliminación' : 'Eliminar Reseña'}</span>
                            </button>
                            {confirm_delete && (
                                <button
                                    onClick={() => set_confirm_delete(false)}
                                    className="w-full mt-2 py-2 text-slate-500 hover:text-slate-700 text-sm"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
