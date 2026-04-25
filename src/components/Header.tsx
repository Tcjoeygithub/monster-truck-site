"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface CategoryLink {
  name: string;
  slug: string;
}

interface Props {
  collections: CategoryLink[];
}

export default function Header({ collections }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="no-print bg-brand-black text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Monster Truck Coloring Pages"
              width={56}
              height={24}
              className="invert"
            />
            <div className="leading-tight">
              <span className="text-brand-orange font-bold text-lg block">
                Monster Truck
              </span>
              <span className="text-brand-green text-xs font-semibold tracking-wide">
                COLORING PAGES
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Mega Menu */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="hover:text-brand-orange transition-colors"
            >
              Home
            </Link>

            <div className="relative group">
              <button className="hover:text-brand-orange transition-colors flex items-center gap-1">
                Collections
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white text-brand-black rounded-lg shadow-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
                style={{ minWidth: collections.length > 8 ? "500px" : "240px" }}
              >
                <div className={`${collections.length > 8 ? "grid grid-cols-2 gap-x-2" : ""} px-2`}>
                  {collections.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      className="block px-3 py-2 hover:bg-brand-orange hover:text-white transition-colors text-sm rounded"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <div className="border-t mt-2 pt-2 px-2">
                  <Link
                    href="/categories"
                    className="block px-3 py-2 text-brand-orange hover:bg-brand-orange hover:text-white transition-colors text-sm rounded font-semibold"
                  >
                    View All Collections →
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/categories"
              className="hover:text-brand-orange transition-colors"
            >
              All Collections
            </Link>

            <Link
              href="/blog"
              className="hover:text-brand-orange transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-brand-dark transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-brand-dark pt-4 space-y-1">
            <Link
              href="/"
              className="block py-2 px-3 rounded hover:bg-brand-dark"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <p className="text-brand-orange font-semibold text-xs uppercase px-3 pt-3 pb-1">
              Collections
            </p>
            {collections.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="block py-2 px-3 rounded hover:bg-brand-dark text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/categories"
              className="block py-2 px-3 rounded hover:bg-brand-dark text-brand-orange font-semibold text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              View All Collections →
            </Link>
            <Link
              href="/blog"
              className="block py-2 px-3 rounded hover:bg-brand-dark text-sm mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
