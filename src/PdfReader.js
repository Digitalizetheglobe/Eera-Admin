import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { pdfjs, Document, Page } from 'react-pdf';

// Set up the pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const PdfReader = () => {
  const [text, setText] = useState('');
  const [pdf, setPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPdf(URL.createObjectURL(file));
  };

  const onLoadSuccess = async (page) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    const imageData = canvas.toDataURL('image/png');
    processImageWithTesseract(imageData);
  };

  const processImageWithTesseract = (imageData) => {
    Tesseract.recognize(imageData, 'eng', { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        setText(text);
      })
      .catch((error) => {
        console.error('Error processing image with Tesseract:', error);
      });
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {pdf && (
        <Document
          file={pdf}
          onLoadSuccess={({ numPages }) => setPageNumber(numPages > 0 ? 1 : 0)}
        >
          <Page
            pageNumber={pageNumber}
            onLoadSuccess={onLoadSuccess}
          />
        </Document>
      )}
      <div>{text}</div>
    </div>
  );
};

export default PdfReader;
