import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faUser, faCalendar, faImage } from '@fortawesome/free-solid-svg-icons';
import { StarRating } from './StarRating';
import type { Review_Model } from '../../domain/models/Review';

interface ReviewCardProps {
    /** Datos de la reseña a mostrar */
    review: Review_Model;
    /** Callback cuando se clickea la tarjeta */
    on_click?: () => void;
}

/**
 * Componente de tarjeta para mostrar resumen de una reseña.
 * Usa estilo glassmorphism según las especificaciones del proyecto.
 * @param props Propiedades del componente.
 * @returns Tarjeta de reseña con información resumida.
 */
export const ReviewCard = ({ review, on_click }: ReviewCardProps) => {
    /**
     * Formatea una fecha a formato legible.
     * @param date Fecha a formatear.
     * @returns Fecha formateada en español.
     */
    const format_date = (date: Date | string): string => {
        const d = new Date(date);
        return d.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <article
            onClick={on_click}
            className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/80 p-5 shadow-xl shadow-indigo-500/10 backdrop-blur-xl transition-all hover:bg-white/90 hover:-translate-y-1 hover:shadow-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
            tabIndex={0}
            role="button"
            aria-label={`Ver detalles de ${review.establishment_name}`}
            onKeyDown={(e) => e.key === 'Enter' && on_click?.()}
        >
            {/* Decorative blob */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl group-hover:bg-purple-500/30 transition-colors" />
            
            {/* Image section */}
            {review.image_urls && review.image_urls.length > 0 ? (
                <div className="relative h-40 -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-2xl">
                    <img
                        src={review.image_urls[0]}
                        alt={`Imagen de ${review.establishment_name}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {review.image_urls.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <FontAwesomeIcon icon={faImage} />
                            <span>+{review.image_urls.length - 1}</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative h-32 -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faImage} className="text-4xl text-indigo-300" />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10">
                {/* Title and Rating */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight line-clamp-1">
                        {review.establishment_name}
                    </h3>
                </div>
                
                <StarRating rating={review.rating} size="sm" />

                {/* Address */}
                <div className="flex items-start gap-2 mt-3 text-slate-600">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium line-clamp-2">{review.address}</p>
                </div>

                {/* Coordinates */}
                <div className="mt-2 text-xs text-slate-500 font-mono bg-slate-100/60 rounded-lg px-2 py-1 inline-block">
                    📍 {review.latitude.toFixed(6)}, {review.longitude.toFixed(6)}
                </div>

                {/* Footer: Author and Date */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <FontAwesomeIcon icon={faUser} className="text-slate-400" />
                        <span className="font-medium truncate max-w-[120px]">
                            {review.author_name || review.author_email.split('@')[0]}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <FontAwesomeIcon icon={faCalendar} className="text-slate-400" />
                        <time dateTime={new Date(review.created_at).toISOString()}>
                            {format_date(review.created_at)}
                        </time>
                    </div>
                </div>
            </div>
        </article>
    );
};
