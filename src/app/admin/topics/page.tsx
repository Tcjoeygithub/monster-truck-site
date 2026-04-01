"use client";

import { useState } from "react";
import Link from "next/link";

interface TopicSuggestion {
  keyword: string;
  searchVolume: number;
  competition: number;
  competitionLevel: string;
  trendingUp: boolean;
  category: string;
  suggestedTitle: string;
  suggestedSlug: string;
  trademarkSafe: boolean;
  notes: string;
}

interface QueuedTopic extends TopicSuggestion {
  id: string;
  status: "pending" | "approved" | "rejected" | "published";
  priority: number;
  addedAt: string;
  approvedAt?: string;
}

const categoryLabels: Record<string, string> = {
  core: "Core",
  "trademark-inspired": "Trademark Inspired",
  seasonal: "Seasonal",
  "trope-mashup": "Trope Mashup",
  audience: "Audience",
  discovered: "Discovered",
};

const categoryColors: Record<string, string> = {
  core: "bg-blue-100 text-blue-700",
  "trademark-inspired": "bg-purple-100 text-purple-700",
  seasonal: "bg-orange-100 text-orange-700",
  "trope-mashup": "bg-green-100 text-green-700",
  audience: "bg-gray-100 text-gray-700",
  discovered: "bg-yellow-100 text-yellow-700",
};

export default function TopicsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Research state
  const [researching, setResearching] = useState(false);
  const [results, setResults] = useState<TopicSuggestion[]>([]);
  const [researchFilters, setResearchFilters] = useState({
    includeTrademarkInspired: true,
    includeSeasonal: true,
    includeTropeMashups: true,
    includeDiscovery: true,
  });

  // Queue state
  const [queue, setQueue] = useState<QueuedTopic[]>([]);
  const [queueFilter, setQueueFilter] = useState<string>("all");
  const [loadingQueue, setLoadingQueue] = useState(false);

  // Tab state
  const [tab, setTab] = useState<"research" | "queue">("research");

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
      loadQueue();
    } else {
      setError("Invalid password");
    }
  };

  const runResearch = async () => {
    setResearching(true);
    setResults([]);
    try {
      const res = await fetch("/api/admin/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...researchFilters, limit: 150 }),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.topics);
      } else {
        const err = await res.json();
        setError(err.error || "Research failed");
      }
    } catch {
      setError("Research request failed");
    }
    setResearching(false);
  };

  const loadQueue = async () => {
    setLoadingQueue(true);
    const res = await fetch("/api/admin/topics");
    if (res.ok) {
      const data = await res.json();
      setQueue(data);
    }
    setLoadingQueue(false);
  };

  const addToQueue = async (topics: TopicSuggestion[]) => {
    const res = await fetch("/api/admin/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topics: topics.map((t) => ({
          ...t,
          priority: t.searchVolume,
        })),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      alert(`Added ${data.added} topics to queue (${data.total} total)`);
      loadQueue();
    }
  };

  const updateTopic = async (id: string, updates: Partial<QueuedTopic>) => {
    await fetch("/api/admin/topics", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    loadQueue();
  };

  const deleteTopic = async (id: string) => {
    await fetch("/api/admin/topics", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadQueue();
  };

  const filteredQueue =
    queueFilter === "all"
      ? queue
      : queue.filter((t) => t.status === queueFilter);

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
      {/* Nav */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-brand-black">
          Keyword Research & Topics
        </h1>
        <div className="flex gap-3">
          <Link
            href="/admin"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Pages
          </Link>
          <button
            onClick={() => setAuthenticated(false)}
            className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
          <button
            onClick={() => setError("")}
            className="float-right font-bold"
          >
            x
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab("research")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "research"
              ? "bg-white text-brand-black shadow"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Keyword Research
        </button>
        <button
          onClick={() => {
            setTab("queue");
            loadQueue();
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "queue"
              ? "bg-white text-brand-black shadow"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Topic Queue ({queue.filter((t) => t.status === "approved").length}{" "}
          approved)
        </button>
      </div>

      {/* RESEARCH TAB */}
      {tab === "research" && (
        <div>
          {/* Filters */}
          <div className="bg-white rounded-xl shadow border p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Research Filters</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              {[
                {
                  key: "includeTrademarkInspired",
                  label: "Trademark Inspired (Grave Digger, El Toro Loco...)",
                },
                {
                  key: "includeSeasonal",
                  label: "Seasonal (Halloween, Christmas...)",
                },
                {
                  key: "includeTropeMashups",
                  label: "Kid Trope Mashups (Dinosaur, Robot, Shark...)",
                },
                {
                  key: "includeDiscovery",
                  label: "Auto-Discover Related Keywords",
                },
              ].map((f) => (
                <label
                  key={f.key}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={
                      researchFilters[
                        f.key as keyof typeof researchFilters
                      ]
                    }
                    onChange={(e) =>
                      setResearchFilters({
                        ...researchFilters,
                        [f.key]: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  {f.label}
                </label>
              ))}
            </div>
            <button
              onClick={runResearch}
              disabled={researching}
              className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {researching ? "Researching..." : "Run Keyword Research"}
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="bg-white rounded-xl shadow border overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-bold text-lg">
                  {results.length} Topic Opportunities Found
                </h2>
                <button
                  onClick={() => addToQueue(results)}
                  className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  Add All to Queue
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-600">
                        Keyword
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-600">
                        Volume
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-600 hidden md:table-cell">
                        Competition
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-600 hidden md:table-cell">
                        Type
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-600 hidden lg:table-cell">
                        Trend
                      </th>
                      <th className="text-right p-3 font-semibold text-gray-600">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((topic, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <p className="font-medium text-brand-black">
                            {topic.keyword}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {topic.suggestedSlug}
                          </p>
                        </td>
                        <td className="p-3 font-semibold">
                          {topic.searchVolume.toLocaleString()}
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              topic.competitionLevel === "LOW"
                                ? "bg-green-100 text-green-700"
                                : topic.competitionLevel === "MEDIUM"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {topic.competitionLevel}
                          </span>
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              categoryColors[topic.category] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {categoryLabels[topic.category] || topic.category}
                          </span>
                        </td>
                        <td className="p-3 hidden lg:table-cell">
                          {topic.trendingUp ? (
                            <span className="text-green-600 font-bold text-xs">
                              Trending Up
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              Stable
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => addToQueue([topic])}
                            className="text-brand-orange hover:text-brand-orange-dark text-xs font-medium"
                          >
                            + Queue
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* QUEUE TAB */}
      {tab === "queue" && (
        <div>
          {/* Queue Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: "All", value: queue.length, filter: "all" },
              {
                label: "Pending",
                value: queue.filter((t) => t.status === "pending").length,
                filter: "pending",
              },
              {
                label: "Approved",
                value: queue.filter((t) => t.status === "approved").length,
                filter: "approved",
              },
              {
                label: "Published",
                value: queue.filter((t) => t.status === "published").length,
                filter: "published",
              },
              {
                label: "Rejected",
                value: queue.filter((t) => t.status === "rejected").length,
                filter: "rejected",
              },
            ].map((s) => (
              <button
                key={s.filter}
                onClick={() => setQueueFilter(s.filter)}
                className={`bg-white rounded-xl p-4 shadow border text-left transition-colors ${
                  queueFilter === s.filter
                    ? "border-brand-orange"
                    : "hover:border-gray-300"
                }`}
              >
                <p className="text-gray-500 text-xs">{s.label}</p>
                <p className="text-2xl font-bold text-brand-black">
                  {s.value}
                </p>
              </button>
            ))}
          </div>

          {/* Queue Table */}
          {loadingQueue ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : filteredQueue.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No topics in queue. Run keyword research to find opportunities.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-600">
                        Topic
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-600">
                        Volume
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-600 hidden md:table-cell">
                        Type
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-600 hidden md:table-cell">
                        Status
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-600 hidden lg:table-cell">
                        Notes
                      </th>
                      <th className="text-right p-3 font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQueue
                      .sort((a, b) => b.priority - a.priority)
                      .map((topic) => (
                        <tr
                          key={topic.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3">
                            <p className="font-medium text-brand-black">
                              {topic.suggestedTitle}
                            </p>
                            <p className="text-xs text-gray-400">
                              {topic.keyword}
                            </p>
                          </td>
                          <td className="p-3 font-semibold">
                            {topic.searchVolume.toLocaleString()}
                          </td>
                          <td className="p-3 hidden md:table-cell">
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                categoryColors[topic.category] ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {categoryLabels[topic.category] ||
                                topic.category}
                            </span>
                            {!topic.trademarkSafe && (
                              <span className="ml-1 text-xs text-purple-600">
                                TM
                              </span>
                            )}
                          </td>
                          <td className="p-3 hidden md:table-cell">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                topic.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : topic.status === "published"
                                    ? "bg-blue-100 text-blue-700"
                                    : topic.status === "rejected"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {topic.status}
                            </span>
                          </td>
                          <td className="p-3 hidden lg:table-cell text-xs text-gray-500 max-w-xs truncate">
                            {topic.notes}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-2">
                              {topic.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      updateTopic(topic.id, {
                                        status: "approved",
                                      })
                                    }
                                    className="text-green-600 hover:text-green-800 text-xs font-medium"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateTopic(topic.id, {
                                        status: "rejected",
                                      })
                                    }
                                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {topic.status === "rejected" && (
                                <button
                                  onClick={() =>
                                    updateTopic(topic.id, {
                                      status: "pending",
                                    })
                                  }
                                  className="text-gray-500 hover:text-gray-700 text-xs font-medium"
                                >
                                  Reconsider
                                </button>
                              )}
                              <button
                                onClick={() => deleteTopic(topic.id)}
                                className="text-gray-400 hover:text-red-500 text-xs font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
