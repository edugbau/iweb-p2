import { use_server_wake } from '../context/ServerWakeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

/**
 * Banner que se muestra cuando el servidor de Render está despertando.
 * El plan gratuito de Render apaga el servidor después de 15 minutos de inactividad
 * y tarda aproximadamente 60 segundos en reactivarse.
 */
export const ServerWakeBanner = () => {
    const { is_waking_up, retry_count } = use_server_wake();

    if (!is_waking_up) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#FFD027] border-b-4 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] p-3">
            <div className="flex items-center justify-center gap-3">
                <FontAwesomeIcon 
                    icon={faSpinner} 
                    className="text-xl text-black animate-spin" 
                />
                <div className="text-center">
                    <p className="font-black text-black text-sm uppercase">
                        Despertando servidor...
                    </p>
                    <p className="text-xs text-black/80 mt-1">
                        El plan gratuito de Render apaga el servidor después de 15 minutos de inactividad.
                        {retry_count > 0 && ` Reintentando... (${retry_count})`}
                    </p>
                    <p className="text-xs text-black/70 mt-1">
                        Esto puede tardar hasta 60 segundos. Por favor, espera...
                    </p>
                </div>
            </div>
        </div>
    );
};
