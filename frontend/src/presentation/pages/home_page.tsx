/**
 * Página principal con mapa y gestión de ubicaciones.
 */

import { useState } from 'react';
import { useAuthContext } from '../context';
import { MapView, LocationForm, Loading } from '../components';
import { use_locations } from '../../application/hooks';

/**
 * Página Home con mapa interactivo.
 * @returns Componente JSX de la página principal.
 */
export const HomePage = () => {
    const { is_authenticated, is_loading: auth_loading } = useAuthContext();
    const { locations, is_loading, create } = use_locations();
    const [show_form, set_show_form] = useState(false);
    const [form_loading, set_form_loading] = useState(false);

    /**
     * Maneja la creación de una nueva ubicación.
     */
    const handle_create = async (
        title: string,
        address: string,
        description?: string,
        image?: File
    ) => {
        set_form_loading(true);
        try {
            await create(title, address, description, image);
            set_show_form(false);
        } finally {
            set_form_loading(false);
        }
    };

    if (auth_loading) {
        return (
            <div className="main-container flex items-center justify-center">
                <Loading message="Verificando autenticación..." />
            </div>
        );
    }

    return (
        <main className="main-container relative">
            {/* Blobs decorativos de fondo */}
            <div className="bg-blob bg-blob-1" aria-hidden="true"></div>
            <div className="bg-blob bg-blob-2" aria-hidden="true"></div>

            {/* Skip link para accesibilidad */}
            <a href="#main-content" className="skip-link">
                Saltar al contenido principal
            </a>

            <div className="container mx-auto px-4 py-6" id="main-content">
                {/* Header de la página */}
                <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                            Explorar ubicaciones
                        </h1>
                        <p className="text-slate-600 mt-1">
                            {locations.length} {locations.length === 1 ? 'ubicación' : 'ubicaciones'} en el mapa
                        </p>
                    </div>

                    {/* Botón para añadir ubicación (solo autenticados) */}
                    {is_authenticated && (
                        <button
                            onClick={() => set_show_form(!show_form)}
                            className="btn-primary"
                            aria-expanded={show_form}
                            aria-controls="location-form"
                        >
                            <i className={`fas ${show_form ? 'fa-times' : 'fa-plus'}`} aria-hidden="true"></i>
                            {show_form ? 'Cancelar' : 'Nueva ubicación'}
                        </button>
                    )}
                </header>

                {/* Mensaje para usuarios no autenticados */}
                {!is_authenticated && (
                    <div className="glass-card p-4 mb-6 flex items-center gap-3">
                        <i className="fas fa-info-circle text-indigo-600 text-xl" aria-hidden="true"></i>
                        <p className="text-slate-700">
                            <strong>Inicia sesión</strong> con Google para crear tus propias ubicaciones en el mapa.
                        </p>
                    </div>
                )}

                {/* Formulario de nueva ubicación */}
                {show_form && (
                    <div id="location-form" className="mb-6 max-w-lg">
                        <LocationForm
                            on_submit={handle_create}
                            is_loading={form_loading}
                            on_close={() => set_show_form(false)}
                        />
                    </div>
                )}

                {/* Mapa */}
                {is_loading ? (
                    <div className="glass-card p-8">
                        <Loading message="Cargando ubicaciones..." />
                    </div>
                ) : (
                    <section aria-label="Mapa de ubicaciones">
                        <MapView locations={locations} />
                    </section>
                )}

                {/* Lista de ubicaciones (visible en móvil) */}
                {locations.length > 0 && (
                    <section
                        className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        aria-label="Lista de ubicaciones"
                    >
                        {locations.slice(0, 6).map((location) => (
                            <article key={location.id} className="glass-card p-4 group">
                                {location.image_url && (
                                    <img
                                        src={location.image_url}
                                        alt=""
                                        className="w-full h-32 object-cover rounded-lg mb-3"
                                    />
                                )}
                                <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {location.title}
                                </h3>
                                {location.description && (
                                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                        {location.description}
                                    </p>
                                )}
                                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                    <i className="fas fa-map-marker-alt text-indigo-500" aria-hidden="true"></i>
                                    {location.address}
                                </p>
                            </article>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
};
