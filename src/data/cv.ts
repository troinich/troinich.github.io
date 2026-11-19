export interface Role {
  title: string
  company: string
  period: string
  intro?: string
  bullets: string[]
}

export const cv = {
  name: 'Natalia Troinich',
  title: 'Fullstack Web Engineer · TypeScript · React · C# / .NET',
  location: 'Gothenburg, Sweden',
  linkedin: 'https://www.linkedin.com/in/troinicz',
  pdf: `${import.meta.env.BASE_URL}Natalia_Troinich_CV_Fullstack.pdf`,
  profile: [
    'Fullstack web engineer with 7+ years building production web applications in TypeScript, React and JavaScript, with hands-on backend development in C# (.NET) and Node.js, on a B2B SaaS platform used in 10+ European markets. I own features end to end, from technical design and API design through implementation, automated testing and release, and I care deeply about user-friendly, accessible web applications and a great developer experience.',
    "I improve how engineering teams work. I introduced type-safe API clients generated from OpenAPI specs, delivered our JavaScript-to-TypeScript migration, and drive my team's adoption of AI agents with Claude Code, writing the project instructions, custom skills and workflows that keep AI-assisted work aligned with our architecture and engineering standards. I share knowledge, keep the team up to date on new tools, and collaborate closely with product, design, architects and backend engineers.",
    "My background as a tax attorney gives me an edge with complex business rules, and I pair it with an engineer's focus on clean, maintainable software that solves real user problems.",
  ],
  experience: [
    {
      title: 'Software Engineer',
      company: 'Realforce AB (former Adfenix AB), Gothenburg',
      period: 'Apr 2024 – present',
      intro: 'Marketing automation SaaS for real-estate agencies. Highlights:',
      bullets: [
        'Own the Stripe payment features end to end, from technical design to release: led the React and TypeScript checkout with Stripe Payment and Address Elements and automated Stripe Tax collection, and built secure server-side payment validation in C# (.NET), mapping Stripe API errors to clear, actionable messages for users.',
        'Improved developer experience by introducing type-safe TypeScript API clients generated from OpenAPI / Swagger specs, keeping frontend and backend contracts in sync so breaking API changes are caught at compile time instead of in production.',
        'Drive team-wide adoption of AI coding agents (Claude Code): defined workflows, wrote project instructions and custom skills, and keep the team up to date on new features, applying AI responsibly across planning, implementation, code review, debugging, testing and documentation.',
        'Build and maintain REST APIs in C# (ASP.NET Core) across several services, from endpoint design and request validation to EF Core domain models and data access.',
        'Deliver key parts of the frontend modernisation of the main customer-facing app, including the move to a new Tailwind CSS and Catalyst design system with reusable, accessible React components.',
        'Use Sentry to catch and debug production errors, helping keep customer-facing features reliable.',
        'Work across the stack in an autonomous, cross-functional team, validating technical design and architecture decisions with architects and backend engineers and partnering with product and design from scoping to release.',
      ],
    },
    {
      title: 'Frontend Engineer',
      company: 'Realforce AB (former Adfenix AB), Gothenburg',
      period: 'Apr 2021 – Apr 2024',
      bullets: [
        "Built the product's core self-service tool, where customers set up automated marketing across Meta and Google with targeting, budgets and validation.",
        'Delivered the migration of the main production codebase from JavaScript to TypeScript, improving type safety and maintainability for the whole team.',
        'Launched a mobile-first self-service checkout, from product selection to payment, extending the platform to B2C.',
        'Built the back-office tools internal teams use to onboard and support customers: white-labelling, ad-platform integrations, permissions and order management.',
        'Worked with backend engineers to define the API contracts behind the checkout and back-office tools, shaping request and response models, validation rules and error handling.',
      ],
    },
    {
      title: 'Junior Frontend Engineer',
      company: 'Adfenix AB, Gothenburg',
      period: 'Oct 2019 – Apr 2021',
      bullets: [
        'Migrated an embeddable marketing widget (Preact) to TypeScript, making it easier and safer to extend.',
        'Integrated RESTful and GraphQL APIs into frontend components, for dynamic data and real-time UI updates.',
        'Built API mocks so frontend features and tests could move ahead before backend endpoints were ready.',
        '… plus day-to-day feature work, bug fixing and code reviews across the product.',
      ],
    },
  ] as Role[],
  skills: [
    [
      'Languages & frameworks',
      'TypeScript, JavaScript, React, Node.js, HTML, CSS, C# / .NET, ASP.NET Core, EF Core, Vue.js',
    ],
    [
      'Frontend',
      'Tailwind CSS, Catalyst, React Query, react-hook-form, Vite, state management, design systems, accessibility (a11y), WCAG, performance optimisation',
    ],
    ['Backend & APIs', 'RESTful APIs, API design, OpenAPI / Swagger, GraphQL, server-side validation'],
    [
      'Testing & delivery',
      'automated testing, Playwright, Cypress, Vitest, CI/CD, continuous delivery, Git, Sentry (production error monitoring), debugging, code reviews',
    ],
    [
      'AI & developer experience',
      'AI agents, Claude Code, Claude.ai, LLM-assisted development, developer tooling, type-safe API clients',
    ],
    ['Payments', 'Stripe (Stripe API, Stripe Tax, Payment Element, Address Element)'],
    ['Collaboration', 'Figma, product and design collaboration, knowledge sharing'],
  ] as [string, string][],
  earlierCareer: [
    {
      title: 'Senior Attorney',
      company: 'Oleksandr Peremezhko & Partners, Kyiv',
      period: 'Jun 2015 – Jan 2018',
      bullets: [
        "Led the firm's tax law practice and oversaw all of its tax cases.",
        'Advised SMEs and large enterprises (film distribution, advertising, engineering) on day-to-day tax matters.',
        'Represented clients in court in disputes worth over $5 million.',
        'Assessed tax risks in planned agreements and investment projects.',
      ],
    },
    {
      title: 'Attorney',
      company: 'Oleksandr Peremezhko & Partners, Kyiv',
      period: 'Sep 2012 – Jun 2015',
      bullets: [
        'Litigated tax and commercial disputes.',
        'Supported clients on site and remotely during tax inspections.',
        'Advised individuals, including foreign nationals, on personal taxation.',
      ],
    },
  ] as Role[],
  education: [
    {
      title: 'Front-End Development',
      company: 'Medieinstitutet, Gothenburg',
      period: '2018 – 2020',
      bullets: ['Final project: built a complete full-stack web application with a Node.js backend.'],
    },
    {
      title: 'Master of Laws',
      company: 'Taras Shevchenko National University of Kyiv',
      period: '2009 – 2011',
      bullets: [],
    },
    {
      title: 'Bachelor of Laws',
      company: 'Taras Shevchenko National University of Kyiv',
      period: '2005 – 2009',
      bullets: [],
    },
  ] as Role[],
  languages: ['English', 'Swedish', 'Ukrainian', 'Polish'],
}
