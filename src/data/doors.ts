export type Category = 'Skill' | 'Achievement' | 'Fact'

export interface Door {
  id: number
  /** Skill, Achievement or Fact; leave out to show no tag. */
  category?: Category
  emoji: string
  headline: string
  description: string
  /** Longer bullet points shown in the "Read more" card. */
  details: string[]
  /** Tools and topics shown as small tags in the "Read more" card. */
  tags: string[]
  /** Optional photo (file in public/), shown on the open door and in its card. */
  photo?: string
  /** Optional short highlighted fact, e.g. availability. */
  highlight?: string
  /** Show the "Email me" / "LinkedIn" call-to-action buttons (door 24). */
  hireMe?: boolean
  /** Visual size in the grid, so the calendar looks hand-made. */
  size?: 'wide' | 'tall' | 'big'
}

export const doors: Door[] = [
  {
    id: 1,
    category: 'Fact',
    emoji: '⚖️',
    headline: 'Plot twist: ex-lawyer',
    description:
      'Six years as a tax attorney in Kyiv (2012–2018) before switching to software. Both have strict rules; only one has a compiler.',
    details: [
      'Attorney (2012–2015), then Senior Attorney (2015–2018) at Oleksandr Peremezhko & Partners, Kyiv.',
      'Moved to Gothenburg and retrained as a front-end developer at Medieinstitutet (2018–2020).',
      'Joined Adfenix (now Realforce) as a Junior Frontend Engineer in 2019.',
    ],
    tags: ['Tax law', 'Litigation', 'Career change'],
    size: 'wide',
  },
  {
    id: 2,
    category: 'Achievement',
    emoji: '🏛️',
    headline: 'Objection! Sustained.',
    description: 'Represented clients in court in tax and commercial disputes worth over $5 million.',
    details: [
      'Litigated tax and commercial disputes.',
      'Represented clients in court in disputes worth over $5 million.',
      'Supported clients on site and remotely during tax inspections.',
    ],
    tags: ['Litigation', 'Negotiation', 'Risk assessment'],
  },
  {
    id: 3,
    category: 'Fact',
    emoji: '📚',
    headline: 'Led a tax law practice',
    description:
      "As Senior Attorney, led the firm's tax practice and oversaw all of its tax cases, advising SMEs and large enterprises.",
    details: [
      "Led the firm's tax law practice and oversaw all of its tax cases.",
      'Advised SMEs and large enterprises in film distribution, advertising and engineering on day-to-day tax matters.',
      'Assessed tax risks in planned agreements and investment projects.',
      'Advised individuals, including foreign nationals, on personal taxation.',
    ],
    tags: ['Leadership', 'Tax advisory', 'Client work'],
  },
  {
    id: 4,
    category: 'Fact',
    emoji: '🎓',
    headline: 'Law and code',
    description:
      'Bachelor and Master of Laws from Taras Shevchenko National University of Kyiv, then Front-End Development at Medieinstitutet, Gothenburg (2018–2020).',
    details: [
      'Bachelor of Laws (2005–2009) and Master of Laws (2009–2011), Taras Shevchenko National University of Kyiv.',
      'Front-End Development, Medieinstitutet, Gothenburg (2018–2020).',
      'Final project: a complete full-stack web application with a Node.js backend.',
    ],
    tags: ['Law', 'Front-end development', 'Node.js'],
    size: 'tall',
  },
  {
    id: 5,
    category: 'Skill',
    emoji: '🪄',
    headline: 'TypeScript migration',
    description:
      'Delivered the migration of the main production codebase from JavaScript to TypeScript, improving type safety and maintainability for the whole team.',
    details: [
      'Migrated the main production codebase from JavaScript to TypeScript.',
      'Earlier, migrated an embeddable marketing widget (Preact) to TypeScript, making it easier and safer to extend.',
      'Improved type safety and maintainability for the whole team.',
    ],
    tags: ['TypeScript', 'JavaScript', 'Preact'],
  },
  {
    id: 6,
    category: 'Skill',
    emoji: '⚛️',
    headline: 'React at scale',
    description: 'Builds the main customer-facing app in React and TypeScript, with reusable, accessible components.',
    details: [
      'Builds features across the main customer-facing React app.',
      'Created reusable, accessible React components for the new design system.',
      'Works with React Query, react-hook-form and Vite.',
    ],
    tags: ['React', 'TypeScript', 'React Query', 'react-hook-form', 'Vite'],
  },
  {
    id: 7,
    category: 'Fact',
    emoji: '🎂',
    headline: 'Happy 7',
    description: '7+ years building production web applications, owning features from technical design to release.',
    details: [
      'Frontend Engineer and Software Engineer at Realforce (former Adfenix) since 2019.',
      'Owns features end to end: technical design, API design, implementation, automated testing and release.',
      'Cares about user-friendly, accessible web applications and a great developer experience.',
    ],
    tags: ['Fullstack', 'End-to-end ownership'],
    size: 'big',
  },
  {
    id: 8,
    category: 'Skill',
    emoji: '🎹',
    headline: 'C# and .NET backend',
    description:
      'Builds and maintains REST APIs in C# / ASP.NET Core across several services, from endpoint design and validation to EF Core data access.',
    details: [
      'Builds and maintains REST APIs in C# (ASP.NET Core) across several services.',
      'Covers endpoint design, request validation, EF Core domain models and data access.',
      'Built secure server-side payment validation in .NET.',
    ],
    tags: ['C#', 'ASP.NET Core', 'EF Core', 'REST'],
  },
  {
    id: 9,
    category: 'Skill',
    emoji: '🔌',
    headline: 'API design',
    description:
      'Designs the API contracts behind features together with backend engineers: request and response models, validation rules and error handling.',
    details: [
      'Shaped the API contracts behind the checkout and back-office tools.',
      'Designs REST endpoints in ASP.NET Core, from routes and request validation to clear error responses.',
      'Maps backend errors, such as Stripe API errors, to clear, actionable messages for users.',
    ],
    tags: ['REST', 'API design', 'Validation', 'Error handling'],
  },
  {
    id: 10,
    category: 'Achievement',
    emoji: '💳',
    headline: 'Stripe payments, end to end',
    description:
      'Owns the Stripe payment features: React checkout, automated Stripe Tax and secure server-side validation in .NET. A former tax lawyer building tax collection, fittingly.',
    details: [
      'Led the React and TypeScript checkout using Stripe Payment and Address Elements.',
      'Set up automated Stripe Tax collection.',
      'Built secure server-side payment validation in C# (.NET).',
      'Mapped Stripe API errors to clear, actionable messages for users.',
    ],
    tags: ['Stripe', 'Stripe Tax', 'React', 'C# / .NET'],
    size: 'wide',
  },
  {
    id: 11,
    category: 'Achievement',
    emoji: '📜',
    headline: 'Type-safe API contracts',
    description:
      'Introduced TypeScript API clients generated from OpenAPI specs, so breaking API changes are caught at compile time instead of in production.',
    details: [
      'Introduced TypeScript API clients generated from OpenAPI / Swagger specs.',
      'Keeps frontend and backend contracts in sync.',
      'Breaking API changes are caught at compile time instead of in production.',
    ],
    tags: ['OpenAPI', 'Swagger', 'TypeScript', 'Developer experience'],
  },
  {
    id: 12,
    category: 'Achievement',
    emoji: '🤖',
    headline: 'AI-assisted engineering',
    description:
      "Drives the team's adoption of Claude Code: project instructions, custom skills and workflows that keep AI-assisted work aligned with the architecture.",
    details: [
      'Drives team-wide adoption of AI coding agents with Claude Code.',
      'Defined workflows and wrote project instructions and custom skills.',
      'Applies AI responsibly across planning, implementation, code review, debugging, testing and documentation.',
      'Keeps the team up to date on new features and tools. (This calendar was built that way too.)',
    ],
    tags: ['Claude Code', 'AI agents', 'Developer tooling'],
    size: 'tall',
  },
  {
    id: 13,
    category: 'Achievement',
    emoji: '📣',
    headline: 'Marketing automation',
    description:
      "Built the product's core self-service tool, where customers set up automated marketing across Meta and Google with targeting, budgets and validation.",
    details: [
      "Built the product's core self-service tool for automated marketing.",
      'Customers set up campaigns across Meta and Google with targeting, budgets and validation.',
      "Used by real-estate agencies across the platform's markets.",
    ],
    tags: ['React', 'TypeScript', 'Meta & Google Ads'],
    size: 'tall',
  },
  {
    id: 14,
    category: 'Achievement',
    emoji: '📱',
    headline: 'Mobile-first checkout',
    description:
      'Launched a mobile-first self-service checkout, from product selection to payment, extending the platform to B2C.',
    details: [
      'Launched a mobile-first self-service checkout.',
      'Covers the whole flow from product selection to payment.',
      'Extended the platform from B2B to B2C customers.',
    ],
    tags: ['Mobile-first', 'Checkout', 'B2C'],
  },
  {
    id: 15,
    category: 'Achievement',
    emoji: '🦸‍♀️',
    headline: 'Back-office tools',
    description:
      'Built the tools internal teams use to onboard and support customers: white-labelling, ad-platform integrations, permissions and order management.',
    details: [
      'Built the back-office tools internal teams use to onboard and support customers.',
      'White-labelling, ad-platform integrations, permissions and order management.',
      'Shaped the API contracts behind these tools together with backend engineers.',
    ],
    tags: ['Internal tools', 'Permissions', 'Integrations'],
  },
  {
    id: 16,
    category: 'Skill',
    emoji: '🎨',
    headline: 'Design systems and accessibility',
    description:
      'Delivered key parts of the move to a Tailwind CSS and Catalyst design system, with accessible React components built to WCAG.',
    details: [
      'Delivered key parts of the frontend modernisation of the main customer-facing app.',
      'Moved to a new Tailwind CSS and Catalyst design system.',
      'Builds reusable, accessible React components with WCAG in mind.',
    ],
    tags: ['Tailwind CSS', 'Catalyst', 'Accessibility', 'WCAG'],
    size: 'wide',
  },
  {
    id: 17,
    category: 'Skill',
    emoji: '🕵️‍♀️',
    headline: 'Production reliability',
    description:
      'Uses Sentry to catch and debug production errors, and takes code reviews seriously, keeping customer-facing features reliable.',
    details: [
      'Uses Sentry to catch and debug production errors.',
      'Helps keep customer-facing features reliable.',
      'Regular code reviews across the product.',
    ],
    tags: ['Sentry', 'Debugging', 'Code review'],
  },
  {
    id: 18,
    category: 'Skill',
    emoji: '🧪',
    headline: 'Automated testing',
    description: 'Playwright, Cypress and Vitest, running in CI/CD for continuous delivery.',
    details: [
      'Writes automated tests with Playwright, Cypress and Vitest.',
      'Works with CI/CD and continuous delivery.',
      'This site has a test suite too, run on every deploy.',
    ],
    tags: ['Playwright', 'Cypress', 'Vitest', 'CI/CD'],
  },
  {
    id: 19,
    category: 'Skill',
    emoji: '🎭',
    headline: 'Unblocking the frontend',
    description: 'Built API mocks so frontend features and tests could move ahead before backend endpoints were ready.',
    details: [
      'Built API mocks so frontend features and tests could move ahead before backend endpoints were ready.',
      'Keeps frontend work unblocked in parallel with backend development.',
    ],
    tags: ['API mocks', 'Testing'],
  },
  {
    id: 20,
    category: 'Fact',
    emoji: '🗺️',
    headline: '10+ European markets',
    description: 'Works on a B2B SaaS platform for real-estate agencies, used in more than ten European markets.',
    details: [
      'Realforce (former Adfenix) is a marketing automation SaaS for real-estate agencies.',
      'The platform is used in 10+ European markets.',
    ],
    tags: ['B2B SaaS', 'Marketing automation'],
  },
  {
    id: 21,
    category: 'Fact',
    emoji: '🗣️',
    headline: 'Four languages',
    description: 'English, Swedish, Ukrainian and Polish.',
    details: ['English, Swedish, Ukrainian and Polish.', 'Comfortable working across cultures and markets.'],
    tags: ['English', 'Swedish', 'Ukrainian', 'Polish'],
  },
  {
    id: 22,
    category: 'Fact',
    emoji: '⛵',
    headline: 'Based in Gothenburg',
    description:
      'Gothenburg, Sweden, working in an autonomous, cross-functional team with product, design and architects.',
    details: [
      'Based in Gothenburg, Sweden.',
      'Works in an autonomous, cross-functional team.',
      'Partners with product and design from scoping to release, and validates technical decisions with architects and backend engineers.',
    ],
    tags: ['Collaboration', 'Figma', 'Knowledge sharing'],
  },
  {
    id: 23,
    category: 'Skill',
    emoji: '🧾',
    headline: 'Complex business rules',
    description:
      'A legal background brings an edge with complex domain rules, paired with a focus on clean, maintainable software.',
    details: [
      'A background as a tax attorney gives an edge with complex business rules.',
      "Paired with an engineer's focus on clean, maintainable software that solves real user problems.",
    ],
    tags: ['Domain modelling', 'Business rules'],
  },
  {
    id: 24,
    emoji: '🎁',
    headline: 'All I want for Christmas is a new challenge',
    description:
      'Fullstack engineer, former tax lawyer and AI enabler who owns features end to end. The full CV is one click away.',
    photo: 'me.jpg',
    highlight: 'Notice period: 1 month',
    hireMe: true,
    details: [
      'Fullstack web engineer: TypeScript, React, C# / .NET.',
      '7+ years in production on a B2B SaaS platform used in 10+ European markets.',
      'Owns features end to end and improves how teams work, from type-safe APIs to AI-assisted engineering.',
    ],
    tags: ['Fullstack', 'TypeScript', 'React', 'C# / .NET', 'Claude Code'],
    size: 'big',
  },
]

/** Fixed shuffled order for the grid, like a real advent calendar. */
export const gridOrder: number[] = [
  7, 13, 2, 3, 10, 21, 4, 15, 23, 1, 9, 16, 24, 5, 20, 11, 18, 17, 12, 8, 22, 14, 6, 19,
]

export const doorById = new Map(doors.map((d) => [d.id, d]))

/**
 * The grid order with today's door swapped into the place of the first door of the same size.
 * Swapping two doors of the same shape never changes how the grid packs (so no gaps appear),
 * and because the shuffled order starts with one door of each shape, today's door always ends
 * up in the first rows (1–2 on desktop, 1–3 on tablet). Phones use `phoneOrder` instead.
 */
export function orderWithTodayFirst(order: number[], todayId: number): number[] {
  const size = (id: number) => doorById.get(id)?.size
  const swapWith = order.find((id) => size(id) === size(todayId))
  if (swapWith === undefined || swapWith === todayId) return order
  return order.map((id) => (id === todayId ? swapWith : id === swapWith ? todayId : id))
}

/** Phones show the doors in plain order, 1–24, the same every day (today's door is highlighted in place). */
export const phoneOrder: number[] = doors.map((d) => d.id)

/**
 * On phones (2 columns), the normal doors that would sit alone in a row in this order, because the
 * next door takes a full row (wide, tall, big) or there is no next door. They stretch to full width,
 * so the grid has no gaps and the doors stay in order.
 */
export function phoneFullWidth(order: number[]): Set<number> {
  const full = new Set<number>()
  let waiting: number | null = null // a normal door in the left column, still without a neighbour
  for (const id of order) {
    if (!doorById.get(id)?.size) {
      waiting = waiting === null ? id : null
    } else {
      if (waiting !== null) full.add(waiting)
      waiting = null
    }
  }
  if (waiting !== null) full.add(waiting)
  return full
}
