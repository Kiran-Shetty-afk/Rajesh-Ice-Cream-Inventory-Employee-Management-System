export function exportToCSV(filename: string, data: any[]) {
  if (!data || !data.length) return;

  const replacer = (key: string, value: any) => value === null ? '' : value; // specify how you want to handle null values here
  const header = Object.keys(data[0]);
  
  const csv = [
    header.join(','), // header row first
    ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  
  if (link.download !== undefined) { 
    // feature detection
    // Browsers that support HTML5 download attribute
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function generatePrintableContent(title: string, htmlContent: string) {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; color: #1e1e1e; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f9f9f9; font-weight: 600; }
            h1 { color: #872e29; } /* strawberry */
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          ${htmlContent}
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}
