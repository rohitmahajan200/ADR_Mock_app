// src/screens/MedicationDetails.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { useForm } from "../contexts/FormContext";

const ACTION_OPTIONS = [
  "Drug withdrawn",
  "Dose increased",
  "Dose reduced",
  "Dose not changed",
  "Not applicable",
  "Unknown",
];

const REINTRO_OPTIONS = ["Yes", "No", "Effect unknown"];

const ROUTE_OPTIONS = [
  "Oral",
  "Intravenous",
  "Intramuscular",
  "Subcutaneous",
  "Topical",
  "Inhalation",
  "Other",
];

type SuspectedMed = {
  name?: string;
  manufacturer?: string;
  batch?: string;
  expiry?: string;
  dose?: string;
  route?: string;
  frequency?: string;
  dateStarted?: string;
  dateStopped?: string;
  indication?: string;
  causality?: string;
  actionTaken?: string;
  reintroducedEffect?: string;
  reintroducedDose?: string;
};

type ConcomitantMed = {
  name?: string;
  dose?: string;
  route?: string;
  frequency?: string;
  dateStarted?: string;
  dateStopped?: string;
  indication?: string;
};

/** ------- MOCK AI SIDE-EFFECTS (PROTOTYPE ONLY) ------- */

type MockSideEffect = {
  id: string;
  label: string;
  condition?: "pregnant" | "child" | "senior" | "renal" | "allergy";
  warningTitle?: string;
  warningMessage?: string;
};

// const MOCK_SIDE_EFFECTS: Record<string, MockSideEffect[]> = {
//   paracetamol: [
//     {
//       id: "p1",
//       label: "May cause liver issues in high doses.",
//       condition: "renal",
//       warningTitle: "Liver / renal caution (prototype)",
//       warningMessage:
//         "Avoid high doses in liver or kidney issues. This is dummy prototype info only, not medical advice.",
//     },
//     {
//       id: "p2",
//       label: "Generally considered safe in pregnancy (mock).",
//       condition: "pregnant",
//       warningTitle: "Pregnancy notice (prototype)",
//       warningMessage:
//         "Always consult a doctor before any medicine in pregnancy. This is just demo behaviour.",
//     },
//   ],
//   ibuprofen: [
//     {
//       id: "i1",
//       label: "Avoid in late pregnancy (mock).",
//       condition: "pregnant",
//       warningTitle: "Pregnancy restriction (prototype)",
//       warningMessage:
//         "Non‑steroidal drugs may be avoided in late pregnancy. This is sample text only.",
//     },
//     {
//       id: "i2",
//       label: "Not recommended for children under 12 (mock).",
//       condition: "child",
//       warningTitle: "Age restriction (prototype)",
//       warningMessage:
//         "Use pediatric dosing and doctor consultation for children. Demo only, not real guidance.",
//     },
//   ],
//   amoxicillin: [
//     {
//       id: "a1",
//       label: "May cause allergic reactions (mock).",
//       condition: "allergy",
//       warningTitle: "Allergy risk (prototype)",
//       warningMessage:
//         "Watch for rash or breathing difficulty and seek help. This is mock behaviour only.",
//     },
//   ],
// };

const MOCK_SIDE_EFFECTS: Record<string, MockSideEffect[]> = {
  paracetamol: [
    {
      id: "p1",
      label: "May cause liver issues in high doses.",
      condition: "renal",
      warningTitle: "Liver / renal caution",
      warningMessage:
        "Avoid high doses in liver or kidney issues.",
    },
    {
      id: "p2",
      label: "Generally considered safe in pregnancy.",
      condition: "pregnant",
      warningTitle: "Pregnancy notice",
      warningMessage:
        "Always consult a doctor before any medicine in pregnancy.",
    },
  ],

  ibuprofen: [
    {
      id: "i1",
      label: "Avoid in late pregnancy.",
      condition: "pregnant",
      warningTitle: "Pregnancy restriction",
      warningMessage:
        "NSAIDs may be avoided in late pregnancy.",
    },
    {
      id: "i2",
      label: "Not recommended for children under 12.",
      condition: "child",
      warningTitle: "Age restriction",
      warningMessage:
        "Use pediatric dosing and doctor consultation for children.",
    },
  ],

  amoxicillin: [
    {
      id: "a1",
      label: "May cause allergic reactions.",
      condition: "allergy",
      warningTitle: "Allergy risk",
      warningMessage:
        "Watch for rash or breathing difficulty and seek help.",
    },
  ],

  chlorpromazine: [
    {
      id: "c1",
      label: "May cause strong drowsiness.",
      condition: "senior",
      warningTitle: "Sedation warning",
      warningMessage:
        "Use cautiously in senior patients due to fall risk.",
    },
    {
      id: "c2",
      label: "May cause allergic reactions in some patients.",
      condition: "allergy",
      warningTitle: "Allergy caution",
      warningMessage:
        "Monitor for rash or swelling.",
    },
  ],

  diclofenac: [
    {
      id: "d1",
      label: "May affect kidney function (mock).",
      condition: "renal",
      warningTitle: "Renal caution (prototype)",
      warningMessage:
        "NSAIDs may impact kidneys. Prototype warning only.",
    },
    {
      id: "d2",
      label: "Use cautiously in seniors due to gastric sensitivity (mock).",
      condition: "senior",
      warningTitle: "Senior caution (prototype)",
      warningMessage:
        "Monitor stomach discomfort in older patients. Demo text only.",
    },
  ],
};

const getMockSideEffects = (medicineName: string): MockSideEffect[] => {
  const key = medicineName.trim().toLowerCase();
  return MOCK_SIDE_EFFECTS[key] ?? [];
};

/** ------------- COMPONENT ------------- */

export default function MedicationDetailsScreen({ navigation }: any) {
  const { form, setForm } = useForm();

  const buildInitialSuspected = (): SuspectedMed[] => {
    const arr: SuspectedMed[] = [];
    for (let i = 1; i <= 4; i++) {
      const prefix = (k: string) =>
        (form as any)[`suspectedMedication${k}${i}`] ?? "";
      const m: SuspectedMed = {
        name: prefix("Name"),
        manufacturer: prefix("Manufacturer"),
        batch: prefix("Batch"),
        expiry: prefix("Expiry"),
        dose: prefix("Dose"),
        route: prefix("Route"),
        frequency: prefix("Frequency"),
        dateStarted: prefix("DateStarted"),
        dateStopped: prefix("DateStopped"),
        indication: prefix("Indication"),
        causality: prefix("Causality"),
        actionTaken: (form as any)[`actionTaken${i}`] ?? "",
        reintroducedEffect: (form as any)[`reintroducedEffect${i}`] ?? "",
        reintroducedDose: (form as any)[`reintroducedDose${i}`] ?? "",
      };
      const isEmpty = Object.values(m).every((v) => !v);
      if (!isEmpty) arr.push(m);
    }
    return arr.length ? arr : [{} as SuspectedMed];
  };

  const buildInitialConcomitant = (): ConcomitantMed[] => {
    const arr: ConcomitantMed[] = [];
    for (let i = 1; i <= 4; i++) {
      const prefix = (k: string) =>
        (form as any)[`concomitant${k}${i}`] ?? "";
      const c: ConcomitantMed = {
        name: prefix("Name"),
        dose: prefix("Dose"),
        route: prefix("Route"),
        frequency: prefix("Frequency"),
        dateStarted: prefix("DateStarted"),
        dateStopped: prefix("DateStopped"),
        indication: prefix("Indication"),
      };
      const isEmpty = Object.values(c).every((v) => !v);
      if (!isEmpty) arr.push(c);
    }
    return arr.length ? arr : [{} as ConcomitantMed];
  };

  const [medications, setMedications] = useState<SuspectedMed[]>(
    (form as any).medications ?? buildInitialSuspected()
  );
  const [concomitant, setConcomitant] = useState<ConcomitantMed[]>(
    (form as any).concomitantMedications ?? buildInitialConcomitant()
  );

  // single date picker state
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerConfig, setPickerConfig] = useState<{
    section: "suspected" | "concomitant";
    index: number;
    key: string;
    date: Date;
  } | null>(null);

  const formatDate = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;

  const [aiSideEffects, setAiSideEffects] = useState<MockSideEffect[]>([]);
  const [aiWarning, setAiWarning] = useState<MockSideEffect | null>(null);

  const handleAiCheck = (idx: number) => {
    const med = medications[idx];
    if (!med?.name?.trim()) {
      Alert.alert("Enter medicine name", "Please type medicine name first.");
      return;
    }
    const results = getMockSideEffects(med.name);
    setAiSideEffects(results);
    if (results.length === 0) {
      Alert.alert(
        "No sample data",
        "No mock side‑effects configured for this medicine in prototype."
      );
    }
  };

  const handleSelectSideEffect = (idx: number, eff: MockSideEffect) => {
    const current = medications[idx];
    const mergedIndication = current.indication
      ? `${current.indication}\n${eff.label}`
      : eff.label;
    updateSuspected(idx, "indication", mergedIndication);
    setAiWarning(eff);
  };

  useEffect(() => {
    setForm((prev: any) => ({ ...prev, medications }));
    const fixedUpdate: any = {};
    for (let i = 1; i <= 4; i++) {
      const med = medications[i - 1] || ({} as SuspectedMed);
      fixedUpdate[`suspectedMedicationName${i}`] = med.name ?? "";
      fixedUpdate[`suspectedMedicationManufacturer${i}`] =
        med.manufacturer ?? "";
      fixedUpdate[`suspectedMedicationBatch${i}`] = med.batch ?? "";
      fixedUpdate[`suspectedMedicationExpiry${i}`] = med.expiry ?? "";
      fixedUpdate[`suspectedMedicationDose${i}`] = med.dose ?? "";
      fixedUpdate[`suspectedMedicationRoute${i}`] = med.route ?? "";
      fixedUpdate[`suspectedMedicationFrequency${i}`] = med.frequency ?? "";
      fixedUpdate[`suspectedMedicationDateStarted${i}`] =
        med.dateStarted ?? "";
      fixedUpdate[`suspectedMedicationDateStopped${i}`] =
        med.dateStopped ?? "";
      fixedUpdate[`suspectedMedicationIndication${i}`] =
        med.indication ?? "";
      fixedUpdate[`suspectedMedicationCausality${i}`] = med.causality ?? "";
      fixedUpdate[`actionTaken${i}`] = med.actionTaken ?? "";
      fixedUpdate[`reintroducedEffect${i}`] = med.reintroducedEffect ?? "";
      fixedUpdate[`reintroducedDose${i}`] = med.reintroducedDose ?? "";
    }
    setForm((prev: any) => ({ ...prev, ...fixedUpdate }));
  }, [medications, setForm]);

  useEffect(() => {
    setForm((prev: any) => ({ ...prev, concomitantMedications: concomitant }));
    const fixedUpdate: any = {};
    for (let i = 1; i <= 4; i++) {
      const c = concomitant[i - 1] || ({} as ConcomitantMed);
      fixedUpdate[`concomitantName${i}`] = c.name ?? "";
      fixedUpdate[`concomitantDose${i}`] = c.dose ?? "";
      fixedUpdate[`concomitantRoute${i}`] = c.route ?? "";
      fixedUpdate[`concomitantFrequency${i}`] = c.frequency ?? "";
      fixedUpdate[`concomitantDateStarted${i}`] = c.dateStarted ?? "";
      fixedUpdate[`concomitantDateStopped${i}`] = c.dateStopped ?? "";
      fixedUpdate[`concomitantIndication${i}`] = c.indication ?? "";
    }
    setForm((prev: any) => ({ ...prev, ...fixedUpdate }));
  }, [concomitant, setForm]);

  const updateSuspected = (
    index: number,
    key: keyof SuspectedMed,
    value: any
  ) => {
    const copy = [...medications];
    copy[index] = { ...(copy[index] || {}), [key]: value };
    setMedications(copy);
  };

  const updateConcomitant = (
    index: number,
    key: keyof ConcomitantMed,
    value: any
  ) => {
    const copy = [...concomitant];
    copy[index] = { ...(copy[index] || {}), [key]: value };
    setConcomitant(copy);
  };

  const addMedication = () => {
    setMedications((prev) => [
      ...prev,
      {
        name: "",
        manufacturer: "",
        batch: "",
        expiry: "",
        dose: "",
        route: "",
        frequency: "",
        dateStarted: "",
        dateStopped: "",
        indication: "",
        causality: "",
        actionTaken: "",
        reintroducedEffect: "",
        reintroducedDose: "",
      },
    ]);
  };

  const removeMedication = (index: number) => {
    if (medications.length === 1) {
      Alert.alert("At least one row must exist");
      return;
    }
    const copy = medications.filter((_, i) => i !== index);
    setMedications(copy);
  };

  const addConcomitant = () => {
    setConcomitant((prev) => [
      ...prev,
      {
        name: "",
        dose: "",
        route: "",
        frequency: "",
        dateStarted: "",
        dateStopped: "",
        indication: "",
      },
    ]);
  };

  const removeConcomitant = (index: number) => {
    if (concomitant.length === 1) {
      Alert.alert("At least one row must exist");
      return;
    }
    setConcomitant((prev) => prev.filter((_, i) => i !== index));
  };

  const onDateChange = (event: any, selected?: Date) => {
    if (Platform.OS === "android") {
      setPickerVisible(false);
    }

    if (!pickerConfig) {
      return;
    }

    if (event?.type === "dismissed") {
      return;
    }

    const chosen = selected || pickerConfig.date;
    const formatted = formatDate(chosen);

    if (pickerConfig.section === "suspected") {
      updateSuspected(pickerConfig.index, pickerConfig.key as any, formatted);
    } else {
      updateConcomitant(pickerConfig.index, pickerConfig.key as any, formatted);
    }
  };

  const openDatePicker = (
    section: "suspected" | "concomitant",
    index: number,
    key: string,
    currentValue?: string
  ) => {
    let baseDate = new Date();
    if (currentValue && currentValue.includes("/")) {
      const [dd, mm, yyyy] = currentValue.split("/");
      const d = parseInt(dd, 10);
      const m = parseInt(mm, 10) - 1;
      const y = parseInt(yyyy, 10);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
        baseDate = new Date(y, m, d);
      }
    }
    setPickerConfig({ section, index, key, date: baseDate });
    setPickerVisible(true);
  };

  const renderFieldLabel = (label: string) => (
    <Text style={styles.fieldHeader}>{label}</Text>
  );

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>C. Suspected Medications</Text>

        {medications.map((med, idx) => (
          <View key={`med-${idx}`} style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Medication {idx + 1}</Text>
              <View style={{ flexDirection: "row" }}>
                <Pressable
                  style={styles.smallBtn}
                  onPress={() => removeMedication(idx)}
                >
                  <Text style={styles.smallBtnText}>Remove</Text>
                </Pressable>
              </View>
            </View>

            {renderFieldLabel("Name")}
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={med.name}
              onChangeText={(v) => updateSuspected(idx, "name", v)}
            />

            <Pressable
              style={[styles.smallBtn, { alignSelf: "flex-start", marginBottom: 10 }]}
              onPress={() => handleAiCheck(idx)}
            >
              <Text style={styles.smallBtnText}>Check side effects</Text>
            </Pressable>

            {aiSideEffects.length > 0 && (
              <View style={styles.aiDropdown}>
                <Text style={styles.aiTitle}>Sample side effects (mock):</Text>
                {aiSideEffects.map((eff) => (
                  <Pressable
                    key={eff.id}
                    style={styles.aiItem}
                    onPress={() => handleSelectSideEffect(idx, eff)}
                  >
                    <Text style={styles.aiText}>{eff.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {renderFieldLabel("Manufacturer")}
            <TextInput
              style={styles.input}
              placeholder="Manufacturer"
              value={med.manufacturer}
              onChangeText={(v) => updateSuspected(idx, "manufacturer", v)}
            />

            {renderFieldLabel("Batch / Lot")}
            <TextInput
              style={styles.input}
              placeholder="Batch / Lot"
              value={med.batch}
              onChangeText={(v) => updateSuspected(idx, "batch", v)}
            />

            {renderFieldLabel("Expiry Date")}
            <TouchableOpacity
              style={styles.input}
              onPress={() =>
                openDatePicker("suspected", idx, "expiry", med.expiry)
              }
            >
              <Text style={styles.inputText}>
                {med.expiry || "Expiry Date"}
              </Text>
            </TouchableOpacity>

            {renderFieldLabel("Dose")}
            <TextInput
              style={styles.input}
              placeholder="Dose"
              value={med.dose}
              onChangeText={(v) => updateSuspected(idx, "dose", v)}
            />

            {renderFieldLabel("Route")}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={med.route}
                onValueChange={(val) => updateSuspected(idx, "route", val)}
                style={styles.picker}
              >
                <Picker.Item label="Select Route" value="" />
                {ROUTE_OPTIONS.map((r) => (
                  <Picker.Item key={r} label={r} value={r} />
                ))}
              </Picker>
            </View>

            {renderFieldLabel("Frequency")}
            <TextInput
              style={styles.input}
              placeholder="Frequency"
              value={med.frequency}
              onChangeText={(v) => updateSuspected(idx, "frequency", v)}
            />

            {renderFieldLabel("Therapy Start Date")}
            <TouchableOpacity
              style={styles.input}
              onPress={() =>
                openDatePicker(
                  "suspected",
                  idx,
                  "dateStarted",
                  med.dateStarted
                )
              }
            >
              <Text style={styles.inputText}>
                {med.dateStarted || "Therapy Start Date"}
              </Text>
            </TouchableOpacity>

            {renderFieldLabel("Therapy Stop Date")}
            <TouchableOpacity
              style={styles.input}
              onPress={() =>
                openDatePicker(
                  "suspected",
                  idx,
                  "dateStopped",
                  med.dateStopped
                )
              }
            >
              <Text style={styles.inputText}>
                {med.dateStopped || "Therapy Stop Date"}
              </Text>
            </TouchableOpacity>

            {renderFieldLabel("Indication")}
            <TextInput
              style={[styles.input, { minHeight: 60 }]}
              placeholder="Indication"
              multiline
              value={med.indication}
              onChangeText={(v) => updateSuspected(idx, "indication", v)}
            />

            <Text style={styles.subHeader}>Action Taken</Text>
            <View style={styles.chipContainer}>
              {ACTION_OPTIONS.map((opt) => (
                <Pressable
                  key={opt}
                  style={[
                    styles.chip,
                    med.actionTaken === opt && styles.chipActive,
                  ]}
                  onPress={() => updateSuspected(idx, "actionTaken", opt)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      med.actionTaken === opt && styles.chipTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.subHeader}>
              Reaction reappeared after reintroduction?
            </Text>
            <View style={styles.chipContainer}>
              {REINTRO_OPTIONS.map((opt) => (
                <Pressable
                  key={opt}
                  style={[
                    styles.chip,
                    med.reintroducedEffect === opt && styles.chipActive,
                  ]}
                  onPress={() =>
                    updateSuspected(idx, "reintroducedEffect", opt)
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      med.reintroducedEffect === opt &&
                        styles.chipTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </View>

            {renderFieldLabel("Dose (if reintroduced)")}
            <TextInput
              style={styles.input}
              placeholder="Dose (if reintroduced)"
              value={med.reintroducedDose}
              onChangeText={(v) =>
                updateSuspected(idx, "reintroducedDose", v)
              }
            />

            {renderFieldLabel("Causality")}
            <TextInput
              style={styles.input}
              placeholder="Causality"
              value={med.causality}
              onChangeText={(v) => updateSuspected(idx, "causality", v)}
            />
          </View>
        ))}

        <Pressable style={styles.addButton} onPress={addMedication}>
          <Text style={styles.addButtonText}>+ Add More Medication</Text>
        </Pressable>

        <Text style={[styles.header, { marginTop: 12 }]}>
          Concomitant medical products (self-medication, herbal remedies)
        </Text>

        {concomitant.map((c, idx) => (
          <View key={`con-${idx}`} style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Concomitant {idx + 1}</Text>
              <Pressable
                style={styles.smallBtn}
                onPress={() => removeConcomitant(idx)}
              >
                <Text style={styles.smallBtnText}>Remove</Text>
              </Pressable>
            </View>

            {renderFieldLabel("Name")}
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={c.name}
              onChangeText={(v) => updateConcomitant(idx, "name", v)}
            />

            {renderFieldLabel("Dose")}
            <TextInput
              style={styles.input}
              placeholder="Dose"
              value={c.dose}
              onChangeText={(v) => updateConcomitant(idx, "dose", v)}
            />

            {renderFieldLabel("Route")}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={c.route}
                onValueChange={(val) => updateConcomitant(idx, "route", val)}
                style={styles.picker}
              >
                <Picker.Item label="Select Route" value="" />
                {ROUTE_OPTIONS.map((r) => (
                  <Picker.Item key={r} label={r} value={r} />
                ))}
              </Picker>
            </View>

            {renderFieldLabel("Frequency")}
            <TextInput
              style={styles.input}
              placeholder="Frequency"
              value={c.frequency}
              onChangeText={(v) => updateConcomitant(idx, "frequency", v)}
            />

            {renderFieldLabel("Therapy Start Date")}
            <TouchableOpacity
              style={styles.input}
              onPress={() =>
                openDatePicker(
                  "concomitant",
                  idx,
                  "dateStarted",
                  c.dateStarted
                )
              }
            >
              <Text style={styles.inputText}>
                {c.dateStarted || "Therapy Start Date"}
              </Text>
            </TouchableOpacity>

            {renderFieldLabel("Therapy Stop Date")}
            <TouchableOpacity
              style={styles.input}
              onPress={() =>
                openDatePicker(
                  "concomitant",
                  idx,
                  "dateStopped",
                  c.dateStopped
                )
              }
            >
              <Text style={styles.inputText}>
                {c.dateStopped || "Therapy Stop Date"}
              </Text>
            </TouchableOpacity>

            {renderFieldLabel("Indication / Reason")}
            <TextInput
              style={styles.input}
              placeholder="Indication / Reason"
              value={c.indication}
              onChangeText={(v) => updateConcomitant(idx, "indication", v)}
            />
          </View>
        ))}

        <Pressable style={styles.addButton} onPress={addConcomitant}>
          <Text style={styles.addButtonText}>
            + Add Concomitant Medication
          </Text>
        </Pressable>

        <View style={styles.navRow}>
          <Pressable
            style={[styles.navButton, { backgroundColor: "#ccc" }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: "#000" }}>Previous</Text>
          </Pressable>

          <Pressable
            style={styles.navButton}
            onPress={() => navigation.navigate("AMCUseOnly")}
          >
            <Text style={{ color: "#fff" }}>Next</Text>
          </Pressable>
        </View>

        {pickerVisible && pickerConfig && (
          <DateTimePicker
            value={pickerConfig.date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
            onChange={onDateChange}
          />
        )}

        <Modal
          visible={!!aiWarning}
          transparent
          animationType="fade"
          onRequestClose={() => setAiWarning(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {aiWarning?.warningTitle || "Mock condition warning"}
              </Text>
              <Text style={styles.modalMessage}>
                {aiWarning?.warningMessage ||
                  "This is only a prototype popup. No real medical advice is provided."}
              </Text>

              <View style={styles.conditionsBox}>
                <Text style={styles.conditionsTitle}>Prototype rules:</Text>
                <Text>- Pregnancy related caution / restriction (demo).</Text>
                <Text>- Age based restriction for children / seniors (demo).</Text>
                <Text>- Renal / liver function caution (demo).</Text>
                <Text>- Allergy or hypersensitivity warning (demo).</Text>
              </View>

              <Pressable
                style={styles.navButton}
                onPress={() => setAiWarning(null)}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  OK, understood
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    backgroundColor: "#B20000",
    color: "#fff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#23264c",
  },
  smallBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginLeft: 8,
  },
  smallBtnText: {
    color: "#23264c",
    fontWeight: "600",
    fontSize: 12,
  },
  fieldHeader: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 4,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#c9c9d9",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  inputText: {
    color: "#333",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#c9c9d9",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: {
    height: 48,
    color: "#000",
  },
  subHeader: {
    fontWeight: "700",
    color: "#23264c",
    marginTop: 10,
    marginBottom: 6,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: "#414071",
    borderColor: "#414071",
  },
  chipText: {
    color: "#23264c",
  },
  chipTextActive: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#414071",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navButton: {
    backgroundColor: "#414071",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  aiDropdown: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    backgroundColor: "#f9fafb",
  },
  aiTitle: {
    fontWeight: "600",
    marginBottom: 4,
    color: "#23264c",
  },
  aiItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  aiText: {
    fontSize: 13,
    color: "#111827",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 12,
    color: "#111827",
  },
  conditionsBox: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  conditionsTitle: {
    fontWeight: "600",
    marginBottom: 4,
    color: "#111827",
  },
});
