import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StudyNote, UserFavorite } from '../types';
import { getEditNotePath, getNoteDetailPath, ROUTES } from '../routes/constants';
import { LoadingState, ErrorMessage, Button, EmptyState } from '../components/common';
import PdfCoverPreview from '../components/PdfCoverPreview';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'created' | 'favorites'>('created');

  useEffect(() => {
    if (profile) {
      setLoading(false);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingState message="Cargando perfil..." />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorMessage message="No se pudo cargar el perfil del usuario" />
      </div>
    );
  }
  
  const createdNotes = profile.createdNotes || [];
  const favorites = profile.favorites || [];


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-800">
                {profile.firstName} {profile.lastName}
              </h1>
              <button
                onClick={() => navigate('/profile/edit')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editar Perfil
              </button>
                <Link to={ROUTES.NEW_NOTE} className="">
        <Button variant="primary" className="rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow">
          + Nuevo Resumen
        </Button>
      </Link>
            </div>
            <p className="text-gray-600 text-lg mb-4">{profile.email}</p>
            
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600 text-lg">{createdNotes.length}</span>
                <span className="text-gray-600">resúmenes creados</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600 text-lg">{favorites.length}</span>
                <span className="text-gray-600">favoritos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('created')}
            className={`pb-4 px-2 font-semibold transition-colors ${
              activeTab === 'created'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Mis Resúmenes ({createdNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-4 px-2 font-semibold transition-colors ${
              activeTab === 'favorites'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Favoritos ({favorites.length})
          </button>
        </div>
      </div>

      {activeTab === 'created' && (
        <div>
          {createdNotes.length === 0 ? (
            <EmptyState
              title="No has creado resúmenes todavía"
              description="Crea tu primer resumen para compartir tus notas de estudio."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {createdNotes.map((note: StudyNote) => (
                <div
                  key={note.id}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  <PdfCoverPreview file={note.pdfLink} />
                  <div className="mt-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{note.name}</h2>
                    <p className="text-gray-600 text-sm line-clamp-2">{note.description}</p>
                  </div>
                  <div className="flex gap-2 mt-4">

                    <Button
                      onClick={() => navigate(getEditNotePath(note.id))}
                      variant="secondary"
                      className="flex-1"
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div>
          {favorites.length === 0 ? (
            <EmptyState
              title="No tienes favoritos todavía"
              description="Explora los resúmenes y marca tus favoritos."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((favorite: UserFavorite) => (
                <div
                  key={favorite.id}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  <PdfCoverPreview file={favorite.studyNote.pdfLink} />
                  <div className="mt-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {favorite.studyNote.name}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {favorite.studyNote.description}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => navigate(getNoteDetailPath(favorite.studyNote.id))}
                      variant="primary"
                      className="flex-1"
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
