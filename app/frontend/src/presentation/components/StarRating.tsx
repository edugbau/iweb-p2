import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface StarRatingProps {
    /** Valoración actual de 0 a 5 */
    rating: number;
    /** Si se puede editar la valoración */
    editable?: boolean;
    /** Callback cuando cambia la valoración */
    on_change?: (rating: number) => void;
    /** Tamaño de las estrellas */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Componente para mostrar y editar valoraciones con estrellas.
 * @param props Propiedades del componente.
 * @returns Componente de valoración con estrellas.
 */
export const StarRating = ({ 
    rating, 
    editable = false, 
    on_change, 
    size = 'md' 
}: StarRatingProps) => {
    const size_classes = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-2xl'
    };

    /**
     * Maneja el click en una estrella.
     * @param star_value Valor de la estrella clickeada.
     */
    const handle_click = (star_value: number) => {
        if (editable && on_change) {
            on_change(star_value);
        }
    };

    return (
        <div 
            className={`flex items-center gap-0.5 ${size_classes[size]}`}
            role="group"
            aria-label={`Valoración: ${rating} de 5 estrellas`}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handle_click(star)}
                    disabled={!editable}
                    className={`
                        ${editable ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
                        focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 rounded
                    `}
                    aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
                >
                    <FontAwesomeIcon
                        icon={faStar}
                        className={star <= rating ? 'text-amber-400' : 'text-slate-300'}
                    />
                </button>
            ))}
            <span className="ml-2 text-slate-600 font-medium text-sm">
                ({rating}/5)
            </span>
        </div>
    );
};
