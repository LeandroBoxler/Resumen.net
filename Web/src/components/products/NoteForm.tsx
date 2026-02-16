import React, { useState } from "react";

export interface NoteFormData { name: string; description: string; pdfFile?: File, noteId?: string }

interface NoteFormProps {
  initialName?: string;
  noteId?: string;
  initialDescription?: string;
  onCancel?: () => void;
  onSubmit: (data: NoteFormData) => Promise<void>;
  isEdit?: boolean;
  loading?: boolean;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  noteId,
  initialName = "",
  initialDescription = "",
  onSubmit,
  isEdit = false,
  loading = false,
  onCancel
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [pdfFile, setPdfFile] = useState<File | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setError("Solo se permiten archivos PDF");
        setPdfFile(undefined);
      } else {
        setError(null);
        setPdfFile(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("Nombre y descripción son obligatorios");
      return;
    }
    if (!isEdit && !pdfFile) {
      setError("El archivo PDF es obligatorio");
      return;
    }
    setError(null);
    onSubmit({ name, description, pdfFile, noteId });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? "Editar Resumen" : "Crear Resumen"}</h2>
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block font-semibold mb-1">Nombre</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Ej: Matemáticas Avanzadas"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Descripción</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              placeholder="Describe el contenido de la nota"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Archivo PDF {isEdit ? "(opcional)" : "*"}</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex-1"
              disabled={loading}
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Guardando..." : isEdit ? "Actualizar Nota" : "Crear Nota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};