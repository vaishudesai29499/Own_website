'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import JobCard from '@/components/JobCard';
import { JobSkeleton } from '@/components/LoadingSkeleton';

const CATEGORIES = [
  { slug: 'all', label: 'All Jobs', icon: '🌐' },
  { slug: 'data-annotation', label: 'Data Annotation', icon: '📝' },
  { slug: 'prompt-engineering', label: 'Prompt Engineering', icon: '🤖' },
  { slug: 'ai-training', label: 'AI Training', icon: '🧠' },
  { slug: 'ai-evaluation', label: 'AI Evaluation', icon: '⚖️' },
  { slug: 'mlops', label: 'MLOps', icon: '🔧' },
  { slug: 'nlp', label: 'NLP / Text AI', icon: '💬' },
  { slug: 'computer-vision', label: 'Computer Vision', icon: '👁️' },
  { slug: 'ai-research', label: 'AI Research', icon: '🔬' },
];

export default function JobsPage() {
  const [jobs, setJobs]         = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchJobs = useCallback(async (cat, q, pg) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category: cat, search: q, page: pg, limit: 18 });
      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setLastUpdated(data.lastUpdated);
    } catch { setJobs([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchJobs(category, search, page); }, [category, page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchJobs(category, search, 1); };
  const handleCategory = (slug) => { setCategory(slug); setPage(1); };

  return (
    <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          AI <span className="text-gradient">Jobs</span>
        </h1>
        <p className="text-slate-400 text-sm">
          {total} opportunities across all AI disciplines
          {lastUpdated && <span className="ml-2 text-slate-600">· Updated {new Date(lastUpdated).toLocaleTimeString()}</span>}
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs, companies, skills..."
          className="flex-1 bg-neural-700 border border-cyan-500/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
        />
        <button type="submit" className="btn-primary px-5 py-3">🔍</button>
      </form>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.slug}
            onClick={() => handleCategory(cat.slug)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              category === cat.slug
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-neural-700/50 text-slate-400 border border-transparent hover:border-cyan-500/20 hover:text-slate-300'
            }`}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Jobs grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <JobSkeleton key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-white font-semibold mb-2">No jobs found</h3>
          <p className="text-slate-500 text-sm mb-4">Try a different search or category.</p>
          <p className="text-slate-600 text-xs">Jobs are fetched automatically every 12 hours.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job, i) => (
              <div key={job.id || i} className="animate-fade-in" style={{ animationDelay: `${(i % 9) * 0.05}s`, opacity: 0 }}>
                <JobCard job={job} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {total > 18 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
              >← Prev</button>
              <span className="text-slate-400 text-sm font-mono">
                {page} / {Math.ceil(total / 18)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / 18)}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
              >Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
