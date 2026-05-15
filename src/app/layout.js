import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'AI Job Hub – Find Your Dream AI Career',
  description:
    'Discover the latest AI jobs in Data Annotation, Prompt Engineering, AI Training, Evaluation, MLOps, NLP, Computer Vision, and more. Stay updated with AI news, blogs, and test your skills with our AI quiz.',
  keywords: 'AI jobs, machine learning jobs, prompt engineering, data annotation, MLOps, NLP, computer vision, AI news',
  openGraph: {
    title: 'AI Job Hub',
    description: 'Your hub for AI careers, news, and learning',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧠</text></svg>" />
      </head>
      <body className="bg-neural-900 text-slate-100 font-sans antialiased min-h-screen flex flex-col">
        <div className="bg-grid fixed inset-0 pointer-events-none z-0" aria-hidden="true" />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
