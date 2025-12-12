import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState } from 'react';

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    initialLat?: number;
    initialLng?: number;
    onLocationSelect?: (lat: number, lng: number) => void;
    markers?: Array<{lat: number, lng: number, title: string}>;
}

const LocationMarker = ({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) => {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            if (onLocationSelect) {
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            }
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Ubicación seleccionada</Popup>
        </Marker>
    );
}

export const MapComponent = ({ initialLat = 40.4168, initialLng = -3.7038, onLocationSelect, markers = [] }: MapComponentProps) => {
    return (
        <MapContainer 
            center={[initialLat, initialLng]} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <LocationMarker onLocationSelect={onLocationSelect} />

            {markers.map((marker, idx) => (
                <Marker key={idx} position={[marker.lat, marker.lng]}>
                    <Popup>{marker.title}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

