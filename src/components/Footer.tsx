import Link from "next/link";

interface CategoryLink {
  name: string;
  slug: string;
}

interface Props {
  collections: CategoryLink[];
}

export default function Footer({ collections }: Props) {
  // Split collections into columns for display
  const col1 = collections.slice(0, Math.ceil(collections.length / 2));
  const col2 = collections.slice(Math.ceil(collections.length / 2));

  return (
    <footer className="no-print bg-brand-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-brand-orange font-bold text-lg mb-3">
              Free Monster Truck Coloring Pages
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Built by a dad for his son and all kids who love monster trucks.
              New free coloring pages added daily! Print them out, grab some
              crayons, and let the coloring fun begin.
            </p>
          </div>

          {/* Collections - Column 1 */}
          <div>
            <h3 className="text-brand-green font-bold text-lg mb-3">
              Collections
            </h3>
            <ul className="space-y-2 text-sm">
              {col1.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-gray-400 hover:text-brand-orange transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections - Column 2 */}
          <div>
            <h3 className="text-brand-green font-bold text-lg mb-3">
              More Collections
            </h3>
            <ul className="space-y-2 text-sm">
              {col2.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-gray-400 hover:text-brand-orange transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="text-brand-orange hover:text-brand-orange-light transition-colors font-semibold"
                >
                  View All Collections →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-10 pt-6 border-t border-gray-700">
          <div className="flex flex-wrap justify-center gap-4 text-sm mb-4">
            <Link
              href="/about"
              className="text-gray-400 hover:text-brand-orange transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 hover:text-brand-orange transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/privacy-policy"
              className="text-gray-400 hover:text-brand-orange transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-brand-orange transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/disclaimer"
              className="text-gray-400 hover:text-brand-orange transition-colors"
            >
              Disclaimer
            </Link>
          </div>
          <p className="text-gray-500 text-xs text-center leading-relaxed">
            Unofficial fan site. Not affiliated with Monster Jam or Feld
            Entertainment. All coloring page illustrations are original fan art
            created for educational and entertainment purposes. Monster truck
            names on this site are original creative names and do not represent
            any trademarked brands.
          </p>
          <p className="text-gray-600 text-xs text-center mt-3">
            &copy; {new Date().getFullYear()} Free Monster Truck Coloring Pages.
            Made with love for little monster truck fans everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
