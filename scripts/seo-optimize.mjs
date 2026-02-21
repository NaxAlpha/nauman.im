import fs from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = 'https://nauman.im';
const SITE_NAME = 'Nauman Mustafa';
const AUTHOR_NAME = 'Nauman Mustafa';
const AUTHOR_TWITTER = '@super_nauman';
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const TODAY = new Date().toISOString().slice(0, 10);

const NOINDEX_ROUTES = new Set([
  '/403.html',
  '/404.html',
  '/500.html',
  '/maintenance.html',
]);

const TITLE_OVERRIDES = {
  '/': 'Nauman Mustafa | AI Systems Engineer and ML Builder',
  '/resume.html': 'Nauman Mustafa Resume | AI Systems Engineer',
};

const DESCRIPTION_OVERRIDES = {
  '/': 'Portfolio and technical writing by Nauman Mustafa on AI systems, machine learning engineering, LLM applications, and production-ready software.',
  '/resume.html': 'Resume of Nauman Mustafa, an AI systems and machine learning engineer with experience in OCR, NLP, computer vision, and LLM-based products.',
  '/403.html': 'Access to this page is forbidden.',
  '/404.html': 'The requested page could not be found.',
  '/500.html': 'An unexpected server error occurred while loading this page.',
  '/maintenance.html': 'This site is temporarily unavailable for maintenance. Please check back soon.',
  '/ai-advancements-2019/': 'A 2019 snapshot of major AI breakthroughs across text, image, audio, and video generation, with practical startup use cases.',
  '/ai-chronicles-2026/': 'A software engineer journey from vibe coding to compound engineering, and what AI changes about architecture, intent, and code quality.',
  '/ai-in-autify-mobile-2021/': 'How Autify for Mobile uses machine learning for visual regression testing, visual self-healing, and AI-powered app exploration.',
  '/apply-modern-deep-learning-2021/': 'A practical guide to applying modern deep learning and pre-trained NLP models in production software and product workflows.',
  '/autify-ocr/': 'A benchmark of Autify OCR versus Google OCR on rendered mobile UI text, including methodology, accuracy metrics, and failure analysis.',
  '/deep-learning-in-cloud/': 'A cost-focused comparison of cloud GPU options for deep learning across AWS, Paperspace, Colab, and Google Cloud preemptible machines.',
  '/deploy-ml-on-cloud-run/': 'Step-by-step tutorial for packaging and deploying a machine learning app to Google Cloud Run with Docker and Cloud Shell.',
  '/gaining-4-years-of-software-engineering-experience-in-4-months/': 'AI changed my job from writing every line to directing parallel software systems. This is my field report from that shift.',
  '/gan-for-icons/': 'Using GANs to generate unique icon designs, with model behavior examples and creative applications for design workflows.',
  '/google-cloud-run/': 'Overview of Google Cloud Run and how serverless containers can simplify deployment, scaling, and cost management for ML applications.',
  '/lessons-learned-vibe-coding-ios-app/': 'Field notes from building an iOS app with AI coding tools, covering what worked, what failed, and how to ship faster with quality.',
  '/long-pythia/': 'Experiments on extending transformer context length, including training observations, tradeoffs, and lessons from long-context tuning.',
  '/prompt-engineering-2020/': 'How to use pre-trained NLP models effectively for text generation and question answering, with practical examples and tradeoffs.',
  '/social/linkedin-gpt-4-rumers/': 'A short opinion post on GPT-4 expectations, scaling constraints, and likely directions for next-generation language models.',
  '/token-compression/': 'An experiment on compressing multiple LLM tokens into one representation for faster decoding and longer effective context.',
  '/toy-app-navigation/': 'A case study on automated mobile app navigation using behavior cloning and heatmap prediction for tap-location modeling.',
};

const DATE_OVERRIDES = {
  '/ai-in-autify-mobile-2021/': '2021-11-08',
  '/toy-app-navigation/': '2021-07-25',
  '/autify-ocr/': '2023-09-06',
  '/token-compression/': '2023-08-11',
  '/ai-chronicles-2026/': '2026-01-01',
  '/gaining-4-years-of-software-engineering-experience-in-4-months/': '2026-02-21',
};

const IMAGE_OVERRIDES = {
  '/': '/photo.png',
  '/resume.html': '/photo.png',
  '/ai-chronicles-2026/': '/ai-chronicles-2026/vibe-coding-og.png',
  '/gaining-4-years-of-software-engineering-experience-in-4-months/': '/gaining-4-years-of-software-engineering-experience-in-4-months/header-command-ledger-abstract.svg',
};

const RESUME_KEYWORDS = [
  'Nauman Mustafa resume',
  'machine learning engineer',
  'AI systems engineer',
  'LLM engineer',
  'NLP',
  'computer vision',
  'OCR',
  'software engineering',
];

const HOME_KEYWORDS = [
  'Nauman Mustafa',
  'AI systems',
  'machine learning engineer',
  'LLM applications',
  'NLP',
  'computer vision',
  'OCR',
  'technical blog',
];

async function main() {
  const htmlFiles = (await walk(PUBLIC_DIR)).filter((file) => file.endsWith('.html')).sort();
  const pages = [];

  for (const file of htmlFiles) {
    const originalHtml = await fs.readFile(file, 'utf8');
    const route = routeFromFile(file);
    const kind = pageKind(route);
    const indexable = !NOINDEX_ROUTES.has(route);

    const existingTitle = getTitle(originalHtml);
    const finalTitle = TITLE_OVERRIDES[route] || existingTitle || fallbackTitle(route);
    const ogTitle = toOgTitle(finalTitle);

    const firstParagraph = extractFirstParagraph(originalHtml);
    const description = DESCRIPTION_OVERRIDES[route] || buildDescription(finalTitle, firstParagraph, kind);
    const keywords = buildKeywords(route, finalTitle, kind);
    const canonical = new URL(route, `${SITE_URL}/`).toString();
    const ogImage = resolveAbsoluteUrl(selectImage(originalHtml, route), route);
    const publishedDate = detectPublishedDate(originalHtml, route);
    const dateModified = TODAY;

    const metadata = {
      route,
      file,
      kind,
      indexable,
      title: finalTitle,
      ogTitle,
      description,
      keywords,
      canonical,
      ogImage,
      publishedDate,
      dateModified,
      robots: indexable
        ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        : 'noindex, nofollow, noarchive',
      ogType: kind === 'article' ? 'article' : 'website',
    };

    const optimizedHtml = injectSeo(originalHtml, metadata);
    await fs.writeFile(file, optimizedHtml, 'utf8');
    pages.push(metadata);
  }

  await fs.writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), buildSitemap(pages), 'utf8');
  await fs.writeFile(path.join(PUBLIC_DIR, 'robots.txt'), buildRobotsTxt(), 'utf8');
  await fs.writeFile(path.join(PUBLIC_DIR, 'rss.xml'), buildRss(pages), 'utf8');

  console.log(`SEO optimization complete: ${pages.length} HTML files updated.`);
}

function pageKind(route) {
  if (route === '/') return 'home';
  if (route === '/resume.html') return 'resume';
  if (NOINDEX_ROUTES.has(route)) return 'utility';
  if (route.startsWith('/social/')) return 'article';
  if (!route.endsWith('.html')) return 'article';
  return 'page';
}

function fallbackTitle(route) {
  if (route === '/') return TITLE_OVERRIDES['/'];
  return `Nauman Mustafa${route}`;
}

function getTitle(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? normalizeSpace(decodeEntities(stripTags(match[1]))) : '';
}

function buildDescription(title, firstParagraph, kind) {
  if (kind === 'article' && firstParagraph) {
    return truncate(firstParagraph, 156);
  }
  if (kind === 'home') {
    return DESCRIPTION_OVERRIDES['/'];
  }
  if (kind === 'resume') {
    return DESCRIPTION_OVERRIDES['/resume.html'];
  }
  return truncate(`Explore ${toOgTitle(title)} by ${AUTHOR_NAME}.`, 156);
}

function buildKeywords(route, title, kind) {
  if (route === '/') return HOME_KEYWORDS.join(', ');
  if (route === '/resume.html') return RESUME_KEYWORDS.join(', ');
  if (NOINDEX_ROUTES.has(route)) return 'nauman.im';

  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'from', 'into', 'this', 'that', 'your', 'you', 'are', 'how', 'use', 'case', 'part', 'very', 'more', 'most', 'over', 'than', 'does', 'not', 'but', 'out', 'all', 'run',
  ]);

  const tokens = normalizeSpace(toOgTitle(title))
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));

  const set = new Set(tokens.slice(0, 7));
  set.add('nauman mustafa');
  set.add('ai');
  set.add('machine learning');
  set.add('software engineering');

  if (kind === 'article') {
    set.add('technical blog');
  }

  return Array.from(set).slice(0, 12).join(', ');
}

function selectImage(html, route) {
  if (IMAGE_OVERRIDES[route]) return IMAGE_OVERRIDES[route];

  const body = getBody(html);
  const imageMatch = body.match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);
  if (imageMatch && imageMatch[1]) {
    return imageMatch[1].trim();
  }

  return '/photo.png';
}

function detectPublishedDate(html, route) {
  if (DATE_OVERRIDES[route]) return DATE_OVERRIDES[route];

  const bodyText = normalizeSpace(decodeEntities(stripTags(getBody(html))));

  const isoMatch = bodyText.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (isoMatch) {
    const value = `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    if (isIsoDate(value)) return value;
  }

  const monthDateRegex = /\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2}),\s+(20\d{2})\b/g;
  let monthMatch;
  while ((monthMatch = monthDateRegex.exec(bodyText)) !== null) {
    const month = monthNameToNumber(monthMatch[1]);
    const day = Number(monthMatch[2]);
    const year = Number(monthMatch[3]);
    const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (isIsoDate(isoDate)) return isoDate;
  }

  const yearMatch = route.match(/(20\d{2})/);
  if (yearMatch) return `${yearMatch[1]}-01-01`;

  return TODAY;
}

function monthNameToNumber(month) {
  const key = month.toLowerCase();
  const map = {
    jan: 1,
    january: 1,
    feb: 2,
    february: 2,
    mar: 3,
    march: 3,
    apr: 4,
    april: 4,
    may: 5,
    jun: 6,
    june: 6,
    jul: 7,
    july: 7,
    aug: 8,
    august: 8,
    sep: 9,
    sept: 9,
    september: 9,
    oct: 10,
    october: 10,
    nov: 11,
    november: 11,
    dec: 12,
    december: 12,
  };
  return map[key] || 1;
}

function isIsoDate(value) {
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp);
}

function injectSeo(html, page) {
  const headRegex = /<head>([\s\S]*?)<\/head>/i;
  const match = html.match(headRegex);
  if (!match) return html;

  let headInner = match[1];

  headInner = removeManagedSeo(headInner);

  if (/<title>[\s\S]*?<\/title>/i.test(headInner)) {
    headInner = headInner.replace(/<title>[\s\S]*?<\/title>/i, `    <title>${escapeHtml(page.title)}</title>`);
  } else {
    headInner = `\n    <title>${escapeHtml(page.title)}</title>\n${headInner}`;
  }

  const seoBlock = buildSeoBlock(page);
  const normalizedHead = `${headInner.replace(/^\s*\n/, '').trimEnd()}\n\n${seoBlock}\n`;
  const updatedHead = `<head>\n${normalizedHead}</head>`;

  return html.replace(headRegex, updatedHead);
}

function removeManagedSeo(headInner) {
  const patterns = [
    /<!--\s*Primary Meta Tags\s*-->\s*/gi,
    /<!--\s*Open Graph[^-]*-->\s*/gi,
    /<!--\s*Twitter\s*-->\s*/gi,
    /<!--\s*Structured Data\s*-->\s*/gi,
    /<!--\s*Favicon\s*-->\s*/gi,
    /<!--\s*Theme Color\s*-->\s*/gi,
    /<!--\s*Preconnect for performance\s*-->\s*/gi,
    /<!--\s*SEO Metadata\s*-->\s*/gi,
    /<meta\b[^>]*\bname=["'](?:title|description|keywords|author|robots|googlebot|theme-color|referrer|twitter:[^"']+|msapplication-TileColor)["'][^>]*>\s*/gi,
    /<meta\b[^>]*\bproperty=["'](?:og:[^"']+|article:[^"']+)["'][^>]*>\s*/gi,
    /<link\b[^>]*\brel=["']canonical["'][^>]*>\s*/gi,
    /<link\b[^>]*\brel=["']sitemap["'][^>]*>\s*/gi,
    /<link\b[^>]*\brel=["']alternate["'][^>]*\btype=["']application\/rss\+xml["'][^>]*>\s*/gi,
    /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,
  ];

  let output = headInner;
  for (const pattern of patterns) {
    output = output.replace(pattern, '');
  }

  return output;
}

function buildSeoBlock(page) {
  const lines = [
    '    <!-- SEO Metadata -->',
    `    <meta name="description" content="${escapeAttr(page.description)}">`,
    `    <meta name="author" content="${escapeAttr(AUTHOR_NAME)}">`,
    `    <meta name="keywords" content="${escapeAttr(page.keywords)}">`,
    `    <meta name="robots" content="${escapeAttr(page.robots)}">`,
    `    <meta name="googlebot" content="${escapeAttr(page.robots)}">`,
    '    <meta name="referrer" content="strict-origin-when-cross-origin">',
    '    <meta name="theme-color" content="#0f172a">',
    `    <link rel="canonical" href="${escapeAttr(page.canonical)}">`,
    '    <link rel="sitemap" type="application/xml" href="/sitemap.xml">',
  ];

  if (page.indexable) {
    lines.push('    <link rel="alternate" type="application/rss+xml" title="Nauman Mustafa RSS Feed" href="/rss.xml">');
  }

  lines.push(`    <meta property="og:type" content="${escapeAttr(page.ogType)}">`);
  lines.push(`    <meta property="og:site_name" content="${escapeAttr(SITE_NAME)}">`);
  lines.push('    <meta property="og:locale" content="en_US">');
  lines.push(`    <meta property="og:url" content="${escapeAttr(page.canonical)}">`);
  lines.push(`    <meta property="og:title" content="${escapeAttr(page.ogTitle)}">`);
  lines.push(`    <meta property="og:description" content="${escapeAttr(page.description)}">`);
  lines.push(`    <meta property="og:image" content="${escapeAttr(page.ogImage)}">`);
  lines.push(`    <meta property="og:image:alt" content="${escapeAttr(page.ogTitle)}">`);

  if (page.kind === 'article') {
    lines.push(`    <meta property="article:author" content="${escapeAttr(AUTHOR_NAME)}">`);
    lines.push(`    <meta property="article:published_time" content="${escapeAttr(`${page.publishedDate}T00:00:00Z`)}">`);
    lines.push(`    <meta property="article:modified_time" content="${escapeAttr(`${page.dateModified}T00:00:00Z`)}">`);
  }

  lines.push('    <meta name="twitter:card" content="summary_large_image">');
  lines.push(`    <meta name="twitter:site" content="${escapeAttr(AUTHOR_TWITTER)}">`);
  lines.push(`    <meta name="twitter:creator" content="${escapeAttr(AUTHOR_TWITTER)}">`);
  lines.push(`    <meta name="twitter:title" content="${escapeAttr(page.ogTitle)}">`);
  lines.push(`    <meta name="twitter:description" content="${escapeAttr(page.description)}">`);
  lines.push(`    <meta name="twitter:image" content="${escapeAttr(page.ogImage)}">`);

  const jsonLd = buildJsonLd(page);
  if (jsonLd) {
    lines.push('    <script type="application/ld+json">');
    lines.push(indentJson(jsonLd, 4));
    lines.push('    </script>');
  }

  return lines.join('\n');
}

function buildJsonLd(page) {
  const personEntity = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/photo.png`,
  };

  if (page.kind === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        personEntity,
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: `${SITE_URL}/`,
          name: SITE_NAME,
          inLanguage: 'en-US',
          publisher: {
            '@id': `${SITE_URL}/#person`,
          },
        },
      ],
    };
  }

  if (page.kind === 'resume') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      url: page.canonical,
      name: page.ogTitle,
      description: page.description,
      mainEntity: {
        ...personEntity,
        knowsAbout: ['Machine Learning', 'AI Systems', 'NLP', 'Computer Vision', 'LLM Engineering'],
      },
    };
  }

  if (page.kind === 'article') {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: page.ogTitle,
      description: page.description,
      image: [page.ogImage],
      author: personEntity,
      publisher: personEntity,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': page.canonical,
      },
      url: page.canonical,
      datePublished: page.publishedDate,
      dateModified: page.dateModified,
      inLanguage: 'en-US',
      keywords: page.keywords,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.ogTitle,
    description: page.description,
    url: page.canonical,
    inLanguage: 'en-US',
  };
}

function buildSitemap(pages) {
  const indexablePages = pages
    .filter((page) => page.indexable)
    .sort((a, b) => a.canonical.localeCompare(b.canonical));

  const urls = indexablePages
    .map((page) => {
      const priority =
        page.route === '/' ? '1.0' : page.route === '/resume.html' ? '0.8' : page.kind === 'article' ? '0.7' : '0.6';
      const changefreq = page.route === '/' ? 'weekly' : 'monthly';

      return `  <url>\n    <loc>${escapeXml(page.canonical)}</loc>\n    <lastmod>${page.dateModified}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobotsTxt() {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /403.html',
    'Disallow: /404.html',
    'Disallow: /500.html',
    'Disallow: /maintenance.html',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Host: ${SITE_URL.replace(/^https?:\/\//, '')}`,
    '',
  ].join('\n');
}

function buildRss(pages) {
  const entries = pages
    .filter((page) => page.kind === 'article' && page.indexable)
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
    .map((page) => {
      const pubDate = new Date(`${page.publishedDate}T00:00:00Z`).toUTCString();
      return [
        '  <item>',
        `    <title>${escapeXml(page.ogTitle)}</title>`,
        `    <link>${escapeXml(page.canonical)}</link>`,
        `    <guid isPermaLink="true">${escapeXml(page.canonical)}</guid>`,
        `    <pubDate>${escapeXml(pubDate)}</pubDate>`,
        `    <description>${escapeXml(page.description)}</description>`,
        '  </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(SITE_NAME)}</title>`,
    `    <link>${escapeXml(`${SITE_URL}/`)}</link>`,
    '    <description>Technical writing by Nauman Mustafa on AI systems and software engineering.</description>',
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    '    <language>en-us</language>',
    entries,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

function toOgTitle(title) {
  return normalizeSpace(title)
    .replace(/\s+\|\s+Nauman Mustafa$/i, '')
    .replace(/\s+-\s+Nauman Mustafa$/i, '')
    .trim();
}

function extractFirstParagraph(html) {
  const body = getBody(html);
  const paragraphRegex = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let match;

  while ((match = paragraphRegex.exec(body)) !== null) {
    const text = normalizeSpace(decodeEntities(stripTags(match[1])));
    if (text.length >= 90) {
      return text;
    }
  }

  return '';
}

function getBody(html) {
  const match = html.match(/<body[\s\S]*?<\/body>/i);
  return match ? match[0] : html;
}

function routeFromFile(file) {
  const relativePath = path.relative(PUBLIC_DIR, file).replace(/\\/g, '/');

  if (relativePath === 'index.html') {
    return '/';
  }

  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'index.html'.length)}`;
  }

  return `/${relativePath}`;
}

function resolveAbsoluteUrl(value, route) {
  if (!value) {
    return `${SITE_URL}/photo.png`;
  }

  const raw = value.trim();

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  if (raw.startsWith('//')) {
    return `https:${raw}`;
  }

  const basePath = route.endsWith('/') ? route : route.slice(0, route.lastIndexOf('/') + 1) || '/';

  const normalizedPath = raw.startsWith('/')
    ? raw
    : path.posix.normalize(path.posix.join(basePath, raw));

  const absolutePath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  return `${SITE_URL}${absolutePath}`;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walk(absolutePath)));
    } else {
      results.push(absolutePath);
    }
  }

  return results;
}

function normalizeSpace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function truncate(value, maxLength) {
  if (value.length <= maxLength) return value;
  const sliceLength = Math.max(0, maxLength - 3);
  const sliced = value.slice(0, sliceLength).trimEnd();
  const boundary = sliced.lastIndexOf(' ');
  const cleaned = boundary > Math.floor(sliceLength * 0.6) ? sliced.slice(0, boundary).trimEnd() : sliced;
  return `${cleaned}...`;
}

function stripTags(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function indentJson(value, spaces) {
  const prefix = ' '.repeat(spaces);
  return JSON.stringify(value, null, 2)
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
