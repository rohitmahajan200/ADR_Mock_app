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
  {
    id: "n7",
    category: "Alert",
    title: "Methotrexate dosing errors: reminder that oral dosing is weekly, not daily",
    source: "Medication Safety Alert",
    date: "11 Jul 2026",
    readMins: 2,
    image: img("adr-methotrexate"),
    glyph: "⚠️",
    summary:
      "Accidental daily dosing continues to cause serious, sometimes fatal, toxicity. Prescriptions should specify the day of the week.",
    body:
      "Safety bodies have repeated warnings after further reports of inadvertent daily methotrexate dosing for non-oncology indications, which can cause bone-marrow suppression, mucositis and hepatotoxicity. Recommended safeguards include specifying the intended day of the week on every prescription, dispensing limited quantities, and counselling patients and carers that the dose is once weekly.",
  },
  {
    id: "n8",
    category: "Research",
    title: "Statin muscle symptoms largely reflect a nocebo effect in blinded trials",
    source: "Cardiology Evidence",
    date: "10 Jul 2026",
    readMins: 5,
    image: img("adr-statin"),
    glyph: "💪",
    summary:
      "Randomised n-of-1 data suggest most reported statin muscle aches occur on placebo too, informing shared decisions about continuation.",
    body:
      "Pooled n-of-1 and blinded crossover studies indicate that the majority of muscle symptoms attributed to statins also occur during placebo periods, supporting a substantial nocebo contribution. True statin-associated myopathy remains important and, rarely, rhabdomyolysis can occur, so unexplained severe muscle pain with raised creatine kinase still warrants review. The findings help clinicians counsel patients considering stopping therapy.",
  },
  {
    id: "n9",
    category: "Research",
    title: "SGLT2 inhibitors linked to euglycaemic diabetic ketoacidosis",
    source: "Diabetes & Endocrinology",
    date: "9 Jul 2026",
    readMins: 4,
    image: img("adr-sglt2"),
    glyph: "🩺",
    summary:
      "Ketoacidosis can develop with near-normal glucose, delaying recognition, especially around surgery or acute illness.",
    body:
      "Reviews highlight that SGLT2 inhibitors can precipitate diabetic ketoacidosis with only modestly elevated or near-normal blood glucose, which can delay diagnosis. Risk rises with reduced insulin, dehydration, surgery, and acute illness. Guidance recommends temporarily withholding the drug during significant intercurrent illness and around procedures, and checking ketones in unwell patients regardless of glucose level.",
  },
  {
    id: "n10",
    category: "Alert",
    title: "Codeine caution in breastfeeding: ultra-rapid metaboliser risk",
    source: "Perinatal Drug Safety",
    date: "8 Jul 2026",
    readMins: 3,
    image: img("adr-codeine"),
    glyph: "🍼",
    summary:
      "In ultra-rapid CYP2D6 metabolisers, codeine can produce high morphine levels in breast milk; safer analgesics are preferred.",
    body:
      "Advisories reiterate that codeine and tramadol are best avoided in breastfeeding because ultra-rapid CYP2D6 metabolisers convert codeine to morphine more quickly, risking infant sedation and respiratory depression. Where an opioid is unavoidable, the lowest effective dose for the shortest time is advised, with monitoring of the infant for drowsiness and feeding difficulty. Paracetamol and ibuprofen are generally preferred.",
  },
  {
    id: "n11",
    category: "Alert",
    title: "Valproate: strengthened controls on use in those able to become pregnant",
    source: "Neurology Review",
    date: "6 Jul 2026",
    readMins: 4,
    image: img("adr-valproate"),
    glyph: "⚠️",
    summary:
      "Prenatal valproate exposure carries substantial risks of malformation and neurodevelopmental disorders; pregnancy-prevention measures apply.",
    body:
      "Regulators continue to tighten conditions on valproate prescribing owing to well-established risks of congenital malformations and neurodevelopmental disorders after in-utero exposure. Requirements typically include specialist review, documented pregnancy-prevention measures, and annual risk acknowledgement. Patients should not stop valproate abruptly but should seek prompt review if pregnancy is possible.",
  },
  {
    id: "n12",
    category: "Alert",
    title: "Serotonin syndrome flagged with tramadol and SSRI co-prescription",
    source: "Drug Interaction Watch",
    date: "4 Jul 2026",
    readMins: 3,
    image: img("adr-serotonin"),
    glyph: "🧬",
    summary:
      "Combining serotonergic agents raises the risk of agitation, tremor, hyperreflexia and hyperthermia; watch for early features.",
    body:
      "Clinicians are reminded that tramadol has serotonergic activity and, combined with SSRIs, SNRIs or MAO inhibitors, can precipitate serotonin syndrome. Early features include agitation, tremor, sweating and hyperreflexia, progressing to hyperthermia and instability. Where co-prescription is unavoidable, use the lowest doses, counsel patients on warning signs, and review the need regularly.",
  },
  {
    id: "n13",
    category: "Research",
    title: "Cardioselective beta-blockers reassessed as safer in mild-to-moderate asthma",
    source: "Respiratory Medicine",
    date: "2 Jul 2026",
    readMins: 5,
    image: img("adr-betablocker"),
    glyph: "🫁",
    summary:
      "Evidence supports cautious use of cardioselective agents where clearly indicated, rather than blanket avoidance.",
    body:
      "A synthesis of trial data suggests that low-dose cardioselective beta-blockers are generally tolerated in mild-to-moderate asthma and should not be automatically withheld when there is a strong cardiac indication. Initiation should be cautious, at low dose with monitoring, and non-selective agents remain best avoided. Individual risk assessment and clear counselling are advised.",
  },
  {
    id: "n14",
    category: "Alert",
    title: "Gentamicin ototoxicity: renewed emphasis on cumulative-dose monitoring",
    source: "Antimicrobial Stewardship",
    date: "30 Jun 2026",
    readMins: 3,
    image: img("adr-gentamicin"),
    glyph: "👂",
    summary:
      "Auditory and vestibular toxicity can be irreversible; therapeutic drug monitoring and duration limits are key safeguards.",
    body:
      "Stewardship programmes highlight that aminoglycoside ototoxicity may be permanent and can develop after therapy has ended. Recommended safeguards include weight-based dosing, therapeutic drug monitoring, limiting duration, and vigilance for tinnitus, hearing change or imbalance. Renal function and concurrent ototoxic drugs should be considered when assessing cumulative risk.",
  },
  {
    id: "n15",
    category: "Research",
    title: "Direct oral anticoagulants show favourable intracranial bleeding profile vs warfarin",
    source: "Haematology Today",
    date: "27 Jun 2026",
    readMins: 6,
    image: img("adr-doac"),
    glyph: "🩸",
    summary:
      "Real-world data reinforce lower intracranial haemorrhage rates, though gastrointestinal bleeding patterns differ by agent.",
    body:
      "Large real-world cohorts continue to show lower rates of intracranial haemorrhage with direct oral anticoagulants compared with warfarin, while gastrointestinal bleeding risk varies by agent and dose. Adherence, renal function and drug interactions remain critical to safety. Reversal agents and clear peri-procedural plans support safer use across settings.",
  },
  {
    id: "n16",
    category: "News",
    title: "Regulator launches real-time signal dashboard for newly approved medicines",
    source: "Global Drug Monitor",
    date: "24 Jun 2026",
    readMins: 3,
    image: img("adr-dashboard"),
    glyph: "📊",
    summary:
      "The dashboard aggregates spontaneous reports to surface emerging safety signals within days rather than months.",
    body:
      "A regulatory authority has launched a public dashboard that aggregates spontaneous adverse-event reports for recently approved medicines, aiming to shorten the interval between an emerging signal and communication to prescribers. Officials stress that raw report counts do not establish causation and encourage continued high-quality reporting to strengthen signal detection.",
  },
  {
    id: "n17",
    category: "News",
    title: "International effort to standardise ADR causality assessment",
    source: "Pharmacovigilance Update",
    date: "20 Jun 2026",
    readMins: 4,
    image: img("adr-causality"),
    glyph: "🌍",
    summary:
      "Harmonised causality categories aim to make reports more comparable across countries and databases.",
    body:
      "A cross-border initiative is working to harmonise causality-assessment terminology so that adverse-reaction reports are more comparable between national databases. Consistent categories — such as certain, probable, possible and unlikely — should improve pooled analyses and speed the recognition of rare reactions. Training materials for frontline reporters accompany the rollout.",
  },
  {
    id: "n18",
    category: "Research",
    title: "Allopurinol hypersensitivity risk tied to HLA-B*5801 and starting dose",
    source: "Rheumatology Insights",
    date: "16 Jun 2026",
    readMins: 5,
    image: img("adr-allopurinol"),
    glyph: "🔬",
    summary:
      "Lower initial dosing and, in some groups, HLA screening reduce the risk of severe cutaneous reactions.",
    body:
      "Studies reaffirm that severe allopurinol hypersensitivity is associated with the HLA-B*5801 allele, higher starting doses, and renal impairment. Risk-reduction strategies include starting at a low dose with gradual titration, dose adjustment for renal function, and, in higher-prevalence populations, considering HLA-B*5801 screening before initiation. Patients should stop the drug at the first sign of rash.",
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
  {
    id: "c6",
    drug: "Phenytoin",
    reaction: "DRESS syndrome",
    severity: "Serious",
    date: "10 Jul 2026",
    image: img("case-phenytoin"),
    glyph: "🌡️",
    summary:
      "Fever, rash and eosinophilia with hepatic involvement four weeks after starting therapy.",
  },
  {
    id: "c7",
    drug: "Vancomycin",
    reaction: "Infusion reaction (red man syndrome)",
    severity: "Moderate",
    date: "8 Jul 2026",
    image: img("case-vancomycin"),
    glyph: "💉",
    summary:
      "Flushing and pruritus of the upper body during rapid infusion; settled on slowing the rate.",
  },
  {
    id: "c8",
    drug: "Allopurinol",
    reaction: "Severe hypersensitivity",
    severity: "Serious",
    date: "5 Jul 2026",
    image: img("case-allopurinol"),
    glyph: "⚠️",
    summary:
      "Widespread rash and deranged liver function in a patient with renal impairment on a high starting dose.",
  },
  {
    id: "c9",
    drug: "Atorvastatin",
    reaction: "Rhabdomyolysis",
    severity: "High",
    date: "2 Jul 2026",
    image: img("case-atorvastatin"),
    glyph: "💪",
    summary:
      "Severe muscle pain with a markedly raised creatine kinase after a macrolide was co-prescribed.",
  },
  {
    id: "c10",
    drug: "Amiodarone",
    reaction: "Thyroid dysfunction",
    severity: "Moderate",
    date: "28 Jun 2026",
    image: img("case-amiodarone"),
    glyph: "🦋",
    summary:
      "Abnormal thyroid function detected on routine monitoring during long-term therapy.",
  },
];
