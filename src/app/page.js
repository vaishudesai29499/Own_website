import Link from 'next/link';
import { getStats } from '@/lib/dataLoader';

const CATEGORIES = [
  { slug: 'data-annotation', label: 'Data Annotation', icon: '📝', color: 'from-cyan-500/20 to-cyan-500/5', border: 'border-cyan-500/30', desc: 'Label & tag datasets for AI' },
  { slug: 'prompt-engineering', label: 'Prompt Engineering', icon: '🤖', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30', desc: 'Design effective AI prompts' },
  { slug: 'ai-training', label: 'AI Training', icon: '🧠', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/30', desc: 'Train ML & DL models' },
  { slug: 'ai-evaluation', label: 'AI Evaluation', icon: '⚖️', color: 'from-yellow-500/20 to-yellow-500/5', border: 'border-yellow-500/30', desc: 'Evaluate AI model quality' },
  { slug: 'mlops', label: 'MLOps', icon: '🔧', color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/30', desc: 'Deploy & scale ML systems' },
  { slug: 'nlp', label: 'NLP / Text AI', icon: '💬', color: 'from-indigo-500/20 to-indigo-500/5', border: 'border-indigo-500/30', desc: 'Natural language processing' },
  { slug: 'computer-vision', label: 'Computer Vision', icon: '👁️', color: 'from-pink-500/20 to-pink-500/5', border: 'border-pink-500/30', desc: 'Image & video AI systems' },
  { slug: 'ai-research', label: 'AI Research', icon: '🔬', color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/30', desc: 'Advance AI science' },
];

export default function HomePage() {
  const stats = getStats();

  return (
    <div className="pt-16">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Decorative orbs */}
        <div className="orb w-96 h-96 bg-cyan-500 top-0 left-1/4 -translate-y-1/2" />
        <div className="orb w-80 h-80 bg-blue-600 top-1/2 right-0 translate-x-1/3" />
        <div className="orb w-64 h-64 bg-purple-600 bottom-0 left-0" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI Jobs updated every 12 hours
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Your Gateway to
            <br />
            <span className="text-gradient">AI Careers</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover curated AI jobs, stay ahead with daily AI news, read expert blogs,
            and sharpen your skills with interactive quizzes — all in one hub.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/jobs" className="btn-primary text-base px-8 py-3">
              💼 Browse AI Jobs
            </Link>
            <Link href="/quiz" className="btn-secondary text-base px-8 py-3">
              🎯 Test Your Knowledge
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'AI Jobs', value: stats.jobCount || '500+', icon: '💼' },
              { label: 'Categories', value: stats.categories || '8', icon: '📂' },
              { label: 'News Articles', value: stats.newsCount || '100+', icon: '📰' },
              { label: 'Blog Posts', value: stats.blogCount || '50+', icon: '✍️' },
            ].map((s) => (
              <div key={s.label} className="card p-4 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-display font-bold text-cyan-400">{s.value}</div>
                <div className="text-slate-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Job Categories ─────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              AI Job <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">Explore roles shaping the future of AI</p>
          </div>
          <Link href="/jobs" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/jobs/${cat.slug}`}
              className={`group p-5 rounded-xl border ${cat.border} bg-gradient-to-br ${cat.color} hover:scale-[1.03] transition-all duration-200 animate-fade-in`}
              style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <h3 className="text-white font-semibold text-sm mb-1">{cat.label}</h3>
              <p className="text-slate-400 text-xs">{cat.desc}</p>
              <div className="mt-3 text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
                Explore →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Features Row ───────────────────────────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              href: '/news',
              icon: '📰',
              title: 'Live AI News',
              desc: 'Curated AI & ML news updated every 6 hours from top sources worldwide.',
              color: 'border-blue-500/30',
              bg: 'from-blue-500/10 to-blue-500/0',
            },
            {
              href: '/blog',
              icon: '✍️',
              title: 'Expert Blog',
              desc: 'In-depth articles and tutorials from leading AI practitioners on Medium.',
              color: 'border-purple-500/30',
              bg: 'from-purple-500/10 to-purple-500/0',
            },
            {
              href: '/quiz',
              icon: '🎯',
              title: 'AI Knowledge Quiz',
              desc: 'Test your skills in ML, DL, NLP, Prompt Engineering & AI Ethics.',
              color: 'border-green-500/30',
              bg: 'from-green-500/10 to-green-500/0',
            },
          ].map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={`card group border ${f.color} bg-gradient-to-br ${f.bg} p-6 hover:scale-[1.02]`}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-display font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              <div className="mt-4 text-sm text-cyan-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Explore <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Quiz CTA ───────────────────────────────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-purple-600/10" />
          <div className="orb w-64 h-64 bg-cyan-500 -top-20 -right-20 opacity-20" />
          <div className="relative">
            <div className="text-5xl mb-4">🧠</div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
              How Well Do You Know AI?
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-6">
              Challenge yourself with our 50-question AI quiz covering Machine Learning, Deep Learning,
              NLP, Prompt Engineering, and AI Ethics.
            </p>
            <Link href="/quiz" className="btn-primary text-base px-8 py-3 inline-block">
              🎯 Start the Quiz Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
