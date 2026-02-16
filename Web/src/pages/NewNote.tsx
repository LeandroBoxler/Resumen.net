import { useState } from "react";
import { NoteForm, NoteFormData } from "../components/products/NoteForm";
import { fileService, studyNoteService } from "../services/api";

export default function NewNote() {
    const [submitting, setSubmitting] = useState(false);

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

            studyNoteService.create({
                
                name: data.name,
                description: data.description,
                pdfLink: pdfUrl,
            })

            console.log("Submitting new note:", data);
            
    }

  return (
      <NoteForm onSubmit={handleSubmit} loading={submitting} />

  );
}