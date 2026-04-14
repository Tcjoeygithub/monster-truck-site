"use client";

interface Props {
  imagePath: string;
  pdfPath: string;
  title: string;
  slug: string;
}

export default function ListicleItemActions({
  imagePath,
  pdfPath,
  title,
  slug,
}: Props) {
  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) {
      window.open(pdfPath, "_blank");
      return;
    }
    const safeTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    w.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${safeTitle} - Coloring Page</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { size: letter portrait; margin: 0.25in; }
  html, body { width: 100%; height: 100%; background: white; }
  body { display: flex; align-items: flex-start; justify-content: center; }
  img { width: 100%; max-height: 100vh; object-fit: contain; }
</style>
</head>
<body>
<img src="${imagePath}" alt="${safeTitle}" onload="setTimeout(function(){window.print();},400);" onerror="document.body.innerText='Image failed to load. Use the Download PDF button instead.';" />
</body>
</html>`);
    w.document.close();
  };

  return (
    <div className="no-print flex flex-wrap gap-3">
      <button
        onClick={handlePrint}
        type="button"
        className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-2.5 px-5 rounded-lg transition-colors shadow-sm active:scale-95"
      >
        <svg
          className="w-5 h-5"
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
        Print
      </button>
      <a
        href={pdfPath}
        download={`${slug}.pdf`}
        className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2.5 px-5 rounded-lg transition-colors shadow-sm active:scale-95"
      >
        <svg
          className="w-5 h-5"
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
        Download PDF
      </a>
    </div>
  );
}
