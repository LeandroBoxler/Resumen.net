import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studyNoteService } from '../services/api';
import { ROUTES } from '../routes';
import { LoadingState, ErrorMessage, Button, Input } from '../components/common';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        try {
          setLoading(true);
          setError(null);
          const studyNote = await studyNoteService.getById(id);
          setFormData({
            name: studyNote.name,
          });
        } catch (err) {
          setError('Error al cargar el resumen');
          console.error('Error loading study note:', err);
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await studyNoteService.update(id!, {...formData, id: id!});
      navigate(ROUTES.NOTES);
    } catch (err) {
      setError('Error al guardar los cambios');
      console.error('Error updating study note:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  if (error && !formData.name) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <ErrorMessage message={error} />
          <Button onClick={handleCancel} variant="primary" className="mt-4">
            Volver a la lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 flex items-center gap-4">
          <Button
            onClick={handleCancel}
            variant="ghost"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            }
          >
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Editar Resumen</h1>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Nombre del Resumen"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Matemáticas Avanzadas"
            required
          />

          <div className="flex gap-4 pt-4">
            <Button type="button" onClick={handleCancel} variant="secondary" disabled={saving} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={saving} className="flex-1">
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
