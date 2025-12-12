import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { CreateLocationForm } from "../components/forms/CreateLocationForm";
import { MapComponent } from "../components/map/MapComponent";
import { locationApi } from "../../infrastructure/api/locationApi";
import type { LocationModel } from "../../infrastructure/api/locationApi";

export const HomePage = () => {
    const { logout } = useAuth();
    const [locations, setLocations] = useState<LocationModel[]>([]);

    const fetchLocations = async () => {
        try {
            const data = await locationApi.getAll();
            setLocations(data);
        } catch (error) {
            console.error("Failed to fetch locations", error);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-purple-100 to-teal-100 p-8">
            <header className="mb-8 flex items-center justify-between rounded-2xl border border-white/40 bg-white/80 p-6 shadow-xl shadow-indigo-500/10 backdrop-blur-xl">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">MiMapa Interactive</h1>
                <button
                    onClick={logout}
                    className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
                >
                    Logout
                </button>
            </header>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Form */}
                <div className="lg:col-span-1">
                    <CreateLocationForm onSuccess={fetchLocations} />

                    <div className="mt-8 rounded-2xl border border-white/40 bg-white/60 p-6 backdrop-blur-md">
                        <h3 className="mb-2 font-bold text-slate-800">Instructions</h3>
                        <ul className="list-inside list-disc space-y-2 text-sm text-slate-600">
                            <li>Enter a location name (e.g. "My favorite cafe").</li>
                            <li>Enter an address (e.g. "Gran Via 1, Madrid").</li>
                            <li>Upload an image.</li>
                            <li>The system will automatically find coordinates.</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column: Map */}
                <div className="lg:col-span-2">
                    <MapComponent locations={locations} />
                </div>
            </div>
        </div>
    );
};
