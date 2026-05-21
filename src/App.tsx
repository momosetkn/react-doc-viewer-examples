import { useMemo, useState } from 'react';
import DocViewerWithDownload from './components/DocViewerWithDownload';

const DEFAULT_PDF_URL =
  'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

export default function App() {
  const [fileUrl, setFileUrl] = useState(DEFAULT_PDF_URL);
  const [fileName, setFileName] = useState('sample.pdf');

  const documentInfo = useMemo(
    () => ({
      uri: fileUrl,
      filename: fileName,
    }),
    [fileName, fileUrl]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileUrl(URL.createObjectURL(file));
    setFileName(file.name);
  };

  const handleDownload = () => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Vite + react-pdf</p>
          <h1>PDF が文字化けしにくい DocViewer 構成</h1>
          <p className="lead">
            `react-doc-viewer` の PDF レンダラを `react-pdf` で差し替えています。
          </p>
        </div>
        <label className="upload">
          <span>PDF を選択</span>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </label>
      </section>

      <section className="viewerCard">
        <DocViewerWithDownload
          themeFileUrlInfo={documentInfo}
          onDownload={handleDownload}
        />
      </section>
    </main>
  );
}
