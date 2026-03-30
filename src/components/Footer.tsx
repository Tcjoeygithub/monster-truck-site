import Link from "next/link";

export default function Footer() {
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

          {/* Quick Links */}
          <div>
            <h3 className="text-brand-green font-bold text-lg mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-brand-orange transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-400 hover:text-brand-orange transition-colors"
                >
                  All Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/category/easy"
                  className="text-gray-400 hover:text-brand-orange transition-colors"
                >
                  Easy Pages (Ages 2-4)
                </Link>
              </li>
              <li>
                <Link
                  href="/category/medium"
                  className="text-gray-400 hover:text-brand-orange transition-colors"
                >
                  Medium Pages (Ages 4-6)
                </Link>
              </li>
              <li>
                <Link
                  href="/category/hard"
                  className="text-gray-400 hover:text-brand-orange transition-colors"
                >
                  Detailed Pages (Ages 6-8)
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-brand-green font-bold text-lg mb-3">
              Popular Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/category/bigfoot-style"
                  className="text-gray-400 hover:text-brand-orange transition-colors"
                >
                  Bigfoot Style Trucks
                </Link>
              </li>
              <li>
                <Link
                  href="/category/car-crushers"
                  className="text-gray-400 hover:text-brand-orange transition-colors"
                >
                  Car Crushers
                </Link>
              </li>
              <li>
                <Link
                  href="/category/skeleton-trucks"
                  className="text-gray-400 hover:text-brand-orange transition-colors"
                >
                  Skeleton & Skull Trucks
                </Link>
              </li>
              <li>
                <Link
                  href="/category/flame-trucks"
                  className="text-gray-400 hover:text-brand-orange transition-colors"
                >
                  Flame & Fire Trucks
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 pt-6 border-t border-gray-700">
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
