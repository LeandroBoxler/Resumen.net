import { useState } from "react";
import { NoteForm, NoteFormData } from "../components/products/NoteForm";
import { fileService, studyNoteService } from "../services/api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from '../routes';


export default function NewNote() {
    const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

    async function handleSubmit(data : NoteFormData) {
        setSubmitting(true);
            if (!data.pdfFile) {
                console.log("No PDF file provided. Cannot submit note.");

                return setSubmitting(false);
            }   

            const pdfUrl = await fileService.upload(data.pdfFile)

            if (!pdfUrl) {
                console.log("Failed to upload PDF file. Cannot submit note.");
                return setSubmitting(false);
            }

            await studyNoteService.create({
                name: data.name,
                description: data.description,
                pdfLink: pdfUrl,
            })
            navigate(ROUTES.NOTES); 


                      
    }

  return (
      <NoteForm onSubmit={handleSubmit} onCancel={() => navigate(ROUTES.PROFILE)} loading={submitting} />

  );
}