import { NextResponse } from 'next/server';
import { getJobs } from '@/lib/dataLoader';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const { jobs, lastUpdated } = getJobs(category);

  let filtered = jobs;
  if (search) {
    const q = search.toLowerCase();
    filtered = jobs.filter(
      (j) =>
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q) ||
        j.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ jobs: paginated, total, page, limit, lastUpdated });
}
