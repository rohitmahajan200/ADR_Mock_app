import React, { createContext, useContext, useState } from 'react';

type FormData = {
  // Case Type (mutually exclusive)
  caseType?: "Initial" | "Follow-Up";

  // Section A: Patient Information
  patientInitials: string;
  patientAgeOrDob: string;         // string to capture age or DOB text input
  gender?: "M" | "F" | "Other";
  weightKg?: string;               // string or number
  regNo?: string;
  amcReportNo?: string;
  worldWideUniqueNo?: string;

  // Section B: Adverse Reaction
  eventStartDate?: string;           // ISO date string or formatted date string
  eventStopDate?: string;
  reactionManagement?: string;
  relevantInvestigations?: string;
  medicalHistory?: string;

  // Section 14: Seriousness of the reaction.
  // `seriousnessNo` is the "No" tick; `seriousness` holds the labels that apply.
  seriousnessNo?: boolean;
  seriousness?: string[];

  // Section 15: Outcome enum
  outcome?: "Recovered" | "Recovering" | "Not Recovered" | "Fatal" | "Recovered with sequelae" | "Unknown";

  // Section C: Suspected Medications (4 rows)
  suspectedMedicationName1?: string;
  suspectedMedicationManufacturer1?: string;
  suspectedMedicationBatch1?: string;
  suspectedMedicationExpiry1?: string;
  suspectedMedicationDose1?: string;
  suspectedMedicationRoute1?: string;
  suspectedMedicationFrequency1?: string;
  suspectedMedicationDateStarted1?: string;
  suspectedMedicationDateStopped1?: string;
  suspectedMedicationIndication1?: string;
  suspectedMedicationCausality1?: string;

  // Repeat for medication 2
  suspectedMedicationName2?: string;
  suspectedMedicationManufacturer2?: string;
  suspectedMedicationBatch2?: string;
  suspectedMedicationExpiry2?: string;
  suspectedMedicationDose2?: string;
  suspectedMedicationRoute2?: string;
  suspectedMedicationFrequency2?: string;
  suspectedMedicationDateStarted2?: string;
  suspectedMedicationDateStopped2?: string;
  suspectedMedicationIndication2?: string;
  suspectedMedicationCausality2?: string;

  // Medication 3
  suspectedMedicationName3?: string;
  suspectedMedicationManufacturer3?: string;
  suspectedMedicationBatch3?: string;
  suspectedMedicationExpiry3?: string;
  suspectedMedicationDose3?: string;
  suspectedMedicationRoute3?: string;
  suspectedMedicationFrequency3?: string;
  suspectedMedicationDateStarted3?: string;
  suspectedMedicationDateStopped3?: string;
  suspectedMedicationIndication3?: string;
  suspectedMedicationCausality3?: string;

  // Medication 4
  suspectedMedicationName4?: string;
  suspectedMedicationManufacturer4?: string;
  suspectedMedicationBatch4?: string;
  suspectedMedicationExpiry4?: string;
  suspectedMedicationDose4?: string;
  suspectedMedicationRoute4?: string;
  suspectedMedicationFrequency4?: string;
  suspectedMedicationDateStarted4?: string;
  suspectedMedicationDateStopped4?: string;
  suspectedMedicationIndication4?: string;
  suspectedMedicationCausality4?: string;

  // Section 9 & 10: Action Taken & Reintroduction
  actionTaken1?: "Drug withdrawn" | "Dose increased" | "Dose reduced" | "Dose not changed" | "Not applicable" | "Unknown";
  reintroducedEffect1?: "Yes" | "No" | "Effect unknown";
  reintroducedDose1?: string;

  actionTaken2?: string;
  reintroducedEffect2?: string;
  reintroducedDose2?: string;

  actionTaken3?: string;
  reintroducedEffect3?: string;
  reintroducedDose3?: string;

  actionTaken4?: string;
  reintroducedEffect4?: string;
  reintroducedDose4?: string;

  // Concomitant medications (3 rows)
  concomitantName1?: string;
  concomitantDose1?: string;
  concomitantRoute1?: string;
  concomitantFrequency1?: string;
  concomitantDateStarted1?: string;
  concomitantDateStopped1?: string;
  concomitantIndication1?: string;

  concomitantName2?: string;
  concomitantDose2?: string;
  concomitantRoute2?: string;
  concomitantFrequency2?: string;
  concomitantDateStarted2?: string;
  concomitantDateStopped2?: string;
  concomitantIndication2?: string;

  concomitantName3?: string;
  concomitantDose3?: string;
  concomitantRoute3?: string;
  concomitantFrequency3?: string;
  concomitantDateStarted3?: string;
  concomitantDateStopped3?: string;
  concomitantIndication3?: string;

  concomitantName4?: string;
  concomitantDose4?: string;
  concomitantRoute4?: string;
  concomitantFrequency4?: string;
  concomitantDateStarted4?: string;
  concomitantDateStopped4?: string;
  concomitantIndication4?: string;

  // Additional info & reporter
  additionalInformation?: string;
  reporterNameAddress?: string;
  reporterPin?: string;
  reporterEmail?: string;
  reporterContact?: string;
  reporterOccupation?: string;
  reportDate?: string;
};


const defaultFormData: FormData = {
  caseType: "Initial",
  patientInitials: '',
  patientAgeOrDob: '',
  gender: undefined,
  weightKg: '',
  regNo: '',
  amcReportNo: '',
  worldWideUniqueNo: '',
  eventStartDate: '',
  eventStopDate: '',
  reactionManagement: '',
  relevantInvestigations: '',
  medicalHistory: '',

  seriousnessNo: false,
  seriousness: [],

  outcome: undefined,

  suspectedMedicationName1: '',
  suspectedMedicationManufacturer1: '',
  suspectedMedicationBatch1: '',
  suspectedMedicationExpiry1: '',
  suspectedMedicationDose1: '',
  suspectedMedicationRoute1: '',
  suspectedMedicationFrequency1: '',
  suspectedMedicationDateStarted1: '',
  suspectedMedicationDateStopped1: '',
  suspectedMedicationIndication1: '',
  suspectedMedicationCausality1: '',

  suspectedMedicationName2: '',
  suspectedMedicationManufacturer2: '',
  suspectedMedicationBatch2: '',
  suspectedMedicationExpiry2: '',
  suspectedMedicationDose2: '',
  suspectedMedicationRoute2: '',
  suspectedMedicationFrequency2: '',
  suspectedMedicationDateStarted2: '',
  suspectedMedicationDateStopped2: '',
  suspectedMedicationIndication2: '',
  suspectedMedicationCausality2: '',

  suspectedMedicationName3: '',
  suspectedMedicationManufacturer3: '',
  suspectedMedicationBatch3: '',
  suspectedMedicationExpiry3: '',
  suspectedMedicationDose3: '',
  suspectedMedicationRoute3: '',
  suspectedMedicationFrequency3: '',
  suspectedMedicationDateStarted3: '',
  suspectedMedicationDateStopped3: '',
  suspectedMedicationIndication3: '',
  suspectedMedicationCausality3: '',

  suspectedMedicationName4: '',
  suspectedMedicationManufacturer4: '',
  suspectedMedicationBatch4: '',
  suspectedMedicationExpiry4: '',
  suspectedMedicationDose4: '',
  suspectedMedicationRoute4: '',
  suspectedMedicationFrequency4: '',
  suspectedMedicationDateStarted4: '',
  suspectedMedicationDateStopped4: '',
  suspectedMedicationIndication4: '',
  suspectedMedicationCausality4: '',

  actionTaken1: undefined,
  reintroducedEffect1: undefined,
  reintroducedDose1: '',

  concomitantName1: '',
  concomitantDose1: '',
  concomitantRoute1: '',
  concomitantFrequency1: '',
  concomitantDateStarted1: '',
  concomitantDateStopped1: '',
  concomitantIndication1: '',

  concomitantName2: '',
  concomitantDose2: '',
  concomitantRoute2: '',
  concomitantFrequency2: '',
  concomitantDateStarted2: '',
  concomitantDateStopped2: '',
  concomitantIndication2: '',

  
  concomitantName3: '',
  concomitantDose3: '',
  concomitantRoute3: '',
  concomitantFrequency3: '',
  concomitantDateStarted3: '',
  concomitantDateStopped3: '',
  concomitantIndication3: '',

  concomitantName4: '',
  concomitantDose4: '',
  concomitantRoute4: '',
  concomitantFrequency4: '',
  concomitantDateStarted4: '',
  concomitantDateStopped4: '',
  concomitantIndication4: '',

  additionalInformation: '',
  reporterNameAddress: '',
  reporterPin: '',
  reporterEmail: '',
  reporterContact: '',
  reporterOccupation: '',
  reportDate: '',
};


type FormContextType = {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [form, setForm] = useState<FormData>(defaultFormData);
  return (
    <FormContext.Provider value={{ form, setForm }}>
      {children}
    </FormContext.Provider>
  );
};

export function useForm() {
  const context = useContext(FormContext);
  if (!context) throw new Error('useForm must be used within a FormProvider');
  return context;
}
