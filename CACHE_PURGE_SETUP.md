# Automatic Cache Purge Setup

This setup automatically purges the Cloudflare cache whenever you publish content through the CMS.

## How It Works

1. You update a comic in the CMS admin panel
2. The CMS commits the change to GitHub
3. GitHub Actions detects the commit and triggers a workflow
4. The workflow identifies which comic files changed
5. Waits 30 seconds for Cloudflare Pages to deploy
6. Purges **only the specific URLs** that changed (not everything!)
7. Users immediately see the updated content

## Setup Instructions

### 1. Get Your Cloudflare Credentials

#### Get Zone ID:
1. Log into Cloudflare dashboard
2. Select your domain (olificus.com)
3. Scroll down on the Overview page
4. Copy the **Zone ID** (right sidebar under "API")

#### Create API Token:
1. In Cloudflare dashboard, go to **My Profile** → **API Tokens**
2. Click **Create Token**
3. Use the **Edit zone DNS** template or create custom token
4. Set permissions:
   - **Zone** → **Cache Purge** → **Purge**
5. Set zone resources:
   - **Include** → **Specific zone** → **olificus.com**
6. Click **Continue to summary** → **Create Token**
7. **Copy the token** (you won't see it again!)

### 2. Add Secrets to GitHub

1. Go to your GitHub repo: https://github.com/echujon/olificus
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add two secrets:
   - Name: `CLOUDFLARE_ZONE_ID`
     Value: [paste your Zone ID]
   - Name: `CLOUDFLARE_API_TOKEN`
     Value: [paste your API token]

### 3. Deploy the Changes

```bash
# Rebuild with updated _headers
npx @11ty/eleventy

# Commit and push
git add .
git commit -m "Add automatic cache purging on publish"
git push
```

### 4. Test It

1. Edit a comic in the CMS admin
2. Save and publish
3. Wait about 30-60 seconds
4. Visit the comic page - you should see the updated content immediately!

## Files Created

- `.github/workflows/purge-cache.yml` - GitHub Actions workflow
- `functions/purge-cache.js` - Cloudflare Function for manual purging
- `_headers` - Updated cache headers (1 year cache, purged on demand)

## Manual Cache Purge

### Purge Everything
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

### Purge Specific URLs
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://olificus.com/comic/temp-comic-1"]}'
```

### Using the Cloudflare Function
```bash
# Purge specific URLs
curl -X POST "https://olificus.com/purge-cache" \
  -H "Content-Type: application/json" \
  --data '{"urls":["https://olificus.com/comic/temp-comic-1"]}'

# Purge everything (no URLs provided)
curl -X POST "https://olificus.com/purge-cache"
```

Or use the Cloudflare dashboard: Caching → Configuration → Purge Everything

## Troubleshooting

- **Cache not purging?** Check GitHub Actions tab to see if workflow ran successfully
- **Workflow failing?** Verify secrets are set correctly in GitHub
- **Still seeing old content?** Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
