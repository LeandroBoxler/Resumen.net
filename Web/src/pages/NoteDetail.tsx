import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studyNoteService } from '../services/api';
import { getNoteDetailPath, ROUTES } from '../routes';
import { LoadingState, Button } from '../components/common';
import { StudyNote } from '../types';
import { useAuth } from '../context/AuthContext';

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<StudyNote | null>(null);
  const { profile }= useAuth();

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
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 flex items-center gap-4">
          <Button onClick={handleBack} variant="ghost">
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Detalle del Resumen</h1>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <label className="block font-semibold mb-1">Nombre</label>
            <div className="w-full border rounded px-3 py-2 bg-gray-50">{note.name}</div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Descripción</label>
            <div className="w-full border rounded px-3 py-2 bg-gray-50 whitespace-pre-line">{note.description}</div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Archivo PDF</label>
            {note.pdfLink ? (
              <a
                href={note.pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                Ver PDF
              </a>
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