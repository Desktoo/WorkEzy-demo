// app/dev/pdf-preview/page.tsx
"use client";

import { PosterPdfDocument } from "@/components/poster/PosterPDFDocs";
import { PDFViewer } from "@react-pdf/renderer";

export default function PdfPreviewPage() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PDFViewer width="100%" height="100%">
        <PosterPdfDocument
          jobTitle="Coder"
          city="alwar"
          state="rajasthan"
          salaryFrom="50000"
          salaryTo="60000"
          workingDays="5"
          requirements={"hey there"}
        />
      </PDFViewer>
    </div>
  );
}
