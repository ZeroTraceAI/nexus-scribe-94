# CodeSecAI - Cybersecurity, AI & Programming Platform

A modern web platform built with React, TypeScript, and Vite, offering tools and resources for developers and security professionals.

## 🚀 Features

- **Developer Tools**: Collection of web-based tools including:
  - Security Header Checker
  - SSL Certificate Checker
  - DNS Lookup
  - WHOIS Lookup
  - Sitemap Generator
  - Schema Markup Generator
  - And more...

- **Modern Tech Stack**:
  - ⚛️ React 18 with TypeScript
  - ⚡ Vite for blazing fast development
  - 🎨 Tailwind CSS + shadcn/ui for beautiful UI
  - 🧪 Vitest for testing
  - 🔍 ESLint for code quality

- **SEO Optimized**: Built-in SEO component with structured data support
- **Responsive Design**: Works on all devices
- **Accessibility**: ARIA-compliant components

## 📋 Prerequisites

- Node.js 20+ ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or bun package manager

## 🛠️ Getting Started

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env.local
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
/workspace
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── tools/      # Tool-specific components
│   │   └── shared/     # Shared components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── assets/         # Static assets
│   └── test/           # Test files
├── public/             # Public static files
├── .github/workflows/  # CI/CD pipelines
└── config files        # TypeScript, ESLint, Vite, etc.
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- path/to/test.tsx
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure your environment variables:

```bash
VITE_API_KEY=your_api_key_here
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### TypeScript

This project uses strict TypeScript configuration for better type safety. See `tsconfig.json` for details.

### ESLint

Code quality is enforced via ESLint with TypeScript support. Rules are configured in `eslint.config.js`.

## 🚢 Deployment

The project can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect Git
- **Cloudflare Pages**: Deploy directly from Git

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 📞 Support

For issues and questions, please open an issue on GitHub.
