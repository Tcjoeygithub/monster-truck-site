"use client";

import { useState } from "react";
import Image from "next/image";

interface ColoringPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  altText: string;
  imagePath: string;
  thumbnailPath: string;
  categoryIds: string[];
  difficulty: "easy" | "medium" | "hard";
  ageRange: "2-4" | "4-6" | "6-8" | "all";
  status: "draft" | "published";
  featured: boolean;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [editingPage, setEditingPage] = useState<ColoringPage | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      loadPages();
    } else {
      setError("Invalid password");
    }
  };

  const loadPages = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/pages");
    if (res.ok) {
      const data = await res.json();
      setPages(data);
    }
    setLoading(false);
  };

  const handleSave = async (page: ColoringPage) => {
    const res = await fetch("/api/admin/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(page),
    });
    if (res.ok) {
      setEditingPage(null);
      loadPages();
    }
  };

  const toggleStatus = async (page: ColoringPage) => {
    const updated = {
      ...page,
      status: page.status === "published" ? "draft" : "published",
    };
    await handleSave(updated as ColoringPage);
  };

  const toggleFeatured = async (page: ColoringPage) => {
    const updated = { ...page, featured: !page.featured };
    await handleSave(updated);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
        >
          <h1 className="text-2xl font-bold text-brand-black mb-6 text-center">
            Admin Login
          </h1>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 mb-4 focus:border-brand-orange focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 rounded-lg transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-brand-black">
          Admin Dashboard
        </h1>
        <div className="flex gap-3">
          <button
            onClick={loadPages}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Refresh
          </button>
          <button
            onClick={() => setAuthenticated(false)}
            className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow border">
          <p className="text-gray-500 text-sm">Total Pages</p>
          <p className="text-3xl font-bold text-brand-black">{pages.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow border">
          <p className="text-gray-500 text-sm">Published</p>
          <p className="text-3xl font-bold text-brand-green">
            {pages.filter((p) => p.status === "published").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow border">
          <p className="text-gray-500 text-sm">Drafts</p>
          <p className="text-3xl font-bold text-brand-orange">
            {pages.filter((p) => p.status === "draft").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow border">
          <p className="text-gray-500 text-sm">Featured</p>
          <p className="text-3xl font-bold text-brand-black">
            {pages.filter((p) => p.featured).length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600">
                  Image
                </th>
                <th className="text-left p-4 font-semibold text-gray-600">
                  Title
                </th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">
                  Difficulty
                </th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden lg:table-cell">
                  Publish Date
                </th>
                <th className="text-right p-4 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="w-16 h-12 relative bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={page.thumbnailPath}
                        alt={page.title}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-brand-black">
                      {page.title}
                    </p>
                    <p className="text-gray-400 text-xs">{page.slug}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        page.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {page.status}
                    </span>
                    {page.featured && (
                      <span className="ml-1 text-xs font-bold px-2 py-1 rounded-full bg-brand-orange/10 text-brand-orange">
                        featured
                      </span>
                    )}
                  </td>
                  <td className="p-4 hidden md:table-cell capitalize">
                    {page.difficulty}
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    {page.publishDate}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingPage(page)}
                        className="text-brand-orange hover:text-brand-orange-dark text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleStatus(page)}
                        className="text-gray-500 hover:text-gray-700 text-xs font-medium"
                      >
                        {page.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => toggleFeatured(page)}
                        className="text-gray-500 hover:text-gray-700 text-xs font-medium"
                      >
                        {page.featured ? "Unfeature" : "Feature"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingPage && (
        <EditModal
          page={editingPage}
          onSave={handleSave}
          onClose={() => setEditingPage(null)}
        />
      )}
    </div>
  );
}

function EditModal({
  page,
  onSave,
  onClose,
}: {
  page: ColoringPage;
  onSave: (page: ColoringPage) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ ...page });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit: {page.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:border-brand-orange focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:border-brand-orange focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              value={form.metaDescription}
              onChange={(e) =>
                setForm({ ...form, metaDescription: e.target.value })
              }
              rows={2}
              className="w-full border rounded-lg px-3 py-2 focus:border-brand-orange focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              value={form.altText}
              onChange={(e) => setForm({ ...form, altText: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:border-brand-orange focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Path
              </label>
              <input
                type="text"
                value={form.imagePath}
                onChange={(e) =>
                  setForm({ ...form, imagePath: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:border-brand-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publish Date
              </label>
              <input
                type="date"
                value={form.publishDate}
                onChange={(e) =>
                  setForm({ ...form, publishDate: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:border-brand-orange focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                value={form.difficulty}
                onChange={(e) =>
                  setForm({
                    ...form,
                    difficulty: e.target.value as ColoringPage["difficulty"],
                  })
                }
                className="w-full border rounded-lg px-3 py-2 focus:border-brand-orange focus:outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age Range
              </label>
              <select
                value={form.ageRange}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ageRange: e.target.value as ColoringPage["ageRange"],
                  })
                }
                className="w-full border rounded-lg px-3 py-2 focus:border-brand-orange focus:outline-none"
              >
                <option value="2-4">Ages 2-4</option>
                <option value="4-6">Ages 4-6</option>
                <option value="6-8">Ages 6-8</option>
                <option value="all">All Ages</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
