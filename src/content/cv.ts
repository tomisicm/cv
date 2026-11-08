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

export interface CvExperienceEntry {
  role: string
  company?: string
  location?: string
  start: string
  end: string
  bullets: string[]
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
  email: 'mihailo.tomisic@gmail.com',
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
    'background, and nine years across e-commerce, healthcare, and scientific ' +
    'data platforms. I work best as the connective tissue in a team — turning ' +
    'ambiguous requirements into a plan, and keeping the people around me ' +
    'unblocked.',

  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'EPAM Systems',
      start: 'Jun 2022',
      end: 'Present',
      bullets: [
        'Bootstrapped two mid-sized projects from greenfield architecture through production release and ongoing support.',
        'Built data extraction and transformation automation with the R&D team, replacing manual pipelines.',
        'Building a compound-data platform (PubChem-like) for scientific search and comparison workflows.',
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
        'Built scalable, compliant digital medical services on a NestJS microservice architecture.',
        'Concentrated test coverage on the highest-risk paths and documented the systems through their support lifecycle.',
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
        'Delivered e-commerce PWAs on Magento 2 and Vue Storefront, extending and upgrading existing codebases.',
        'Integrated third-party services and mentored junior developers through delivery.',
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
        'Defined test specifications with engineering, ran root-cause analysis, and maintained defect reporting.',
        'Built and executed automated test suites, reducing manual regression effort.',
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
      items: ['Docker', 'AWS', 'GCP', 'Azure SSO', 'CI/CD'],
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
