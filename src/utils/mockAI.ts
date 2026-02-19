// src/utils/mockAi.ts

export type SideEffect = {
  id: string;
  label: string;
  condition?: 'pregnant' | 'child' | 'senior' | 'renal';
  warningTitle?: string;
  warningMessage?: string;
};

const MOCK_DB: Record<string, SideEffect[]> = {
  paracetamol: [
    {
      id: 'p1',
      label: 'May cause liver issues in high doses',
      condition: 'renal',
      warningTitle: 'Liver / renal caution',
      warningMessage:
        'Avoid high doses in patients with liver or kidney problems. This is mock info, not medical advice.',
    },
    {
      id: 'p2',
      label: 'Generally safe in pregnancy',
      condition: 'pregnant',
      warningTitle: 'Pregnancy notice',
      warningMessage:
        'Always consult a doctor before taking any medicine during pregnancy. Mock prototype only.',
    },
  ],
  ibuprofen: [
    {
      id: 'i1',
      label: 'Avoid in late‑pregnancy',
      condition: 'pregnant',
      warningTitle: 'Pregnancy restriction',
      warningMessage:
        'Non‑steroidal drugs are usually avoided in late pregnancy. Prototype only, not real advice.',
    },
    {
      id: 'i2',
      label: 'Not recommended for kids under 12',
      condition: 'child',
      warningTitle: 'Age restriction',
      warningMessage:
        'Use pediatric dosage and doctor consultation for children. Prototype only.',
    },
  ],
  amoxicillin: [
    {
      id: 'a1',
      label: 'Possible allergic reactions like rash or swelling',
      warningTitle: 'Allergy risk',
      warningMessage:
        'Watch for rash or breathing issues and seek medical help. Prototype only.',
    },
  ],
  warfarin: [
    {
      id: 'w1',
      label: 'High risk of serious bleeding with dose changes or interactions',
      warningTitle: 'Severe bleeding risk',
      warningMessage:
        'Strong mock warning: combining with other drugs or incorrect dosing can increase bleeding risk. Prototype only, not medical advice.',
    },
    {
      id: 'w2',
      label: 'Requires very close INR monitoring (mock)',
      warningTitle: 'Monitoring required',
      warningMessage:
        'In this prototype we flag warfarin as needing close lab monitoring for clotting. Educational demo only.',
    },
  ],
  clozapine: [
    {
      id: 'c1',
      label: 'Can cause severe drop in white blood cells (agranulocytosis) – mock',
      warningTitle: 'Blood dyscrasia risk',
      warningMessage:
        'Prototype warning: clozapine is associated with serious blood count problems, requiring strict monitoring in real life.',
    },
    {
      id: 'c2',
      label: 'Risk of seizures at higher doses (mock)',
      warningTitle: 'Seizure risk',
      warningMessage:
        'This demo flags a seizure risk at high doses or with interacting medicines. Not real clinical guidance.',
    },
  ],
  carbamazepine: [
    {
      id: 'cb1',
      label: 'Rare but severe skin reactions like SJS/TEN (mock)',
      warningTitle: 'Severe skin reaction',
      warningMessage:
        'Prototype only: we warn about rare but serious skin reactions and need for urgent evaluation.',
    },
    {
      id: 'cb2',
      label: 'May affect liver function and blood counts (mock)',
      warningTitle: 'Liver / blood monitoring',
      warningMessage:
        'Educational demo: shows need for periodic blood tests in real clinical use.',
    },
  ],
  cisplatin: [
    {
      id: 'cs1',
      label: 'Can cause severe kidney damage (nephrotoxicity) – mock',
      warningTitle: 'Kidney toxicity',
      warningMessage:
        'Prototype warning: highlights nephrotoxicity and hydration / renal monitoring in real practice.',
    },
    {
      id: 'cs2',
      label: 'May cause hearing loss (ototoxicity) – mock',
      warningTitle: 'Hearing risk',
      warningMessage:
        'Demo note: in real life, cisplatin can affect hearing and may require audiology monitoring.',
    },
  ],
  digoxin: [
    {
      id: 'd1',
      label: 'Narrow therapeutic window – toxicity at slightly high levels (mock)',
      warningTitle: 'Toxicity risk',
      warningMessage:
        'Prototype alert: small dose changes, kidney issues, or interactions can cause serious toxicity.',
    },
    {
      id: 'd2',
      label: 'Can cause dangerous heart rhythm problems when toxic (mock)',
      warningTitle: 'Arrhythmia risk',
      warningMessage:
        'Educational demo only: highlights risk of life‑threatening arrhythmias in overdose or interactions.',
    },
  ],
};

export function getMockSideEffects(medicineName: string): SideEffect[] {
  const key = medicineName.trim().toLowerCase();
  return MOCK_DB[key] ?? [];
}
