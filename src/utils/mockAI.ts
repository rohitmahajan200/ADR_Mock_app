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
};

export function getMockSideEffects(medicineName: string): SideEffect[] {
  const key = medicineName.trim().toLowerCase();
  return MOCK_DB[key] ?? [];
}
