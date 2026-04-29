---
name: supabase-arch-review
description: Run a structured architecture audit on a Next.js + Supabase project. Trigger when the user asks for an architecture review, code checkup, structural audit, or says things like "review my project", "check my schema", "is my structure bad", "audit my code". Read uploaded files and output ranked problems by severity. Always use this skill before giving architecture feedback on the user's Supabase/Next.js project.
---

# Supabase Architecture Review

## Goal

Read the user's uploaded project files and produce a ranked list of architectural problems, from highest to lowest severity. Do not just execute whatever the user asks — the point is to surface structural issues they may not be aware of or are actively ignoring.

## What to audit

Cover all of the following that are present in the uploaded files:

**Database / Supabase**
- Schema design: normalization, redundant columns, wrong data types, missing constraints
- Missing or overly permissive RLS policies
- Triggers and functions: logic that should be in the app layer, or vice versa
- Missing indexes on columns used in filters/joins
- Unique constraints — especially on junction-like pairs (e.g. `(user_id, show_id)`)
- Use of `public` schema for things that should be protected
- Nullable columns that shouldn't be, or vice versa

**Next.js / App layer**
- Server vs client component boundaries — fetching data in client components unnecessarily
- Duplicated data fetching logic that should be centralized
- Business logic living in components instead of utility/service modules
- Auth logic scattered across files instead of a single middleware or hook
- API routes doing too much (multiple responsibilities)
- Missing error boundaries or unhandled promise rejections

**General structure**
- Folder/module organization: are concerns separated or tangled?
- Repeated patterns that should be abstracted
- Hardcoded values that should be env vars or constants
- Dead code or commented-out blocks that are clearly abandoned

## Output format

Group findings by severity. For each issue:

- One-line title (what's wrong)
- Which file or area it's in
- Why it's a problem (one or two sentences max, no filler)
- A concrete fix or alternative — not vague advice

Example structure:

---
HIGH
- [Missing unique constraint on (user_id, show_id) in reviews table] — schema.sql
  Allows duplicate reviews per user per show. Silent upserts will create rows instead of updating. Add: `ALTER TABLE reviews ADD CONSTRAINT reviews_user_show_unique UNIQUE (user_id, show_id);`

MEDIUM
- ...

LOW
- ...
---

## Rules

- Be direct. Do not soften findings with "you might want to consider."
- If something is genuinely bad, say it's bad.
- If the user has clearly been patching around a structural problem (e.g. repeated workarounds for the same root cause), call it out explicitly.
- Do not praise things that are merely adequate.
- If files are missing context needed for a full audit, say what's missing and what it would change.
- Do not generate a refactor plan unless the user asks for one after seeing the findings.