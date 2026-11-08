/**
 * Single source of truth for the CV.
 *
 * Both the web page and the A4 PDF are rendered from this object, so they can
 * never drift apart. Edit this file, run `pnpm build:pdf`, done.
 *
 * Copy is intentionally short: the PDF target is one A4 page.
 */

export interface CvLink {
  label: string
  href: string
  display: string
}

export interface CvBullet {
  text: string
  /** Rendered with emphasis — the lead achievement of the role. */
  highlight?: boolean
}

export interface CvExperienceEntry {
  role: string
  company?: string
  /** End client, for consulting/outsourcing engagements. */
  client?: string
  location?: string
  start: string
  end: string
  bullets: CvBullet[]
  tech: string[]
}

export interface CvSkillGroup {
  label: string
  items: string[]
}

export interface CvEducationEntry {
  degree: string
  school: string
  start: string
  end: string
}

export interface Cv {
  name: string
  role: string
  location: string
  email: string
  /** Short availability line shown on the website, e.g. consulting. */
  availability?: string
  links: CvLink[]
  summary: string
  experience: CvExperienceEntry[]
  skills: CvSkillGroup[]
  education: CvEducationEntry[]
  languages: string[]
}

export const cv: Cv = {
  name: 'Mihailo Tomišić',
  role: 'Senior Software Engineer',
  location: 'Novi Sad, Serbia',
  availability: 'Open to part-time consulting',
  email: 'cv@tomisic.dev',
  links: [
    {
      label: 'GitHub',
      href: 'https://github.com/tomisicm',
      display: 'github.com/tomisicm',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/mihailo-tomisic-a21900141/',
      display: 'linkedin.com/in/mihailo-tomisic',
    },
  ],

  summary:
    'Fullstack engineer with a backend focus, an applied mathematics ' +
    'background, and nine years across e-commerce, healthcare, scientific data, ' +
    'and energy. I work best as the connective tissue in a team — turning ' +
    'ambiguous requirements into a plan, and keeping the people around me ' +
    'unblocked.',

  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'EPAM Systems',
      start: 'Mar 2026',
      end: 'Present',
      bullets: [
        {
          text: 'Built a mobile-first PWA that also works on desktop: pulls data from Fabric and Postgres, processes it with an LLM, and returns the result to the user.',
        },
      ],
      tech: [
        'Next.js',
        'React',
        'TypeScript',
        'Node',
        'Postgres',
        'Redis',
        'Tailwind',
        'Fabric',
        'OpenAI API',
      ],
    },
    {
      role: 'Senior Software Engineer',
      company: 'EPAM Systems',
      client: 'AstraZeneca',
      start: 'Jun 2022',
      end: 'Mar 2026',
      bullets: [
        {
          text: 'Building a compound-data platform (PubChem-like) for scientific search and comparison workflows.',
          highlight: true,
        },
        {
          text: 'Bootstrapped two mid-sized projects from greenfield architecture through production release and ongoing support.',
        },
        {
          text: 'Built data extraction and transformation automation with the R&D team, replacing manual pipelines.',
        },
      ],
      tech: [
        'TypeScript',
        'React',
        'Next.js',
        'GraphQL',
        'Node',
        'PostgreSQL',
        'Redis',
        'AWS',
        'Snowflake',
        'Redshift',
      ],
    },
    {
      role: 'Senior Software Engineer',
      company: 'Vertrical',
      start: 'Oct 2021',
      end: 'Jun 2022',
      bullets: [
        {
          text: 'Built scalable, compliant digital medical services on a NestJS microservice architecture.',
        },
        {
          text: 'Concentrated test coverage on the highest-risk paths and documented the systems through their support lifecycle.',
        },
      ],
      tech: [
        'NestJS',
        'React',
        'Gatsby',
        'PostgreSQL',
        'Elasticsearch',
        'RabbitMQ',
        'Docker',
        'GCP',
      ],
    },
    {
      role: 'Fullstack Software Engineer',
      company: 'BeeIT',
      start: '2019',
      end: 'Sep 2021',
      bullets: [
        {
          text: 'Delivered e-commerce PWAs on Magento 2 and Vue Storefront, extending and upgrading existing codebases.',
        },
        {
          text: 'Integrated third-party services and mentored junior developers through delivery.',
        },
      ],
      tech: [
        'Magento 2',
        'Vue Storefront',
        'React',
        'Express',
        'MySQL',
        'Elasticsearch',
        'Docker',
      ],
    },
    {
      role: 'QA & Automation Engineer',
      start: '2017',
      end: '2019',
      bullets: [
        {
          text: 'Defined test specifications with engineering, ran root-cause analysis, and maintained defect reporting.',
        },
        {
          text: 'Built and executed automated test suites, reducing manual regression effort.',
        },
      ],
      tech: ['Java', 'Python', 'Selenium', 'TestRail', 'Jira'],
    },
  ],

  skills: [
    {
      label: 'Languages',
      items: ['TypeScript', 'JavaScript', 'Python', 'SQL'],
    },
    {
      label: 'Backend',
      items: ['Node.js', 'NestJS', 'Express', 'GraphQL'],
    },
    {
      label: 'AI & LLM',
      items: [
        'DeepSeek & open-weight models',
        'OpenCode',
        'GitHub Copilot',
        'Claude (certification in progress)',
        'LLM integration',
      ],
    },
    {
      label: 'Frontend',
      items: ['React', 'Next.js', 'Vue', 'Gatsby', 'Tailwind'],
    },
    {
      label: 'Data',
      items: [
        'PostgreSQL',
        'MySQL',
        'MongoDB',
        'Elasticsearch',
        'Redis',
        'Redshift',
        'Snowflake',
      ],
    },
    {
      label: 'Platform',
      items: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'CI/CD'],
    },
  ],

  education: [
    {
      degree: 'MSc, Financial Mathematics',
      school: 'University of Novi Sad',
      start: '2014',
      end: '2017',
    },
    {
      degree: 'BSc, Applied Mathematics',
      school: 'University of Novi Sad',
      start: '2010',
      end: '2014',
    },
  ],

  languages: ['Serbian (native)', 'English (professional)'],
}
