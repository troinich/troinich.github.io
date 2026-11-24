import { cv } from './cv'

export interface Door {
  id: number
  headline: string
  description: string
  /** Longer bullet points shown in the "Read more" card. */
  details: string[]
  /** Tools used (no soft skills), shown as one plain "Tools:" line in the "Read more" card; leave out if none. */
  tools?: string[]
  /** Optional photo (file in public/), shown on the open door and in its card. */
  photo?: string
  /** Optional short highlighted fact, e.g. availability. */
  highlight?: string
  /** Show the contact buttons ("Book a call", "Email me", …) (door 24). */
  hireMe?: boolean
  /** Visual size in the grid, so the calendar looks hand-made. */
  size?: 'wide' | 'tall' | 'big'
}

export const doors: Door[] = [
  {
    id: 1,
    headline: 'Fullstack, from React to .NET',
    description:
      'I build web applications across the whole stack: React and TypeScript in the browser, C# and ASP.NET Core on the server.',
    details: [
      'Frontend: React, TypeScript, Tailwind CSS, React Query, react-hook-form and Vite.',
      'Backend: REST APIs in C# (ASP.NET Core) with EF Core, plus Node.js.',
      'Comfortable working anywhere between the UI, the API contract and the database.',
    ],
    tools: ['TypeScript', 'React', 'C#', 'ASP.NET Core', 'EF Core', 'Node.js'],
    size: 'wide',
  },
  {
    id: 2,
    headline: 'Court cases worth over $5 million',
    description:
      'For six years I was a tax attorney in Kyiv, representing clients in court in tax and commercial disputes worth over $5 million.',
    details: [
      'Attorney (2012–2015), then Senior Attorney (2015–2018), at Oleksandr Peremezhko & Partners, Kyiv.',
      "Led the firm's tax practice and oversaw all of its tax cases.",
      'Supported clients on site and remotely during tax inspections.',
      'Moved to Gothenburg in 2018 and switched to software.',
    ],
  },
  {
    id: 3,
    headline: 'Junior to Software Engineer',
    description:
      'I joined Adfenix (now Realforce) as a Junior Frontend Engineer and grew into a fullstack Software Engineer, with more responsibility at every step.',
    details: [
      'Junior Frontend Engineer (2019–2021): feature work, API integrations and a first TypeScript migration.',
      'Frontend Engineer (2021–2024): owned core product features and the move of the main codebase to TypeScript.',
      'Software Engineer (2024–now): own features across frontend and backend, and drive AI adoption in the team.',
    ],
  },
  {
    id: 4,
    headline: 'Master of Laws, trained developer',
    description:
      'I hold a Master of Laws (LL.M.) from Taras Shevchenko National University of Kyiv and studied Front-End Development in Gothenburg, writing production code before I graduated.',
    details: [
      'Master of Laws, LL.M. (2009–2011) and Bachelor of Laws (2005–2009), Taras Shevchenko National University of Kyiv.',
      'Front-End Development, Medieinstitutet, Gothenburg (2018–2020).',
      'Final project: a complete full-stack web application with a Node.js backend.',
      'Designed and built this calendar: React, TypeScript, Tailwind CSS and Vite, tested and deployed on every push.',
    ],
    tools: ['Node.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    size: 'tall',
  },
  {
    id: 5,
    headline: 'JavaScript to TypeScript',
    description:
      'I delivered the migration of our main production codebase from JavaScript to TypeScript, making it safer for the whole team to change.',
    details: [
      'Migrated the main production codebase to TypeScript, improving type safety and maintainability for the whole team.',
      'Earlier, migrated an embeddable marketing widget (Preact) to TypeScript, making it easier and safer to extend.',
    ],
    tools: ['TypeScript', 'JavaScript', 'Preact'],
  },
  {
    id: 6,
    headline: 'React and TypeScript',
    description:
      'I build features in our main customer-facing React and TypeScript app, with reusable, accessible components.',
    details: [
      'Server state with React Query, forms with react-hook-form, builds with Vite.',
      'Work on performance optimisation and state management.',
    ],
    tools: ['React', 'TypeScript', 'React Query', 'react-hook-form', 'Vite'],
  },
  {
    id: 7,
    headline: '7+ years in production',
    description:
      'I have built production web applications for more than seven years, and I own features end to end: technical design, API design, implementation, testing and release.',
    details: [
      'At Realforce (formerly Adfenix) since 2019: Junior Frontend Engineer, Frontend Engineer and, since 2024, Software Engineer (fullstack).',
      'Shipped features such as the Stripe checkout, the B2C self-service checkout and the Meta and Google marketing tool.',
      'Before building: technical design and API contracts, checked with architects and backend engineers.',
      'After building: automated tests in CI/CD, then Sentry to watch the feature in production.',
      'Care about user-friendly, accessible web applications and a great developer experience.',
    ],
    size: 'big',
  },
  {
    id: 8,
    headline: 'C# and .NET backend',
    description: 'I build and maintain REST APIs in C# and ASP.NET Core across several backend services.',
    details: [
      'Build endpoints, request validation, EF Core domain models and data access.',
      'Also hands-on with Node.js on the backend.',
    ],
    tools: ['C#', 'ASP.NET Core', 'EF Core', 'Node.js'],
  },
  {
    id: 9,
    headline: 'API design',
    description:
      'I design API contracts with backend engineers: request and response models, validation rules and error handling.',
    details: [
      'Defined the API contracts behind the back-office tools.',
      'Design REST endpoints in ASP.NET Core, from routes to clear error responses.',
    ],
    tools: ['ASP.NET Core', 'REST', 'GraphQL'],
  },
  {
    id: 10,
    headline: 'Stripe payments, end to end',
    description:
      'I own our Stripe payment features from technical design to release: the React checkout, automated Stripe Tax and secure server-side validation in .NET.',
    details: [
      'Led the React and TypeScript checkout using Stripe Payment and Address Elements.',
      'Set up automated Stripe Tax collection.',
      'Built secure server-side payment validation in C# (.NET).',
      'Mapped Stripe API errors to clear, actionable messages for users.',
    ],
    tools: ['Stripe', 'Stripe Tax', 'React', 'TypeScript', 'C# / .NET'],
    size: 'wide',
  },
  {
    id: 11,
    headline: 'Type-safe API contracts',
    description:
      'I introduced TypeScript API clients generated from OpenAPI specs, so breaking API changes are caught at compile time, not in production.',
    details: [
      'Introduced TypeScript API clients generated from OpenAPI / Swagger specs.',
      'Keeps frontend and backend contracts in sync.',
      'Catches breaking API changes at compile time instead of in production.',
    ],
    tools: ['OpenAPI', 'Swagger', 'TypeScript'],
  },
  {
    id: 12,
    headline: 'AI-assisted engineering',
    description:
      "I lead my team's adoption of AI coding agents with Claude Code, keeping AI-assisted work in line with our architecture and engineering standards.",
    details: [
      'Defined workflows and wrote the project instructions and custom skills that keep AI-assisted work aligned with the architecture.',
      'Apply AI responsibly across planning, implementation, code review, debugging, testing and documentation.',
      'Keep the team up to date on new features and tools.',
      'Built this calendar with Claude Code too.',
    ],
    tools: ['Claude Code', 'Claude.ai'],
    size: 'tall',
  },
  {
    id: 13,
    headline: 'Automated ad marketing',
    description:
      "I built the product's core self-service tool, where customers set up automated marketing on Meta and Google.",
    details: [
      'Lets customers set up campaigns across Meta and Google, with targeting, budgets and validation.',
      "Used by real-estate agencies across the platform's markets.",
      'Built in React and TypeScript.',
    ],
    tools: ['React', 'TypeScript', 'Meta Ads', 'Google Ads'],
    size: 'tall',
  },
  {
    id: 14,
    headline: 'From B2B to B2C',
    description:
      'I launched a mobile-first self-service checkout that extended the platform from B2B to B2C customers.',
    details: [
      'Covers the whole flow, from product selection to payment.',
      'Defined its API contracts together with backend engineers.',
    ],
  },
  {
    id: 15,
    headline: 'Back-office tools',
    description: 'I built the tools our internal teams use to onboard and support customers.',
    details: ['White-labelling and ad-platform integrations.', 'Permissions and order management.'],
  },
  {
    id: 16,
    headline: 'Design systems and accessibility',
    description:
      'I delivered key parts of our move to a Tailwind CSS and Catalyst design system, with reusable, accessible React components.',
    details: [
      'Delivered key parts of the frontend modernisation of the main customer-facing app.',
      'Build reusable, accessible React components with WCAG in mind.',
      'Work closely with designers in Figma.',
    ],
    tools: ['Tailwind CSS', 'Catalyst', 'React', 'Figma'],
    size: 'wide',
  },
  {
    id: 17,
    headline: 'Production reliability',
    description: 'I use Sentry to catch and debug production errors, keeping customer-facing features reliable.',
    details: ['Monitor and debug production errors with Sentry.', 'Review code regularly across the product.'],
    tools: ['Sentry'],
  },
  {
    id: 18,
    headline: 'Automated testing',
    description: 'I write automated tests with Playwright, Cypress and Vitest, running in CI/CD.',
    details: ['Work with continuous delivery.', 'Built a test suite for this site too, run on every deploy.'],
    tools: ['Playwright', 'Cypress', 'Vitest'],
  },
  {
    id: 19,
    headline: 'Unblocking the frontend',
    description:
      'I built API mocks so frontend features and tests could move ahead before backend endpoints were ready.',
    details: [
      'Kept frontend work and tests moving in parallel with backend development.',
      'Integrated REST and GraphQL APIs into frontend components, for dynamic data and real-time UI updates.',
    ],
    tools: ['REST', 'GraphQL'],
  },
  {
    id: 20,
    headline: '10+ markets',
    description: 'I work on a B2B SaaS platform for real-estate agencies, used in more than ten markets.',
    details: [
      'Realforce (formerly Adfenix) is a marketing automation SaaS for real-estate agencies.',
      'Serves both B2B and B2C customers.',
    ],
  },
  {
    id: 21,
    headline: 'Four languages',
    description: 'I speak English, Swedish, Ukrainian and Polish, and I live in Gothenburg, Sweden.',
    details: ['English, Swedish, Ukrainian and Polish.', 'Comfortable working across cultures and markets.'],
  },
  {
    id: 22,
    headline: 'Cross-functional by default',
    description:
      'I work in an autonomous, cross-functional team and partner with product, design and architects from scoping to release.',
    details: [
      'Validate technical design and architecture decisions with architects and backend engineers.',
      'Share knowledge across the team.',
    ],
    tools: ['Figma'],
  },
  {
    id: 23,
    headline: 'Complex business rules',
    description:
      'My background as a tax attorney gives me an edge with complex business rules, such as payments and tax.',
    details: [
      'Assessed tax risks in planned agreements and investment projects.',
      "Paired with an engineer's focus on clean, maintainable software that solves real user problems.",
    ],
  },
  {
    id: 24,
    headline: 'All I want for Christmas is a new challenge',
    description:
      'I am a fullstack engineer and former tax lawyer who owns features end to end and helps teams work well with AI. My full CV is one click away.',
    photo: 'me.webp',
    highlight: cv.availability,
    hireMe: true,
    details: [
      'Fullstack: TypeScript, React and C# / .NET.',
      '7+ years in production on a B2B SaaS platform used in 10+ markets.',
      'Improve how teams work, from type-safe APIs to AI-assisted engineering.',
    ],
    size: 'big',
  },
]

/** Fixed shuffled order for the grid, like a real advent calendar. */
export const gridOrder: number[] = [
  7, 10, 13, 2, 3, 21, 4, 15, 23, 1, 9, 16, 24, 5, 20, 11, 18, 17, 12, 8, 22, 14, 6, 19,
]

export const doorById = new Map(doors.map((d) => [d.id, d]))

/**
 * The grid order with today's door swapped into the place of the first door of the same size.
 * Swapping two doors of the same shape never changes how the grid packs (so no gaps appear),
 * and because the shuffled order starts with one door of each shape (big 7, wide 10, tall 13,
 * normal 2), today's door always ends up in the first two rows on tablet and desktop; a test
 * checks it. Phones use `phoneOrder` instead.
 * Door 24 is the exception: the finale keeps its place in the middle of the calendar, even on its day.
 */
export function orderWithTodayFirst(order: number[], todayId: number): number[] {
  const FINALE = 24
  if (todayId === FINALE) return order
  const size = (id: number) => doorById.get(id)?.size
  // door 24 is never swapped away either, even if another big door's day comes first
  const swapWith = order.find((id) => id !== FINALE && size(id) === size(todayId))
  if (swapWith === undefined || swapWith === todayId) return order
  return order.map((id) => (id === todayId ? swapWith : id === swapWith ? todayId : id))
}

/** Phones show the doors in plain order, 1–24, the same every day (today's door is highlighted in place). */
export const phoneOrder: number[] = doors.map((d) => d.id)

/**
 * The order the doors appear on screen: plain 1–24 on phones, the shuffled calendar with today's
 * door in the first rows on wider screens. The calendar renders this, and "Open all doors"
 * cascades through it, so the doors open in the order you see them.
 */
export function displayOrder(phone: boolean, todayId: number): number[] {
  return phone ? phoneOrder : orderWithTodayFirst(gridOrder, todayId)
}

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
