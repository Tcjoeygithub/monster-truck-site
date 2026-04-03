"use client";

interface Props {
  imagePath: string;
  title: string;
}

export default function PrintDownloadButtons({ imagePath, title }: Props) {
  const handlePrint = () => {
    // Open the raw image directly in a new tab — works with all printer apps
    // The image itself is already sized for US Letter (1200x1575)
    window.open(imagePath, "_blank");
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
