'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import JobCard from '@/components/JobCard';
import { JobSkeleton } from '@/components/LoadingSkeleton';

const CATEGORY_META = {
  'data-annotation':    { label: 'Data Annotation',    icon: '📝', color: 'cyan',   desc: 'Label, tag and annotate datasets that power AI models.' },
  'prompt-engineering': { label: 'Prompt Engineering',  icon: '🤖', color: 'blue',   desc: 'Design and optimize prompts for large language models.' },
  'ai-training':        { label: 'AI Training',         icon: '🧠', color: 'purple', desc: 'Train, fine-tune and optimize machine learning models.' },
  'ai-evaluation':      { label: 'AI Evaluation',       icon: '⚖️', color: 'yellow', desc: 'Evaluate, test and improve AI model quality and safety.' },
  'mlops':              { label: 'MLOps',               icon: '🔧', color: 'green',  desc: 'Deploy, monitor and scale ML systems in production.' },
  'nlp':                { label: 'NLP / Text AI',       icon: '💬', color: 'indigo', desc: 'Build natural language understanding and generation systems.' },
  'computer-vision':    { label: 'Computer Vision',     icon: '👁️', color: 'pink',   desc: 'Develop image and video understanding AI systems.' },
  'ai-research':        { label: 'AI Research',         icon: '🔬', color: 'orange', desc: 'Advance the frontiers of artificial intelligence research.' },
};

const BORDER_COLORS = {
  cyan: 'border-cyan-500/40', blue: 'border-blue-500/40', purple: 'border-purple-500/40',
  yellow: 'border-yellow-500/40', green: 'border-green-500/40', indigo: 'border-indigo-500/40',
  pink: 'border-pink-500/40', orange: 'border-orange-500/40',
};

export default function CategoryPage() {
  const params = useParams();
  const category = params.category;
  const meta = CATEGORY_META[category] || { label: category, icon: '💼', color: 'cyan', desc: 'AI Jobs' };

  const [jobs, setJobs]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);

  const fetchJobs = async (q = '', pg = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?category=${category}&search=${encodeURIComponent(q)}&page=${pg}&limit=18`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
    } catch { setJobs([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs('', 1); }, [category]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchJobs(search, 1); };

  const borderColor = BORDER_COLORS[meta.color] || 'border-cyan-500/40';

  return (
    <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-600 mb-6">
        <Link href="/jobs" className="hover:text-cyan-400 transition-colors">Jobs</Link>
        <span>/</span>
        <span className="text-slate-400">{meta.label}</span>
      </div>

      {/* Hero */}
      <div className={`card border ${borderColor} p-6 sm:p-8 mb-8 bg-gradient-to-br from-${meta.color}-500/10 to-transparent`}>
        <div className="flex items-start gap-4">
          <div className="text-5xl">{meta.icon}</div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">{meta.label} Jobs</h1>
            <p className="text-slate-400 text-sm mb-3">{meta.desc}</p>
            <span className="text-cyan-400 font-mono text-sm">{total} positions available</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${meta.label} jobs...`}
          className="flex-1 bg-neural-700 border border-cyan-500/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
        />
        <button type="submit" className="btn-primary px-5 py-3">🔍</button>
      </form>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <JobSkeleton key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">{meta.icon}</div>
          <h3 className="text-white font-semibold mb-2">No {meta.label} jobs found yet</h3>
          <p className="text-slate-500 text-sm mb-4">Jobs are automatically fetched every 12 hours.</p>
          <Link href="/jobs" className="btn-secondary px-6 py-2 inline-block">← All Jobs</Link>
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
          {total > 18 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button onClick={() => { setPage(p => Math.max(1,p-1)); fetchJobs(search, page-1); }} disabled={page===1} className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">← Prev</button>
              <span className="text-slate-400 text-sm font-mono">{page} / {Math.ceil(total/18)}</span>
              <button onClick={() => { setPage(p => p+1); fetchJobs(search, page+1); }} disabled={page>=Math.ceil(total/18)} className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">Next →</button>
            </div>
          )}
        </>
      )}

      {/* Other categories */}
      <div className="mt-12">
        <h2 className="text-white font-display font-bold text-lg mb-4">Other AI Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(CATEGORY_META).filter(([slug]) => slug !== category).slice(0,4).map(([slug, m]) => (
            <Link key={slug} href={`/jobs/${slug}`} className="card p-4 hover:scale-[1.02] text-center">
              <div className="text-2xl mb-1">{m.icon}</div>
              <div className="text-white text-xs font-semibold">{m.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
