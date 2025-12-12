import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapComponent } from '../components/MapComponent';
import { ReviewCard } from '../components/ReviewCard';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewDetail } from '../components/ReviewDetail';
import { use_reviews } from '../hooks/use_reviews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSignOutAlt, 
    faStar, 
    faPlus, 
    faList, 
    faMap,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import type { Review_Model } from '../../domain/models/Review';

/**
 * Página principal de la aplicación ReViews.
 * Muestra el listado de reseñas, el mapa y permite crear nuevas reseñas.
 * @returns Página principal con todas las funcionalidades de reseñas.
 */
export const ReviewsPage = () => {
    const { user, logout } = useAuth();
    const { 
        reviews, 
        loading, 
        error, 
        create_review, 
        delete_review,
        get_review_by_id,
        geocode_address 
    } = use_reviews();
    
    const [show_form, set_show_form] = useState(false);
    const [selected_review, set_selected_review] = useState<Review_Model | null>(null);
    const [view_mode, set_view_mode] = useState<'list' | 'map'>('list');
    const [is_creating, set_is_creating] = useState(false);
    const [is_loading_detail, set_is_loading_detail] = useState(false);

    /**
     * Maneja la selección de una reseña para ver su detalle completo.
     * Obtiene la información completa incluyendo el token OAuth.
     * @param review Reseña seleccionada del listado.
     */
    const handle_select_review = async (review: Review_Model) => {
        set_is_loading_detail(true);
        try {
            // Obtener el detalle completo de la reseña (incluyendo token)
            const full_review = await get_review_by_id(review.id);
            if (full_review) {
                set_selected_review(full_review);
            } else {
                // Si falla, mostrar al menos la info del listado
                set_selected_review(review);
            }
        } catch (err) {
            console.error('Error loading review detail:', err);
            set_selected_review(review);
        } finally {
            set_is_loading_detail(false);
        }
    };

    /**
     * Maneja la creación de una nueva reseña.
     * @param form_data Datos del formulario.
     */
    const handle_create_review = async (form_data: FormData) => {
        set_is_creating(true);
        try {
            await create_review(form_data);
            set_show_form(false);
        } finally {
            set_is_creating(false);
        }
    };

    /**
     * Maneja la eliminación de una reseña.
     * @param id ID de la reseña a eliminar.
     */
    const handle_delete_review = async (id: string) => {
        await delete_review(id);
        set_selected_review(null);
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-purple-100 to-teal-100">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/30">
                                <FontAwesomeIcon icon={faStar} className="text-xl" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                                ReViews
                            </h1>
                        </div>

                        {/* User & Actions */}
                        <div className="flex items-center gap-3">
                            {user && (
                                <div className="hidden sm:flex items-center gap-3 bg-white/50 border border-white/60 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md">
                                    <img 
                                        src={user.picture} 
                                        alt={user.name} 
                                        className="w-8 h-8 rounded-full border border-white shadow-sm"
                                        referrerPolicy="no-referrer"
                                    />
                                    <span className="font-semibold text-slate-700 text-sm pr-2">
                                        {user.name}
                                    </span>
                                </div>
                            )}

                            <button
                                onClick={logout}
                                className="bg-white/80 text-slate-700 border border-white/60 px-4 py-2 rounded-xl font-semibold shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
                                aria-label="Cerrar sesión"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="text-slate-500" />
                                <span className="hidden sm:inline">Salir</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Reseñas de Establecimientos
                        </h2>
                        <p className="text-slate-600 text-sm mt-1">
                            {reviews.length} reseña{reviews.length !== 1 ? 's' : ''} registrada{reviews.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="flex bg-white/80 rounded-xl border border-white/60 p-1 shadow-sm backdrop-blur-sm">
                            <button
                                onClick={() => set_view_mode('list')}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                                    view_mode === 'list'
                                        ? 'bg-indigo-500 text-white shadow-md'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                                aria-label="Ver como lista"
                            >
                                <FontAwesomeIcon icon={faList} />
                                <span className="hidden sm:inline">Lista</span>
                            </button>
                            <button
                                onClick={() => set_view_mode('map')}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                                    view_mode === 'map'
                                        ? 'bg-indigo-500 text-white shadow-md'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                                aria-label="Ver en mapa"
                            >
                                <FontAwesomeIcon icon={faMap} />
                                <span className="hidden sm:inline">Mapa</span>
                            </button>
                        </div>

                        {/* New Review Button */}
                        <button
                            onClick={() => set_show_form(true)}
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            <span className="hidden sm:inline">Nueva Reseña</span>
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-indigo-500" />
                    </div>
                )}

                {/* Content */}
                {!loading && (
                    <>
                        {/* List View */}
                        {view_mode === 'list' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {reviews.length === 0 ? (
                                    <div className="col-span-full text-center py-20">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-4">
                                            <FontAwesomeIcon icon={faStar} className="text-3xl text-indigo-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-700">No hay reseñas</h3>
                                        <p className="text-slate-500 mt-2">
                                            Sé el primero en crear una reseña
                                        </p>
                                        <button
                                            onClick={() => set_show_form(true)}
                                            className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg"
                                        >
                                            Crear primera reseña
                                        </button>
                                    </div>
                                ) : (
                                    reviews.map((review) => (
                                        <ReviewCard
                                            key={review.id}
                                            review={review}
                                            on_click={() => handle_select_review(review)}
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {/* Map View */}
                        {view_mode === 'map' && (
                            <div className="h-[calc(100vh-220px)] min-h-[500px] rounded-3xl overflow-hidden border border-white/40 shadow-xl shadow-indigo-500/10 bg-white/60 backdrop-blur-lg">
                                <MapComponent
                                    reviews={reviews}
                                    on_review_select={handle_select_review}
                                    on_geocode={geocode_address}
                                />
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Review Form Modal */}
            <ReviewForm
                is_open={show_form}
                on_close={() => set_show_form(false)}
                on_submit={handle_create_review}
                is_loading={is_creating}
            />

            {/* Loading Detail Indicator */}
            {is_loading_detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl flex items-center gap-3">
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-indigo-500" />
                        <span className="font-semibold text-slate-700">Cargando detalle...</span>
                    </div>
                </div>
            )}

            {/* Review Detail Modal */}
            <ReviewDetail
                review={selected_review}
                on_close={() => set_selected_review(null)}
                on_delete={handle_delete_review}
                current_user_email={user?.email}
            />
        </div>
    );
};
