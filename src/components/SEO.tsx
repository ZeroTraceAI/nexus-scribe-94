import { Helmet } from "react-helmet-async";

const BASE_URL = "https://codesecai.com";

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface ArticleJsonLd {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorRole?: string;
  section?: string;
  tags?: string[];
  wordCount?: number;
}

interface SoftwareAppJsonLd {
  name: string;
  description: string;
  category: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  articleJsonLd?: ArticleJsonLd;
  softwareAppJsonLd?: SoftwareAppJsonLd;
  faqJsonLd?: FAQItem[];
  includeOrgJsonLd?: boolean;
}

const getOrganizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CodeSecAI",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.ico`,
  description:
    "Expert tutorials, analysis, and tools for developers and security professionals navigating cybersecurity, AI, cloud, blockchain, and modern programming.",
  sameAs: ["https://twitter.com/codesecai"],
  founder: {
    "@type": "Person",
    name: "CodeSecAI Team",
  },
});

const getWebSiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CodeSecAI",
  url: BASE_URL,
  description:
    "Expert tutorials, analysis, and tools for developers and security professionals.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

const getBreadcrumbJsonLd = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${BASE_URL}${item.path}`,
  })),
});

const getArticleJsonLd = (article: ArticleJsonLd) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.headline,
  description: article.description,
  image: article.image?.startsWith("http")
    ? article.image
    : `${BASE_URL}${article.image}`,
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  author: {
    "@type": "Person",
    name: article.authorName,
    ...(article.authorRole && { jobTitle: article.authorRole }),
  },
  publisher: {
    "@type": "Organization",
    name: "CodeSecAI",
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/favicon.ico`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": BASE_URL,
  },
  ...(article.section && { articleSection: article.section }),
  ...(article.tags && { keywords: article.tags.join(", ") }),
  ...(article.wordCount && { wordCount: article.wordCount }),
});

const getSoftwareAppJsonLd = (app: SoftwareAppJsonLd) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: app.name,
  description: app.description,
  applicationCategory: app.category,
  url: app.url,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  operatingSystem: "Web",
});

const getFAQJsonLd = (items: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

const SEO = ({
  title,
  description = "Expert tutorials, analysis, and tools for developers and security professionals navigating cybersecurity, AI, cloud, blockchain, and modern programming.",
  canonical,
  ogType = "website",
  ogImage = "/og-default.png",
  article,
  noindex = false,
  breadcrumbs,
  articleJsonLd,
  softwareAppJsonLd,
  faqJsonLd,
  includeOrgJsonLd = false,
}: SEOProps) => {
  const fullTitle = title
    ? `${title} | CodeSecAI`
    : "CodeSecAI — Security, AI & Code Deep Dives";
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`;

  const jsonLdScripts: object[] = [];

  if (includeOrgJsonLd) {
    jsonLdScripts.push(getOrganizationJsonLd());
    jsonLdScripts.push(getWebSiteJsonLd());
  }

  if (breadcrumbs) {
    jsonLdScripts.push(getBreadcrumbJsonLd(breadcrumbs));
  }

  if (articleJsonLd) {
    jsonLdScripts.push(getArticleJsonLd(articleJsonLd));
  }

  if (softwareAppJsonLd) {
    jsonLdScripts.push(getSoftwareAppJsonLd(softwareAppJsonLd));
  }

  if (faqJsonLd) {
    jsonLdScripts.push(getFAQJsonLd(faqJsonLd));
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImageUrl} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content="CodeSecAI" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:site" content="@codesecai" />

      {/* Article-specific */}
      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {article?.author && <meta property="article:author" content={article.author} />}
      {article?.section && <meta property="article:section" content={article.section} />}
      {article?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* JSON-LD Structured Data */}
      {jsonLdScripts.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
