"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  { name: "Bigfoot Style", slug: "bigfoot-style" },
  { name: "Car Crushers", slug: "car-crushers" },
  { name: "Racing Trucks", slug: "racing-trucks" },
  { name: "Freestyle Tricks", slug: "freestyle-tricks" },
  { name: "Mud Bog Trucks", slug: "mud-bog-trucks" },
  { name: "Skeleton & Skull", slug: "skeleton-trucks" },
  { name: "Flame & Fire", slug: "flame-trucks" },
];

const difficultyLinks = [
  { name: "Easy (Ages 2-4)", slug: "easy" },
  { name: "Medium (Ages 4-6)", slug: "medium" },
  { name: "Detailed (Ages 6-8)", slug: "hard" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="no-print bg-brand-black text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-3xl">🛻</span>
            <div className="leading-tight">
              <span className="text-brand-orange font-bold text-lg block">
                Monster Truck
              </span>
              <span className="text-brand-green text-xs font-semibold tracking-wide">
                COLORING PAGES
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="hover:text-brand-orange transition-colors"
            >
              Home
            </Link>

            <div className="relative group">
              <button className="hover:text-brand-orange transition-colors flex items-center gap-1">
                By Truck Type
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
              <div className="absolute top-full left-0 mt-1 bg-white text-brand-black rounded-lg shadow-xl py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="block px-4 py-2 hover:bg-brand-orange hover:text-white transition-colors text-sm"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button className="hover:text-brand-orange transition-colors flex items-center gap-1">
                By Age
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
              <div className="absolute top-full left-0 mt-1 bg-white text-brand-black rounded-lg shadow-xl py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {difficultyLinks.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/category/${d.slug}`}
                    className="block px-4 py-2 hover:bg-brand-orange hover:text-white transition-colors text-sm"
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/categories"
              className="hover:text-brand-orange transition-colors"
            >
              All Categories
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
          <nav className="md:hidden pb-4 border-t border-brand-dark pt-4 space-y-2">
            <Link
              href="/"
              className="block py-2 px-3 rounded hover:bg-brand-dark"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <p className="text-brand-orange font-semibold text-xs uppercase px-3 pt-2">
              By Truck Type
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="block py-2 px-3 rounded hover:bg-brand-dark text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <p className="text-brand-orange font-semibold text-xs uppercase px-3 pt-2">
              By Age / Difficulty
            </p>
            {difficultyLinks.map((d) => (
              <Link
                key={d.slug}
                href={`/category/${d.slug}`}
                className="block py-2 px-3 rounded hover:bg-brand-dark text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {d.name}
              </Link>
            ))}
            <Link
              href="/categories"
              className="block py-2 px-3 rounded hover:bg-brand-dark"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Categories
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
