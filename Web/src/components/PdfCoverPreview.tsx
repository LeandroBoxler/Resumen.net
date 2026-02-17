import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect, useRef } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfCoverPreview({ file }: { file: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState<number>(300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <Document 
        file={file}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          setLoading(false);
        }}
        onLoadError={() => {
          setLoading(false);
        }}
        loading={
          <div className="flex items-center justify-center p-4 min-h-[200px]">
            <span className="text-gray-500">Cargando PDF...</span>
          </div>
        }
        error={<div className="hidden"></div>}
        className="w-full"
      >
        {!loading && numPages && (
          <Page 
            pageNumber={1} 
            renderTextLayer={false} 
            renderAnnotationLayer={false}
            className="w-full"
            width={containerWidth}
          />
        )}
      </Document>
    </div>
  );
}
