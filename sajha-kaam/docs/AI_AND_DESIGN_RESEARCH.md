# Sajha Kaam (साझा काम): How to Add AI That Feels Necessary and a UI That Looks Professionally Designed

The best approach for Sajha Kaam is AI that drafts and checks text inside the screens people already use, with a calm bilingual label, and never a chatbot tab or anything that scores people. Every feature recommended here is a known pattern already shipped elsewhere: AI drafts a form that a person edits, a "suggested fix" chip next to a problem, translation with "show original", and a scam warning the user can dismiss. Each can be built in a hackathon with Claude Haiku, structured JSON and a rules-first fallback.

> **Status in this repo:** Part B (design) is applied in the v2 "deep" redesign. Part A is implemented:
> - #1 Kaam Card draft → AI frame (dashed until checked) + "I've checked every line" gate on posting (`app/client/post.tsx`)
> - #2 Stress Test fix chips with Use / Ignore (`components/StressPanel.tsx`)
> - #3 Translate + Show original + AI tag, in blind review and chat (`components/Translatable.tsx`)
> - #4 Scam Shield: bilingual rules, AI only for borderline money talk, banner with Why? / Report / Dismiss, admin queue (`services/scamshield.py`, workroom)
> - #5 Leak Guard preview (already in Apply)
> - #6 "Explain this item" for workers (`services/explain.py`)
> - #7 Work Story, claim-grounded with a number/boast validator (`services/workstory.py`, Passport)
> - A6 labelling: `components/ai.tsx` (bilingual AI tag → "How this was made" sheet; AiFrame dashed/solid)
> - Help: "5 signs of a fake job"
> Not built: #8 voice input, #9 practice briefs. Screens: `docs/screens/ai-*.png`.

## TL;DR

- **Build these, in this order:** (1) Kaam Card draft-then-edit (already built; make it editable field by field), (2) Stress Test as inline "suggested fix" chips, (3) inline translation with "Show original", (4) Scam Shield, rules first, as a dismissible "Looks like a scam" banner, (5) a claim-grounded Work Story drafted only from signed Passport records. Upwork, LinkedIn, Airbnb, Google Messages and Revolut all ship these patterns at scale.
- **Never build:** AI ranking, "match scores" or shortlists of people; a generic chatbot tab; AI-written applications. Hiring AI is listed as high-risk in EU AI Act Annex III, NYC Local Law 144 requires bias audits, and a University of Washington study found LLM-based résumé screening favoured White-associated names in 85.1% of tests. Blind review is your moat, so keep AI out of it.
- **For the "not AI-generated" look:** skip sparkles and purple gradients. Label AI output with a plain bilingual text tag ("AI draft · एआई मस्यौदा") that opens a short "how this was made" note. Use the flat brick/pine/ink/honey palette in fixed roles, use honey only on ink or pine (honey on stone fails contrast), keep Mukta for body text, and make Anek's width axis the typographic signature.

---

## Key Findings

1. **"AI in the workflow" is a well-documented, validated design pattern, not a guess.** Microsoft's 18 Guidelines for Human-AI Interaction were validated through multiple rounds of evaluation, including a study with 49 design practitioners testing them against 20 popular AI-infused products. Most relevant: G1 "Make clear what the system can do", G2 "Make clear how well the system can do what it can do", G6 "Mitigate social biases", G8 "Support efficient dismissal", G9 "Support efficient correction", G11 "Make clear why the system did what it did". Google PAIR's guidebook frames the goal as *calibrated* trust (the user shouldn't trust the system completely) and advises anchoring new users with familiar UI patterns.
2. **The draft-then-edit pattern has measured results in this exact domain.** Upwork's Job Post Generator turns a sentence or two into a customizable draft job post; OpenAI's case study reports it cut job-post creation time by 80%, and clients who used it spent 9% more. Upwork says its Uma AI powers a majority of new client job posts. LinkedIn's AI job descriptions also produce a draft for the poster to review and edit, and warn that drafts can contain mistakes.
3. **Scam warnings work best as interrupt-and-educate flows, not silent blocks.** Revolut's flow asks the user questions, shows scam education stories, and can redirect to a human fraud specialist; Revolut reported a 30% reduction in card-scam fraud losses for investment scams after launch (Feb 2024). Google Messages shows a "Likely scam" warning with an option to dismiss or report and block; it runs on the device and only for non-contacts. Caution: warnings alone are not enough. In a Which? case, a scammer coached the victim through Revolut's warnings word for word.
4. **The sparkle icon is ambiguous.** In Nielsen Norman Group's study (Kate Kaplan, Sept 2024), none of 107 participants shown the sparkles icon alone mentioned AI, and 73% associated the star icon with saving/favouriting. IBM's Carbon design system uses a dedicated "AI label" that opens an explainability popover, which fits a flat, honest brand better.
5. **AI that ranks people is the biggest risk, legally and ethically.** EU AI Act Annex III lists as high-risk AI used for recruitment or selection, to analyse and filter job applications, and to evaluate candidates. The European Commission's AI Act service desk names automated job matching and ranking tools as high-risk, while a job-ad writing/screening tool falls outside that category. Writing and checking job posts is on the safe side.
6. **Nepali quality is "good enough with a human in the loop", not solved.** On the IndicParam benchmark (arXiv:2512.00333), Claude-4.5 averaged 42.7% across 11 Indic languages including Nepali; the best model (GPT-5) reached only 45%. A Nepali benchmark found the GPT-4-era cl100k tokenizer used 4.79× more tokens for Nepali than English, so Nepali calls are slower and cost more. Keep outputs short and always editable.
7. **The "AI-generated look" is a known cluster of default choices:** purple-to-blue gradients, Inter, centered heroes with three feature cards, untouched shadcn, glass everywhere. The fix is deliberate decisions in those places: own type, a semantic colour system, real content.

---

## Part A — AI Feature Integration

### A1. Patterns that make AI feel native

| Pattern | What it means | Source |
|---|---|---|
| Draft → human edits | AI fills a form; the person reviews and changes it before anything is saved | Upwork Job Post Generator; LinkedIn AI job descriptions |
| Inline action / suggested fix | AI acts on one item where it sits, as a suggestion layer, not an overwrite | Shape of AI "Inline Action" |
| Efficient dismissal and correction | One tap to ignore, one tap to edit | Microsoft HAX G8, G9 |
| Explain why | Short reason attached to every suggestion | HAX G11; Google PAIR |
| Calibrated trust / scope when in doubt | Say what the AI can't do; fall back to manual | HAX G2, G10; PAIR manual controls |
| Label + explain-on-tap | Small AI label that opens "how this was made" | IBM Carbon AI label |
| Revert to original | Visible way back to the human/source version | Carbon revert; Airbnb "Translated · Show original" |
| Follow-up instead of guessing | Ask a short clarifying question when input is too thin | Shape of AI "Follow up" |
| Interrupt-and-educate for risk | Stop the user at the risky moment, ask, teach | Revolut card-scam flow; Google Messages |

AI feels necessary when it removes a blank page (drafting), points to a specific problem (fix chips), or protects someone at a risky moment (scams). It feels forced when it is a destination (a chat tab) or makes decisions that belong to people.

### A2. Proven examples in related domains

- **Freelance marketplaces.** Upwork Job Post Generator: 80% faster job posts; early Uma users spent 7% more in their first month (vendor-reported). Upwork also gives real-time job-post feedback on title length, skills and budget, the same idea as our Stress Test. *Counter-example:* Upwork's Uma Recruiter ranks proposals and builds AI shortlists. That is the AI-selects-people model our rules forbid; present it to judges as a deliberate contrast.
- **Professional networks.** LinkedIn's AI job descriptions produce a draft for the poster to review and edit, and admit it may produce mistakes. Its job-fit "top applicant" feature ranks people against jobs, so do not copy it.
- **Translation in context.** Airbnb translates messages and reviews automatically in 60+ languages with "Translated · Show original". Hosts report mistranslations causing real arguments, so "Show original" is essential.
- **Writing assistance.** Gmail Smart Compose targets under 60 ms p90 latency for ghost text. Cloud Haiku on Nepali 3G can't do that: use on-demand buttons instead.
- **Fintech / messaging safety.** Revolut: questionnaire + education + human specialist, card-scam losses down 30%. Google Messages: on-device "Likely scam", non-contacts only, dismiss or report.

*Not verified:* outcome numbers for Fiverr briefs, Grammarly, Notion AI, Duolingo Max, Wise/Monzo scam screens, Bhashini, or Khalti/eSewa AI.

### A3. Ranked shortlist

| # | Feature | Where in flow | Proven example | Effort | Risk | Fallback |
|---|---|---|---|---|---|---|
| 1 | **Kaam Card draft → edit** (field-level) | Client: Describe job | Upwork; LinkedIn | S (exists) | Wrong price/scope invented | Offline template; blank fields with hints |
| 2 | **Stress Test fix chips** | Client: card review, before publishing | Upwork feedback; Shape of AI inline action | S | Over-flagging annoys | Rules-only vague-word list |
| 3 | **Inline translate + Show original** | Kaam Card, messages, delivery notes | Airbnb | S | Mistranslated obligations | Source text only + "Translation unavailable" |
| 4 | **Scam Shield** (rules first, AI for borderline) | Worker: messages and offers | Google Messages; Revolut | M | False alarms; missed scams | Rules only; static "5 signs of a scam" card |
| 5 | **Leak Guard preview** (rules) | Worker: before submitting application | Carbon revert pattern | S | Over-scrubbing | Show the diff; restore non-identifying text |
| 6 | **"Done when" checklist helper** | Worker: delivery screen | HAX G4 | S | AI judging quality | Plain checklist |
| 7 | **Work Story from Passport** (claim-grounded) | Worker: Passport | Draft-then-edit; PAIR data sources | M | Hallucinated claims | Template sentence from record fields |
| 8 | **Voice input (ne-NP)** | Client and worker text fields | Google Cloud STT Chirp ne-NP | M | Recognition errors; no device support | Hide mic if unsupported; type |
| 9 | **Practice challenge brief** | Worker: Practice | Draft-then-edit | S | Feels gamified | Curated static briefs; no points/streaks |

### A4. Short specs

**1. Kaam Card draft → edit.** Text box "Describe the job in your own words (English or नेपाली)" → filled card, every field editable, header tag **"AI draft — check every line · एआई मस्यौदा — हरेक लाइन जाँच्नुहोस्"**. Microcopy: "Price and deadline are your decision. We left them blank." Haiku + JSON schema, server-side validation, ~8 s timeout → offline template ("Couldn't reach AI. Start from a template instead."). Strip personal data before the call.

**2. Stress Test fix chips.** Vague item underlined; chip below: **"Vague: 'make it look good' → Try: 'Uses the 3 brand colours provided; logo is at least 200px wide'"** with [Use this] [Edit] [Ignore]. Rules pass first, then one Haiku call returning `[{item_id, issue, suggestion_en, suggestion_ne}]`, only on "Check my card", never per keystroke.

**3. Inline translate + Show original.** Footer **"Translated by AI · Show original / एआईद्वारा अनुवादित · मूल हेर्नुहोस्"**. For the binding Kaam Card the client approves both languages before publishing. Cache by content hash (server + AsyncStorage).

**4. Scam Shield.** Banner: **"This message asks you to pay a fee to get work. Real clients on Sajha Kaam never ask for this. [Why?] [Report] [Dismiss]"**. Rules: registration/"security" fees, move to WhatsApp/Telegram before acceptance, unknown payment links, OTP/PIN requests, pay outside the worker's own Khalti link. AI only for borderline text, returning `{likely_scam, reason_en, reason_ne}`. Never auto-block. Warnings must be specific, not generic.

**5. Leak Guard preview.** "We hid 3 things that could identify you before the client sees your sample: your name, phone number, Facebook link. [See what changed]".

**6. Checklist helper.** Tick box per item + "Explain this item" in simple Nepali. The AI explains requirements; it never says "your work meets this".

**7. Work Story.** "Completed 2 logo design jobs; both clients confirmed all checklist items." Every claim links to its signed record. Prompt gets only signed fields; post-check every number/skill appears in them, else template.

**8. Voice input.** Google Cloud STT supports ne-NP only via Chirp models in regional endpoints. On device, `expo-speech-recognition` `getSupportedLocales()` is unsupported on Android 12 and below and may return empty lists (treat as unknown). Cheapest path: Gboard's own mic (Nepali voice typing announced 2017; verify on real devices).

**9. Practice challenges.** "Practice brief (not a real job)" in the Kaam Card format. No points, streaks or leaderboards.

### A5. Avoid list

| Don't build | Why |
|---|---|
| AI ranking, "match %", "top applicant", AI shortlists | EU AI Act Annex III high-risk; NYC LL144 bias audits; UW study 85.1% name bias; breaks blind review |
| AI summaries/comparisons of applicants for clients | Still AI evaluating people; leaks signals into blind review |
| AI-written applications for workers | No real signal of ability; undermines work samples |
| Generic "Ask Mauri" chatbot tab | A destination with no specific job; PAIR: determine if AI adds value |
| Ghost-text autocomplete | Needs ~60 ms latency; impossible on slow data |
| AI auto-blocking or auto-rejecting | Violates "human approves" |
| AI judging if delivered work "meets" the checklist | AI evaluating worker performance (Annex III 4(b)) |
| Numeric confidence ("87% sure") | Misread by low-literacy users; use words |

### A6. How to label AI without the "AI look"

- **No sparkles.** Use a small ink-outlined text tag: **"AI draft · एआई मस्यौदा"**, **"AI translated · एआई अनुवाद"**, **"AI suggestion · एआई सुझाव"**. Tap opens a bottom sheet: what AI did, what data it saw ("only the job description; no names"), and that you must check it.
- **Two visual states:** dashed ink outline while an AI draft is unapproved; solid outline once approved, tag becomes "Checked by you · तपाईंले जाँच्नुभयो".
- **Mauri** for empty states, loading ("Mauri is drafting…") and onboarding, never as the AI's voice.
- **Verbs, not magic:** Draft, Check, Translate, Explain. Not "Magic", "Generate ✨", "Smart".

### A7. Low-end phones, slow data, bilingual

- No streaming for structured JSON: wait, validate, render; skeleton with "Drafting… usually 5–10 seconds".
- Hard timeout + template fallback on every AI call (HAX G10).
- Cache translations and Stress Test results by content hash.
- Keep Nepali output short; request EN and NE in one JSON call.
- Have a Nepali speaker review prompt templates and 20 sample outputs before the demo.
- Run Leak Guard rules *before* any AI call.

---

## Part B — Design Quality ("not AI-generated")

### B1. Tells and professional alternatives

| AI-default tell | Sajha Kaam alternative |
|---|---|
| Purple→blue gradient | Flat brick/pine/ink blocks with fixed meanings |
| Inter everywhere | Anek Devanagari headings + Mukta body |
| Identical bordered cards | Cards only for real objects (Kaam Card, applicant letter); spacing and dividers elsewhere |
| Pills and uppercase eyebrows everywhere | One label style, status only |
| Centered hero + 3 feature cards | Left-aligned title + one primary action |
| Emoji icons | One outline icon set matching Mauri's stroke |
| Vague headlines | Specific copy: "Your first paid job, judged on your work, not your name" |
| Lorem demo data | Realistic Nepali names, NPR/USD prices, real briefs |

### B2. Colour: depth without gradients

- Roles ≈ 60-30-10: stone `#F1ECE3` surfaces; ink `#161C18` text and pine `#1C3A2E` structure; brick `#B03D1E` primary actions; honey `#F2A516` sparingly.
- Depth from tonal steps, at most one dark pine block per screen.
- Contrast (our WCAG calculations; verify with a checker): ink on stone ≈ 14.7:1 ✅; brick on stone ≈ 5.2:1 ✅; white on brick ≈ 6:1 ✅; stone on pine ≈ 10.5:1 ✅; ink on honey ≈ 8.4:1 ✅; **honey on stone ≈ 1.8:1 ❌** (never text/lines/icons).
- Never colour alone for state (WCAG 1.4.11).

### B3. Typography

**Keep Anek Devanagari + Mukta.** Both by Ek Type; Mukta is a humanist mono-linear family covering Devanagari + Latin; Anek is variable with weight and width axes. The width axis is the distinctive move. Alternatives considered: Hind (safe, common), Noto Sans Devanagari (generic, needs Latin pair), Baloo 2 (too round for contracts), Poppins (common default; Devanagari not verified).

Rules: ship Mukta static weights and Anek as one variable file where possible; Devanagari line height ≥ 1.5 body / 1.25 headings; check Nepali and English at equal visual size.

### B4. Layout and text placement

1. Left-align text (except single-number displays).
2. One primary action per screen, pinned bottom.
3. Large left title (Anek ~28–32px) saying what the screen is for.
4. Type scale ≈ 1.25: 14/16/20/25/32; ≤ 4 sizes per screen.
5. 4/8px spacing; more space between groups than inside.
6. Body lines ~35–60 characters on mobile.
7. Cut copy in half, then again; bilingual text stacked, not side by side.
8. Design empty, loading, error, offline states first (Mauri lives there).
9. Android conventions (back gesture, bottom sheets).
10. Touch targets ≥ 48dp with real labels.

### B5. Information minimisation for first-time users

Google's Next Billion Users research: novice users fear "breaking" apps; test for local languages and low literacy. Medhi et al.: text-only interfaces are unusable for first-time low-literacy users. Microsoft Research: 23 of 30 low-literate participants needed an intermediary. Apply: one question per screen in flows; progressive disclosure; icons with words; Undo over "Are you sure?"; a 3-step progress (Apply → Deliver → Get paid); voice where available; design for a helper reading over the shoulder.

### B6. Reference techniques (general, not sourced to specific shots)

One brand colour at full saturation on large flat areas; the oversized number as the hero; status as a plain-language timeline; illustration only in empty/success/onboarding; one icon family matching illustration stroke.

### B7. Pre-demo checklist

- [ ] No gradients, sparkles, emoji icons, default font
- [ ] Every screen: one title, one primary brick button, left-aligned
- [ ] Honey never text/line colour on stone
- [ ] All AI output has the bilingual tag, opening "how this was made"
- [ ] Every AI suggestion has [Use] [Edit] [Ignore]; every translation has "Show original"
- [ ] Unapproved AI drafts dashed, approved solid
- [ ] Empty, loading, error, offline states designed with Mauri
- [ ] Devanagari line height tested; no clipped matras
- [ ] Realistic Nepali demo data
- [ ] Nothing scores, ranks or compares people

---

## Hackathon Roadmap

| Priority | Build | Time | Why first |
|---|---|---|---|
| **P0** | Field-level editable Kaam Card + bilingual "AI draft" tag + offline template | ½ day | Core loop; most proven pattern |
| **P0** | Stress Test as fix chips [Use/Edit/Ignore] | ½ day | The visible "necessary AI" moment |
| **P0** | Design pass (done in v2): palette roles, sticky CTA, empty states; next: Anek width headings | 1 day | Biggest perceived-quality gain |
| **P1** | Translation with "Show original" + caching | ½ day | Bilingual promise |
| **P1** | Scam Shield rules + dismissible banner (AI borderline if time) | ½ day | Protects first-job workers |
| **P1** | Leak Guard "see what changed" | 2 hrs | Makes blind review trustworthy |
| **P2** | Work Story with claim check | ½ day | Strong demo ending |
| **P2** | Voice input (Gboard first; Chirp ne-NP if time) | ½ day | Accessibility |
| **Pitch** | Slide: "What our AI will never do" (rank, score, select) | 1 hr | Rules become a differentiator |

---

## Caveats

- Upwork and Revolut figures are self-reported, not independently audited.
- Uma Recruiter details come from third-party freelancer guides citing Upwork.
- Nepali LLM figures are general benchmarks; test with Nepali speakers.
- Gboard Nepali voice typing is confirmed only by 2017 Nepali tech press; on-device ne-NP via `expo-speech-recognition` is unverified.
- Contrast ratios are our own calculations.
- Part B layout numbers are working defaults from common practice.
- Not legal advice. EU AI Act and NYC LL144 are cited as evidence of risk.

## Sources

- Microsoft, Guidelines for Human-AI Interaction: https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/
- Microsoft Design (Medium), Guidelines summary: https://medium.com/microsoft-design/guidelines-for-human-ai-interaction-9aa1535d72b9
- Google PAIR, Explainability + Trust: https://pair.withgoogle.com/chapter/explainability-trust/
- Google PAIR, Patterns: https://pair.withgoogle.com/guidebook-v2/patterns
- Shape of AI, Inline Action / Follow up: https://www.shapeof.ai/patterns/inline-action , https://www.shapeof.ai/patterns/follow-up
- IBM Carbon, AI label: https://www.carbondesignsystem.com/building-blocks/core/components/ai-label/guidelines
- IBM Carbon for AI: https://carbondesignsystem.com/guidelines/carbon-for-ai/
- Upwork Uma: https://www.upwork.com/uma
- OpenAI case study, Upwork: https://openai.com/index/upwork/
- Upwork investor news (AI Work Agent): https://investors.upwork.com/news-releases/news-release-details/upwork-evolves-uma-ai-ai-work-agent-advances-human-ai
- LinkedIn AI job descriptions: https://www.linkedin.com/business/talent/blog/talent-acquisition/linkedin-tests-ai-powered-job-descriptions
- LinkedIn AI-assisted messages FAQ: https://www.linkedin.com/help/recruiter/answer/a1506864
- Fast Company on LinkedIn AI tools: https://www.fastcompany.com/91251721/linkedin-artificial-intelligence-ai-tools-job-seekers-recruiters
- Airbnb Translation Engine: https://news.airbnb.com/?p=338456
- Gmail Smart Compose (KDD 2019): https://www.researchgate.net/publication/334712332_Gmail_Smart_Compose_Real-Time_Assisted_Writing
- Revolut AI card-scam feature: https://www.revolut.com/en-US/news/revolut_launches_ai_feature_to_protect_customers_from_card_scams_and_break_the_scammers_spell/
- Google scam detection on Android: https://blog.google/security/new-ai-powered-scam-detection-features/
- Which? Revolut scam case: https://www.which.co.uk/news/article/revolut-bank-transfer-scam-aryj55l66MBL
- EU AI Act Annex III: https://artificialintelligenceact.eu/annex/3/
- EU AI Act service desk, Employment: https://ai-act-service-desk.ec.europa.eu/en/employment-0
- Gender, race and intersectional bias in résumé screening (arXiv:2407.20371): https://arxiv.org/abs/2407.20371
- Google Cloud STT supported languages: https://cloud.google.com/speech-to-text/v2/docs/speech-to-text-supported-languages
- expo-speech-recognition: https://www.npmjs.com/package/expo-speech-recognition
- Nepali voice typing (TechLekh): https://techlekh.com/google-voice-typing-supports-nepali-voice/
- WCAG 1.4.3 / 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html , https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html
- Mukta (Google Fonts): https://fonts.google.com/specimen/Mukta
- Anek Devanagari (Ek Type): https://ektype.in/anek-devanagari.html
- Hind / Noto Sans Devanagari / Baloo 2 (Google Fonts): https://fonts.google.com/specimen/Hind , https://fonts.google.com/noto/specimen/Noto+Sans+Devanagari , https://fonts.google.com/specimen/Baloo%2B2
- Google Design, Next Billion Users: https://design.google/library/connectivity-culture-and-credit
- Medhi et al., low-literacy mobile interfaces: https://www.researchgate.net/publication/234829313_Designing_mobile_interfaces_for_novice_and_low-literacy_users
- Microsoft Research, emergent users: https://www.microsoft.com/en-us/research/wp-content/uploads/2022/05/compass22-34-taps.pdf
