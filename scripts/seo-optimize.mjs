import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);

const SITE_URL = 'https://nauman.im';
const SITE_NAME = 'Nauman Mustafa';
const AUTHOR_NAME = 'Nauman Mustafa';
const AUTHOR_TWITTER = '@super_nauman';
const PERSON_JOB_TITLE = 'AI Systems Engineer';
const PERSON_SAME_AS = [
  'https://www.linkedin.com/in/naxalpha/',
  'https://github.com/NaxAlpha',
];
const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');
const CONTENT_DIR = path.resolve(ROOT_DIR, 'content');
const SITE_ICON_PATH = '/favicon.svg';
const APPLE_TOUCH_ICON_PATH = '/photo.png';
const TODAY = new Date().toISOString().slice(0, 10);
const gitDateCache = new Map();
const gitDirtyCache = new Map();
const imageDimensionCache = new Map();

const NOINDEX_ROUTES = new Set([
  '/403.html',
  '/404.html',
  '/500.html',
  '/maintenance.html',
  '/resume.html',
]);

const TITLE_OVERRIDES = {
  '/': 'Nauman Mustafa | AI Systems Engineer and ML Builder',
  '/resume/': 'Nauman Mustafa Resume | AI Systems Engineer',
  '/writing/': 'Writing | Nauman Mustafa on AI Systems and LLMs',
  '/ai-advancements-2019/': 'Recent AI Advancements in 2019 | Nauman Mustafa',
  '/ai-chronicles-2026/': 'From Vibe Coding to Compound Engineering | Nauman Mustafa',
  '/deploy-ml-on-cloud-run/': 'Deploy ML Models on Google Cloud Run | Nauman Mustafa',
  '/gaining-4-years-of-software-engineering-experience-in-4-months/': '4 Years of Engineering Experience in 4 Months | Nauman Mustafa',
  '/gan-for-icons/': 'GANs for Icon Generation | Nauman Mustafa',
  '/lessons-learned-vibe-coding-ios-app/': 'Lessons From Vibe Coding an iOS App | Nauman Mustafa',
};

const DESCRIPTION_OVERRIDES = {
  '/': 'Portfolio and technical writing by Nauman Mustafa on AI systems, machine learning engineering, LLM applications, and production-ready software.',
  '/resume/': 'Resume of Nauman Mustafa, an AI systems and machine learning engineer with experience in OCR, NLP, computer vision, and LLM-based products.',
  '/resume.html': 'Redirecting to the canonical resume URL for Nauman Mustafa.',
  '/writing/': 'Browse Nauman Mustafa’s essays and tutorials on AI systems, OCR, LLM engineering, mobile automation, and product delivery.',
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
  '/social/linkedin-gpt-4-rumers/': '2023-01-15',
  '/ai-chronicles-2026/': '2026-01-01',
  '/gaining-4-years-of-software-engineering-experience-in-4-months/': '2026-02-21',
};

const IMAGE_OVERRIDES = {
  '/': '/photo.png',
  '/resume/': '/photo.png',
  '/ai-chronicles-2026/': '/ai-chronicles-2026/vibe-coding-og.png',
  '/gaining-4-years-of-software-engineering-experience-in-4-months/': '/gaining-4-years-of-software-engineering-experience-in-4-months/header-command-ledger-abstract.svg',
};
const CANONICAL_OVERRIDES = {
  '/resume.html': `${SITE_URL}/resume/`,
};
const ROUTE_SOURCE_OVERRIDES = {
  '/': path.join(PUBLIC_DIR, 'index.html'),
  '/resume/': path.join(PUBLIC_DIR, 'resume', 'index.html'),
  '/resume.html': path.join(PUBLIC_DIR, 'resume.html'),
  '/writing/': path.join(PUBLIC_DIR, 'writing', 'index.html'),
  '/apply-modern-deep-learning-2021/': path.join(CONTENT_DIR, 'blogs', 'modern-deep-learning-2021.md'),
  '/social/linkedin-gpt-4-rumers/': path.join(CONTENT_DIR, 'social', 'linkedin-gpt-4-rumers.md'),
};
const PAGE_KIND_OVERRIDES = {
  '/writing/': 'writing',
};

async function main() {
  const htmlFiles = (await walk(PUBLIC_DIR)).filter((file) => file.endsWith('.html')).sort();
  const pages = [];

  for (const file of htmlFiles) {
    const originalHtml = await fs.readFile(file, 'utf8');
    const route = routeFromFile(file);
    const kind = pageKind(route);
    const indexable = !NOINDEX_ROUTES.has(route);
    const sourceFile = await resolveSourceFile(route, file);

    const existingTitle = getTitle(originalHtml);
    const finalTitle = TITLE_OVERRIDES[route] || existingTitle || fallbackTitle(route);
    const ogTitle = toOgTitle(finalTitle);

    const firstParagraph = extractFirstParagraph(originalHtml);
    const description = DESCRIPTION_OVERRIDES[route] || buildDescription(finalTitle, firstParagraph, kind);
    const canonical = CANONICAL_OVERRIDES[route] || new URL(route, `${SITE_URL}/`).toString();
    const ogImage = resolveAbsoluteUrl(selectImage(originalHtml, route), route);
    const publishedDate = detectPublishedDate(originalHtml, route);
    const dateModified = await detectModifiedDate(file, sourceFile, publishedDate);

    const metadata = {
      route,
      file,
      sourceFile,
      originalHtml,
      kind,
      indexable,
      title: finalTitle,
      ogTitle,
      description,
      canonical,
      ogImage,
      publishedDate,
      dateModified,
      robots: indexable
        ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        : 'noindex, nofollow, noarchive',
      ogType: kind === 'article' ? 'article' : 'website',
    };

    pages.push(metadata);
  }

  for (const page of pages) {
    const optimizedMarkup = await optimizePageMarkup(page.originalHtml, page, pages);
    const optimizedHtml = injectSeo(optimizedMarkup, page, pages);
    await fs.writeFile(page.file, optimizedHtml, 'utf8');
  }

  await fs.writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), buildSitemap(pages), 'utf8');
  await fs.writeFile(path.join(PUBLIC_DIR, 'robots.txt'), buildRobotsTxt(), 'utf8');
  await fs.writeFile(path.join(PUBLIC_DIR, 'rss.xml'), buildRss(pages), 'utf8');

  console.log(`SEO optimization complete: ${pages.length} HTML files updated.`);
}

function pageKind(route) {
  if (PAGE_KIND_OVERRIDES[route]) return PAGE_KIND_OVERRIDES[route];
  if (route === '/') return 'home';
  if (route === '/resume/') return 'resume';
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
    return DESCRIPTION_OVERRIDES['/resume/'];
  }
  if (kind === 'writing') {
    return DESCRIPTION_OVERRIDES['/writing/'];
  }
  return truncate(`Explore ${toOgTitle(title)} by ${AUTHOR_NAME}.`, 156);
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

async function detectModifiedDate(file, sourceFile, publishedDate) {
  const candidates = Array.from(new Set([sourceFile, file].filter(Boolean)));

  for (const candidate of candidates) {
    if (await hasWorkingTreeChanges(candidate)) {
      const stat = await fs.stat(candidate);
      return toIsoDate(stat.mtime);
    }
  }

  const gitDates = await Promise.all(candidates.map((candidate) => getGitLastModified(candidate)));
  const validGitDates = gitDates.filter(Boolean).sort();
  if (validGitDates.length > 0) {
    return validGitDates.at(-1);
  }

  return publishedDate;
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

function injectSeo(html, page, pages) {
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

  const seoBlock = buildSeoBlock(page, pages);
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
    /<link\b[^>]*\brel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>\s*/gi,
    /<link\b[^>]*\bhref=["']\/lib\/seo\.css["'][^>]*>\s*/gi,
    /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,
  ];

  let output = headInner;
  for (const pattern of patterns) {
    output = output.replace(pattern, '');
  }

  return output;
}

function buildSeoBlock(page, pages) {
  const lines = [
    '    <!-- SEO Metadata -->',
    `    <meta name="description" content="${escapeAttr(page.description)}">`,
    `    <meta name="author" content="${escapeAttr(AUTHOR_NAME)}">`,
    `    <meta name="robots" content="${escapeAttr(page.robots)}">`,
    `    <meta name="googlebot" content="${escapeAttr(page.robots)}">`,
    '    <meta name="referrer" content="strict-origin-when-cross-origin">',
    '    <meta name="theme-color" content="#0f172a">',
    `    <link rel="icon" type="image/svg+xml" href="${SITE_ICON_PATH}">`,
    `    <link rel="apple-touch-icon" href="${APPLE_TOUCH_ICON_PATH}">`,
    `    <link rel="canonical" href="${escapeAttr(page.canonical)}">`,
    '    <link rel="stylesheet" href="/lib/seo.css">',
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

  const jsonLd = buildJsonLd(page, pages);
  if (jsonLd) {
    lines.push('    <script type="application/ld+json">');
    lines.push(indentJson(jsonLd, 4));
    lines.push('    </script>');
  }

  return lines.join('\n');
}

function buildJsonLd(page, pages) {
  const personEntity = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/photo.png`,
    sameAs: PERSON_SAME_AS,
    jobTitle: PERSON_JOB_TITLE,
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
      '@graph': [
        {
          '@type': 'ProfilePage',
          url: page.canonical,
          name: page.ogTitle,
          description: page.description,
          mainEntity: {
            ...personEntity,
            knowsAbout: ['Machine Learning', 'AI Systems', 'NLP', 'Computer Vision', 'LLM Engineering'],
          },
        },
        buildBreadcrumbList(page),
      ],
    };
  }

  if (page.kind === 'writing') {
    const listItems = pages
      .filter((entry) => entry.kind === 'article' && entry.indexable)
      .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
      .map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: entry.canonical,
        name: entry.ogTitle,
      }));

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          url: page.canonical,
          name: page.ogTitle,
          description: page.description,
          inLanguage: 'en-US',
        },
        {
          '@type': 'ItemList',
          itemListElement: listItems,
        },
        buildBreadcrumbList(page),
      ],
    };
  }

  if (page.kind === 'article') {
    const articleEntity = {
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
    };

    return {
      '@context': 'https://schema.org',
      '@graph': [articleEntity, buildBreadcrumbList(page)],
    };
  }

  const breadcrumb = buildBreadcrumbList(page);
  return breadcrumb
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            name: page.ogTitle,
            description: page.description,
            url: page.canonical,
            inLanguage: 'en-US',
          },
          breadcrumb,
        ],
      }
    : {
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
        page.route === '/' ? '1.0' : page.route === '/resume/' ? '0.8' : page.kind === 'article' ? '0.7' : '0.6';
      const changefreq = page.route === '/' ? 'weekly' : page.kind === 'article' ? 'monthly' : 'weekly';

      return `  <url>\n    <loc>${escapeXml(page.canonical)}</loc>\n    <lastmod>${page.dateModified}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobotsTxt() {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
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

async function resolveSourceFile(route, htmlFile) {
  const override = ROUTE_SOURCE_OVERRIDES[route];
  if (override && (await fileExists(override))) {
    return override;
  }

  if (route.startsWith('/social/')) {
    const socialCandidate = path.join(CONTENT_DIR, 'social', `${route.split('/').filter(Boolean).at(-1)}.md`);
    if (await fileExists(socialCandidate)) {
      return socialCandidate;
    }
  }

  if (route.endsWith('/') && route !== '/' && !route.startsWith('/resume/')) {
    const slug = route.split('/').filter(Boolean).at(-1);
    const blogCandidate = path.join(CONTENT_DIR, 'blogs', `${slug}.md`);
    if (await fileExists(blogCandidate)) {
      return blogCandidate;
    }
  }

  return htmlFile;
}

async function optimizePageMarkup(html, page, pages) {
  let output = stripManagedRelatedLinks(html);
  output = await optimizeImages(output, page.file, page.route);

  if (page.kind === 'article') {
    output = injectRelatedLinks(output, page, pages);
  }

  return output;
}

function stripManagedRelatedLinks(html) {
  return html.replace(/\s*<!-- SITE-RELATED-START -->[\s\S]*?<!-- SITE-RELATED-END -->\s*/g, '\n');
}

function injectRelatedLinks(html, page, pages) {
  const relatedPages = selectRelatedPages(page, pages);
  if (relatedPages.length === 0) {
    return html;
  }

  const links = relatedPages
    .map(
      (relatedPage) =>
        `      <li><a href="${escapeAttr(relatedPage.route)}">${escapeHtml(relatedPage.ogTitle)}</a><span>${escapeHtml(relatedPage.description)}</span></li>`,
    )
    .join('\n');

  const block = [
    '<!-- SITE-RELATED-START -->',
    '<section class="site-related-links" aria-labelledby="site-related-heading">',
    '  <div class="site-related-inner">',
    '    <p class="site-related-kicker">Explore more</p>',
    '    <h2 id="site-related-heading">More writing on AI systems and shipping software</h2>',
    '    <ul class="site-related-list">',
    links,
    '    </ul>',
    '    <p class="site-related-archive"><a href="/writing/">Browse the full writing archive</a></p>',
    '  </div>',
    '</section>',
    '<!-- SITE-RELATED-END -->',
  ].join('\n');

  if (html.includes('</main>')) {
    return injectBeforeLastClosingTag(html, '</main>', `${block}\n`);
  }

  if (html.includes('</article>')) {
    return injectBeforeLastClosingTag(html, '</article>', `${block}\n`);
  }

  return injectBeforeLastClosingTag(html, '</body>', `${block}\n`);
}

function injectBeforeLastClosingTag(html, closingTag, content) {
  const index = html.lastIndexOf(closingTag);
  if (index === -1) {
    return html;
  }

  return `${html.slice(0, index)}${content}${html.slice(index)}`;
}

function selectRelatedPages(page, pages) {
  const candidates = pages.filter((entry) => entry.kind === 'article' && entry.indexable && entry.route !== page.route);
  if (candidates.length === 0) {
    return [];
  }

  const sourceTokens = new Set(tokenizeForSimilarity(`${page.ogTitle} ${page.description} ${page.route}`));
  const scored = candidates.map((candidate) => {
    const candidateTokens = tokenizeForSimilarity(`${candidate.ogTitle} ${candidate.description} ${candidate.route}`);
    const overlap = candidateTokens.filter((token) => sourceTokens.has(token)).length;
    const yearDistance = Math.abs(Number(candidate.publishedDate.slice(0, 4)) - Number(page.publishedDate.slice(0, 4)));
    const recencyBonus = Math.max(0, 2 - yearDistance);
    return {
      candidate,
      score: overlap * 4 + recencyBonus,
    };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.candidate.publishedDate.localeCompare(a.candidate.publishedDate);
  });

  const best = scored.filter((entry) => entry.score > 0).slice(0, 3).map((entry) => entry.candidate);
  if (best.length > 0) {
    return best;
  }

  return candidates
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
    .slice(0, 3);
}

function tokenizeForSimilarity(value) {
  const stopWords = new Set([
    'the',
    'and',
    'for',
    'with',
    'from',
    'into',
    'this',
    'that',
    'your',
    'you',
    'are',
    'how',
    'what',
    'when',
    'where',
    'why',
    'using',
    'used',
    'learned',
    'lessons',
    'build',
    'building',
    'system',
    'systems',
    'software',
    'engineering',
    'nauman',
    'mustafa',
  ]);

  return normalizeSpace(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

async function optimizeImages(html, htmlFile, route) {
  const imgRegex = /<img\b[^>]*>/gi;
  let lastIndex = 0;
  let match;
  let imageIndex = 0;
  let output = '';

  while ((match = imgRegex.exec(html)) !== null) {
    output += html.slice(lastIndex, match.index);
    output += await optimizeImageTag(match[0], htmlFile, route, imageIndex);
    lastIndex = match.index + match[0].length;
    imageIndex += 1;
  }

  output += html.slice(lastIndex);
  return output;
}

async function optimizeImageTag(tag, htmlFile, route, imageIndex) {
  const srcMatch = tag.match(/\bsrc=["']([^"']+)["']/i);
  if (!srcMatch) {
    return tag;
  }

  let updatedTag = tag;
  if (!/\bdecoding=/.test(updatedTag)) {
    updatedTag = insertImgAttribute(updatedTag, 'decoding="async"');
  }

  if (imageIndex > 0 && !/\bloading=/.test(updatedTag)) {
    updatedTag = insertImgAttribute(updatedTag, 'loading="lazy"');
  }

  if (imageIndex === 0 && !/\bfetchpriority=/.test(updatedTag)) {
    updatedTag = insertImgAttribute(updatedTag, 'fetchpriority="high"');
  }

  const dimensions = await getImageDimensionsForTag(srcMatch[1], htmlFile, route);
  if (dimensions) {
    if (!/\bwidth=/.test(updatedTag)) {
      updatedTag = insertImgAttribute(updatedTag, `width="${dimensions.width}"`);
    }
    if (!/\bheight=/.test(updatedTag)) {
      updatedTag = insertImgAttribute(updatedTag, `height="${dimensions.height}"`);
    }
  }

  return updatedTag;
}

function insertImgAttribute(tag, attribute) {
  return tag.replace(/<img\b/i, `<img ${attribute}`);
}

async function getImageDimensionsForTag(src, htmlFile, route) {
  const assetPath = resolveLocalAssetPath(src, htmlFile, route);
  if (!assetPath) {
    return null;
  }

  if (imageDimensionCache.has(assetPath)) {
    return imageDimensionCache.get(assetPath);
  }

  const dimensions = await readImageDimensions(assetPath);
  imageDimensionCache.set(assetPath, dimensions);
  return dimensions;
}

function resolveLocalAssetPath(src, htmlFile) {
  const raw = src.split('#')[0].split('?')[0].trim();
  if (!raw || /^https?:\/\//i.test(raw) || raw.startsWith('//') || raw.startsWith('data:')) {
    return null;
  }

  if (raw.startsWith('/')) {
    return path.join(PUBLIC_DIR, raw);
  }

  return path.resolve(path.dirname(htmlFile), raw);
}

async function readImageDimensions(assetPath) {
  try {
    const extension = path.extname(assetPath).toLowerCase();

    if (extension === '.svg') {
      const svg = await fs.readFile(assetPath, 'utf8');
      return readSvgDimensions(svg);
    }

    const buffer = await fs.readFile(assetPath);
    if (extension === '.png') return readPngDimensions(buffer);
    if (extension === '.gif') return readGifDimensions(buffer);
    if (extension === '.webp') return readWebpDimensions(buffer);
    if (extension === '.jpg' || extension === '.jpeg') return readJpegDimensions(buffer);
  } catch {
    return null;
  }

  return null;
}

function readSvgDimensions(svg) {
  const width = svg.match(/\bwidth=["']([\d.]+)(?:px)?["']/i);
  const height = svg.match(/\bheight=["']([\d.]+)(?:px)?["']/i);

  if (width && height) {
    return {
      width: Math.round(Number(width[1])),
      height: Math.round(Number(height[1])),
    };
  }

  const viewBox = svg.match(/\bviewBox=["']([\d.\s-]+)["']/i);
  if (!viewBox) return null;

  const [, values] = viewBox;
  const parts = values.trim().split(/\s+/).map(Number);
  if (parts.length !== 4 || parts.some((value) => Number.isNaN(value))) return null;

  return {
    width: Math.round(parts[2]),
    height: Math.round(parts[3]),
  };
}

function readPngDimensions(buffer) {
  if (buffer.length < 24) return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function readGifDimensions(buffer) {
  if (buffer.length < 10) return null;
  return {
    width: buffer.readUInt16LE(6),
    height: buffer.readUInt16LE(8),
  };
}

function readJpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marker);

    if (isStartOfFrame) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      };
    }

    offset += 2 + length;
  }

  return null;
}

function readWebpDimensions(buffer) {
  if (buffer.length < 30 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    return null;
  }

  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const chunkType = buffer.toString('ascii', offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const chunkData = offset + 8;

    if (chunkType === 'VP8X' && chunkData + 10 <= buffer.length) {
      return {
        width: 1 + readUInt24LE(buffer, chunkData + 4),
        height: 1 + readUInt24LE(buffer, chunkData + 7),
      };
    }

    if (chunkType === 'VP8 ' && chunkData + 10 <= buffer.length) {
      return {
        width: buffer.readUInt16LE(chunkData + 6) & 0x3fff,
        height: buffer.readUInt16LE(chunkData + 8) & 0x3fff,
      };
    }

    if (chunkType === 'VP8L' && chunkData + 5 <= buffer.length) {
      const bits = buffer.readUInt32LE(chunkData + 1);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
      };
    }

    offset = chunkData + chunkSize + (chunkSize % 2);
  }

  return null;
}

function readUInt24LE(buffer, offset) {
  return buffer[offset] + (buffer[offset + 1] << 8) + (buffer[offset + 2] << 16);
}

function buildBreadcrumbList(page) {
  if (page.kind === 'home') {
    return null;
  }

  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/`,
    },
  ];

  if (page.kind === 'article') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Writing',
      item: `${SITE_URL}/writing/`,
    });
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: page.ogTitle,
      item: page.canonical,
    });
  } else {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: page.kind === 'resume' ? 'Resume' : page.ogTitle,
      item: page.canonical,
    });
  }

  return {
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

async function hasWorkingTreeChanges(file) {
  if (gitDirtyCache.has(file)) {
    return gitDirtyCache.get(file);
  }

  const relativePath = path.relative(ROOT_DIR, file);
  try {
    const { stdout } = await execFile('git', ['status', '--porcelain', '--', relativePath], {
      cwd: ROOT_DIR,
    });
    const changed = stdout.trim().length > 0;
    gitDirtyCache.set(file, changed);
    return changed;
  } catch {
    gitDirtyCache.set(file, false);
    return false;
  }
}

async function getGitLastModified(file) {
  if (gitDateCache.has(file)) {
    return gitDateCache.get(file);
  }

  const relativePath = path.relative(ROOT_DIR, file);
  try {
    const { stdout } = await execFile('git', ['log', '-1', '--format=%cs', '--', relativePath], {
      cwd: ROOT_DIR,
    });
    const value = stdout.trim() || null;
    gitDateCache.set(file, value);
    return value;
  } catch {
    gitDateCache.set(file, null);
    return null;
  }
}

async function fileExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function toIsoDate(value) {
  return new Date(value).toISOString().slice(0, 10);
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
    .replace(/&gt;/g, '>')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-');
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
