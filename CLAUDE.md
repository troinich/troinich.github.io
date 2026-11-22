# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Meet me", an Advent CV Calendar: a static single-page site (Vite + React 18 + TypeScript + Tailwind CSS v4) that presents Natalia Troinich's CV as 24 advent doors. No backend. Deployed to GitHub Pages at https://troinich.github.io (repo `troinich/troinich.github.io`) by `.github/workflows/deploy.yml` on every push to `main` (type-check → tests → `vite build` → Pages).

## Commands

```bash
npm run dev                      # dev server (http://localhost:5173)
npm test                         # all tests once (Vitest + jsdom)
npx vitest run src/App.test.tsx  # one test file
npx vitest run -t "Read more"    # tests whose name matches
npm run typecheck                # tsc -b
npm run build                    # tsc -b && vite build -> dist/
```

There is no linter configured. If the dev server suddenly renders without layout/styles (usually after a git branch switch makes Vite restart), stop and restart it; the Tailwind plugin stops processing after that restart, while the production build is unaffected.

## Architecture

`src/App.tsx` is the orchestrator. It owns which overlay is showing (snowman game, door "Read more" card, full CV, cookie prompt, confetti) and the flows between them. Most behaviour questions are answered there:

- **Lock before December.** `data/lock.ts`: outside December the calendar is locked unless the visitor has built the snowman (remembered in localStorage `meet-me:unlocked`). Locked visitors land on `SnowmanGame` ("Too early!" + 3-click snowman). "No, I'll wait" opens the CV; leaving the CV while locked shows the game again. While locked, every door renders closed and the counter shows 0; unlocking calls `closeAll()`.
- **Arrival.** When unlocked, today's door (`data/today.ts`: day of month, 25–31 → 24) is highlighted (gold pulse + red ribbon) but **not opened**, and the page is **not scrolled** to it. `orderWithTodayFirst` in `data/doors.ts` swaps it with the first door of the same size, so it is always in the first rows without leaving gaps in the grid. Phones (under 640px, via `hooks/useMediaQuery.ts`) use `phoneOrder` instead: always 1–24, today's door highlighted in place; `phoneFullWidth` stretches a normal door that would sit alone in its row (`.door--phone-full`), so there are no gaps. A phones-only "Go to today's door" button in the header row, before "Show full CV" (`goToToday` in `App.tsx`), scrolls to it without opening it. On phones the arrival pulse waits (IntersectionObserver in `App.tsx`) until today's door is actually on screen, by scrolling or via that button.
- **Cookie consent.** `consent.ts` stores the answer in a real cookie `cookie_consent`; GoatCounter (`config.ts` `GOATCOUNTER_CODE`) is loaded only after "Yes"; a later "No" (via "Cookie settings") calls `stopAnalytics()`, which removes the script, no-ops any further counting and sets GoatCounter's own `skipgc` opt-out flag ("Yes" reverses it). The question is `CookieBanner`, a small non-blocking card (bottom-right on desktop, bottom bar on phones, above pop-ups) that appears 4 seconds after arrival or when the first door is opened or 3 seconds after the full CV opens (never on top of the snowman game; for locked visitors it comes 3 seconds after the snowman unlocks the calendar or via the CV), only if unanswered; "No thanks" and "Sure!" have equal weight, and "Not now" hides it for the visit without saving. Its gingerbread man (`Gingerbread.tsx`) is eaten on "Sure!"; "No thanks" shows him safe in a marshmallow bath (`public/marshmallow-bath.jpg`).
- **Modals** (`CvView`, `DoorDetails`, `PhotoZoom`, `SnowmanGame`) share `hooks/useModal.ts` (focus trap, Escape, scroll lock, focus restore). Dialogs can stack (cookie prompt over the CV); `useModal` ignores keys whose target is inside a different `aria-modal` dialog, so Escape only closes the top one.
- **Doors.** `components/Door.tsx` stacks both faces in one grid cell: the content card (back) stays in place and the door (front) swings open on a hinge at its left edge. A transparent full-size `.door__hit` button sits above the door; when a door is open, `.door.is-open .door__inner` is raised above it (z-index in `index.css`) so buttons on the open card ("Read more", door 24's Email/LinkedIn/Full CV) are clickable. Inner buttons must `stopPropagation`, because clicking the open card itself closes the door. jsdom tests cannot catch z-index/hit-testing regressions; check in a real browser. Mobile Safari ignores `backface-visibility` on the front face's own layers (glowing number, ribbon), which once showed the number mirrored; so the door stops at -85° (never showing its back) and is set to `visibility: hidden` when the swing ends. Keep that when changing the door markup.
- **Persistence.** Opened doors live in localStorage `amazing-me:opened-doors` (`hooks/useOpenedDoors.ts`); all storage access is wrapped in try/catch.

## UI conventions

`src/index.css` defines the palette as CSS variables on `:root` (the page is always dark) and shared component classes in `@layer components`: `.btn` with `.btn--primary` (gold) / `.btn--secondary` (gold outline) / `.btn--sm`, `.icon-btn` (44px round), `.eyebrow` (small gold capitals above a title) and `.modal-backdrop` (centred, dimmed, blurred). Pop-up cards use `.door-details` for the green-and-gold frame. Use these and the colour variables (`--gold`, `--on-gold`, `--ink`, `--ink-2`, `--ink-soft`, …) instead of one-off Tailwind colours or button paddings, keep touch targets at least 40–44px, and keep body text on cards at 14px or larger.

## Content and assets

- Door content is data in `src/data/doors.ts`; CV view content is `src/data/cv.ts` (a copy of the PDF in `public/`). Door `size` (`wide`/`tall`/`big`) drives the grid: the total must stay a multiple of 12 cells (big = 4, wide/tall = 2, normal = 1) so rows of 2/3/4/6 have no gaps. A test in `doors.test.ts` enforces it.
- `src/config.ts` holds the GoatCounter code, the jingle sound file and an optional custom cookie image.
- The contact email is deliberately never written as plain text in source, tests or the built site (`data/contact.ts` assembles it from reversed pieces at click time; tests compare against a base64 value). Keep it that way. "Email me" falls back to copying the address if no mail app takes focus.
- `public/` contains only web-sized copies that the site uses. Originals live in `design/`, which is git-ignored (it includes a photo with GPS metadata). When adding a photo, export a resized copy with metadata stripped (e.g. render it in headless Chrome and screenshot it) and verify no GPS data before putting it in `public/`.
- New images are often dropped straight into `public/` (sometimes duplicating a file in `design/`). After any image change, check for unused assets: every file under `public/` should be referenced from `src/` or `index.html` (search for both the plain path and its URL-encoded form, e.g. spaces as `%20`). Move unused web copies, and originals in `design/` that no longer back any `public/` file, to the Trash (`~/.Trash/meet-me-cleanup/`) rather than deleting them, then run the tests and build. Name originals in `design/` after the web file they feed, keeping the source ID, e.g. `season-winter (pixabay bairyna-4332992).jpg`.

## Tests

`src/test/setup.ts` installs an in-memory `localStorage` when the global one is missing (newer Node versions shadow jsdom's) and clears it after each test. Much behaviour depends on the date, so App tests set the clock with `vi.useFakeTimers()` + `vi.setSystemTime(...)`. Use a December date for unlocked behaviour and a November date for the lock. Set `document.cookie = 'cookie_consent=no; path=/'` to skip the cookie prompt.

## Working agreements

- Do not commit or push unless explicitly asked.
- Never commit `_specs/` (local feature specs, git-ignored) or anything in `design/`.
- Slash commands (`/spec`, `/commit-message`) and subagents live in `.claude/commands/` and `.claude/agents/`, which are git-ignored: they stay local and are not in the repo.
