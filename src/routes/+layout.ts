import { browser, dev } from '$app/env';
// Not '@vercel/analytics/sveltekit': in 2.0.1 it subscribes to `$app/stores`,
// which throws in SvelteKit 3 and breaks hydration. Plain inject() tracks
// client-side navigations itself.
import { inject } from '@vercel/analytics';

if (browser) inject({ mode: dev ? 'development' : 'production' });
