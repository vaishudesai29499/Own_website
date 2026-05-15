'use client';
import { useState, useEffect, useCallback } from 'react';
import NewsCard from '@/components/NewsCard';
import { NewsSkeleton } from '@/components/LoadingSkeleton';

export default function NewsPage() {
  const [articles, setArticles]     = useState([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNews = useCallback(async (q = '', pg = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?search=${encodeURIComponent(q)}&page=${pg}&limit=24`);
      const data = await res.json();
      setArticles(data.articles || []);
      setTotal(data.total || 0);
      setLastUpdated(data.lastUpdated);
    } catch { setArticles([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNews('', 1); }, []);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchNews(search, 1); };

  const fmtTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
  };

  return (
    <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest">Live Feed</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          AI <span className="text-gradient">News</span>
        </h1>
        <p className="text-slate-400 text-sm">
          {total} articles from top AI publications
          {lastUpdated && (
            <span className="ml-2 text-slate-600">· Last updated {fmtTime(lastUpdated)}</span>
          )}
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search AI news..."
          className="flex-1 bg-neural-700 border border-cyan-500/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
        />
        <button type="submit" className="btn-primary px-5 py-3">🔍 Search</button>
        {search && (
          <button type="button" onClick={() => { setSearch(''); fetchNews('',1); }} className="btn-secondary px-4 py-3 text-sm">✕</button>
        )}
      </form>

      {/* Articles */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <NewsSkeleton key={i} />)}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">📰</div>
          <h3 className="text-white font-semibold mb-2">No articles found</h3>
          <p className="text-slate-500 text-sm">
            {search ? 'Try different keywords.' : 'News is fetched every 6 hours. Check back soon!'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {articles.map((article, i) => (
              <div key={article.url || i} className="animate-fade-in" style={{ animationDelay: `${(i % 8) * 0.04}s`, opacity: 0 }}>
                <NewsCard article={article} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {total > 24 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={() => { const p = Math.max(1, page-1); setPage(p); fetchNews(search, p); }}
                disabled={page === 1}
                className="btn-secondary px-5 py-2 text-sm disabled:opacity-40"
              >← Prev</button>
              <span className="text-slate-400 text-sm font-mono">Page {page} of {Math.ceil(total/24)}</span>
              <button
                onClick={() => { const p = page+1; setPage(p); fetchNews(search, p); }}
                disabled={page >= Math.ceil(total/24)}
                className="btn-secondary px-5 py-2 text-sm disabled:opacity-40"
              >Next →</button>
            </div>
          )}
        </>
      )}

      {/* Info card */}
      <div className="mt-12 card p-5 border-blue-500/20 bg-blue-500/5 flex items-start gap-3">
        <span className="text-xl flex-shrink-0">ℹ️</span>
        <div>
          <p className="text-blue-300 text-sm font-medium mb-0.5">Auto-updated every 6 hours</p>
          <p className="text-slate-500 text-xs">News is automatically fetched from NewsAPI covering AI, machine learning, LLMs, ChatGPT, and more.</p>
        </div>
      </div>
    </div>
  );
}
