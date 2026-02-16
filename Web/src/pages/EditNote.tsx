import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fileService, studyNoteService } from '../services/api';
import { ROUTES } from '../routes';
import { LoadingState } from '../components/common';
import { NoteForm, NoteFormData } from '../components/products/NoteForm';
import { StudyNote } from '../types';

export default function EditNote() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [note, setNote] = useState<StudyNote | null>(null);

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        try {
          setLoading(true);
          const studyNote = await studyNoteService.getById(id);
          setNote(studyNote);
        } catch (err) {
          console.error('Error loading study note:', err);
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [id]);

  const handleCancel = () => {
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen no encontrado</h2>
        </div>)
  }

  async function handleSubmit(data : NoteFormData) {
        setSubmitting(true);
        if (!note) {
            console.log("No note ID provided. Cannot submit note.");
            return setSubmitting(false);
        }
            const pdfUrl = data.pdfFile ? await fileService.upload(data.pdfFile) : note.pdfLink;

            if (!pdfUrl) {
                console.log("Failed to upload PDF file. Cannot submit note.");
                return setSubmitting(false);
            }

            studyNoteService.update(note.id, {
              id: note.id,
              name: data.name,
              description: data.description,
              pdfLink: pdfUrl,
            })

            console.log("Submitting new note:", data);
            
    }

  return (
      <NoteForm 
        onSubmit={handleSubmit} 
        loading={submitting} 
        onCancel={handleCancel} 
        initialName={note.name}
        initialDescription={note.description} 
        noteId={id}
        isEdit
      />
  );
}
