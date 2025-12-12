import { useState } from "react";
import type { FormEvent } from "react";
import { locationApi } from "../../../infrastructure/api/locationApi";

interface CreateLocationFormProps {
    onSuccess: () => void;
}

export const CreateLocationForm = ({ onSuccess }: CreateLocationFormProps) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError("Please select an image");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("address", address);
            formData.append("file", file);
            // In a real app we would get this from Context/JWT
            formData.append("owner_email", "user@example.com");

            await locationApi.create(formData);
            // Reset form
            setName("");
            setAddress("");
            setFile(null);
            onSuccess();
        } catch (err) {
            console.error(err);
            setError("Failed to create location. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-2xl border border-white/40 bg-white/80 p-6 shadow-xl shadow-indigo-500/10 backdrop-blur-xl">
            <h2 className="mb-4 text-xl font-bold text-slate-800">Add New Location</h2>

            {error && (
                <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Location Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white/50 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">Address (Geocoded)</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white/50 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Add Location"}
                </button>
            </form>
        </div>
    );
};
