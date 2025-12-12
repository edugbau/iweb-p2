/**
 * Componente MapView con Leaflet.
 * Muestra el mapa con los marcadores de ubicaciones.
 */

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import type { Location_Model } from '../../domain/models';
import 'leaflet/dist/leaflet.css';

// Fix para iconos de Leaflet en Vite
import L from 'leaflet';

// Configurar iconos por defecto con URLs directas
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * Props del componente MapView.
 */
interface Map_View_Props {
    /** Lista de ubicaciones a mostrar */
    locations: Location_Model[];
    /** Centro inicial del mapa */
    center?: LatLngTuple;
    /** Nivel de zoom inicial */
    zoom?: number;
    /** Callback cuando se selecciona una ubicación */
    on_location_select?: (location: Location_Model) => void;
}

/**
 * Vista del mapa con marcadores interactivos.
 * @param props - Props del componente.
 * @returns Componente JSX del mapa.
 */
export const MapView = ({
    locations,
    center = [40.4168, -3.7038],  // Madrid por defecto
    zoom = 6,
    on_location_select
}: Map_View_Props) => {
    return (
        <div className="map-container" role="application" aria-label="Mapa interactivo de ubicaciones">
            <MapContainer
                center={center}
                zoom={zoom}
                className="h-full w-full"
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {locations.map((location) => (
                    <Marker
                        key={location.id}
                        position={[location.latitude, location.longitude]}
                        eventHandlers={{
                            click: () => on_location_select?.(location),
                        }}
                    >
                        <Popup>
                            <div className="p-2 min-w-48">
                                {location.image_url && (
                                    <img
                                        src={location.image_url}
                                        alt={`Imagen de ${location.title}`}
                                        className="marker-image"
                                    />
                                )}
                                <h3 className="font-bold text-slate-800 text-base mb-1">
                                    {location.title}
                                </h3>
                                {location.description && (
                                    <p className="text-slate-600 text-sm mb-2">
                                        {location.description}
                                    </p>
                                )}
                                <p className="text-slate-500 text-xs flex items-center gap-1">
                                    <i className="fas fa-map-marker-alt text-indigo-500" aria-hidden="true"></i>
                                    {location.address}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
