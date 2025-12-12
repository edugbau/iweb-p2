import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LocationModel } from "../../../infrastructure/api/locationApi";

// Fix for Leaflet marker icons in React
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    locations: LocationModel[];
}

export const MapComponent = ({ locations }: MapComponentProps) => {
    return (
        <div className="h-[500px] w-full overflow-hidden rounded-2xl border border-white/40 shadow-xl shadow-indigo-500/10">
            <MapContainer center={[40.4168, -3.7038]} zoom={5} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((loc) => (
                    <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                        <Popup>
                            <div className="text-center">
                                <h3 className="font-bold">{loc.name}</h3>
                                <p className="text-sm">{loc.address}</p>
                                {loc.image_url && (
                                    <img
                                        src={loc.image_url}
                                        alt={loc.name}
                                        className="mt-2 h-24 w-full rounded object-cover"
                                    />
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
