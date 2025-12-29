# Dashboards

App shell blueprint with full-bleed content, reliable sidebar, and resilient cards/tables.

## Shell Layout
- **Grid:** `grid-cols-[260px_minmax(0,1fr)]` with `min-h-screen`. Sidebar fixed width; main uses `minmax(0, 1fr)` to avoid accidental gutters.
- **Apply shell only to dashboard routes:** Keep root layout minimal (fonts/theme), then wrap dashboard routes with an `AppShell`/layout component so auth/landing pages stay clean.
- **No hidden rails:** Do not place invisible collapse targets between sidebar and content. Use explicit toggle buttons only.
- **Padding:** Place page padding inside the main column (`px-6 lg:px-10 py-8`).

## Full-Bleed Fix (mandatory)
- Avoid `container`/`max-w-*` on the main dashboard content; let the grid span the viewport.
- Add `min-w-0` to main, sections, and card wrappers to prevent horizontal scroll when cards expand.
- If using a sidebar component, ensure it sits in its own grid track and doesn’t wrap the main content.
- Keep header/toolbars inside the main track so they align with cards and tables.
- Verification: on ultrawide screens, content should reach near the viewport edge minus padding; hovering near sidebar/content boundary should not expose any hidden target. See `docs/fullbleed-layout.md` for the fix logic that solved this recurring bug.

## Header & Navigation
- Top bar inside main track with breadcrumbs, search, user menu, theme toggle. Keep height compact (`h-14`–`h-16`).
- Sidebar uses shadcn `NavigationMenu`/`ScrollArea` + buttons; lock width and make it scroll independently.

## Content Patterns
- **Cards grid:** `grid gap-6 md:grid-cols-2 xl:grid-cols-3` for summaries; pin key metrics in the first row.
- **Tables:** shadcn `Table` with zebra stripes, sticky header optional. Right-align numeric columns; use `tabular-nums` and muted dividers.
- **Filters:** use `Select`, `Popover`, `DateRangePicker` (shadcn) with a sticky toolbar if needed.
- **Empty states:** card with icon + headline + small CTA; keep copy direct.

## Motion & States
- Subtle page fade-in and stagger cards; avoid animating table rows on load beyond a light fade.
- Loading: skeleton cards/rows; keep layout stable. Errors: inline `Alert` with retry button.

## Checklist
- [ ] Shell applied only to dashboard routes; landing/auth stay unaffected.
- [ ] `grid-cols-[sidebar_minmax(0,1fr)]` with `min-w-0` on main/sections.
- [ ] No `container`/`max-w` wrappers on main content.
- [ ] Sidebar has explicit toggle, no hidden rails.
- [ ] Cards/tables source components from shadcn; spacing consistent with tokens.
