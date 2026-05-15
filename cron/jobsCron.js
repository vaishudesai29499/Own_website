/**
 * jobsCron.js – Fetches AI jobs from 3 free APIs per category
 * Sources: RemoteOK + Remotive + Arbeitnow (all free, no key needed)
 * FIX: Each category fetches & stores independently (no cross-category dedup)
 */

const axios = require('axios');
const fs    = require('fs');
const path  = require('path');

const JOBS_DIR      = path.join(process.cwd(), 'data', 'jobs');
const ALL_JOBS_FILE = path.join(JOBS_DIR, 'all.json');
const delay         = (ms) => new Promise((r) => setTimeout(r, ms));

const JOB_CATEGORIES = {
  'data-annotation': {
    label: 'Data Annotation', icon: '📝', color: 'cyan',
    remoteok:  ['annotation', 'data'],
    remotive:  ['data annotation', 'data labeling'],
    arbeitnow: ['data annotation', 'image annotation'],
    keywords:  ['annotation', 'labeling', 'label', 'tagging', 'data collection', 'transcription', 'image label', 'data entry'],
  },
  'prompt-engineering': {
    label: 'Prompt Engineering', icon: '🤖', color: 'blue',
    remoteok:  ['ai', 'llm'],
    remotive:  ['prompt engineering', 'generative ai'],
    arbeitnow: ['prompt engineer', 'llm engineer'],
    keywords:  ['prompt engineer', 'prompt design', 'llm', 'gpt', 'generative ai', 'chatgpt', 'openai', 'large language model', 'anthropic'],
  },
  'ai-training': {
    label: 'AI Training', icon: '🧠', color: 'purple',
    remoteok:  ['machine-learning', 'deep-learning'],
    remotive:  ['machine learning', 'deep learning'],
    arbeitnow: ['machine learning engineer', 'ml engineer'],
    keywords:  ['machine learning', 'deep learning', 'model training', 'neural network', 'ml engineer', 'tensorflow', 'pytorch', 'fine-tuning'],
  },
  'ai-evaluation': {
    label: 'AI Evaluation', icon: '⚖️', color: 'yellow',
    remoteok:  ['ai', 'quality-assurance'],
    remotive:  ['ai evaluation', 'rlhf'],
    arbeitnow: ['ai evaluation', 'ai quality assurance'],
    keywords:  ['ai evaluation', 'model evaluation', 'rlhf', 'human feedback', 'red teaming', 'ai testing', 'ai quality', 'ai reviewer'],
  },
  'mlops': {
    label: 'MLOps', icon: '🔧', color: 'green',
    remoteok:  ['mlops', 'devops'],
    remotive:  ['mlops', 'ml infrastructure'],
    arbeitnow: ['mlops engineer', 'ml platform engineer'],
    keywords:  ['mlops', 'ml infrastructure', 'model deployment', 'model serving', 'kubeflow', 'airflow', 'ml platform', 'ml pipeline'],
  },
  'nlp': {
    label: 'NLP / Text AI', icon: '💬', color: 'indigo',
    remoteok:  ['nlp', 'ai'],
    remotive:  ['nlp', 'natural language processing'],
    arbeitnow: ['nlp engineer', 'natural language processing'],
    keywords:  ['nlp', 'natural language', 'text mining', 'sentiment analysis', 'language model', 'hugging face', 'transformers', 'bert', 'spacy'],
  },
  'computer-vision': {
    label: 'Computer Vision', icon: '👁️', color: 'pink',
    remoteok:  ['computer-vision', 'cv'],
    remotive:  ['computer vision', 'image recognition'],
    arbeitnow: ['computer vision engineer', 'image processing'],
    keywords:  ['computer vision', 'image recognition', 'object detection', 'opencv', 'yolo', 'image segmentation', 'visual ai', 'video analysis'],
  },
  'ai-research': {
    label: 'AI Research', icon: '🔬', color: 'orange',
    remoteok:  ['research', 'machine-learning'],
    remotive:  ['ai research', 'research scientist'],
    arbeitnow: ['ai researcher', 'research scientist'],
    keywords:  ['ai research', 'ml research', 'research scientist', 'research engineer', 'applied research', 'ai lab', 'r&d'],
  },
};

function normalizeJob(raw, source, category) {
  return {
    id: raw.id, title: raw.title || 'Untitled',
    company: raw.company || 'Unknown', company_logo: raw.company_logo || null,
    location: raw.location || 'Remote', url: raw.url || '#',
    description: raw.description || '', tags: raw.tags || [],
    salary: raw.salary || null, postedAt: raw.postedAt || new Date().toISOString(),
    source, type: raw.type || 'Remote', category,
  };
}

async function fetchRemoteOK(tags, category) {
  const results = [];
  for (const tag of tags.slice(0, 2)) {
    try {
      await delay(2500);
      const { data } = await axios.get(`https://remoteok.com/api?tag=${encodeURIComponent(tag)}&limit=20`, {
        headers: { 'User-Agent': 'Mozilla/5.0 AIJobHub/1.0', Accept: 'application/json' },
        timeout: 15000,
      });
      if (!Array.isArray(data)) continue;
      const jobs = data.filter((j) => j.id && j.position).map((j) =>
        normalizeJob({
          id: `remoteok-${j.id}`, title: j.position, company: j.company,
          company_logo: j.company_logo, location: j.location || 'Worldwide',
          url: j.url || `https://remoteok.com/l/${j.slug}`,
          description: (j.description || '').replace(/<[^>]*>/g, '').slice(0, 400),
          tags: Array.isArray(j.tags) ? j.tags.slice(0, 8) : [],
          salary: j.salary_min ? `$${Math.round(j.salary_min/1000)}k–$${Math.round((j.salary_max||j.salary_min)/1000)}k` : null,
          postedAt: j.date || new Date().toISOString(), type: 'Remote',
        }, 'RemoteOK', category));
      results.push(...jobs);
      console.log(`    [RemoteOK] tag=${tag}: ${jobs.length} jobs`);
    } catch (e) { console.warn(`    [RemoteOK] tag=${tag}: ${e.message}`); }
  }
  return results;
}

async function fetchRemotive(searches, category) {
  const results = [];
  for (const search of searches.slice(0, 2)) {
    try {
      await delay(1200);
      const { data } = await axios.get(
        `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(search)}&limit=20`,
        { timeout: 12000 }
      );
      const jobs = (data.jobs || []).map((j) =>
        normalizeJob({
          id: `remotive-${j.id}`, title: j.title, company: j.company_name,
          company_logo: j.company_logo, location: j.candidate_required_location || 'Worldwide',
          url: j.url,
          description: (j.description || '').replace(/<[^>]*>/g, '').slice(0, 400),
          tags: Array.isArray(j.tags) ? j.tags.slice(0, 8) : [],
          salary: j.salary || null, postedAt: j.publication_date || new Date().toISOString(), type: 'Remote',
        }, 'Remotive', category));
      results.push(...jobs);
      console.log(`    [Remotive] search="${search}": ${jobs.length} jobs`);
    } catch (e) { console.warn(`    [Remotive] search="${search}": ${e.message}`); }
  }
  return results;
}

async function fetchArbeitnow(searches, category) {
  const results = [];
  for (const search of searches.slice(0, 2)) {
    try {
      await delay(1000);
      const { data } = await axios.get(
        `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(search)}`,
        { timeout: 12000 }
      );
      const jobs = (data.data || []).slice(0, 15).map((j) =>
        normalizeJob({
          id: `arbeitnow-${j.slug}`, title: j.title, company: j.company_name,
          company_logo: null, location: j.location || 'Remote', url: j.url,
          description: (j.description || '').replace(/<[^>]*>/g, '').slice(0, 400),
          tags: Array.isArray(j.tags) ? j.tags.slice(0, 8) : [], salary: null,
          postedAt: j.created_at ? new Date(j.created_at * 1000).toISOString() : new Date().toISOString(),
          type: j.remote ? 'Remote' : 'On-site',
        }, 'Arbeitnow', category));
      results.push(...jobs);
      console.log(`    [Arbeitnow] search="${search}": ${jobs.length} jobs`);
    } catch (e) { console.warn(`    [Arbeitnow] search="${search}": ${e.message}`); }
  }
  return results;
}

function isRelevant(job, keywords) {
  const hay = `${job.title} ${job.description} ${job.tags.join(' ')}`.toLowerCase();
  return keywords.some((kw) => hay.includes(kw.toLowerCase()));
}

function mockJobs(category, config) {
  const titleMap = {
    'data-annotation':    ['Data Annotation Specialist', 'AI Data Labeler', 'Image Annotation Expert', 'NLP Data Annotator', 'Content Reviewer'],
    'prompt-engineering': ['Prompt Engineer', 'LLM Prompt Designer', 'AI Prompt Specialist', 'Generative AI Engineer', 'AI Content Engineer'],
    'ai-training':        ['ML Engineer', 'AI Training Specialist', 'Deep Learning Engineer', 'Model Training Engineer', 'AI Engineer'],
    'ai-evaluation':      ['AI Evaluator', 'RLHF Specialist', 'AI Quality Analyst', 'Model Evaluation Engineer', 'AI Safety Reviewer'],
    'mlops':              ['MLOps Engineer', 'ML Platform Engineer', 'AI Infrastructure Engineer', 'ML DevOps Engineer', 'Model Deployment Engineer'],
    'nlp':                ['NLP Engineer', 'Computational Linguist', 'Text AI Engineer', 'NLP Researcher', 'Conversational AI Engineer'],
    'computer-vision':    ['Computer Vision Engineer', 'CV Researcher', 'Image Processing Engineer', 'Visual AI Engineer', 'Video AI Engineer'],
    'ai-research':        ['AI Research Scientist', 'ML Researcher', 'Applied AI Researcher', 'Research Engineer', 'AI Scientist'],
  };
  const companies = ['OpenAI', 'Google DeepMind', 'Anthropic', 'Meta AI', 'Hugging Face', 'Cohere', 'Mistral AI', 'Scale AI', 'DataAnnotation.tech', 'Appen'];
  return (titleMap[category] || ['AI Specialist']).map((title, i) => ({
    id: `mock-${category}-${i}`, title, company: companies[i % companies.length],
    company_logo: null, location: 'Remote / Worldwide',
    url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(title + ' AI')}`,
    description: `${title} role at a leading AI company. Work on cutting-edge ${config.label} projects. Fully remote, competitive pay.`,
    tags: config.keywords.slice(0, 5), salary: null,
    postedAt: new Date().toISOString(), source: 'AI Job Hub (Search)', type: 'Remote', category,
  }));
}

async function fetchAndStoreJobs() {
  console.log('\n[Jobs] ═══════════════════════════════════════════════');
  console.log('[Jobs]  Starting AI job fetch — ALL 8 categories');
  console.log('[Jobs] ═══════════════════════════════════════════════');
  if (!fs.existsSync(JOBS_DIR)) fs.mkdirSync(JOBS_DIR, { recursive: true });

  const globalSeen = new Set();
  const allJobs    = [];

  for (const [slug, config] of Object.entries(JOB_CATEGORIES)) {
    console.log(`\n[Jobs] ${config.icon} ${config.label}...`);

    // Fetch from all 3 sources in parallel
    const [rok, rem, arb] = await Promise.allSettled([
      fetchRemoteOK(config.remoteok, slug),
      fetchRemotive(config.remotive, slug),
      fetchArbeitnow(config.arbeitnow, slug),
    ]);

    const raw = [
      ...(rok.status === 'fulfilled' ? rok.value : []),
      ...(rem.status === 'fulfilled' ? rem.value : []),
      ...(arb.status === 'fulfilled' ? arb.value : []),
    ];

    // Dedup within this category only
    const catSeen = new Set();
    const catJobs = [];
    for (const job of raw) {
      if (!catSeen.has(job.id) && job.title && job.url && job.url !== '#') {
        catSeen.add(job.id);
        catJobs.push(job);
      }
    }

    // Relevance filter
    const relevant = catJobs.filter((j) => isRelevant(j, config.keywords));
    const toSave   = (relevant.length >= 3 ? relevant : catJobs.length >= 3 ? catJobs : mockJobs(slug, config));
    toSave.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

    // Save per-category file
    fs.writeFileSync(path.join(JOBS_DIR, `${slug}.json`), JSON.stringify(toSave, null, 2), 'utf-8');
    console.log(`[Jobs] ✅ ${config.label}: ${toSave.length} jobs (${relevant.length > 0 ? 'live data' : catJobs.length > 0 ? 'live unfiltered' : 'mock fallback'})`);

    // Add unique jobs to global list
    for (const job of toSave) {
      if (!globalSeen.has(job.id)) { globalSeen.add(job.id); allJobs.push(job); }
    }
    await delay(600);
  }

  allJobs.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
  fs.writeFileSync(ALL_JOBS_FILE, JSON.stringify(allJobs, null, 2), 'utf-8');
  console.log(`\n[Jobs] ═══════════════════════════════════════════════`);
  console.log(`[Jobs]  COMPLETE: ${allJobs.length} total jobs across all categories`);
  console.log(`[Jobs] ═══════════════════════════════════════════════\n`);
  return allJobs;
}

function loadJobs(category = 'all') {
  try {
    const file = category === 'all' ? ALL_JOBS_FILE : path.join(JOBS_DIR, `${category}.json`);
    if (!fs.existsSync(file)) return { jobs: [], lastUpdated: null };
    const jobs = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const lastUpdated = new Date(fs.statSync(file).mtimeMs).toISOString();
    return { jobs: Array.isArray(jobs) ? jobs : [], lastUpdated };
  } catch { return { jobs: [], lastUpdated: null }; }
}

module.exports = { fetchAndStoreJobs, loadJobs, JOB_CATEGORIES };

if (require.main === module) {
  require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });
  fetchAndStoreJobs().then(() => {
    console.log('\nPer-category summary:');
    for (const slug of Object.keys(JOB_CATEGORIES)) {
      const { jobs } = loadJobs(slug);
      console.log(`  ${JOB_CATEGORIES[slug].icon} ${slug}: ${jobs.length} jobs`);
    }
  });
}
