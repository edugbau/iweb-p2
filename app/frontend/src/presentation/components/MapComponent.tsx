import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import type { Review_Model } from '../../domain/models/Review';
import { StarRating } from './StarRating';

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    /** Latitud inicial del centro del mapa */
    initial_lat?: number;
    /** Longitud inicial del centro del mapa */
    initial_lng?: number;
    /** Lista de reseñas para mostrar como marcadores */
    reviews?: Review_Model[];
    /** Callback cuando se selecciona una reseña */
    on_review_select?: (review: Review_Model) => void;
    /** Función para geocodificar direcciones */
    on_geocode?: (address: string) => Promise<{ latitude: number; longitude: number }>;
}

/**
 * Componente interno para mover el mapa a una ubicación.
 */
const MapController = ({ center }: { center: [number, number] | null }) => {
    const map = useMap();
    
    useEffect(() => {
        if (center) {
            map.flyTo(center, 15, { duration: 1.5 });
        }
    }, [center, map]);
    
    return null;
};

/**
 * Componente de mapa interactivo con marcadores de reseñas y búsqueda.
 * Permite buscar direcciones y ver reseñas en el mapa.
 * @param props Propiedades del componente.
 * @returns Mapa interactivo con funcionalidades de búsqueda.
 */
export const MapComponent = ({ 
    initial_lat = 40.4168, 
    initial_lng = -3.7038, 
    reviews = [],
    on_review_select,
    on_geocode
}: MapComponentProps) => {
    const [search_address, set_search_address] = useState('');
    const [is_searching, set_is_searching] = useState(false);
    const [search_error, set_search_error] = useState<string | null>(null);
    const [map_center, set_map_center] = useState<[number, number] | null>(null);
    const [search_marker, set_search_marker] = useState<[number, number] | null>(null);

    /**
     * Maneja la búsqueda de una dirección.
     * @param e Evento de submit del formulario.
     */
    const handle_search = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!search_address.trim() || !on_geocode) return;
        
        set_is_searching(true);
        set_search_error(null);
        
        try {
            const result = await on_geocode(search_address);
            const new_center: [number, number] = [result.latitude, result.longitude];
            set_map_center(new_center);
            set_search_marker(new_center);
        } catch (error: any) {
            set_search_error(error.response?.data?.detail || 'Dirección no encontrada');
            set_search_marker(null);
        } finally {
            set_is_searching(false);
        }
    };

    return (
        <div className="relative h-full w-full flex flex-col">
            {/* Search Bar */}
            {on_geocode && (
                <div className="absolute top-4 left-4 right-4 z-[1000]">
                    <form 
                        onSubmit={handle_search}
                        className="flex gap-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg shadow-indigo-500/10 p-2 border border-white/40"
                    >
                        <div className="flex-1 relative">
                            <FontAwesomeIcon 
                                icon={faMapMarkerAlt} 
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={search_address}
                                onChange={(e) => set_search_address(e.target.value)}
                                placeholder="Buscar dirección..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none transition-all text-slate-700 text-sm"
                                aria-label="Dirección a buscar"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={is_searching || !search_address.trim()}
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2"
                            aria-label="Buscar"
                        >
                            {is_searching ? (
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                            ) : (
                                <FontAwesomeIcon icon={faSearch} />
                            )}
                            <span className="hidden sm:inline">Buscar</span>
                        </button>
                    </form>
                    
                    {search_error && (
                        <div className="mt-2 p-3 bg-red-50/95 backdrop-blur-sm border border-red-200 rounded-xl text-red-700 text-sm">
                            {search_error}
                        </div>
                    )}
                </div>
            )}

            {/* Map */}
            <MapContainer 
                center={[initial_lat, initial_lng]} 
                zoom={13} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%' }}
                className="rounded-2xl"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapController center={map_center} />

                {/* Search Result Marker */}
                {search_marker && (
                    <Marker position={search_marker}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-semibold text-slate-700">Ubicación buscada</p>
                                <p className="text-xs text-slate-500 mt-1">{search_address}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Review Markers */}
                {reviews.map((review) => (
                    <Marker 
                        key={review.id} 
                        position={[review.latitude, review.longitude]}
                        eventHandlers={{
                            click: () => on_review_select?.(review)
                        }}
                    >
                        <Popup>
                            <div className="min-w-[200px]">
                                {review.image_urls && review.image_urls.length > 0 && (
                                    <img 
                                        src={review.image_urls[0]} 
                                        alt={review.establishment_name}
                                        className="w-full h-24 object-cover rounded-lg mb-2"
                                    />
                                )}
                                <h3 className="font-bold text-slate-800 text-sm">
                                    {review.establishment_name}
                                </h3>
                                <div className="my-1">
                                    <StarRating rating={review.rating} size="sm" />
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2">
                                    {review.address}
                                </p>
                                <button
                                    onClick={() => on_review_select?.(review)}
                                    className="mt-2 w-full py-1.5 bg-indigo-500 text-white text-xs font-semibold rounded-lg hover:bg-indigo-600 transition-colors"
                                >
                                    Ver detalle
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

