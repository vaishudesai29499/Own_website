/**
 * newsCron.js – Fetches AI-related news from NewsAPI
 * Runs every 6 hours via server.js scheduler
 * Can also be run standalone: node cron/newsCron.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const NEWSAPI_KEY = process.env.NEWSAPI_KEY || '19dadafb959c408fae16eee8609fb48f';
const NEWSAPI_URL = 'https://newsapi.org/v2/everything';
const DATA_FILE = path.join(process.cwd(), 'data', 'news.json');

const AI_NEWS_QUERIES = [
  'artificial intelligence ChatGPT GPT OpenAI',
  'machine learning deep learning neural network',
  'AI model LLM large language model Anthropic Claude',
  'AI automation data science generative AI',
];

async function fetchNewsQuery(query) {
  const response = await axios.get(NEWSAPI_URL, {
    params: {
      q: query,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: 30,
      apiKey: NEWSAPI_KEY,
    },
    timeout: 10000,
  });
  return response.data.articles || [];
}

async function fetchAndStoreNews() {
  console.log('[News] Fetching AI news from NewsAPI...');
  try {
    // Fetch from multiple queries and deduplicate
    const results = await Promise.allSettled(AI_NEWS_QUERIES.map(fetchNewsQuery));

    const seen = new Set();
    const articles = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        for (const article of result.value) {
          if (
            article.title &&
            article.title !== '[Removed]' &&
            article.url &&
            !seen.has(article.url)
          ) {
            seen.add(article.url);
            articles.push({
              title: article.title,
              description: article.description || '',
              url: article.url,
              urlToImage: article.urlToImage || null,
              source: article.source?.name || 'Unknown',
              publishedAt: article.publishedAt,
              author: article.author || null,
            });
          }
        }
      }
    }

    // Sort by date descending
    articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    const top100 = articles.slice(0, 100);

    fs.writeFileSync(DATA_FILE, JSON.stringify(top100, null, 2), 'utf-8');
    console.log(`[News] ✅ Saved ${top100.length} AI articles`);
    return top100;
  } catch (err) {
    console.error('[News] ❌ Error:', err.message);
    return [];
  }
}

function loadNews() {
  try {
    if (!fs.existsSync(DATA_FILE) || fs.statSync(DATA_FILE).size < 3) return { articles: [], lastUpdated: null };
    const articles = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const lastUpdated = new Date(fs.statSync(DATA_FILE).mtimeMs).toISOString();
    return { articles: Array.isArray(articles) ? articles : [], lastUpdated };
  } catch (e) {
    console.error('[News] load error:', e.message);
    return { articles: [], lastUpdated: null };
  }
}

module.exports = { fetchAndStoreNews, loadNews };

// Standalone run
if (require.main === module) {
  require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });
  fetchAndStoreNews().then(() => {
    const { articles } = loadNews();
    console.log(`Loaded ${articles.length} articles`);
    if (articles[0]) console.log('Latest:', articles[0].title);
  });
}
