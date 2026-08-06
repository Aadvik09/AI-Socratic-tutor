/**
 * Database access is intentionally not configured in this Vercel deployment.
 * Module progress currently lives in the learning session; a persistent adapter
 * can be added later without coupling the course UI to a Cloudflare binding.
 */
export function getDb(): never {
  throw new Error("Database persistence is not configured for this deployment.");
}
