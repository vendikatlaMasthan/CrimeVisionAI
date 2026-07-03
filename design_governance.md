# Master Design Governance — Crime Pattern Genome Platform

This document establishes the non-negotiable design governance standard for all future page generations, screen layouts, and component updates.

---

## 1. Non-Negotiable Theme Rule

**One theme, applied everywhere, no exceptions.** Light theme is locked in. No screen, panel, or component may switch to a dark or semi-transparent surface while the rest of the app is light. 

### Surface System

| Layer | Color | Usage |
|---|---|---|
| Page background | `#F5F7FA` | Behind all content, all pages |
| Card / panel surface | `#FFFFFF` | Every card, table, modal, sidebar |
| Hairline border | `#E4EAF2` | 1px borders between cards, table rows, dividers |
| Header / navbar | `#FFFFFF` | Must match the light theme — no dark navy blocks |
| Disabled / muted surface | `#EEF1F6` | Inputs, placeholders, empty states |

**Forbidden:** any `rgba(0,0,0,0.x)` dark overlay panel, any translucent gray "in-between" surface sitting on a dark background. Use hairline borders + subtle shadow (`0 1px 2px rgba(16,24,40,0.05)`), not a darker fill.

---

## 2. Semantic Color System (Badges, Tags, Status Chips)

**Exactly four colors. No exceptions, no one-offs (no purple, pink, cyan, lime, etc.).**

| Semantic meaning | Color token | Hex | Use for |
|---|---|---|---|
| Info / In Progress | `--color-info` | `#2563EB` (blue) or `#0D9488` (teal, brand-aligned) | Under investigation, new, in progress |
| Success / Resolved | `--color-success` | `#16A34A` | Resolved, closed, verified, convicted |
| Warning / Pending | `--color-warning` | `#D97706` (amber) | Pending review, awaiting evidence |
| Danger / Critical | `--color-danger` | `#DC2626` | Arrested, critical, high-priority, escalated |

Rules:
- Every status tag, case category, priority flag, and system badge must map to one of these four.
- Badge style: light tint background (10–15% opacity of the semantic color) + solid text/border in the full semantic color. Example: `background: #FEF3E2; color: #D97706; border: 1px solid #FCD9A8;`
- Neutral/purely informational tags can use a neutral gray badge (`#EEF1F6` bg / `#475467` text).

---

## 3. Typography Rules

- **Sentence case everywhere**: page titles, section headers, badge text, table column headers, table cell content, button labels.
- **Lowercase eyebrow/meta labels**: Uppercase is reserved *only* for small eyebrow/meta labels, max 11–12px, medium weight (not bold), with letter-spacing ~0.04em.
- **Weight hierarchy**:
  - Page title: 24–28px, semibold (600)
  - Section header: 16–18px, semibold (600)
  - Stat numbers: 28–32px, bold (700)
  - Body / table text: 14px, regular (400)
  - Muted/secondary text: 13px, regular, `#667085`
  - Badge text: 12–13px, medium (500), sentence case

---

## 4. Layout & Density

- No page may ship with more than ~20% unused whitespace in the primary content area.
- Content layout for list+detail screens: **left panel (list, ~30–35% width) + right panel (detail/visualization, ~65–70% width)**, both light-surface cards with hairline borders.

---

## 5. Pre-Ship Checklist (run this on every new screen)

- [ ] No dark or translucent-gray surfaces anywhere.
- [ ] All badges use only info/success/warning/danger tokens — zero off-palette colors.
- [ ] No uppercase+bold text except ≤12px eyebrow labels.
- [ ] No large empty content regions — every panel has a function.
- [ ] Header background matches body background theme (white surface).
- [ ] Borders are hairline `#E4EAF2`, not heavy dividers.
- [ ] Contrast checked: body text ≥ 4.5:1 against its surface.

---

# Master Layout Prompt — Sidebar & Section Arrangement

This standard governs *structure and arrangement* — where things sit, how they're grouped, and in what order — separate from color/typography rules.

## 0. Core Layout Grid

Every page uses the same three-zone skeleton. No screen may invent a new skeleton.

```
┌─────────────┬──────────────────────────────────────────────┐
│             │  Top Bar (search, filters, user, alerts)      │
│             ├──────────────────────────────────────────────┤
│   Sidebar   │  Page Header (title + key stats row)          │
│  (fixed,    ├──────────────────────────────────────────────┤
│  240px)     │  Content Area                                 │
│             │  ┌───────────────┬──────────────────────────┐ │
│             │  │ List Panel    │ Detail / Visualization    │ │
│             │  │ (~32%)        │ Panel (~68%)               │ │
│             │  └───────────────┴──────────────────────────┘ │
└─────────────┴──────────────────────────────────────────────┘
```

- Sidebar: fixed width 240–260px, full viewport height, never scrolls with content.
- Top bar: fixed height ~64px, sits above content, same width as content area (not full-bleed under the sidebar).
- Page header: title + a horizontal row of stat cards, height auto, one consistent style across all pages.
- Content area: everything below the header, uses the list+detail split (or a full-width table/grid if the page has no detail view).

---

## 1. Sidebar Arrangement Rules

**Vertical order, top to bottom, fixed for every page:**

1. **Logo / product name** (top, 64px height, aligned with top bar height)
2. **Primary nav group** — core workflow items (Dashboard, Live Alerts, Cases, AI Investigator, Crime Pattern Genome, etc.)
3. **Secondary nav group** — supporting tools (Reports, Analytics, Map View), visually separated from primary group by a hairline divider or 16px gap + small uppercase group label (e.g. `ANALYSIS`, `TOOLS`)
4. **Bottom-anchored group** — Settings, Support, User profile/account — pinned to the bottom of the sidebar via `margin-top: auto`, always separate from the scrollable nav list above it

**Per-item rules:**
- Icon (20px) + label, consistent left padding (16px), consistent vertical padding (10–12px) — same tap/click target height for every item, no exceptions.
- Active state: light tint background (`#EEF6F4` or brand-teal 8% tint) + colored left border (3px, brand teal) + icon and text in brand color. Never a bold, high-contrast inverted block.
- Hover state: subtle gray tint (`#F5F7FA`), no border.
- Group labels (`ANALYSIS`, `TOOLS`, etc.): 11px, uppercase, medium weight, `#98A2B3`, 8px bottom margin — this is the one legitimate uppercase use case.
- Collapsed/expandable sub-items (if any) indent 12px further with a smaller icon or none.

**What "arranged nicely" means in practice:**
- Related items are grouped, not scattered — grouping reflects the user's workflow (monitor → investigate → analyze → configure), not alphabetical or arbitrary order.
- No orphaned single items floating with extra whitespace around them.
- Equal spacing between every item in a group; only group boundaries get the larger gap.

---

## 2. Section Arrangement Within a Page

**Order of sections top to bottom (standard for list/dashboard-style pages):**

1. Page title + short subtitle/description (left-aligned)
2. Key stats row — 3 to 5 stat cards, equal width, equal height, evenly spaced in a single row (wrap to 2 rows only below ~900px)
3. Filter/search/action bar — search input left, filter chips/dropdowns center, primary action button (e.g. "New Case") right
4. Main content split:
   - Left: scrollable list/table panel
   - Right: detail panel or visualization, sticky/fixed while list scrolls
5. Pagination or "load more," bottom of list panel only — never floating disconnected from the list

**Spacing scale (use consistently, don't invent new values):**
- 4px — icon-to-text gaps
- 8px — inside a component (badge padding, button padding)
- 16px — between related elements (stat cards in a row, form fields)
- 24px — between a section's header and its content
- 32px — between major sections on the page
- 40–48px — page-level top/bottom margins

**Alignment rules:**
- Every card in a row shares the same top edge and same height (use `align-items: stretch` in the row, not natural content height).
- All left edges of stacked sections align to the same content-area left margin — no section indents randomly.
- Right-aligned actions (buttons, "view all" links) stay right-aligned consistently across every section header, not left in some and right in others.

---

## 3. Detail / Right Panel (fills the current dead space)

Use this structure so the panel never sits empty:

1. **Header row**: selected item title + status badge + close/collapse icon
2. **Key facts strip**: 2–4 compact data points in a row (e.g. District, Date, Match Confidence, Assigned Officer)
3. **Primary visualization block**: map, pattern-match graph, or timeline — this is the visual anchor of the panel, should take ~50% of panel height
4. **Secondary tabs or list**: related cases, evidence, activity log — tabbed if more than one, so the panel doesn't get overloaded

If nothing is selected: show a neutral empty state (icon + one line of text, e.g. "Select a case to view details") — never a truly blank white panel.

---

## 4. Responsive Collapse Order

When width shrinks, collapse in this order (don't let sections just wrap randomly):

1. Sidebar collapses to icon-only (still fixed, 64px wide)
2. Detail panel stacks below the list panel instead of side-by-side
3. Stat row wraps from one row to two
4. Filter bar stacks search above filters above action button

---

## 5. Pre-Ship Checklist — Arrangement

- [ ] Sidebar items grouped by workflow stage, not scattered
- [ ] Settings/account pinned to sidebar bottom, separate from nav
- [ ] Every stat/card row has equal-width, equal-height, evenly spaced items
- [ ] Spacing only ever uses the defined scale (4/8/16/24/32/40)
- [ ] All section left edges align to one content margin
- [ ] Right panel always shows either content or a proper empty state — never blank
- [ ] Same skeleton (sidebar + top bar + header + list/detail split) reused on every page, no one-off structures
