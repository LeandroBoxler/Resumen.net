import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StudyNote } from '../types';
import { studyNoteService } from '../services/api';

import { getNoteDetailPath, ROUTES } from '../routes';
import { LoadingState, ErrorMessage, Button, EmptyState } from './common';

export default function NotesList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<StudyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studyNoteService.getAll();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar los resúmenes. Por favor, intenta nuevamente.');
      console.error('Error loading study notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${name}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await studyNoteService.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError('Error al eliminar el resumen. Por favor, intenta nuevamente.');
      console.error('Error deleting study note:', err);
    } finally {
      setDeletingId(null);
    }
  };


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingState message="Cargando resúmenes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <ErrorMessage message={error} />
          <Button onClick={loadProducts} variant="primary" className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Resúmenes de Estudio</h1>
        <p className="text-lg text-gray-600">
          {products.length === 0
            ? 'No hay resúmenes disponibles'
            : `${products.length} ${products.length === 1 ? 'resumen' : 'resúmenes'} disponibles`}
        </p>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="No hay resúmenes disponibles"
          description="Vuelve más tarde para ver los resúmenes."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{product.name}</h2>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => navigate(getNoteDetailPath(product.id))}
                  variant="primary"
                  className="flex-1"
                >
                  Ver Detalles
                </Button>
                <Button
                  onClick={() => handleDelete(product.id, product.name)}
                  variant="secondary"
                  disabled={deletingId === product.id}
                  loading={deletingId === product.id}
                  className="flex-1"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Link to={ROUTES.NEW_NOTE} className="fixed bottom-8 right-8">
        <Button variant="primary" className="rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow">
          + Nuevo Resumen
        </Button>
      </Link>
    </div>
  );
}
