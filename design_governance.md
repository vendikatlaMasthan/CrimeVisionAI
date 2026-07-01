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
