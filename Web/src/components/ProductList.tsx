import { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { StudyNote } from '../types';
import { studyNoteService } from '../services/api';

import { getNoteDetailPath } from '../routes';
import { LoadingState, ErrorMessage, Button, EmptyState } from './common';
import PdfCoverPreview from './PdfCoverPreview';

export default function NotesList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<StudyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

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
              onClick={() => navigate(getNoteDetailPath(product.id))}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <PdfCoverPreview file={product.pdfLink} />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{product.name}</h2>
              </div>

            </div>
          ))}
        </div>
      )}
     
    </div>
  );
}
