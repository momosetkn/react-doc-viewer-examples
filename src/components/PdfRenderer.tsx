import { useEffect, useMemo, useRef, useState } from 'react';
import type { DocRenderer } from '@cyntler/react-doc-viewer';
import { PDFRenderer as DefaultPDFRenderer } from '@cyntler/react-doc-viewer';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
// @ts-ignore Vite の ?url import を使って worker を URL 文字列として読む
// https://vite.dev/guide/assets?utm_source=chatgpt.com#explicit-url-imports
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

const PDF_CMAP_URL = '/pdfjs/cmaps/';
const PDF_STANDARD_FONT_DATA_URL = '/pdfjs/standard_fonts/';
const PDF_PADDING = 24;
const PDF_DEFAULT_SCALE = 1;
const PDF_SCALE_STEP = 0.25;
const PDF_MIN_SCALE = 0.5;
const PDF_MAX_SCALE = 4;

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

const pdfOptions = {
  cMapUrl: PDF_CMAP_URL,
  cMapPacked: true,
  standardFontDataUrl: PDF_STANDARD_FONT_DATA_URL,
};

// PDF 内の日本語文字化けを避けるため、標準の PDFRenderer ではなく react-pdf で描画する
const PdfRenderer: DocRenderer = ({ mainState }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(PDF_DEFAULT_SCALE);
  const file = mainState.currentDocument?.fileData ?? mainState.currentDocument?.uri;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      setContainerWidth(Math.max(container.clientWidth - PDF_PADDING * 2, 0));
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setNumPages(0);
    setScale(PDF_DEFAULT_SCALE);
  }, [file]);

  const pageNumbers = useMemo(
    () => Array.from({ length: numPages }, (_, index) => index + 1),
    [numPages]
  );

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + PDF_SCALE_STEP, PDF_MAX_SCALE));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - PDF_SCALE_STEP, PDF_MIN_SCALE));
  };

  if (!file) return null;

  return (
    <div ref={containerRef} className="pdfRoot">
      <div className="pdfToolbar">
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={scale <= PDF_MIN_SCALE}
        >
          -
        </button>
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={scale >= PDF_MAX_SCALE}
        >
          +
        </button>
        <span className="pdfZoomRate">倍率: {(scale * 100).toFixed(0)}%</span>
      </div>

      <Document
        className="pdfDocument"
        file={file}
        options={pdfOptions}
        onLoadSuccess={({ numPages: nextNumPages }) => setNumPages(nextNumPages)}
      >
        {pageNumbers.map((pageNumber) => (
          <div key={pageNumber} className="pdfPageContainer">
            <Page
              pageNumber={pageNumber}
              width={containerWidth || undefined}
              scale={scale}
              renderAnnotationLayer
              renderTextLayer
            />
          </div>
        ))}
      </Document>
    </div>
  );
};

PdfRenderer.fileTypes = DefaultPDFRenderer.fileTypes;
PdfRenderer.weight = DefaultPDFRenderer.weight;
PdfRenderer.fileLoader = DefaultPDFRenderer.fileLoader;

export default PdfRenderer;
