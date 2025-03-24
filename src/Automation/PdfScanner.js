import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js"; // Using Tesseract.js directly

// Set the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

const PdfScanner = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setScreenshots([]);
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const extractPublicNoticeScreenshots = async (file) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    return new Promise((resolve, reject) => {
      fileReader.onload = async () => {
        try {
          const typedArray = new Uint8Array(fileReader.result);
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          let extractedScreenshots = [];

          // Initialize Tesseract.js worker
          const worker = await Tesseract.createWorker();

          // Load and initialize the English language
          await worker.loadLanguage("eng");
          await worker.initialize("eng");

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = { canvasContext: context, viewport: viewport };
            await page.render(renderContext).promise;

            console.log(`Rendered page ${i} successfully.`);

            // Perform OCR on the page's canvas
            const { data } = await worker.recognize(canvas);
            console.log(`OCR Data for page ${i}:`, data);

            // Ensure blocks is an array
            if (Array.isArray(data.blocks)) {
              const publicNoticeBlocks = data.blocks.filter((block) =>
                block.text.toLowerCase().includes("public notice")
              );

              if (publicNoticeBlocks.length > 0) {
                for (const block of publicNoticeBlocks) {
                  const { x0, y0, x1, y1 } = block.bbox || {};
                  if (
                    x0 !== undefined &&
                    y0 !== undefined &&
                    x1 !== undefined &&
                    y1 !== undefined
                  ) {
                    // Normalize coordinates to canvas dimensions
                    const scaleX = canvas.width / data.width;
                    const scaleY = canvas.height / data.height;

                    const croppedX0 = x0 * scaleX;
                    const croppedY0 = y0 * scaleY;
                    const croppedWidth = (x1 - x0) * scaleX;
                    const croppedHeight = (y1 - y0) * scaleY;

                    // Create a new cropped canvas
                    const croppedCanvas = document.createElement("canvas");
                    croppedCanvas.width = croppedWidth;
                    croppedCanvas.height = croppedHeight;
                    const croppedContext = croppedCanvas.getContext("2d");

                    // Draw the cropped section
                    croppedContext.drawImage(
                      canvas,
                      croppedX0,
                      croppedY0,
                      croppedWidth,
                      croppedHeight,
                      0,
                      0,
                      croppedWidth,
                      croppedHeight
                    );

                    // Convert to image
                    const screenshot = croppedCanvas.toDataURL("image/png");
                    extractedScreenshots.push({ page: i, screenshot });
                  } else {
                    console.warn(`Invalid bbox values on page ${i}:`, block.bbox);
                  }
                }
              } else {
                console.warn(`No "Public Notice" found on page ${i}`);
              }
            } else {
              console.warn("data.blocks is not an array:", data.blocks);
            }
          }

          await worker.terminate();
          resolve(extractedScreenshots);
        } catch (err) {
          console.error("PDF Processing Error:", err);
          setError(`Error processing PDF: ${err.message}`);
          reject(err);
        }
      };

      fileReader.onerror = (err) => {
        console.error("File Reader Error:", err);
        setError(`Error reading PDF file: ${err.message}`);
        reject(err);
      };
    });
  };

  const handleScan = async () => {
    if (!pdfFile) {
      setError("Please upload a PDF first.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const extractedScreenshots = await extractPublicNoticeScreenshots(pdfFile);
      setScreenshots(extractedScreenshots);
    } catch (err) {
      console.error("Scan Error:", err);
      setError(`Error scanning PDF: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleScan}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Scanning..." : "Scan PDF"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {screenshots.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg font-bold">Extracted Public Notice Sections:</h3>
          {screenshots.map((notice, index) => (
            <div key={index} className="mt-4 p-4 border rounded shadow">
              <h4 className="text-blue-600 font-semibold">Page {notice.page}</h4>
              <img
                src={notice.screenshot}
                alt={`Screenshot of Public Notice on page ${notice.page}`}
                className="mt-4"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4">No public notice sections found.</p>
      )}
    </div>
  );
};

export default PdfScanner;