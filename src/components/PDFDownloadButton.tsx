import React, { useState, useEffect } from 'react';
import { Quotation } from '../types';

interface PDFDownloadButtonProps {
  data: Quotation;
  fileName?: string;
  className?: string;
  title?: string;
  children: React.ReactNode;
}

export function PDFDownloadButton({ data, fileName, className, title, children }: PDFDownloadButtonProps) {
  const [PDFDownloadLink, setPDFDownloadLink] = useState<React.ComponentType<any> | null>(null);
  const [QuotationDoc, setQuotationDoc] = useState<React.ComponentType<{ data: Quotation }> | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      import('@react-pdf/renderer'),
      import('./QuotationPDF')
    ]).then(([pdfModule, docModule]) => {
      if (isMounted) {
        setPDFDownloadLink(() => pdfModule.PDFDownloadLink);
        setQuotationDoc(() => docModule.QuotationPDF);
      }
    }).catch(err => {
      console.error('Failed to load PDF module:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!PDFDownloadLink || !QuotationDoc) {
    return (
      <span className={className} title={title} style={{ cursor: 'pointer' }}>
        {children}
      </span>
    );
  }

  const Doc = QuotationDoc;
  return (
    <PDFDownloadLink
      document={<Doc data={data} />}
      fileName={fileName || `${data.quotationNumber || 'quotation'}.pdf`}
      className={className}
      title={title}
    >
      {children}
    </PDFDownloadLink>
  );
}

export default PDFDownloadButton;
