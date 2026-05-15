import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-cyan-500/10 bg-neural-800/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white">AI</div>
              <span className="font-display font-bold text-white">AI Job<span className="text-gradient">Hub</span></span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Your central hub for AI careers, daily news, learning resources, and community insights.
            </p>
          </div>

          {/* Jobs */}
          <div>
            <h4 className="text-slate-300 font-semibold text-sm mb-3">Job Categories</h4>
            <ul className="space-y-2">
              {[
                ['data-annotation', '📝 Data Annotation'],
                ['prompt-engineering', '🤖 Prompt Engineering'],
                ['ai-training', '🧠 AI Training'],
                ['ai-evaluation', '⚖️ AI Evaluation'],
              ].map(([slug, label]) => (
                <li key={slug}>
                  <Link href={`/jobs/${slug}`} className="text-slate-500 hover:text-cyan-400 text-xs transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Jobs */}
          <div>
            <h4 className="text-slate-300 font-semibold text-sm mb-3">More Roles</h4>
            <ul className="space-y-2">
              {[
                ['mlops', '🔧 MLOps'],
                ['nlp', '💬 NLP / Text AI'],
                ['computer-vision', '👁️ Computer Vision'],
                ['ai-research', '🔬 AI Research'],
              ].map(([slug, label]) => (
                <li key={slug}>
                  <Link href={`/jobs/${slug}`} className="text-slate-500 hover:text-cyan-400 text-xs transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-slate-300 font-semibold text-sm mb-3">Resources</h4>
            <ul className="space-y-2">
              {[
                ['/news', '📰 AI News'],
                ['/blog', '✍️ Blog'],
                ['/quiz', '🎯 AI Quiz'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-500 hover:text-cyan-400 text-xs transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-cyan-500/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">© {year} AI Job Hub. All rights reserved.</p>
          <p className="text-slate-600 text-xs flex items-center gap-1">
            Built with <span className="text-red-400">♥</span> for the AI Community
          </p>
        </div>
      </div>
    </footer>
  );
}
