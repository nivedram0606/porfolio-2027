/**
 * SEO + GEO generator. Everything is derived from data.ts at build time
 * (see the seo() plugin in vite.config.ts), so content and schema never drift.
 *
 *  - head():       title, meta, canonical, Open Graph, Twitter, JSON-LD
 *  - prerender():  semantic HTML copy of the page for crawlers/LLM fetchers that don't run JS
 *  - llmsTxt():    /llms.txt, a plain-text profile for AI assistants (llmstxt.org)
 *  - sitemap():    /sitemap.xml
 */
import { aiAgents, beyond, experience, faqs, linkedOrganizations, profile, projects, skills, stats } from './data';

export const site = {
  url: 'https://nivedram.online',
  name: 'Nived Ram',
  title: 'Nived Ram | Frontend Engineer (React, Next.js) in Bengaluru',
  description:
    'Nived Ram is a Bengaluru-based frontend engineer with 3+ years building React, Next.js and TypeScript products across ERP, HealthTech, EdTech, InsurTech, AI and GovTech. Open to frontend and full-stack roles.',
  /** Meta / OG / Twitter description: must stay 25–160 chars (Bing flags anything longer). */
  metaDescription:
    'Bengaluru frontend engineer with 3+ years building React, Next.js and TypeScript apps for ERP, CRM, insurance, HealthTech and EdTech. Open to new roles.',
  ogImage: '/og-image.png',
  locale: 'en_IN',
  twitterCard: 'summary_large_image',
};

const abs = (path: string) => new URL(path, site.url).toString();
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const today = () => new Date().toISOString().slice(0, 10);

const MONTHS: Record<string, string> = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
/** "Oct 2022 – Present" -> { start: "2022-10", end: undefined } */
function parsePeriod(period: string) {
  const [a, b] = period.split(/\s*[–-]\s*/);
  const iso = (s?: string) => {
    const m = s?.match(/([A-Z][a-z]{2})\s+(\d{4})/);
    return m ? `${m[2]}-${MONTHS[m[1]]}` : undefined;
  };
  return { start: iso(a), end: iso(b) };
}

const sameAs = [profile.linkedin, profile.github];
const languages = [
  { name: 'Malayalam', alternateName: 'ml' },
  { name: 'English', alternateName: 'en' },
  { name: 'Hindi', alternateName: 'hi' },
  { name: 'Tamil', alternateName: 'ta' },
];
const domains = ['ERP systems', 'CRM systems', 'HealthTech', 'EdTech', 'InsurTech', 'AI products', 'GovTech', 'AI-assisted software development', 'Agentic coding'];
/** AI coding agents as typed entities, so engines can connect "Nived Ram" with each tool and its maker. */
// Typed as Thing + additionalType: a plain SoftwareApplication makes Google validate each one as an
// app rich result (needs offers/ratings) and report it invalid. These are tools used, not apps offered.
const agentEntities = aiAgents.map((a) => ({
  '@type': 'Thing',
  additionalType: 'https://schema.org/SoftwareApplication',
  name: a.name,
  url: a.url,
  description: `AI coding agent by ${a.maker}`,
}));
const agentNames = aiAgents.map((a) => `${a.name} (${a.maker})`).join(', ');
const current = experience.find((e) => e.current);

const PERSON_ID = `${site.url}/#person`;
const orgId = (url: string) => `${new URL(url).origin}/#organization`;
/** Employers and clients with a website become first-class Organization entities (linked, crawlable). */
const WEBSITE_ID = `${site.url}/#website`;

export function jsonLd() {
  const person = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    givenName: 'Nived',
    familyName: 'Ram',
    url: site.url,
    image: abs(profile.photo),
    email: `mailto:${profile.email}`,
    jobTitle: current?.role ?? 'Software Engineer',
    description: site.description,
    address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressRegion: 'Karnataka', addressCountry: 'IN' },
    homeLocation: { '@type': 'Place', name: 'Bengaluru, India' },
    nationality: { '@type': 'Country', name: 'India' },
    sameAs,
    // Freelance partners, e.g. Codenzic Innovations (https://www.codenzic.com/)
    // Freelance clients (Codenzic, Brand Mantra); employers are linked through worksFor below.
    affiliation: linkedOrganizations.filter((o) => o.freelance).map((o) => ({ '@id': orgId(o.url) })),
    // Skills, domains, and the AI coding agents that back the work (Claude, Codex, Antigravity, Kiro, Cursor).
    knowsAbout: [...skills, ...domains, ...agentEntities],
    knowsLanguage: languages.map((l) => ({ '@type': 'Language', ...l })),
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'IBVE - Institute of Basic and Vocational Education',
    },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: 'Bachelor of Computer Applications (BCA)',
      recognizedBy: { '@type': 'EducationalOrganization', name: 'IBVE - Institute of Basic and Vocational Education' },
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Frontend Engineer',
      occupationLocation: { '@type': 'City', name: 'Bengaluru' },
      skills: skills.join(', '),
      description: `Builds production web applications with React, Next.js and TypeScript, including ERP, CRM, insurance and lead management systems, working alongside AI coding agents: ${agentNames}.`,
    },
    // Career history as Role objects (schema.org pattern for dated employment).
    worksFor: [...experience].reverse().map((e) => {
      const { start, end } = parsePeriod(e.period);
      return {
        '@type': 'EmployeeRole',
        roleName: e.role,
        startDate: start,
        ...(end ? { endDate: end } : {}),
        description: e.summary,
        worksFor: e.url
          ? { '@id': orgId(e.url) }
          : { '@type': 'Organization', name: e.company === 'B-JeLT' ? 'B-JeLT Technologies' : e.company, location: e.place },
      };
    }),
  };

  const website = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: site.url,
    name: `${site.name} | Portfolio`,
    description: site.description,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
    author: { '@id': PERSON_ID },
  };

  const profilePage = {
    '@type': 'ProfilePage',
    '@id': `${site.url}/#profile`,
    url: site.url,
    name: site.title,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: { '@id': PERSON_ID },
    about: { '@id': PERSON_ID },
    // Rich Results Test requires a full ISO 8601 datetime with timezone here.
    dateModified: new Date().toISOString(),
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(site.ogImage), width: 1200, height: 630 },
  };

  const portfolio = {
    '@type': 'ItemList',
    '@id': `${site.url}/#projects`,
    name: 'Projects by Nived Ram',
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.title,
        description: p.description,
        genre: 'Web application',
        keywords: [...p.tags, ...(p.modules ?? [])].join(', '),
        creator: { '@id': PERSON_ID },
        ...(p.modules ? { hasPart: p.modules.map((m) => ({ '@type': 'CreativeWork', name: m })) } : {}),
        // Linked clients reference their Organization node; others get an inline name ("Bareeq, Oman").
        sourceOrganization: p.client?.url
          ? { '@id': orgId(p.client.url) }
          : { '@type': 'Organization', name: p.context.replace(/^Freelance\s*·\s*/, '') },
      },
    })),
  };

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${site.url}/#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const organizations = linkedOrganizations.map((o) => {
    const parts = [
      o.roles.length ? `employed ${profile.name} as ${o.roles.join(', ')}` : '',
      o.projects.length ? `${o.freelance ? 'engaged' : 'worked with'} ${profile.name}${o.freelance ? ' as a freelance frontend developer' : ''} on ${o.projects.join(', ')}` : '',
    ].filter(Boolean);
    return {
      '@type': 'Organization',
      '@id': orgId(o.url),
      name: o.name,
      url: o.url,
      description: `${o.name} ${parts.join(' and ')}.`,
    };
  });

  return { '@context': 'https://schema.org', '@graph': [person, website, profilePage, portfolio, faqPage, ...organizations] };
}

export function head() {
  const img = abs(site.ogImage);
  const tags = [
    `<title>${esc(site.title)}</title>`,
    `<meta name="description" content="${esc(site.metaDescription)}" />`,
    `<meta name="author" content="${esc(site.name)}" />`,
    `<meta name="keywords" content="${esc(['Nived Ram', 'Frontend Engineer', 'React developer Bengaluru', 'Next.js developer', 'ERP frontend', 'CRM developer', 'AI-assisted development', ...aiAgents.map((a) => a.name), ...skills.slice(0, 6)].join(', '))}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
    `<link rel="canonical" href="${site.url}/" />`,
    `<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable profile" />`,
    `<link rel="sitemap" type="application/xml" href="/sitemap.xml" />`,
    // geo
    `<meta name="geo.region" content="IN-KA" />`,
    `<meta name="geo.placename" content="Bengaluru" />`,
    // Open Graph
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:url" content="${site.url}/" />`,
    `<meta property="og:title" content="${esc(site.title)}" />`,
    `<meta property="og:description" content="${esc(site.metaDescription)}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Nived Ram, frontend engineer" />`,
    `<meta property="profile:first_name" content="Nived" />`,
    `<meta property="profile:last_name" content="Ram" />`,
    // Twitter / X
    `<meta name="twitter:card" content="${site.twitterCard}" />`,
    `<meta name="twitter:title" content="${esc(site.title)}" />`,
    `<meta name="twitter:description" content="${esc(site.metaDescription)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd()).replace(/</g, '\\u003c')}</script>`,
  ];
  return tags.join('\n    ');
}

/** Static, semantic copy of the page. React replaces it on mount; crawlers without JS read it. */
export function prerender() {
  const li = (s: string) => `<li>${esc(s)}</li>`;
  return `<div class="prerender">
      <header>
        <h1>${esc(profile.name)}: Frontend Engineer (React, Next.js)</h1>
        <p>${esc(profile.roles.join(' · '))}</p>
        <p>${esc(profile.intro)} ${esc(profile.introEmphasis)}</p>
        <p>Based in ${esc(profile.location)}. Email: <a href="mailto:${profile.email}">${profile.email}</a> · <a href="${profile.linkedin}">LinkedIn</a> · <a href="${profile.github}">GitHub</a> · <a href="${profile.resume}">Résumé (PDF)</a></p>
        <ul>${stats.map((s) => li(`${s.value} ${s.label}`)).join('')}</ul>
      </header>
      <section id="projects"><h2>Projects</h2>
        ${projects
          .map(
            (p) => `<article><h3>${esc(p.title)}</h3><p><em>${
              p.client?.url ? esc(p.context).replace(esc(p.client.name), `<a href="${p.client.url}">${esc(p.client.name)}</a>`) : esc(p.context)
            }</em></p><p>${esc(p.description)}</p>${
              p.modules ? `<ul>${p.modules.map(li).join('')}</ul>` : ''
            }<p>${esc(p.tags.join(', '))}</p></article>`,
          )
          .join('\n        ')}
      </section>
      <section id="experience"><h2>Experience</h2>
        ${[...experience]
          .reverse()
          .map((e) => `<article><h3>${esc(e.role)}, ${e.url ? `<a href="${e.url}">${esc(e.company)}</a>` : esc(e.company)}</h3><p>${esc(e.period)} · ${esc(e.place)}</p><p>${esc(e.summary)}</p></article>`)
          .join('\n        ')}
      </section>
      <section id="stack"><h2>Tech stack</h2><ul>${skills.map(li).join('')}</ul></section>
      <section id="ai-agents"><h2>What backs me: AI coding agents</h2>
        <p>I build with AI coding agents alongside my own engineering judgement.</p>
        <ul>${aiAgents.map((a) => `<li><a href="${a.url}">${esc(a.name)}</a> by ${esc(a.maker)}</li>`).join('')}</ul>
      </section>
      <section id="beyond"><h2>Education, languages and domains</h2>
        ${beyond.map((b) => `<article><h3>${esc(b.kicker)}: ${esc(b.title)}</h3><p>${esc(b.body)}</p></article>`).join('\n        ')}
      </section>
      <section id="connect"><h2>FAQ</h2>
        ${faqs.map((f) => `<details open><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n        ')}
      </section>
    </div>`;
}

export function llmsTxt() {
  const line = (s: string) => `- ${s}`;
  return `# ${profile.name}

> ${site.description}

- Website: ${site.url}
- Email: ${profile.email}
- LinkedIn: ${profile.linkedin}
- GitHub: ${profile.github}
- Résumé (PDF): ${abs(profile.resume)}
- Location: ${profile.location} (works remotely for international teams)
- Current role: ${current ? `${current.role} at ${current.company} (${current.place}), since ${current.period.split('–')[0].trim()}` : 'n/a'}
- Open to: frontend and full-stack roles (React, Next.js, TypeScript); remote, hybrid or on-site

## Roles
${profile.roles.map(line).join('\n')}

## Experience
${[...experience]
  .reverse()
  .map((e) => line(`${e.role}, ${e.company}${e.url ? ` (${e.url})` : ''} (${e.period}, ${e.place}): ${e.summary}`))
  .join('\n')}

## Projects
${projects
  .map((p) => line(`${p.title} (${p.context}${p.client?.url ? `, ${p.client.url}` : ''}): ${p.description}${p.modules ? ` Modules: ${p.modules.join(', ')}.` : ''}`))
  .join('\n')}

## Companies worked with
${linkedOrganizations
  .map((o) => line(`${o.name}: ${o.url} (${[...o.roles, ...o.projects].join('; ')}${o.freelance ? '; freelance' : ''})`))
  .join('\n') || '- n/a'}

## AI coding agents (what backs me)
${aiAgents.map((a) => line(`${a.name} by ${a.maker}: ${a.url}`)).join('\n')}

## Skills
${skills.join(', ')}

## Education
- Bachelor of Computer Applications, IBVE - Institute of Basic and Vocational Education (2017–2020)
- MERN stack internship, Luminar Technolab (Oct 2022 – Feb 2023)

## Languages
Malayalam (native), English (fluent), Hindi (fluent), Tamil (proficient)

## FAQ
${faqs.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}
`;
}

export function sitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${site.url}/</loc>
    <lastmod>${today()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <image:image><image:loc>${abs(site.ogImage)}</image:loc></image:image>
    <image:image><image:loc>${abs(profile.photo)}</image:loc></image:image>
  </url>
</urlset>
`;
}
