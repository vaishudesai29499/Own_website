'use client';
import { useState, useEffect, useCallback } from 'react';
import BlogCard from '@/components/BlogCard';
import { BlogSkeleton } from '@/components/LoadingSkeleton';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPosts = useCallback(async (q = '', pg = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog?search=${encodeURIComponent(q)}&page=${pg}&limit=12`);
      const data = await res.json();
      setPosts(data.posts || []);
      setTotal(data.total || 0);
      setLastUpdated(data.lastUpdated);
    } catch { setPosts([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts('', 1); }, []);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchPosts(search, 1); };

  return (
    <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs mb-3">
          <span>✍️</span> Medium Blog
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          AI <span className="text-gradient">Blog</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Expert insights, tutorials and deep-dives from the AI community
          {lastUpdated && <span className="ml-2 text-slate-600">· Synced {new Date(lastUpdated).toLocaleDateString()}</span>}
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search articles..."
          className="flex-1 bg-neural-700 border border-cyan-500/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
        />
        <button type="submit" className="btn-primary px-5 py-3">🔍 Search</button>
        {search && (
          <button type="button" onClick={() => { setSearch(''); fetchPosts('', 1); }} className="btn-secondary px-4 py-3 text-sm">✕</button>
        )}
      </form>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <BlogSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">✍️</div>
          <h3 className="text-white font-semibold mb-2">No blog posts found</h3>
          <p className="text-slate-500 text-sm mb-2">
            {search ? 'Try different keywords.' : 'Blog posts are fetched from Medium daily.'}
          </p>
          <p className="text-slate-600 text-xs">Set your <code className="text-cyan-400">MEDIUM_USERNAME</code> in <code className="text-cyan-400">.env.local</code> to load your posts.</p>
        </div>
      ) : (
        <>
          {/* Featured post */}
          {posts[0] && (
            <a href={posts[0].url} target="_blank" rel="noopener noreferrer"
              className="group card border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent mb-6 block overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-0">
                <div className="sm:w-2/5 h-56 sm:h-auto relative overflow-hidden bg-neural-700">
                  {posts[0].image ? (
                    <img src={posts[0].image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-purple-900/40 to-blue-900/20">✍️</div>
                  )}
                </div>
                <div className="p-6 flex flex-col gap-3 sm:w-3/5">
                  <div className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 w-fit">⭐ Featured Post</div>
                  <h2 className="text-white font-display font-bold text-xl leading-tight group-hover:text-purple-300 transition-colors line-clamp-3">{posts[0].title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{posts[0].description}</p>
                  <div className="flex items-center gap-3 mt-auto text-xs text-slate-500">
                    <span>✍️ {posts[0].author}</span>
                    <span>·</span>
                    <span>{posts[0].readTime} min read</span>
                    <span>·</span>
                    <span>{new Date(posts[0].publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </a>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.slice(1).map((post, i) => (
              <div key={post.id || i} className="animate-fade-in" style={{ animationDelay: `${(i % 6) * 0.06}s`, opacity: 0 }}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>

          {total > 12 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button onClick={() => { const p = Math.max(1, page - 1); setPage(p); fetchPosts(search, p); }} disabled={page === 1} className="btn-secondary px-5 py-2 text-sm disabled:opacity-40">← Prev</button>
              <span className="text-slate-400 text-sm font-mono">Page {page} of {Math.ceil(total / 12)}</span>
              <button onClick={() => { const p = page + 1; setPage(p); fetchPosts(search, p); }} disabled={page >= Math.ceil(total / 12)} className="btn-secondary px-5 py-2 text-sm disabled:opacity-40">Next →</button>
            </div>
          )}
        </>
      )}

      {/* Config tip */}
      <div>
        <div className="mt-12 flex justify-center">
          <button
            onClick={() =>
              window.open("https://medium.com/@vaishnavidesai29", "_blank")
            }
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300"
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
}
