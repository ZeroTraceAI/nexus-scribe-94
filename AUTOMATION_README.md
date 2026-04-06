# 🤖 Content Automation System

## Overview
Automated content generation system that fetches trending topics from X (Twitter) and Reddit, generates blog posts with AI, creates tools, and downloads images - running every hour automatically.

## Features

### 📱 Multi-Platform Trend Detection
- **Twitter/X Integration**: Monitors hashtags and trending topics
- **Reddit Integration**: Tracks hot posts from relevant subreddits
- **Configurable Filters**: Minimum engagement thresholds
- **Duplicate Prevention**: Tracks processed content IDs

### ✍️ AI-Powered Content Generation
- **Blog Posts**: Full-length articles with SEO optimization
- **Tool Creation**: Automatic tool generation based on trends
- **Image Downloads**: Fetches relevant images from Unsplash
- **Fallback Templates**: Works without API keys using templates

### ⏰ Automated Scheduling
- **Hourly Execution**: Runs at the top of every hour
- **Manual Trigger**: Run on-demand for testing
- **Persistent State**: Remembers processed content
- **Detailed Logging**: Comprehensive console output

## Installation

### 1. Install Dependencies
```bash
npm install node-cron openai dotenv
```

### 2. Configure Environment Variables
Create or update `.env.local`:

```env
# OpenAI (Optional - enables AI-generated content)
OPENAI_API_KEY=your_openai_api_key_here

# Twitter API (Optional - enables Twitter trend fetching)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# Reddit API (Optional - enables Reddit trend fetching)
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
```

## Usage

### Start Hourly Scheduler
```bash
npx tsx src/services/content-automation.ts --start
```

### Run Once (Testing)
```bash
npx tsx src/services/content-automation.ts --run-once
```

### Add to package.json Scripts
```json
{
  "scripts": {
    "automation:start": "tsx src/services/content-automation.ts --start",
    "automation:run": "tsx src/services/content-automation.ts --run-once"
  }
}
```

## Configuration

Edit `src/services/content-automation.ts` to customize:

```typescript
const CONFIG = {
  cronSchedule: '0 * * * *',        // Every hour
  maxPostsPerRun: 3,                // Max blog posts per run
  maxToolsPerRun: 1,                // Max tools per run
  minTrendScore: 50,                // Minimum engagement score
  
  sources: {
    twitter: {
      enabled: true,
      trends: ['technology', 'AI', 'webdev', 'programming'],
      minRetweets: 100,
    },
    reddit: {
      enabled: true,
      subreddits: ['technology', 'programming', 'webdev', 'artificial'],
      minScore: 500,
    },
  },
};
```

## Output Structure

Generated content is saved to `src/data/auto-generated/`:

```
src/data/auto-generated/
├── blog-example-title.json       # Generated blog post
├── tool-example-tool.json        # Generated tool
├── run-summary-1234567890.json   # Run summary
├── processed.json                # Track processed IDs
└── images/
    ├── blog-example-title.jpg    # Downloaded image
    └── tool-example-tool.svg     # Fallback SVG
```

## Generated Content Format

### Blog Post JSON
```json
{
  "title": "Exciting AI Breakthrough Announced",
  "slug": "exciting-ai-breakthrough-announced",
  "content": "# Exciting AI Breakthrough Announced\n\n...",
  "excerpt": "Short description of the content...",
  "featuredImage": "/images/auto/exciting-ai-breakthrough.jpg",
  "tags": ["AI", "trending", "automated"],
  "category": "Technology",
  "seoTitle": "Exciting AI Breakthrough Announced | CodeSec AI",
  "seoDescription": "Short SEO description...",
  "status": "draft"
}
```

### Tool JSON
```json
{
  "name": "AI Content Analyzer",
  "slug": "ai-content-analyzer",
  "description": "Professional tool for analyzing AI content",
  "category": "AI Tools",
  "functionality": "Analyze and summarize AI-related content",
  "code": "export function AIContentAnalyzer(...) {...}",
  "status": "draft"
}
```

## Production Deployment

### Option 1: PM2 Process Manager
```bash
npm install -g pm2
pm2 start "tsx src/services/content-automation.ts --start" --name "content-automation"
pm2 save
```

### Option 2: Systemd Service
Create `/etc/systemd/system/content-automation.service`:

```ini
[Unit]
Description=CodeSec AI Content Automation
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/project
ExecStart=/usr/bin/npx tsx src/services/content-automation.ts --start
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable content-automation
sudo systemctl start content-automation
```

### Option 3: Docker Container
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npx", "tsx", "src/services/content-automation.ts", "--start"]
```

## Admin Panel Integration

### View Generated Content in Admin
Access generated blogs and tools through the admin panel:
- `/admin/posts` - View and publish auto-generated blog posts
- `/admin/tools` - Review and deploy auto-generated tools

### Auto-Publish Feature
To automatically publish content, modify the status:
```typescript
status: 'published'  // Instead of 'draft'
```

## Troubleshooting

### No Content Generated
- Check API keys in `.env.local`
- Verify minimum score thresholds aren't too high
- Check network connectivity
- Review console logs for errors

### Duplicate Content
- The system tracks processed IDs in `processed.json`
- Clear the file to reprocess content: `rm src/data/auto-generated/processed.json`

### Image Download Fails
- Falls back to SVG placeholder automatically
- Check Unsplash API availability
- Verify write permissions in output directory

## Best Practices

1. **Review Before Publishing**: Keep status as 'draft' initially
2. **Monitor Disk Space**: Images accumulate over time
3. **Rate Limiting**: Respect API rate limits
4. **Content Quality**: Periodically review AI-generated content
5. **Backup Processed IDs**: Don't lose `processed.json`

## Security Considerations

- Store API keys securely in environment variables
- Never commit `.env.local` to version control
- Use read-only API keys when possible
- Implement content moderation before publishing
- Monitor for API abuse

## Future Enhancements

- [ ] LinkedIn trend integration
- [ ] YouTube trending videos
- [ ] Custom AI fine-tuning
- [ ] Multi-language support
- [ ] Content quality scoring
- [ ] Automatic social media posting
- [ ] Analytics dashboard integration

## Support

For issues or questions:
1. Check console logs for error messages
2. Verify environment variables are set correctly
3. Test with `--run-once` flag first
4. Review API documentation for rate limits

---

**Built with ❤️ by CodeSec AI**
