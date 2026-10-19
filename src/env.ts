import { defineEnvVars } from '@sveltejs/kit/env';

// Server-only (imported from `$app/env/private`). Optional, so the site still builds and runs
// without them; the drum-hit counter is just hidden then
const optional = (value: string | undefined) => value || undefined;

export const variables = defineEnvVars({
	KV_REST_API_URL: {
		schema: optional,
		description: 'Upstash Redis REST URL, for the drum-hit counter (set by the Vercel integration)'
	},
	KV_REST_API_TOKEN: {
		schema: optional,
		description:
			'Upstash Redis REST token, for the drum-hit counter (set by the Vercel integration)'
	}
});
