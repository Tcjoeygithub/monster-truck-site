"use client";

interface Props {
  imagePath: string;
  title: string;
}

export default function PrintDownloadButtons({ imagePath, title }: Props) {
  const handlePrint = () => {
    // Open a clean window with just the image — guaranteed single page on all devices
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      // Fallback if popup blocked
      window.print();
      return;
    }

    const safeTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${safeTitle} - Coloring Page</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { size: letter portrait; margin: 0.25in; }
            html, body {
              width: 100%;
              height: 100%;
              background: white;
            }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0.25in;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img
            src="${imagePath}"
            alt="${safeTitle}"
            onload="window.print(); window.close();"
            onerror="document.body.innerText='Image failed to load. Please try again.'"
          />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-coloring-page.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open image in new tab for manual save
      window.open(imagePath, "_blank");
    }
  };

  return (
    <div className="no-print flex flex-wrap gap-3">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 px-6 rounded-xl text-lg transition-colors shadow-md hover:shadow-lg active:scale-95"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
        Print This Page
      </button>
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-6 rounded-xl text-lg transition-colors shadow-md hover:shadow-lg active:scale-95"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Download Free
      </button>
    </div>
  );
}
