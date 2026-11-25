// Single source of truth for portfolio content.
// Edit this file to update the site; components only render what is here.

export const profile = {
  name: 'Nived Ram',
  firstName: 'Nived',
  initials: 'NR',
  location: 'Bengaluru, India',
  email: 'nivedchempakam@gmail.com',
  linkedin: 'https://www.linkedin.com/in/nived-ram-online/',
  github: 'https://github.com/nivedram0606',
  resume: '/Nived_Ram_Resume.pdf',
  // Drop a portrait at public/me.jpg and it will show in the hero + connect sections.
  photo: '/me.jpg',
  // Shown in the Start a Conversation section (3D flip portrait).
  contactPhoto: '/nived-contact.jpg',
  roles: [
    'Frontend engineer · React & Next.js',
    'MERN stack developer',
    'ERP / CRM specialist',
    'Insurance solution expert',
    'HealthTech & InsurTech UIs',
    'Shipping scalable interfaces',
  ],
  intro:
    "Building the interfaces people trust with their health, their insurance and their time. For 3+ years I've shipped production React across HealthTech, InsurTech, AI and GovTech, from hospital CRMs and patient-engagement flows to insurance journeys for a Dubai-based team. My focus stays the same:",
  introEmphasis: 'turn complex workflows into fast, scalable, human frontends.',
};

export const stats = [
  { value: '3+', label: 'Years shipping production React' },
  { value: '5', label: 'Product teams across 3 cities' },
  { value: '10', label: 'Products shipped, client and freelance' },
  { value: '6', label: 'Domains: ERP, Health, EdTech, Insurance, AI, Gov' },
];

export type ProjectArt = 'erp' | 'insurance' | 'lms' | 'school' | 'crm' | 'pwa' | 'faces' | 'qr' | 'slides' | 'factory';

export const projects: {
  title: string;
  art: ProjectArt;
  hue: string;
  context: string;
  description: string;
  tags: string[];
  /** Featured projects render full-width with a module list. */
  featured?: boolean;
  modules?: string[];
  /** Client/partner; when `url` is set the name links out (do-follow) on the card, footer and schema. */
  client?: { name: string; url?: string };
}[] = [
  {
    title: 'ERP Suite',
    art: 'erp',
    hue: '#4ade80',
    context: 'Freelance · Codenzic Innovations',
    client: { name: 'Codenzic Innovations', url: 'https://www.codenzic.com/' },
    description:
      'A complete ERP, built as the sole frontend developer. Everything from billing the customer to closing the books lives in one app: tax-ready invoicing, stock that understands multiple units per product, daily accounting, sales and return flows, warranty registration and claims, and the reports that tie it all together.',
    tags: ['Sole frontend developer', 'Freelance', 'ERP'],
    featured: true,
    modules: [
      'Tax-ready invoicing',
      'Inventory management',
      'Multi-unit products',
      'Daily accounting',
      'Sales & returns',
      'Warranty & claims',
      'Reports',
    ],
  },
  {
    title: 'Takaful Insurance Workflow',
    art: 'insurance',
    hue: '#22d3ee',
    context: 'Clinch Solutions · Al Rajhi Takaful, UAE',
    client: { name: 'Al Rajhi Takaful', url: 'https://www.alrajhitakaful.com/en' },
    description:
      'An insurance workflow application for Al Rajhi Takaful, built as the sole developer while at Clinch Solutions. It guides customers through the takaful insurance user flows step by step, on fast, responsive screens built with React, Next.js and SCSS.',
    tags: ['Sole developer', 'React', 'Next.js', 'SCSS'],
  },
  {
    title: 'Lead Management System',
    art: 'lms',
    hue: '#38bdf8',
    context: 'Freelance · Brand Mantra, UAE',
    client: { name: 'Brand Mantra', url: 'https://brandmantra.ae/' },
    description:
      'A lead management system (LMS) for Brand Mantra, a digital marketing firm in the UAE. It gives the team one place to capture incoming leads, follow them through each stage of the pipeline and keep every follow-up from slipping through the cracks.',
    tags: ['Freelance', 'UAE client', 'Lead pipeline'],
  },
  {
    title: 'Preschool Management CRM',
    art: 'school',
    hue: '#e879f9',
    context: 'Freelance · Bareeq, Oman',
    description:
      'A school management CRM built for Bareeq, a preschool in Oman, as the sole frontend developer. It brings the school’s children, classes and parent relationships into one system the staff can run their day from.',
    tags: ['Sole frontend developer', 'Freelance', 'Oman client'],
  },
  {
    title: 'KareFlow',
    art: 'crm',
    hue: '#2f7bff',
    context: 'Mykare Health',
    client: { name: 'Mykare Health', url: 'https://mykare.ai/' },
    description:
      'A unified digital ecosystem for hospitals on a microservice-based frontend. Demand generation, lead management and automated inventory in one place, with WhatsApp Business integration for appointments, reminders and real-time patient conversations.',
    tags: ['React', 'Microfrontends', 'WhatsApp API'],
  },
  {
    title: 'Kare Buddy App',
    art: 'pwa',
    hue: '#18c29c',
    context: 'Mykare Health',
    client: { name: 'Mykare Health', url: 'https://mykare.ai/' },
    description:
      'A pocket version of the KareFlow CRM, shipped as a Progressive Web App so on-ground Kare Buddies can update task status in real time, from any phone, even on patchy hospital networks.',
    tags: ['PWA', 'React', 'Real-time'],
  },
  {
    title: 'AI Photocloud',
    art: 'faces',
    hue: '#9967ff',
    context: 'Trigeminal.ai',
    description:
      'A face-recognition photo sharing platform. Users upload event photos, AI tags the people in them, and everyone discovers the pictures of themselves that others uploaded.',
    tags: ['React', 'AI / Face recognition', 'Uploads'],
  },
  {
    title: 'RestoAp',
    art: 'qr',
    hue: '#ff8a3d',
    context: 'B-JeLT Technologies',
    description:
      'Restaurant operations on autopilot. Guests scan a table QR code, order and pay from their phone, and the kitchen gets the ticket instantly. Fewer waiters running, faster tables turning.',
    tags: ['MERN', 'QR ordering', 'Payments'],
  },
  {
    title: 'Pathology Slide Viewer',
    art: 'slides',
    hue: '#ff4f7b',
    context: 'HealthTech',
    description:
      'Upload high-resolution pathology slide images, assign cases to pathologists, and let them annotate, comment and reply in context, turning a manual review loop into a tracked workflow.',
    tags: ['React', 'Image viewer', 'Case workflow'],
  },
  {
    title: 'Oushadhi Production App',
    art: 'factory',
    hue: '#f5c84b',
    context: 'Govt. of Kerala',
    description:
      'Production management for Oushadhi, a Kerala public-sector Ayurvedic medicine manufacturer. Batches, stages and output tracked digitally instead of on paper registers.',
    tags: ['MERN', 'GovTech', 'Dashboards'],
  },
];

export const experience: {
  company: string;
  role: string;
  period: string;
  place: string;
  summary: string;
  current?: boolean;
  /** Company website; linked (do-follow) on the Journey card, footer and schema. */
  url?: string;
}[] = [
  {
    company: 'B-JeLT',
    role: 'MERN Stack Developer',
    period: 'Oct 2022 – Oct 2023',
    place: 'Kochi',
    summary:
      'The full-stack foundation. Built web apps end to end on MongoDB, Express, React and Node, including RestoAp and the Oushadhi production system, working closely with design and backend teams.',
  },
  {
    company: 'Trigeminal.ai',
    role: 'Software Developer',
    period: 'Oct 2023 – May 2024',
    place: 'Bengaluru',
    summary:
      'Frontend for an AI startup. Built dynamic, responsive React apps like AI Photocloud, partnering cross-functionally so model capabilities turned into features users actually understood.',
  },
  {
    company: 'Mykare Health',
    url: 'https://mykare.ai/',
    role: 'Software Developer',
    period: 'Jul 2024 – Jan 2025',
    place: 'Kochi',
    summary:
      'HealthTech at scale. Owned frontend for the KareFlow hospital CRM and the Kare Buddy PWA, with deep work in React Hooks and state management for fast, reliable interfaces.',
  },
  {
    company: 'Flycatch',
    url: 'https://www.flycatchtech.com/',
    role: 'Software Engineer',
    period: 'Jan 2025 – Jun 2025',
    place: 'Kochi',
    summary:
      'Frontend engineer on React, TypeScript and Next.js. Built scalable features, integrated REST APIs and tuned performance, with reusable components and Agile delivery as the default.',
  },
  {
    company: 'Clinch Solutions',
    role: 'Software Engineer',
    period: 'Jun 2025 – Present',
    place: 'Dubai · Remote',
    current: true,
    url: 'https://clinchitech.com/',
    summary:
      'Building insurance user flows with React, Next.js and SCSS. Focused on scalable, responsive interfaces, performance and seamless journeys, with clean state management across the team.',
  },
];

export const skills = [
  'React JS',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Redux Toolkit',
  'Node JS',
  'Express JS',
  'MongoDB',
  'HTML',
  'CSS / SCSS',
  'REST APIs',
  'PWA',
  'AWS',
  'NGINX',
  'Git',
  'Jira',
];

export const beyond: {
  kicker: string;
  title: string;
  body: string;
  hue: string;
}[] = [
  {
    kicker: 'Education',
    title: 'Bachelor of Computer Applications',
    body: 'IBVE, Institute of Basic and Vocational Education. Jun 2017 – Mar 2020.',
    hue: '#2f7bff',
  },
  {
    kicker: 'Training',
    title: 'Internship, Luminar Technolab',
    body: 'Oct 2022 – Feb 2023. Intensive MERN training that turned into my first production role.',
    hue: '#18c29c',
  },
  {
    kicker: 'Languages',
    title: 'Four languages, one codebase',
    body: 'Malayalam (native), English and Hindi (fluent), Tamil (proficient). Easy to work with teams across India and the Gulf.',
    hue: '#9967ff',
  },
  {
    kicker: 'Domains',
    title: 'ERP · Health · EdTech · Insurance · AI · Gov',
    body: 'A full business ERP, a preschool CRM, hospital CRMs, pathology tools, insurance journeys, AI photo platforms and public-sector production systems.',
    hue: '#ff8a3d',
  },
  {
    kicker: 'Working style',
    title: 'Remote-ready, Agile by habit',
    body: 'Currently shipping remotely for a Dubai team from Bengaluru. Comfortable with Jira, async updates and tight sprints.',
    hue: '#ff4f7b',
  },
];

export const faqs = [
  {
    q: 'Are you open to new roles right now?',
    a: "Yes. I'm looking for frontend or full-stack roles where React, Next.js and TypeScript are central, ideally on a product with real users and real complexity. Email is the fastest way to reach me.",
  },
  {
    q: 'Remote, hybrid or on-site?',
    a: "All three work. I'm based in Bengaluru and currently work remotely for a Dubai-based company, so I'm used to async collaboration and overlapping time zones.",
  },
  {
    q: "What's your strongest area?",
    a: 'Turning complicated workflows into clean React interfaces: multi-step forms, CRMs, dashboards and real-time task flows. Plus the state management and performance work that keeps them fast as they grow.',
  },
  {
    q: 'Can you work across the stack?',
    a: 'I started as a MERN developer, so I am comfortable with Node, Express and MongoDB, REST API design and deployments on AWS and NGINX. My day-to-day focus today is the frontend.',
  },
  {
    q: 'Do you use AI coding agents?',
    a: 'Yes. Claude, Codex, Antigravity, Kiro and Cursor are the AI coding agents that back my day-to-day work, from planning a feature to reviewing the code that ships.',
  },
];

export const nav = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'experience', label: 'Experience', icon: 'briefcase' },
  { id: 'stack', label: 'Tech stack', icon: 'code' },
  { id: 'beyond', label: 'Beyond code', icon: 'spark' },
  { id: 'connect', label: 'Connect', icon: 'chat' },
] as const;

/**
 * Every company with a website, de-duplicated by URL, with how Nived worked with them.
 * Drives the footer "Worked with" links and the schema.org Organization nodes.
 */
export type LinkedOrg = { name: string; url: string; projects: string[]; roles: string[]; freelance: boolean };
export const linkedOrganizations: LinkedOrg[] = (() => {
  const byUrl = new Map<string, LinkedOrg>();
  const get = (name: string, url: string) => {
    if (!byUrl.has(url)) byUrl.set(url, { name, url, projects: [], roles: [], freelance: false });
    return byUrl.get(url)!;
  };
  for (const e of experience) if (e.url) get(e.company, e.url).roles.push(`${e.role} (${e.period})`);
  for (const p of projects) {
    if (!p.client?.url) continue;
    const o = get(p.client.name, p.client.url);
    o.projects.push(p.title);
    if (p.context.startsWith('Freelance')) o.freelance = true;
  }
  return [...byUrl.values()];
})();

/**
 * AI coding agents Nived builds with, shown behind the contact portrait ("what backs me")
 * and published in the schema / llms.txt. Text only: no third-party logos.
 */
export const aiAgents: { name: string; maker: string; hue: string; url: string }[] = [
  { name: 'Claude', maker: 'Anthropic', hue: '#d97757', url: 'https://claude.com/' },
  { name: 'Codex', maker: 'OpenAI', hue: '#10a37f', url: 'https://openai.com/codex/' },
  { name: 'Antigravity', maker: 'Google', hue: '#4285f4', url: 'https://antigravity.google/' },
  { name: 'Kiro', maker: 'AWS', hue: '#9046ff', url: 'https://kiro.dev/' },
  { name: 'Cursor', maker: 'Anysphere', hue: '#e5e7eb', url: 'https://cursor.com/' },
];
