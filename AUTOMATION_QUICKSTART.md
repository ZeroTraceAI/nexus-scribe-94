# 🚀 Automation Quick Start Guide

## What Was Built

A professional **Content Automation System** that automatically:
- ✅ Fetches trending content from Twitter/X and Reddit every hour
- ✅ Generates SEO-optimized blog posts with AI
- ✅ Creates useful tools based on trending topics
- ✅ Downloads relevant images automatically
- ✅ Prevents duplicate content processing

## Files Created

```
/workspace/
├── src/services/content-automation.ts    # Main automation service
├── AUTOMATION_README.md                   # Complete documentation
├── .env.example                           # Updated with automation vars
├── package.json                           # Added automation scripts
└── src/pages/admin/Dashboard.tsx          # Updated with automation status
```

## Quick Start (3 Steps)

### 1. Install Dependencies
```bash
npm install node-cron openai dotenv
```

### 2. Configure API Keys (Optional)
Copy `.env.example` to `.env.local` and add your keys:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# For AI-generated content (optional - works without it using templates)
OPENAI_API_KEY=sk-your-key-here

# For Twitter trends (optional)
TWITTER_API_KEY=your-key
TWITTER_API_SECRET=your-secret
TWITTER_ACCESS_TOKEN=your-token
TWITTER_ACCESS_SECRET=your-secret

# For Reddit trends (optional)
REDDIT_CLIENT_ID=your-id
REDDIT_CLIENT_SECRET=your-secret
```

### 3. Run the Automation

**Test Run (Immediate):**
```bash
npm run automation:run
```

**Start Hourly Scheduler:**
```bash
npm run automation:start
```

## How It Works

```
Every Hour → Fetch Trends → Generate Content → Save Files
    ↓            ↓              ↓              ↓
  Cron      Twitter/      Blog Posts    JSON files in
 Job        Reddit       + Tools +     auto-generated/
             Images
```

## Output Location

Generated content saves to:
```
src/data/auto-generated/
├── blog-example-title.json
├── tool-example-tool.json
├── run-summary-timestamp.json
├── processed.json (tracks done items)
└── images/
    └── blog-example.jpg
```

## Admin Panel Integration

View automation status in your admin dashboard:
- Navigate to `/admin`
- See "Content Automation" card with:
  - Next scheduled run time
  - Total blogs generated
  - Total tools created
  - Last run timestamp

## Configuration Options

Edit `src/services/content-automation.ts`:

```typescript
const CONFIG = {
  cronSchedule: '0 * * * *',  // Change schedule (cron format)
  maxPostsPerRun: 3,          // Max blogs per run
  maxToolsPerRun: 1,          // Max tools per run
  
  sources: {
    twitter: {
      trends: ['technology', 'AI', 'webdev'],  // Topics to monitor
      minRetweets: 100,                         // Minimum engagement
    },
    reddit: {
      subreddits: ['technology', 'programming'],  // Subreddits
      minScore: 500,                               // Minimum upvotes
    },
  },
};
```

## Production Deployment

### Option 1: PM2 (Recommended)
```bash
npm install -g pm2
pm2 start "npm run automation:start" --name "content-bot"
pm2 save
pm2 startup
```

### Option 2: Docker
```dockerfile
CMD ["npm", "run", "automation:start"]
```

### Option 3: Systemd Service
See `AUTOMATION_README.md` for full systemd configuration.

## Without API Keys?

The system works perfectly without any API keys:
- ❌ No OpenAI → Uses smart templates
- ❌ No Twitter → Skips Twitter, uses Reddit only
- ❌ No Reddit → Skips Reddit, uses Twitter only
- ❌ No APIs → Runs in demo mode with mock data

## Troubleshooting

**No content generated?**
- Check if minimum score thresholds are too high
- Verify network connectivity
- Review console output for errors

**Duplicate content?**
- Delete `src/data/auto-generated/processed.json` to reset

**Images not downloading?**
- System automatically falls back to SVG placeholders
- Check Unsplash API availability

## Next Steps

1. ✅ Test with `npm run automation:run`
2. ✅ Review generated content in `src/data/auto-generated/`
3. ✅ Configure API keys for better results
4. ✅ Deploy with `npm run automation:start`
5. ✅ Monitor via admin dashboard at `/admin`

## Support

Full documentation: `AUTOMATION_README.md`

---

**Built for CodeSec AI** 🤖
