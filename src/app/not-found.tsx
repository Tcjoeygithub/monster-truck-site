import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <span className="text-8xl block mb-6">🛻</span>
      <h1 className="font-[var(--font-display)] text-4xl font-bold text-brand-black mb-4">
        Oops! Page Not Found
      </h1>
      <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
        Looks like this monster truck drove off the page! Let&rsquo;s get you
        back on track.
      </p>
      <Link
        href="/"
        className="inline-block bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
