// Curated drug-safety feed content. Static and bundled with the app so the
// feed is instant and works offline; photos are fetched over https when a
// connection is available and fall back gracefully when it isn't.

import { colors } from "../theme/theme";

export type FeedCategory = "Alert" | "Research" | "News";

export type NewsItem = {
  id: string;
  category: FeedCategory;
  title: string;
  source: string;
  date: string;
  readMins: number;
  image: string;
  glyph: string;
  summary: string;
  body: string;
};

export type Severity = "Serious" | "High" | "Moderate";

export type CaseItem = {
  id: string;
  drug: string;
  reaction: string;
  severity: Severity;
  date: string;
  image: string;
  glyph: string;
  summary: string;
};

const img = (seed: string) => `https://picsum.photos/seed/${seed}/640/380`;

export const CATEGORY_STYLE: Record<
  FeedCategory,
  { color: string; soft: string; glyph: string }
> = {
  Alert: { color: colors.danger, soft: colors.dangerSoft, glyph: "⚠️" },
  Research: { color: colors.info, soft: colors.infoSoft, glyph: "🔬" },
  News: { color: colors.accent, soft: colors.accentSoft, glyph: "📰" },
};

export const SEVERITY_STYLE: Record<
  Severity,
  { color: string; soft: string }
> = {
  Serious: { color: colors.danger, soft: colors.dangerSoft },
  High: { color: colors.warning, soft: colors.warningSoft },
  Moderate: { color: colors.info, soft: colors.infoSoft },
};

export const NEWS: NewsItem[] = [
  {
    id: "n1",
    category: "Alert",
    title:
      "Regulators reinforce screening for severe skin reactions with carbamazepine",
    source: "Pharmacovigilance Update",
    date: "18 Jul 2026",
    readMins: 3,
    image: img("adr-carbamazepine"),
    glyph: "⚠️",
    summary:
      "Genetic screening for HLA-B*1502 is again recommended before starting carbamazepine in at-risk populations.",
    body:
      "Safety authorities have restated guidance urging HLA-B*1502 screening before initiating carbamazepine in patients of South-East Asian ancestry, where the allele is more prevalent. Carriers face a markedly higher risk of Stevens-Johnson syndrome and toxic epidermal necrolysis. Clinicians are advised to counsel patients to stop the drug and seek care at the first sign of rash, fever, or mucosal involvement, and to record any reaction through their national reporting scheme.",
  },
  {
    id: "n2",
    category: "Research",
    title:
      "Long-term proton-pump inhibitor use linked to hypomagnesaemia and B12 deficiency",
    source: "Journal of Clinical Pharmacology",
    date: "17 Jul 2026",
    readMins: 5,
    image: img("adr-ppi"),
    glyph: "🔬",
    summary:
      "A large cohort analysis strengthens the association between prolonged PPI therapy and electrolyte and vitamin depletion.",
    body:
      "Pooled data from over 120,000 patients show a dose- and duration-dependent relationship between proton-pump inhibitor exposure and both hypomagnesaemia and vitamin B12 deficiency, particularly among older adults and those on concurrent diuretics or digoxin. The authors recommend periodic magnesium and B12 monitoring for patients on long-term therapy and prescribing the lowest effective dose for the shortest necessary duration.",
  },
  {
    id: "n3",
    category: "Alert",
    title: "Renewed warning on fluoroquinolone tendon rupture in older adults",
    source: "Drug Safety Bulletin",
    date: "16 Jul 2026",
    readMins: 2,
    image: img("adr-fluoroquinolone"),
    glyph: "🦵",
    summary:
      "Risk of Achilles tendon injury rises sharply with age over 60, corticosteroid use, and renal impairment.",
    body:
      "A refreshed advisory highlights the elevated risk of tendinopathy and tendon rupture with systemic fluoroquinolones, especially in patients over 60, those taking corticosteroids, and those with reduced renal function. Prescribers are reminded to reserve these agents for infections without safer alternatives and to advise patients to stop treatment and rest the affected limb if tendon pain or swelling develops.",
  },
  {
    id: "n4",
    category: "Research",
    title: "Early troponin screening lowers mortality in clozapine myocarditis",
    source: "Psychopharmacology Today",
    date: "15 Jul 2026",
    readMins: 4,
    image: img("adr-clozapine"),
    glyph: "❤️",
    summary:
      "Structured cardiac monitoring in the first weeks of clozapine therapy improved early detection and outcomes.",
    body:
      "Investigators report that a structured protocol of baseline and weekly troponin and C-reactive protein testing during the first eight weeks of clozapine treatment substantially improved early detection of myocarditis and reduced associated mortality. New chest pain, tachycardia, fever, or breathlessness in this window should prompt immediate evaluation and consideration of stopping the drug.",
  },
  {
    id: "n5",
    category: "News",
    title:
      "Global adverse-event reporting network expands to twelve more countries",
    source: "Global Drug Monitor",
    date: "14 Jul 2026",
    readMins: 3,
    image: img("adr-network"),
    glyph: "🌐",
    summary:
      "The expansion aims to accelerate signal detection for rare and serious drug reactions worldwide.",
    body:
      "An international pharmacovigilance programme has added twelve new member countries, broadening the pool of adverse-event data used to detect emerging safety signals. Coordinators say faster, more representative reporting shortens the time between a suspected reaction and regulatory action, and they encourage frontline clinicians to submit reports even when causality is uncertain.",
  },
  {
    id: "n6",
    category: "Research",
    title: "Predictive models flag anaphylaxis risk from prescribing patterns",
    source: "Digital Medicine Review",
    date: "12 Jul 2026",
    readMins: 6,
    image: img("adr-ai"),
    glyph: "🧠",
    summary:
      "Machine-learning tools trained on prescribing and allergy data identified high-risk combinations before dispensing.",
    body:
      "Researchers describe decision-support models that analyse prescribing history, documented allergies, and co-medications to flag patients at elevated risk of anaphylaxis before a prescription is dispensed. In validation, the tools surfaced high-risk beta-lactam and NSAID scenarios that manual review had missed. The authors stress that such systems augment, rather than replace, clinical judgement and thorough allergy history-taking.",
  },
];

export const RECENT_CASES: CaseItem[] = [
  {
    id: "c1",
    drug: "Amoxicillin",
    reaction: "Anaphylaxis",
    severity: "Serious",
    date: "18 Jul 2026",
    image: img("case-amoxicillin"),
    glyph: "💊",
    summary:
      "Rapid-onset urticaria and dyspnoea within 20 minutes of the first dose; resolved after adrenaline.",
  },
  {
    id: "c2",
    drug: "Warfarin",
    reaction: "Gastrointestinal bleed",
    severity: "Serious",
    date: "17 Jul 2026",
    image: img("case-warfarin"),
    glyph: "🩸",
    summary:
      "INR rose to 6.2 after co-prescription of an antibiotic; presented with melaena.",
  },
  {
    id: "c3",
    drug: "Ibuprofen",
    reaction: "Acute kidney injury",
    severity: "High",
    date: "16 Jul 2026",
    image: img("case-ibuprofen"),
    glyph: "🫘",
    summary:
      "Elderly patient with dehydration and long-term NSAID use; creatinine improved on withdrawal.",
  },
  {
    id: "c4",
    drug: "Metformin",
    reaction: "Lactic acidosis",
    severity: "High",
    date: "14 Jul 2026",
    image: img("case-metformin"),
    glyph: "⚗️",
    summary:
      "Occurred during acute illness with reduced renal perfusion; managed with supportive care.",
  },
  {
    id: "c5",
    drug: "Carbamazepine",
    reaction: "Stevens-Johnson syndrome",
    severity: "Serious",
    date: "11 Jul 2026",
    image: img("case-carbamazepine"),
    glyph: "🔥",
    summary:
      "Mucocutaneous rash with fever two weeks after initiation; drug stopped immediately.",
  },
];
