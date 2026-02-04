// Cloudflare Pages deploy hook - purges cache when new content is deployed
export async function onRequestPost(context) {
    const { env } = context;

    // Get Cloudflare API credentials from environment variables
    const CLOUDFLARE_ZONE_ID = env.CLOUDFLARE_ZONE_ID;
    const CLOUDFLARE_API_TOKEN = env.CLOUDFLARE_API_TOKEN;

    if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_TOKEN) {
        return new Response(JSON.stringify({
            error: 'Missing CLOUDFLARE_ZONE_ID or CLOUDFLARE_API_TOKEN environment variables'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Parse request body to get URLs to purge
        const body = await context.request.json().catch(() => ({}));
        const urls = body.urls || [];

        // If specific URLs provided, purge only those; otherwise purge everything
        const purgePayload = urls.length > 0
            ? { files: urls }
            : { purge_everything: true };

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(purgePayload)
            }
        );

        const result = await response.json();

        if (result.success) {
            return new Response(JSON.stringify({
                message: 'Cache purged successfully',
                result
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({
                error: 'Failed to purge cache',
                result
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
