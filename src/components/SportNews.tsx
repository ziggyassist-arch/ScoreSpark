"use client";

import { useState, useEffect } from "react";
import type { Sport } from "@/lib/types";

interface Article {
  title: string;
  source: string;
  url: string;
  time: string;
  image?: string;
}

export default function SportNews({ sport }: { sport: Sport }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(`/api/v1/news?sport=${sport}`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data.articles || []);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [sport]);

  if (loading || articles.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold text-white/60 mb-3">News</h2>
      <div className="space-y-2">
        {articles.slice(0, 6).map((article, i) => (
          <a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 p-3 bg-card rounded-xl border border-white/5 hover:bg-white/5 transition-colors"
          >
            {article.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.image}
                alt=""
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white/80 line-clamp-2 leading-snug">
                {article.title}
              </p>
              <p className="text-[11px] text-white/30 mt-1">
                {article.source} · {article.time}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
