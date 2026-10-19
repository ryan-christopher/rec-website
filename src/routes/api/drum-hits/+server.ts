import { error, json } from '@sveltejs/kit';
import { KV_REST_API_TOKEN, KV_REST_API_URL } from '$app/env/private';
import { Redis } from '@upstash/redis';
import { maxHitsPerRequest } from '#lib/drumHits.js';
import type { RequestHandler } from './$types';

// Total drum-pad hits by every visitor, one counter in Upstash Redis (connected through Vercel,
// which sets the KV_REST_API_* variables; `vercel env pull .env.local` gets them for dev)
const key = 'drum:hits';

function redis() {
	if (!KV_REST_API_URL || !KV_REST_API_TOKEN) error(503, 'Counter not configured');
	return new Redis({ url: KV_REST_API_URL, token: KV_REST_API_TOKEN });
}

export const GET: RequestHandler = async ({ setHeaders }) => {
	const total = Number((await redis().get<number>(key)) ?? 0);
	// Vercel's CDN answers repeat requests for 10s, so page loads don't each cost a Redis command
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=10, stale-while-revalidate=60' });
	return json({ total });
};

// Adds a batch of hits ({ count }) and returns the new total
export const POST: RequestHandler = async ({ request }) => {
	const { count } = await request.json().catch(() => ({}));
	if (!Number.isInteger(count) || count < 1 || count > maxHitsPerRequest) {
		error(400, `count must be a whole number from 1 to ${maxHitsPerRequest}`);
	}
	const total = await redis().incrby(key, count);
	return json({ total });
};
