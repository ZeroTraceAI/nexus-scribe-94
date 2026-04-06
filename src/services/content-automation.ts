/**
 * Content Automation Service
 * Automatically fetches trending content from X (Twitter) and Reddit,
 * generates blog posts with AI, creates tools, and uploads images.
 * 
 * Run this as a cron job every hour.
 */

import cron from 'node-cron';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Configuration
const CONFIG = {
  cronSchedule: '0 * * * *', // Every hour
  maxPostsPerRun: 3,
  maxToolsPerRun: 1,
  minTrendScore: 50,
  sources: {
    twitter: {
      enabled: process.env.TWITTER_API_KEY ? true : false,
      trends: ['technology', 'AI', 'webdev', 'programming'],
      minRetweets: 100,
    },
    reddit: {
      enabled: process.env.REDDIT_CLIENT_ID ? true : false,
      subreddits: ['technology', 'programming', 'webdev', 'artificial'],
      minScore: 500,
    },
  },
};

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface TrendingContent {
  id: string;
  source: 'twitter' | 'reddit';
  title: string;
  content: string;
  url: string;
  author: string;
  score: number;
  timestamp: Date;
  tags: string[];
  imageUrl?: string;
}

interface GeneratedBlog {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  tags: string[];
  category: string;
  seoTitle: string;
  seoDescription: string;
  status: 'draft' | 'published';
}

interface GeneratedTool {
  name: string;
  slug: string;
  description: string;
  category: string;
  functionality: string;
  code: string;
  status: 'draft' | 'published';
}

class ContentAutomationService {
  private processedIds: Set<string> = new Set();
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'src', 'data', 'auto-generated');
    this.ensureOutputDir();
    this.loadProcessedIds();
  }

  private ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    const imageDir = path.join(this.outputDir, 'images');
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
  }

  private loadProcessedIds() {
    const filePath = path.join(this.outputDir, 'processed.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      this.processedIds = new Set(data);
    }
  }

  private saveProcessedIds() {
    const filePath = path.join(this.outputDir, 'processed.json');
    fs.writeFileSync(filePath, JSON.stringify(Array.from(this.processedIds)), 'utf-8');
  }

  /**
   * Fetch trending content from Twitter
   */
  async fetchTwitterTrends(): Promise<TrendingContent[]> {
    if (!CONFIG.sources.twitter.enabled) {
      console.log('Twitter integration disabled - add TWITTER_API_KEY to .env');
      return [];
    }

    try {
      const trends: TrendingContent[] = [];
      
      // Simulated Twitter API call (replace with actual implementation)
      for (const trend of CONFIG.sources.twitter.trends) {
        // In production: Use twitter-api-v2 to fetch real tweets
        // const searchResult = await twitterClient.v2.search({...})
        
        console.log(`Fetching Twitter trends for: #${trend}`);
        
        // Mock data for demonstration
        const mockTweet = {
          id: `twitter-mock-${Date.now()}`,
          text: `Exciting developments in ${trend}! The community is buzzing about new innovations.`,
          author: 'TechInfluencer',
          retweets: 150,
          created_at: new Date().toISOString(),
        };

        if (mockTweet.retweets >= CONFIG.sources.twitter.minRetweets && !this.processedIds.has(mockTweet.id)) {
          trends.push({
            id: mockTweet.id,
            source: 'twitter',
            title: mockTweet.text.split('.')[0],
            content: mockTweet.text,
            url: `https://twitter.com/${mockTweet.author}/status/${mockTweet.id}`,
            author: mockTweet.author,
            score: mockTweet.retweets,
            timestamp: new Date(mockTweet.created_at),
            tags: [trend],
          });
        }
      }

      return trends.sort((a, b) => b.score - a.score).slice(0, CONFIG.maxPostsPerRun);
    } catch (error) {
      console.error('Error fetching Twitter trends:', error);
      return [];
    }
  }

  /**
   * Fetch trending content from Reddit
   */
  async fetchRedditTrends(): Promise<TrendingContent[]> {
    if (!CONFIG.sources.reddit.enabled) {
      console.log('Reddit integration disabled - add REDDIT_CLIENT_ID to .env');
      return [];
    }

    try {
      const trends: TrendingContent[] = [];

      for (const subreddit of CONFIG.sources.reddit.subreddits) {
        try {
          const response = await fetch(
            `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`,
            {
              headers: {
                'User-Agent': 'CodeSec-AI-Bot/1.0',
              },
            }
          );

          if (!response.ok) continue;

          const data = await response.json();
          
          for (const post of data.data?.children || []) {
            const item = post.data;
            
            if (item.score < CONFIG.sources.reddit.minScore) continue;

            const content: TrendingContent = {
              id: `reddit-${item.id}`,
              source: 'reddit',
              title: item.title,
              content: item.selftext || item.url,
              url: `https://reddit.com${item.permalink}`,
              author: item.author,
              score: item.score,
              timestamp: new Date(item.created_utc * 1000),
              tags: [subreddit],
              imageUrl: item.thumbnail !== 'self' && item.thumbnail !== 'default' ? item.thumbnail : undefined,
            };

            if (!this.processedIds.has(content.id)) {
              trends.push(content);
            }
          }
        } catch (err) {
          console.warn(`Failed to fetch r/${subreddit}:`, err);
        }
      }

      return trends.sort((a, b) => b.score - a.score).slice(0, CONFIG.maxPostsPerRun);
    } catch (error) {
      console.error('Error fetching Reddit trends:', error);
      return [];
    }
  }

  /**
   * Generate blog post using AI
   */
  async generateBlogPost(content: TrendingContent): Promise<GeneratedBlog | null> {
    if (!openai) {
      console.log('OpenAI not configured, using template mode');
      return this.createTemplateBlog(content);
    }

    try {
      const prompt = `
        Based on this trending content from ${content.source}:
        
        Title: ${content.title}
        Content: ${content.content}
        Score: ${content.score}
        
        Create a comprehensive blog post with:
        1. Catchy SEO-friendly title (under 60 characters)
        2. Engaging introduction
        3. Detailed analysis (800+ words)
        4. Key takeaways
        5. Call to action
        
        Return as JSON with fields: title, slug, content, excerpt, tags, category, seoTitle, seoDescription
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'You are a professional tech blogger. Write engaging, informative content.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const generated = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        title: generated.title || content.title,
        slug: this.generateSlug(generated.title || content.title),
        content: generated.content || this.expandContent(content),
        excerpt: generated.excerpt || content.content.slice(0, 200) + '...',
        featuredImage: await this.generateImage(generated.title || content.title),
        tags: generated.tags || content.tags,
        category: generated.category || 'Technology',
        seoTitle: generated.seoTitle || generated.title,
        seoDescription: generated.seoDescription || generated.excerpt,
        status: 'draft',
      };
    } catch (error) {
      console.error('Error generating blog post:', error);
      return this.createTemplateBlog(content);
    }
  }

  /**
   * Create template-based blog post (fallback)
   */
  private createTemplateBlog(content: TrendingContent): GeneratedBlog {
    const title = content.title;
    const slug = this.generateSlug(title);
    
    return {
      title,
      slug,
      content: `
# ${title}

## Overview
${content.content}

## Why This Matters
This trending topic from ${content.source} has gained significant attention with ${content.score} engagements.

## Key Points
- 🔥 Trending on ${content.source}
- 👤 Shared by ${content.author}
- 📈 High engagement rate (${content.score})

## Analysis
[Add your detailed analysis here - expand on why this topic matters]

## Community Response
The community has shown strong interest in this topic, indicating its relevance and importance.

## Conclusion
Stay tuned for more updates on this developing story.

---
*Source: [${content.source}](${content.url})*
*Generated automatically by CodeSec AI Content System*
      `.trim(),
      excerpt: content.content.slice(0, 200) + '...',
      featuredImage: `/images/auto/${slug}.jpg`,
      tags: [...content.tags, 'trending', 'automated'],
      category: 'Technology',
      seoTitle: `${title} | CodeSec AI`,
      seoDescription: content.content.slice(0, 160) + ' - Automated content from CodeSec AI',
      status: 'draft',
    };
  }

  /**
   * Generate tool based on trending topics
   */
  async generateTool(content: TrendingContent): Promise<GeneratedTool | null> {
    const toolIdeas: Record<string, any> = {
      'AI': {
        name: 'AI Content Analyzer',
        category: 'AI Tools',
        functionality: 'Analyze and summarize AI-related content with advanced NLP',
      },
      'webdev': {
        name: 'Web Dev Quick Tools',
        category: 'Development',
        functionality: 'Quick utilities for web developers including formatters and validators',
      },
      'programming': {
        name: 'Code Snippet Generator',
        category: 'Development',
        functionality: 'Generate code snippets for common programming tasks',
      },
      'technology': {
        name: 'Tech Trend Tracker',
        category: 'Analytics',
        functionality: 'Track and analyze technology trends across platforms',
      },
    };

    const category = content.tags.find(t => toolIdeas[t]) || 'technology';
    const idea = toolIdeas[category] || {
      name: `${category.charAt(0).toUpperCase() + category.slice(1)} Helper Tool`,
      category: 'Utilities',
      functionality: 'Helpful tool for ' + category,
    };

    const tool: GeneratedTool = {
      name: idea.name,
      slug: this.generateSlug(idea.name),
      description: `A professional tool inspired by trending ${category} discussions. ${idea.functionality}.`,
      category: idea.category,
      functionality: idea.functionality,
      code: this.generateToolCode(idea.name, category),
      status: 'draft',
    };

    return tool;
  }

  /**
   * Generate placeholder tool code
   */
  private generateToolCode(name: string, category: string): string {
    const funcName = name.replace(/\s+/g, '');
    return `
/**
 * ${name}
 * Category: ${category}
 * Auto-generated tool based on trending topics
 */

export interface ${funcName}Input {
  data: any;
  options?: {
    format?: 'json' | 'text';
    verbose?: boolean;
  };
}

export interface ${funcName}Output {
  success: boolean;
  data: any;
  metadata?: {
    processedAt: string;
    version: string;
  };
}

/**
 * Main function for ${name}
 * @param input - Input data to process
 * @returns Processed result
 */
export function ${funcName}(input: ${funcName}Input): ${funcName}Output {
  console.log('[${funcName}] Processing:', input);
  
  const result: ${funcName}Output = {
    success: true,
    data: input.data,
    metadata: {
      processedAt: new Date().toISOString(),
      version: '1.0.0',
    },
  };
  
  if (input.options?.verbose) {
    console.log('[${funcName}] Verbose mode enabled');
  }
  
  return result;
}

export default ${funcName};
    `.trim();
  }

  /**
   * Generate or download image for blog post
   */
  private async generateImage(title: string): Promise<string> {
    const slug = this.generateSlug(title);
    const imagePath = path.join(this.outputDir, 'images', `${slug}.jpg`);
    
    try {
      // Try to fetch from Unsplash Source (free, no API key needed)
      const keywords = encodeURIComponent(title.split(' ').slice(0, 3).join(','));
      const imageUrl = `https://source.unsplash.com/1200x630/?technology,${keywords}`;
      
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to fetch image');
      
      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(imagePath, buffer);
      
      console.log(`✅ Image saved: ${imagePath}`);
      return `/images/auto/${slug}.jpg`;
    } catch (error) {
      console.log('Could not download image, using placeholder');
      // Create a simple SVG placeholder
      const svgPlaceholder = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#1a1a2e"/>
  <text x="50%" y="50%" font-family="Arial" font-size="48" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
    ${title.slice(0, 50)}
  </text>
  <text x="50%" y="60%" font-family="Arial" font-size="24" fill="#888888" text-anchor="middle">
    CodeSec AI - Auto-Generated
  </text>
</svg>`.trim();
      
      const svgPath = path.join(this.outputDir, 'images', `${slug}.svg`);
      fs.writeFileSync(svgPath, svgPlaceholder);
      
      return `/images/auto/${slug}.svg`;
    }
  }

  /**
   * Generate URL-friendly slug
   */
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60);
  }

  /**
   * Expand content into full article
   */
  private expandContent(content: TrendingContent): string {
    return `
# ${content.title}

## 🚀 Introduction
This trending topic from **${content.source}** has captured the attention of the tech community with **${content.score}** engagements.

## 📋 Original Content
> ${content.content}

## 🎯 Context and Background
Shared by **${content.author}**, this post has received significant traction, indicating strong community interest in the topic.

### Why This Matters
- **Trending Status**: Currently viral on ${content.source}
- **Community Impact**: ${content.score} engagements and counting
- **Relevance**: Addresses current industry developments

## 🔍 Analysis
[Detailed analysis section - expand with your expertise]

### Key Observations
1. First important observation about the trend
2. Second key insight from the community discussion
3. Third notable pattern or implication

## 💡 Key Takeaways
- ✅ Important point 1 for readers to remember
- ✅ Critical insight 2 for practical application
- ✅ Actionable takeaway 3 for implementation

## 🎓 What You Can Learn
This trending discussion highlights important developments in the field. Stay informed and adapt your strategies accordingly.

## 📞 Next Steps
- Follow the original discussion on [${content.source}](${content.url})
- Share your thoughts in the comments
- Subscribe for more automated insights

---
*Originally posted on [${content.source}](${content.url})*  
*Auto-generated by CodeSec AI Content System • ${new Date().toLocaleDateString()}*
    `.trim();
  }

  /**
   * Save generated content to file
   */
  private saveContent(data: any, filename: string): void {
    const filePath = path.join(this.outputDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`💾 Saved: ${filePath}`);
  }

  /**
   * Main automation run
   */
  async run(): Promise<void> {
    console.log('\\n🚀 Starting content automation run...');
    console.log(`⏰ Time: ${new Date().toISOString()}`);
    console.log(`📊 Config: ${CONFIG.maxPostsPerRun} posts, ${CONFIG.maxToolsPerRun} tools per run\\n`);

    try {
      // Fetch trending content from both sources
      console.log('📱 Fetching trending content...');
      const [twitterTrends, redditTrends] = await Promise.all([
        this.fetchTwitterTrends(),
        this.fetchRedditTrends(),
      ]);

      const allTrends = [...twitterTrends, ...redditTrends];
      console.log(`✅ Found ${allTrends.length} trending items\\n`);

      if (allTrends.length === 0) {
        console.log('ℹ️  No new trending content found');
        return;
      }

      // Generate blog posts
      const blogs: GeneratedBlog[] = [];
      console.log('✍️  Generating blog posts...');
      for (let i = 0; i < Math.min(allTrends.length, CONFIG.maxPostsPerRun); i++) {
        const content = allTrends[i];
        console.log(`   📝 #${i + 1}: ${content.title.slice(0, 50)}...`);
        
        const blog = await this.generateBlogPost(content);
        if (blog) {
          blogs.push(blog);
          this.processedIds.add(content.id);
          this.saveContent(blog, `blog-${blog.slug}.json`);
        }
      }

      // Generate tools
      const tools: GeneratedTool[] = [];
      if (allTrends.length > 0 && CONFIG.maxToolsPerRun > 0) {
        console.log('\\n🔧 Generating tools...');
        const toolContent = allTrends[0];
        console.log(`   🛠️  ${toolContent.title.slice(0, 50)}...`);
        
        const tool = await this.generateTool(toolContent);
        if (tool) {
          tools.push(tool);
          this.saveContent(tool, `tool-${tool.slug}.json`);
        }
      }

      // Save summary
      const summary = {
        timestamp: new Date().toISOString(),
        trendsFound: allTrends.length,
        blogsGenerated: blogs.length,
        toolsGenerated: tools.length,
        processedIdsCount: this.processedIds.size,
      };
      
      this.saveContent(summary, `run-summary-${Date.now()}.json`);
      this.saveProcessedIds();

      console.log('\\n✅ Automation run completed successfully!');
      console.log(`   📄 Blogs generated: ${blogs.length}`);
      console.log(`   🛠️  Tools generated: ${tools.length}`);
      console.log(`   📚 Total processed IDs: ${this.processedIds.size}\\n`);

    } catch (error) {
      console.error('❌ Automation run failed:', error);
      throw error;
    }
  }

  /**
   * Start the cron scheduler
   */
  startScheduler(): void {
    console.log(`\\n🕐 Starting automation scheduler: "${CONFIG.cronSchedule}" (Every hour)`);
    console.log(`📍 Output directory: ${this.outputDir}\\n`);
    
    cron.schedule(CONFIG.cronSchedule, async () => {
      console.log('\\n⏰ Scheduled automation triggered');
      await this.run();
    });

    console.log('✅ Scheduler started!');
    console.log('📌 Next run will be at the top of the next hour');
    console.log('🛑 Press Ctrl+C to stop\\n');
  }

  /**
   * Run immediately (for testing)
   */
  async runOnce(): Promise<void> {
    await this.run();
  }
}

// Export singleton instance
const automationService = new ContentAutomationService();

// CLI execution
if (process.argv[2] === '--start') {
  automationService.startScheduler();
} else if (process.argv[2] === '--run-once') {
  automationService.runOnce().catch(console.error);
} else {
  console.log('\\n🤖 CodeSec AI Content Automation Service');
  console.log('=========================================');
  console.log('\\nUsage:');
  console.log('  node content-automation.js --start     # Start hourly scheduler');
  console.log('  node content-automation.js --run-once  # Run once immediately');
  console.log('\\nEnvironment Variables Required:');
  console.log('  - OPENAI_API_KEY (optional, for AI generation)');
  console.log('  - TWITTER_API_KEY (optional, for Twitter trends)');
  console.log('  - REDDIT_CLIENT_ID (optional, for Reddit trends)');
  console.log('\\n');
}

export default automationService;
