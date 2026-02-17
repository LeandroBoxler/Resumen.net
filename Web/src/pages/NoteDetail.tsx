import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studyNoteService, favoritesService } from '../services/api';
import { getNoteDetailPath, ROUTES } from '../routes';
import { LoadingState, Button } from '../components/common';
import { StudyNote } from '../types';
import { useAuth } from '../context/AuthContext';
import PdfCoverPreview from '../components/PdfCoverPreview';


export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<StudyNote | null>(null);
  const { profile }= useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      const loadNote = async () => {
        try {
          setLoading(true);
          const studyNote = await studyNoteService.getById(id);
          setNote(studyNote);
        } catch (err) {
          setNote(null);
        } finally {
          setLoading(false);
        }
      };
      loadNote();
    }
  }, [id]);

  useEffect(() => {
    if (profile && id) {
      loadFavoriteStatus();
    }
  }, [profile, id]);

  const loadFavoriteStatus = async () => {
    if (!id) return;
    try {
      const favorites = await favoritesService.getUserFavorites();
      setIsFavorite(favorites.some(f => f.noteId === id));
    } catch (err) {
      console.error('Error loading favorite status:', err);
    }
  };

  const toggleFavorite = async () => {  
    if (!profile) {
      navigate(ROUTES.LOGIN);
      return;
    }
    
    if (!id) return;

    try {
      setTogglingFavorite(true);
      
      if (isFavorite) {
        await favoritesService.removeFavorite(id);
        setIsFavorite(false);
      } else {
        await favoritesService.addFavorite(id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setTogglingFavorite(false);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.NOTES);
  };


  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <LoadingState message="Cargando resumen..." />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen no encontrado</h2>
          <Button onClick={handleBack} variant="secondary">Volver</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 relative isolate">
        {profile && (
          <button
            onClick={toggleFavorite}
            disabled={togglingFavorite}
            className="absolute top-8 right-8 p-3 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 z-30"
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <svg
              className={`w-8 h-8 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-gray-400'
              }`}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        )}

        <div className="mb-6 flex items-center gap-4">
          <Button onClick={handleBack} variant="ghost">
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Detalle del Resumen</h1>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <label className="block font-semibold mb-1">Nombre</label>
            <div className="w-full  px-3 py-2">{note.name}</div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Descripción</label>
            <div className="w-full  px-3 py-2 whitespace-pre-line">{note.description}</div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Archivo PDF</label>
            {note.pdfLink ? (
              <div className="flex flex-col gap-4 relative z-0">
                <PdfCoverPreview file={note.pdfLink} />
                <a
                  href={note.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  Ver PDF completo
                </a>
              
                
              </div>
            
            ) : (
              <span className="text-gray-500">No disponible</span>
            )}
          </div>
      

          {profile && profile.id === note.userId ?(
            <Button
                  onClick={() => navigate(getNoteDetailPath(note.id))}
                  variant="primary"
                  className="flex-1"
                >
                  Editar
                </Button>
          ):null}
        </div>
      </div>
    </div>
  );
}