import { memo, useMemo } from 'react';
import DocViewer, {
  DocViewerRenderers,
  PDFRenderer,
  type IHeaderOverride,
} from '@cyntler/react-doc-viewer';
import PdfRenderer from './PdfRenderer';

type Props = {
  onDownload: () => void;
  themeFileUrlInfo: {
    filename: string;
    uri: string;
  };
};

const getHeader =
  ({ onDownload }: Pick<Props, 'onDownload'>): IHeaderOverride =>
  (state, previousDocument, nextDocument) => (
    <div className="viewerHeader">
      <div className="viewerHeaderMeta">
        <strong>{state.currentDocument?.fileName ?? 'document.pdf'}</strong>
        <span>{state.documents.length} file</span>
      </div>
      <div className="viewerHeaderActions">
        <button
          type="button"
          onClick={previousDocument}
          disabled={state.currentFileNo === 0}
        >
          Prev
        </button>
        <button
          type="button"
          onClick={nextDocument}
          disabled={state.currentFileNo >= state.documents.length - 1}
        >
          Next
        </button>
        <button type="button" onClick={onDownload}>
          Download
        </button>
      </div>
    </div>
  );

const DocViewerWithDownload = memo(
  ({ themeFileUrlInfo, onDownload }: Props) => {
    const headerOverride = useMemo(() => getHeader({ onDownload }), [onDownload]);
    const pluginRenderers = useMemo(
      () => [
        PdfRenderer,
        ...DocViewerRenderers.filter(
          (renderer: (typeof DocViewerRenderers)[number]) => renderer !== PDFRenderer
        ),
      ],
      []
    );

    return (
      <DocViewer
        documents={[
          {
            uri: themeFileUrlInfo.uri,
            fileName: themeFileUrlInfo.filename,
          },
        ]}
        pluginRenderers={pluginRenderers}
        config={{
          header: {
            disableHeader: false,
            overrideComponent: headerOverride,
          },
        }}
        style={{ height: '100%' }}
      />
    );
  }
);

DocViewerWithDownload.displayName = 'DocViewerWithDownload';

export default DocViewerWithDownload;
