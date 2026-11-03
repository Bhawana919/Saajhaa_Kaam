# Mauri design update: what changed

**New**
- `mobile/src/components/brand/geometry.ts`: Mauri's shapes (single source for app + icons)
- `mobile/src/components/brand/Mauri.tsx`: the mascot, 8 poses, wing flutter / hover
- `mobile/src/components/brand/Honeycomb.tsx`: `HoneycombCell`, `KaamPath`, `Stepper`, `LetterCell`
- `mobile/src/components/Icon.tsx`: 30-icon SVG set
- `mobile/src/components/AnimatedSplash.tsx`: launch sequence
- `mobile/scripts/make-icons.ts`, `mobile/scripts/render-icons.py`
- `docs/BRAND.md`, `docs/brand/*` (pose sheet, icon sheet, feature graphic)

**Changed**
- Theme tokens (honey palette, type scale, 400/600 fonts only); `Txt` Devanagari sizing
- `ui.tsx`: press-scale buttons with icons, tones incl. honey/ink, `EmptyState`, `NextAction`, skeleton loading, vector bullet marks
- `motion.tsx` / `lib/motion.ts`: `PressScale`, `Skeleton`, hex `SuccessMark`, `useMotionOK` (reduce-motion + Lite Mode)
- Screens: welcome + language choice, board (ticket cards, search icon), worker home (next step + Kaam Path; now the first tab), Passport cover + stamps, workroom stepper, blind-review letter cells, sign-in, card rows, Help (Lite Mode), offline banner, post/apply success
- Tabs: own icons with honey-hex active state; screen transitions
- `app.json`: `allowBackup: false`, paper background; `package.json`: removed `@expo/vector-icons`, added `npm run icons`
- All app icons + splash regenerated; `RULES.md` rules 13–14; README build status; `NEPALI_REVIEW.md` regenerated (new lines unticked)

**Removed**
- `mobile/scripts/make-icons.py`, `mobile/assets/brand/logo-mark.svg` (old two-cards logo)

## v2: "deep" redesign

- Palette: solid brick / pine / ink blocks on stone; tinted washes removed (`theme/index.ts`)
- Fonts: Anek Devanagari + Mukta (Ek Type) replace Inter + Noto Sans Devanagari (`package.json`, `_layout.tsx`, `Txt.tsx`)
- `Screen`: quiet top bar (back, DEMO mark, one-tap language button), large left titles, optional pinned `footer`
- `ui.tsx`: text-style `Tag`, underline `Tabs`, real `Section` headings, `Row`, `Divider`, filled/outlined buttons
- Screens: welcome + language (brick block, dark worker tile), board cards (price as the focal number), job detail (ink price block, pinned Apply), My work (pine Kaam Path block, underline tabs), Passport cover, My cards (tabs), workroom (ink block with stepper), Help (settings list with a switch), post, review, sign-in
- Less information: removed board subtitle/help, large DEMO banners, duplicated taglines, own name/role on own applications
- `docs/screens/`: screenshots of the running app (EN + NE)

## AI features (from docs/AI_AND_DESIGN_RESEARCH.md)

- Backend: `services/scamshield.py`, `services/workstory.py`, `services/explain.py`, `services/aicache.py`, `routers/ai.py`, `ScamReport` model, `scam` field on messages, generic `json()` call on the LLM client; `tests/test_ai_helpers.py` (27 tests); OpenAPI + `schema.d.ts` regenerated
- App: `components/ai.tsx` (AiTag, "How this was made" sheet, AiFrame), `components/Translatable.tsx`; post approval gate; Stress Test Use/Ignore; Scam Shield banner + Report; Explain this item; Work Story on Passport; Help "5 signs of a fake job"; 50 new EN/NE strings
