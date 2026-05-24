// Local on-device side-effect knowledge base used by the medicine helper.
// This is bundled data for an offline demo — no network requests are made.

export type SideEffect = {
  id: string;
  label: string;
  condition?: "pregnant" | "child" | "senior" | "renal" | "allergy" | "hepatic";
  warningTitle?: string;
  warningMessage?: string;
};

const DB: Record<string, SideEffect[]> = {
  paracetamol: [
    {
      id: "para-1",
      label: "May cause liver injury at high doses",
      condition: "hepatic",
      warningTitle: "Hepatic caution",
      warningMessage:
        "Doses above 4 g/day or chronic use can cause hepatotoxicity, particularly with pre-existing liver disease.",
    },
    {
      id: "para-2",
      label: "Considered safe at therapeutic doses during pregnancy",
      condition: "pregnant",
      warningTitle: "Pregnancy note",
      warningMessage:
        "Generally regarded as the first-line analgesic in pregnancy. Use the lowest effective dose.",
    },
  ],

  ibuprofen: [
    {
      id: "ibu-1",
      label: "Avoid in the third trimester of pregnancy",
      condition: "pregnant",
      warningTitle: "Pregnancy restriction",
      warningMessage:
        "NSAIDs after 30 weeks of gestation can cause premature closure of the ductus arteriosus.",
    },
    {
      id: "ibu-2",
      label: "Gastrointestinal bleeding and ulceration risk",
      warningTitle: "GI bleeding risk",
      warningMessage:
        "Monitor for dyspepsia or melaena, especially with prolonged use, elderly patients, or with steroids / anticoagulants.",
    },
    {
      id: "ibu-3",
      label: "Renal impairment with long-term use",
      condition: "renal",
      warningTitle: "Renal caution",
      warningMessage:
        "Avoid in significant renal impairment. Monitor creatinine if chronic use.",
    },
  ],

  aspirin: [
    {
      id: "asp-1",
      label: "Reye's syndrome risk in children under 16",
      condition: "child",
      warningTitle: "Paediatric contraindication",
      warningMessage:
        "Avoid in children under 16 (except Kawasaki disease) due to risk of Reye's syndrome.",
    },
    {
      id: "asp-2",
      label: "Bleeding risk, especially with anticoagulants",
      warningTitle: "Bleeding risk",
      warningMessage:
        "Increases bleeding time. Caution with warfarin, DOACs, or peptic ulcer disease.",
    },
  ],

  amoxicillin: [
    {
      id: "amox-1",
      label: "Hypersensitivity / anaphylaxis in penicillin-allergic patients",
      condition: "allergy",
      warningTitle: "Allergy risk",
      warningMessage:
        "Watch for rash, urticaria, dyspnoea or anaphylaxis. Contraindicated in known penicillin allergy.",
    },
    {
      id: "amox-2",
      label: "Diarrhoea, including C. difficile colitis",
      warningTitle: "GI side effect",
      warningMessage:
        "Antibiotic-associated diarrhoea is common. Persistent diarrhoea warrants evaluation for C. difficile.",
    },
  ],

  ceftriaxone: [
    {
      id: "ceft-1",
      label: "Cross-reactivity in patients with penicillin allergy",
      condition: "allergy",
      warningTitle: "Cross-reactivity",
      warningMessage:
        "Up to 10% cross-reactivity with penicillins; use with caution in known beta-lactam allergy.",
    },
    {
      id: "ceft-2",
      label: "Biliary sludge / pseudolithiasis",
      warningTitle: "Hepatobiliary effect",
      warningMessage:
        "Reversible biliary sludging may occur with high doses or prolonged therapy.",
    },
  ],

  azithromycin: [
    {
      id: "azi-1",
      label: "QT prolongation and torsades de pointes",
      warningTitle: "QT prolongation",
      warningMessage:
        "Avoid in patients with known QT prolongation, hypokalaemia, or on other QT-prolonging drugs.",
    },
  ],

  ciprofloxacin: [
    {
      id: "cip-1",
      label: "Tendon rupture, especially Achilles tendon",
      condition: "senior",
      warningTitle: "Tendinopathy",
      warningMessage:
        "Risk increases with age over 60, concomitant corticosteroids, and renal impairment.",
    },
    {
      id: "cip-2",
      label: "Avoid in children except specific indications",
      condition: "child",
      warningTitle: "Paediatric caution",
      warningMessage:
        "Generally avoided in children due to potential cartilage effects.",
    },
  ],

  metronidazole: [
    {
      id: "met-1",
      label: "Disulfiram-like reaction with alcohol",
      warningTitle: "Alcohol interaction",
      warningMessage:
        "Avoid alcohol during and for 48 hours after therapy. May cause flushing, nausea and tachycardia.",
    },
  ],

  warfarin: [
    {
      id: "war-1",
      label: "Serious bleeding risk with dose changes or interactions",
      warningTitle: "Bleeding risk",
      warningMessage:
        "Many drug and food interactions. Requires regular INR monitoring.",
    },
    {
      id: "war-2",
      label: "Teratogenic — avoid in pregnancy",
      condition: "pregnant",
      warningTitle: "Pregnancy contraindication",
      warningMessage:
        "Crosses the placenta; associated with embryopathy. Switch to LMWH in pregnancy.",
    },
  ],

  heparin: [
    {
      id: "hep-1",
      label: "Heparin-induced thrombocytopenia (HIT)",
      warningTitle: "HIT risk",
      warningMessage:
        "Monitor platelet counts. A sudden drop after 5-10 days suggests HIT — stop heparin immediately.",
    },
  ],

  clozapine: [
    {
      id: "clo-1",
      label: "Agranulocytosis — severe drop in white blood cells",
      warningTitle: "Haematological monitoring",
      warningMessage:
        "Strict weekly / fortnightly WBC monitoring required. Discontinue if neutrophils fall.",
    },
    {
      id: "clo-2",
      label: "Lowered seizure threshold at higher doses",
      warningTitle: "Seizure risk",
      warningMessage:
        "Risk rises above 600 mg/day. Caution with epilepsy or other seizure-lowering drugs.",
    },
    {
      id: "clo-3",
      label: "Myocarditis, especially in the first 8 weeks",
      warningTitle: "Cardiac risk",
      warningMessage:
        "Investigate any new chest pain, tachycardia, fever or dyspnoea.",
    },
  ],

  carbamazepine: [
    {
      id: "car-1",
      label: "Stevens-Johnson syndrome / toxic epidermal necrolysis",
      warningTitle: "Severe skin reaction",
      warningMessage:
        "Higher risk in HLA-B*1502 carriers (more common in some Asian populations). Discontinue at first sign of rash.",
    },
    {
      id: "car-2",
      label: "Hepatotoxicity and blood dyscrasias",
      condition: "hepatic",
      warningTitle: "Hepatic / blood monitoring",
      warningMessage:
        "Baseline and periodic LFTs, FBC and serum sodium recommended.",
    },
  ],

  phenytoin: [
    {
      id: "phe-1",
      label: "Gum hyperplasia and hirsutism with long-term use",
      warningTitle: "Chronic toxicity",
      warningMessage:
        "Encourage dental hygiene. Long-term use also linked to osteomalacia and folate deficiency.",
    },
    {
      id: "phe-2",
      label: "Narrow therapeutic index — toxicity with small dose changes",
      warningTitle: "Toxicity",
      warningMessage:
        "Symptoms include nystagmus, ataxia, drowsiness, confusion. Therapeutic drug monitoring is essential.",
    },
  ],

  cisplatin: [
    {
      id: "cis-1",
      label: "Nephrotoxicity",
      condition: "renal",
      warningTitle: "Kidney toxicity",
      warningMessage:
        "Vigorous hydration and renal function monitoring are required. Adjust dose for impaired renal function.",
    },
    {
      id: "cis-2",
      label: "Ototoxicity (hearing loss, tinnitus)",
      warningTitle: "Hearing risk",
      warningMessage:
        "Baseline and periodic audiometry recommended, especially in children.",
    },
  ],

  digoxin: [
    {
      id: "dig-1",
      label: "Narrow therapeutic window — toxicity easily reached",
      warningTitle: "Toxicity risk",
      warningMessage:
        "Hypokalaemia, renal impairment, and many drug interactions increase risk. Symptoms: nausea, visual disturbance, arrhythmia.",
    },
    {
      id: "dig-2",
      label: "Bradyarrhythmia and conduction block in toxicity",
      warningTitle: "Cardiac toxicity",
      warningMessage:
        "ECG monitoring during initiation and in suspected toxicity.",
    },
  ],

  metformin: [
    {
      id: "metf-1",
      label: "Lactic acidosis (rare but serious)",
      condition: "renal",
      warningTitle: "Lactic acidosis risk",
      warningMessage:
        "Avoid in significant renal impairment (eGFR < 30) or acute illness with hypoperfusion.",
    },
    {
      id: "metf-2",
      label: "Vitamin B12 deficiency with long-term use",
      warningTitle: "B12 monitoring",
      warningMessage:
        "Check vitamin B12 levels periodically in patients on long-term therapy.",
    },
  ],

  insulin: [
    {
      id: "ins-1",
      label: "Hypoglycaemia",
      warningTitle: "Hypoglycaemia",
      warningMessage:
        "Counsel patients on signs and ensure access to fast-acting glucose.",
    },
  ],

  atenolol: [
    {
      id: "ate-1",
      label: "Bradycardia and atrioventricular block",
      warningTitle: "Cardiac caution",
      warningMessage:
        "Caution with verapamil, diltiazem, and in patients with conduction defects.",
    },
    {
      id: "ate-2",
      label: "Caution in asthma and severe COPD",
      warningTitle: "Bronchospasm risk",
      warningMessage:
        "Non-selective effects at higher doses may precipitate bronchospasm.",
    },
  ],

  amlodipine: [
    {
      id: "amlo-1",
      label: "Peripheral oedema",
      warningTitle: "Dose-related side effect",
      warningMessage:
        "Common dose-related ankle swelling; consider dose reduction or alternative if troublesome.",
    },
  ],

  enalapril: [
    {
      id: "ena-1",
      label: "Persistent dry cough",
      warningTitle: "Common side effect",
      warningMessage:
        "ACE-inhibitor-induced cough; switching to an ARB usually resolves it.",
    },
    {
      id: "ena-2",
      label: "Angioedema (potentially life-threatening)",
      warningTitle: "Angioedema",
      warningMessage:
        "Stop immediately if facial or laryngeal swelling occurs. Higher incidence in patients of African descent.",
    },
    {
      id: "ena-3",
      label: "Teratogenicity — avoid in pregnancy",
      condition: "pregnant",
      warningTitle: "Pregnancy contraindication",
      warningMessage:
        "Associated with foetal renal damage and oligohydramnios in second and third trimesters.",
    },
  ],

  atorvastatin: [
    {
      id: "ator-1",
      label: "Myopathy and rhabdomyolysis",
      warningTitle: "Muscle toxicity",
      warningMessage:
        "Investigate unexplained muscle pain. Check CK and renal function; risk rises with concurrent fibrates / macrolides.",
    },
    {
      id: "ator-2",
      label: "Transaminase elevation",
      condition: "hepatic",
      warningTitle: "Hepatic effects",
      warningMessage:
        "Check baseline LFTs; persistent elevations >3x ULN warrant discontinuation.",
    },
  ],

  omeprazole: [
    {
      id: "ome-1",
      label: "Hypomagnesaemia with prolonged use",
      warningTitle: "Electrolyte effect",
      warningMessage:
        "Check magnesium in patients on long-term PPIs, especially with diuretics or digoxin.",
    },
    {
      id: "ome-2",
      label: "Increased risk of C. difficile infection",
      warningTitle: "Infection risk",
      warningMessage:
        "Use the lowest effective dose for the shortest duration.",
    },
  ],

  diclofenac: [
    {
      id: "dic-1",
      label: "Cardiovascular events with high dose / long use",
      warningTitle: "Cardiovascular risk",
      warningMessage:
        "Avoid in established cardiovascular disease; risk of MI and stroke increases at higher doses.",
    },
    {
      id: "dic-2",
      label: "Renal impairment and fluid retention",
      condition: "renal",
      warningTitle: "Renal caution",
      warningMessage:
        "Caution in elderly, heart failure, or pre-existing renal disease.",
    },
  ],

  morphine: [
    {
      id: "mor-1",
      label: "Respiratory depression",
      warningTitle: "Respiratory risk",
      warningMessage:
        "Particular risk with co-administered benzodiazepines or other CNS depressants.",
    },
    {
      id: "mor-2",
      label: "Dependence and tolerance with chronic use",
      warningTitle: "Dependence",
      warningMessage:
        "Use cautiously for chronic non-cancer pain; review need regularly.",
    },
  ],

  tramadol: [
    {
      id: "tra-1",
      label: "Serotonin syndrome when combined with SSRIs / SNRIs",
      warningTitle: "Drug interaction",
      warningMessage:
        "Watch for agitation, tremor, hyperreflexia, hyperthermia.",
    },
    {
      id: "tra-2",
      label: "Lowers seizure threshold",
      warningTitle: "Seizure risk",
      warningMessage:
        "Avoid or use with caution in patients with epilepsy or on other seizure-threshold-lowering drugs.",
    },
  ],

  ranitidine: [
    {
      id: "ran-1",
      label: "Withdrawn in many countries due to NDMA contamination",
      warningTitle: "Regulatory note",
      warningMessage:
        "Many regulators have suspended ranitidine; consider an alternative H2-blocker or PPI.",
    },
  ],

  isoniazid: [
    {
      id: "iso-1",
      label: "Hepatotoxicity",
      condition: "hepatic",
      warningTitle: "Hepatic risk",
      warningMessage:
        "Monitor LFTs, especially in older patients and with concurrent rifampicin.",
    },
    {
      id: "iso-2",
      label: "Peripheral neuropathy (especially in malnourished patients)",
      warningTitle: "Neuropathy",
      warningMessage:
        "Co-administer pyridoxine (vitamin B6) prophylactically.",
    },
  ],

  rifampicin: [
    {
      id: "rif-1",
      label: "Orange-red discolouration of body fluids",
      warningTitle: "Cosmetic effect",
      warningMessage:
        "Harmless but counsel patients; may permanently stain soft contact lenses.",
    },
    {
      id: "rif-2",
      label: "Potent CYP enzyme inducer — many drug interactions",
      warningTitle: "Drug interactions",
      warningMessage:
        "Reduces effectiveness of oral contraceptives, warfarin, many antiretrovirals, and others.",
    },
  ],

  chlorpromazine: [
    {
      id: "chl-1",
      label: "Sedation and postural hypotension",
      condition: "senior",
      warningTitle: "Sedation / fall risk",
      warningMessage:
        "Especially problematic in older patients — increases falls and confusion.",
    },
    {
      id: "chl-2",
      label: "Extrapyramidal side effects",
      warningTitle: "EPS risk",
      warningMessage:
        "Watch for dystonia, parkinsonism, akathisia, tardive dyskinesia.",
    },
    {
      id: "chl-3",
      label: "Cholestatic jaundice",
      condition: "hepatic",
      warningTitle: "Hepatic effect",
      warningMessage:
        "Idiosyncratic reaction; usually presents within first month.",
    },
  ],

  haloperidol: [
    {
      id: "hal-1",
      label: "QT prolongation",
      warningTitle: "QT prolongation",
      warningMessage:
        "ECG monitoring advised, especially with parenteral high-dose use.",
    },
    {
      id: "hal-2",
      label: "Neuroleptic malignant syndrome (rare, life-threatening)",
      warningTitle: "NMS",
      warningMessage:
        "Hyperthermia, rigidity, altered mental state and autonomic instability — discontinue and seek emergency care.",
    },
  ],

  diazepam: [
    {
      id: "dia-1",
      label: "Sedation, falls, and cognitive impairment",
      condition: "senior",
      warningTitle: "Use in elderly",
      warningMessage:
        "Avoid long-acting benzodiazepines in older adults where possible.",
    },
    {
      id: "dia-2",
      label: "Dependence with prolonged use",
      warningTitle: "Dependence",
      warningMessage:
        "Generally limit to short-term use (2-4 weeks).",
    },
  ],

  methotrexate: [
    {
      id: "mtx-1",
      label: "Bone marrow suppression",
      warningTitle: "Haematological toxicity",
      warningMessage:
        "Regular FBC monitoring. Stop and seek advice with any infection, sore throat, or unexplained bruising.",
    },
    {
      id: "mtx-2",
      label: "Severely teratogenic — contraindicated in pregnancy",
      condition: "pregnant",
      warningTitle: "Pregnancy contraindication",
      warningMessage:
        "Reliable contraception required during and for at least 3 months after treatment.",
    },
    {
      id: "mtx-3",
      label: "Hepatotoxicity with chronic use",
      condition: "hepatic",
      warningTitle: "Hepatic monitoring",
      warningMessage:
        "Routine LFTs; folate supplementation reduces side effects.",
    },
  ],

  prednisolone: [
    {
      id: "pred-1",
      label: "Cushingoid features and osteoporosis with long-term use",
      warningTitle: "Chronic steroid effects",
      warningMessage:
        "Use the lowest effective dose; consider bone-protection therapy if used over 3 months.",
    },
    {
      id: "pred-2",
      label: "Hyperglycaemia and diabetes worsening",
      warningTitle: "Glycaemic effect",
      warningMessage:
        "Monitor blood glucose, particularly in known diabetics.",
    },
  ],
};

export function getMockSideEffects(medicineName: string): SideEffect[] {
  const key = medicineName.trim().toLowerCase();
  return DB[key] ?? [];
}

export const KNOWN_MEDICINES = Object.keys(DB).sort();
