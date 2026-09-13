import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PdfExportOptions {
  filename?: string;
  onProgress?: (step: string) => void;
}

/**
 * Captures a printable HTML DOM element and exports it as a formatted multi-page or single-page PDF.
 * Uses high-resolution scaling for crisp text rendering and handles Bengali typography natively.
 */
export async function exportElementToPdf(
  element: HTMLElement,
  options: PdfExportOptions = {}
): Promise<void> {
  const {
    filename = `poultry_farm_report_${new Date().toISOString().split('T')[0]}.pdf`,
    onProgress,
  } = options;

  onProgress?.('preparing');

  // Clone or ensure element is visible and styled for capture
  const originalDisplay = element.style.display;
  if (originalDisplay === 'none') {
    element.style.display = 'block';
  }

  try {
    onProgress?.('rendering');

    // High resolution canvas capture
    const canvas = await html2canvas(element, {
      scale: 2, // 2x scale for 300dpi retina quality text & graphics
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      windowWidth: element.scrollWidth || 800,
    });

    onProgress?.('generating_pdf');

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Standard A4 dimensions in millimeters
    const pdfWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    if (imgHeight <= pageHeight) {
      // Fits in a single page
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight, undefined, 'FAST');
    } else {
      // Multi-page slicing
      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Subsequent pages
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
    }

    pdf.save(filename);
    onProgress?.('completed');
  } finally {
    if (originalDisplay === 'none') {
      element.style.display = 'none';
    }
  }
}

/**
 * Triggers standard browser print dialog for an element by rendering it in a print-ready iframe.
 * Ideal for users wanting to physically print or use their browser's native Print to PDF engine.
 */
export function printFormattedElement(element: HTMLElement, title: string = 'Financial Report'): void {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.title = title;
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  // Copy stylesheets into print document
  const headContent: string[] = [];
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    headContent.push(node.outerHTML);
  });

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${headContent.join('\n')}
        <style>
          @page {
            size: A4;
            margin: 12mm;
          }
          body {
            background-color: #FFFFFF !important;
            color: #111827 !important;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Bengali', sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @media print {
            body {
              padding: 0 !important;
              margin: 0 !important;
            }
          }
        </style>
      </head>
      <body>
        <div style="width: 100%; max-width: 800px; margin: 0 auto;">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Wait for images and fonts in the iframe to finish loading then print
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error('Print iframe failed:', e);
      window.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }
  }, 500);
}
