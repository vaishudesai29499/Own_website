'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const JOB_CATEGORIES = [
  { slug: 'data-annotation', label: 'Data Annotation', icon: '📝' },
  { slug: 'prompt-engineering', label: 'Prompt Engineering', icon: '🤖' },
  { slug: 'ai-training', label: 'AI Training', icon: '🧠' },
  { slug: 'ai-evaluation', label: 'AI Evaluation', icon: '⚖️' },
  { slug: 'mlops', label: 'MLOps', icon: '🔧' },
  { slug: 'nlp', label: 'NLP / Text AI', icon: '💬' },
  { slug: 'computer-vision', label: 'Computer Vision', icon: '👁️' },
  { slug: 'ai-research', label: 'AI Research', icon: '🔬' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [jobsDropdown, setJobsDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setJobsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setJobsDropdown(false);
  }, [pathname]);

  const isActive = (href) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-glow-cyan group-hover:shadow-glow-blue transition-all">
              AI
            </div>
            <span className="font-display font-bold text-lg text-white">
              Job<span className="text-gradient">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className={`nav-link ${isActive('/') && pathname === '/' ? 'active text-cyan-400' : ''}`}>
              Home
            </Link>

            {/* Jobs Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setJobsDropdown(!jobsDropdown)}
                className={`nav-link flex items-center gap-1 ${isActive('/jobs') ? 'active text-cyan-400' : ''}`}
              >
                Jobs
                <svg className={`w-3.5 h-3.5 transition-transform ${jobsDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {jobsDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 glass rounded-xl p-2 shadow-xl shadow-black/40 border border-cyan-500/20 animate-fade-in">
                  <Link
                    href="/jobs"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 text-sm transition-colors mb-1"
                  >
                    <span>🌐</span>
                    <span className="font-medium">All AI Jobs</span>
                  </Link>
                  <div className="border-t border-cyan-500/10 my-1.5" />
                  <div className="grid grid-cols-2 gap-0.5">
                    {JOB_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/jobs/${cat.slug}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-300 text-xs transition-colors"
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/news" className={`nav-link ${isActive('/news') ? 'active text-cyan-400' : ''}`}>
              News
            </Link>
            <Link href="/blog" className={`nav-link ${isActive('/blog') ? 'active text-cyan-400' : ''}`}>
              Blog
            </Link>
            <Link href="/quiz" className={`nav-link ${isActive('/quiz') ? 'active text-cyan-400' : ''}`}>
              Quiz
            </Link>
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <Link href="/quiz" className="hidden sm:inline-flex btn-primary text-sm px-4 py-2">
              🎯 Take Quiz
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-cyan-500/10 px-4 py-4 animate-fade-in">
          <div className="flex flex-col gap-1">
            <Link href="/" className="px-3 py-2.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 text-sm font-medium transition-colors">
              🏠 Home
            </Link>
            <Link href="/jobs" className="px-3 py-2.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 text-sm font-medium transition-colors">
              💼 All AI Jobs
            </Link>
            <div className="pl-4 flex flex-col gap-0.5">
              {JOB_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/jobs/${cat.slug}`}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 text-xs transition-colors"
                >
                  {cat.icon} {cat.label}
                </Link>
              ))}
            </div>
            <Link href="/news" className="px-3 py-2.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 text-sm font-medium transition-colors">
              📰 AI News
            </Link>
            <Link href="/blog" className="px-3 py-2.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 text-sm font-medium transition-colors">
              ✍️ Blog
            </Link>
            <Link href="/quiz" className="px-3 py-2.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 text-sm font-medium transition-colors">
              🎯 AI Quiz
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
