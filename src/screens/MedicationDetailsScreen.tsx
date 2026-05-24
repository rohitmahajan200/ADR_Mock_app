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
import { getMockSideEffects, SideEffect } from "../utils/mockAI";

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
  "Sublingual",
  "Rectal",
  "Other",
];

const CAUSALITY_OPTIONS = [
  "Certain",
  "Probable",
  "Possible",
  "Unlikely",
  "Unclassified",
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
    buildInitialSuspected
  );
  const [concomitant, setConcomitant] = useState<ConcomitantMed[]>(
    buildInitialConcomitant
  );

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

  // Side-effect helper state, per row.
  const [aiResults, setAiResults] = useState<{
    medIdx: number;
    items: SideEffect[];
  } | null>(null);
  const [warning, setWarning] = useState<SideEffect | null>(null);

  const handleAiCheck = (idx: number) => {
    const med = medications[idx];
    if (!med?.name?.trim()) {
      Alert.alert(
        "Enter a medicine name first",
        "Type the medicine name in the Name field, then tap “Check side effects”."
      );
      return;
    }
    const results = getMockSideEffects(med.name);
    if (results.length === 0) {
      Alert.alert(
        "No suggestions found",
        `No reference data is available for “${med.name}”. Try a generic name (e.g. paracetamol, amoxicillin, warfarin).`
      );
      setAiResults(null);
      return;
    }
    setAiResults({ medIdx: idx, items: results });
  };

  const handleSelectSideEffect = (idx: number, eff: SideEffect) => {
    const current = medications[idx];
    const mergedIndication = current.indication
      ? `${current.indication}\n${eff.label}`
      : eff.label;
    updateSuspected(idx, "indication", mergedIndication);
    if (eff.warningTitle || eff.warningMessage) {
      setWarning(eff);
    }
  };

  // Sync suspected medication state into form.
  useEffect(() => {
    setForm((prev: any) => {
      const next = { ...prev };
      for (let i = 1; i <= 4; i++) {
        const med = medications[i - 1] || ({} as SuspectedMed);
        next[`suspectedMedicationName${i}`] = med.name ?? "";
        next[`suspectedMedicationManufacturer${i}`] = med.manufacturer ?? "";
        next[`suspectedMedicationBatch${i}`] = med.batch ?? "";
        next[`suspectedMedicationExpiry${i}`] = med.expiry ?? "";
        next[`suspectedMedicationDose${i}`] = med.dose ?? "";
        next[`suspectedMedicationRoute${i}`] = med.route ?? "";
        next[`suspectedMedicationFrequency${i}`] = med.frequency ?? "";
        next[`suspectedMedicationDateStarted${i}`] = med.dateStarted ?? "";
        next[`suspectedMedicationDateStopped${i}`] = med.dateStopped ?? "";
        next[`suspectedMedicationIndication${i}`] = med.indication ?? "";
        next[`suspectedMedicationCausality${i}`] = med.causality ?? "";
        next[`actionTaken${i}`] = med.actionTaken ?? "";
        next[`reintroducedEffect${i}`] = med.reintroducedEffect ?? "";
        next[`reintroducedDose${i}`] = med.reintroducedDose ?? "";
      }
      return next;
    });
  }, [medications, setForm]);

  // Sync concomitant state into form.
  useEffect(() => {
    setForm((prev: any) => {
      const next = { ...prev };
      for (let i = 1; i <= 4; i++) {
        const c = concomitant[i - 1] || ({} as ConcomitantMed);
        next[`concomitantName${i}`] = c.name ?? "";
        next[`concomitantDose${i}`] = c.dose ?? "";
        next[`concomitantRoute${i}`] = c.route ?? "";
        next[`concomitantFrequency${i}`] = c.frequency ?? "";
        next[`concomitantDateStarted${i}`] = c.dateStarted ?? "";
        next[`concomitantDateStopped${i}`] = c.dateStopped ?? "";
        next[`concomitantIndication${i}`] = c.indication ?? "";
      }
      return next;
    });
  }, [concomitant, setForm]);

  const updateSuspected = (
    index: number,
    key: keyof SuspectedMed,
    value: any
  ) => {
    setMedications((prev) => {
      const copy = [...prev];
      copy[index] = { ...(copy[index] || {}), [key]: value };
      return copy;
    });
  };

  const updateConcomitant = (
    index: number,
    key: keyof ConcomitantMed,
    value: any
  ) => {
    setConcomitant((prev) => {
      const copy = [...prev];
      copy[index] = { ...(copy[index] || {}), [key]: value };
      return copy;
    });
  };

  const addMedication = () => {
    if (medications.length >= 4) {
      Alert.alert(
        "Limit reached",
        "The form supports up to 4 suspected medications. Use the Additional Information section for more."
      );
      return;
    }
    setMedications((prev) => [...prev, {} as SuspectedMed]);
  };

  const removeMedication = (index: number) => {
    if (medications.length === 1) {
      Alert.alert("At least one medication row is required.");
      return;
    }
    setMedications((prev) => prev.filter((_, i) => i !== index));
  };

  const addConcomitant = () => {
    if (concomitant.length >= 4) {
      Alert.alert(
        "Limit reached",
        "The form supports up to 4 concomitant medications."
      );
      return;
    }
    setConcomitant((prev) => [...prev, {} as ConcomitantMed]);
  };

  const removeConcomitant = (index: number) => {
    if (concomitant.length === 1) {
      Alert.alert("At least one concomitant row is required.");
      return;
    }
    setConcomitant((prev) => prev.filter((_, i) => i !== index));
  };

  const onDateChange = (event: any, selected?: Date) => {
    if (Platform.OS === "android") setPickerVisible(false);
    if (!pickerConfig) return;
    if (event?.type === "dismissed") return;

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
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) baseDate = new Date(y, m, d);
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
        <Text style={styles.sectionHeader}>C. Suspected Medications</Text>

        {medications.map((med, idx) => (
          <View key={`med-${idx}`} style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Medication {idx + 1}</Text>
              {medications.length > 1 && (
                <Pressable
                  style={styles.removeBtn}
                  onPress={() => removeMedication(idx)}
                >
                  <Text style={styles.removeBtnText}>Remove</Text>
                </Pressable>
              )}
            </View>

            {renderFieldLabel("Name (Brand / Generic)")}
            <TextInput
              style={styles.input}
              placeholder="e.g. Paracetamol"
              placeholderTextColor="#9ca0c0"
              value={med.name}
              onChangeText={(v) => updateSuspected(idx, "name", v)}
            />

            <Pressable
              style={styles.helperBtn}
              onPress={() => handleAiCheck(idx)}
            >
              <Text style={styles.helperBtnText}>
                Check known side effects
              </Text>
            </Pressable>

            {aiResults && aiResults.medIdx === idx && (
              <View style={styles.aiDropdown}>
                <Text style={styles.aiTitle}>
                  Reference side effects for “{med.name}”
                </Text>
                <Text style={styles.aiHint}>
                  Tap an item to add it to the Indication field.
                </Text>
                {aiResults.items.map((eff) => (
                  <Pressable
                    key={eff.id}
                    style={styles.aiItem}
                    onPress={() => handleSelectSideEffect(idx, eff)}
                  >
                    <Text style={styles.aiText}>• {eff.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {renderFieldLabel("Manufacturer (if known)")}
            <TextInput
              style={styles.input}
              placeholder="Manufacturer"
              placeholderTextColor="#9ca0c0"
              value={med.manufacturer}
              onChangeText={(v) => updateSuspected(idx, "manufacturer", v)}
            />

            {renderFieldLabel("Batch / Lot No.")}
            <TextInput
              style={styles.input}
              placeholder="Batch / Lot number"
              placeholderTextColor="#9ca0c0"
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
              <Text style={[styles.inputText, !med.expiry && styles.placeholder]}>
                {med.expiry || "Select expiry date"}
              </Text>
            </TouchableOpacity>

            {renderFieldLabel("Dose")}
            <TextInput
              style={styles.input}
              placeholder="e.g. 500 mg"
              placeholderTextColor="#9ca0c0"
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
                <Picker.Item label="Select route" value="" />
                {ROUTE_OPTIONS.map((r) => (
                  <Picker.Item key={r} label={r} value={r} />
                ))}
              </Picker>
            </View>

            {renderFieldLabel("Frequency")}
            <TextInput
              style={styles.input}
              placeholder="e.g. OD, BD, TDS"
              placeholderTextColor="#9ca0c0"
              value={med.frequency}
              onChangeText={(v) => updateSuspected(idx, "frequency", v)}
            />

            {renderFieldLabel("Therapy Start Date")}
            <TouchableOpacity
              style={styles.input}
              onPress={() =>
                openDatePicker("suspected", idx, "dateStarted", med.dateStarted)
              }
            >
              <Text
                style={[
                  styles.inputText,
                  !med.dateStarted && styles.placeholder,
                ]}
              >
                {med.dateStarted || "Select start date"}
              </Text>
            </TouchableOpacity>

            {renderFieldLabel("Therapy Stop Date")}
            <TouchableOpacity
              style={styles.input}
              onPress={() =>
                openDatePicker("suspected", idx, "dateStopped", med.dateStopped)
              }
            >
              <Text
                style={[
                  styles.inputText,
                  !med.dateStopped && styles.placeholder,
                ]}
              >
                {med.dateStopped || "Select stop date"}
              </Text>
            </TouchableOpacity>

            {renderFieldLabel("Indication")}
            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder="Why this medicine was prescribed"
              placeholderTextColor="#9ca0c0"
              multiline
              value={med.indication}
              onChangeText={(v) => updateSuspected(idx, "indication", v)}
            />

            <Text style={styles.subHeader}>Action Taken after Reaction</Text>
            <View style={styles.chipContainer}>
              {ACTION_OPTIONS.map((opt) => {
                const active = med.actionTaken === opt;
                return (
                  <Pressable
                    key={opt}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => updateSuspected(idx, "actionTaken", opt)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        active && styles.chipTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.subHeader}>
              Reaction Reappeared after Reintroduction?
            </Text>
            <View style={styles.chipContainer}>
              {REINTRO_OPTIONS.map((opt) => {
                const active = med.reintroducedEffect === opt;
                return (
                  <Pressable
                    key={opt}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() =>
                      updateSuspected(idx, "reintroducedEffect", opt)
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        active && styles.chipTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {renderFieldLabel("Dose if Reintroduced")}
            <TextInput
              style={styles.input}
              placeholder="Dose used at reintroduction"
              placeholderTextColor="#9ca0c0"
              value={med.reintroducedDose}
              onChangeText={(v) => updateSuspected(idx, "reintroducedDose", v)}
            />

            {renderFieldLabel("Causality Assessment")}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={med.causality}
                onValueChange={(val) => updateSuspected(idx, "causality", val)}
                style={styles.picker}
              >
                <Picker.Item label="Select causality" value="" />
                {CAUSALITY_OPTIONS.map((c) => (
                  <Picker.Item key={c} label={c} value={c} />
                ))}
              </Picker>
            </View>
          </View>
        ))}

        <Pressable style={styles.addButton} onPress={addMedication}>
          <Text style={styles.addButtonText}>+ Add Another Medication</Text>
        </Pressable>

        <Text style={[styles.sectionHeader, { marginTop: 8 }]}>
          Concomitant Medical Products
        </Text>
        <Text style={styles.subnote}>
          Self-medication, herbal remedies and recently stopped medications.
          Exclude any drugs used to treat the reaction.
        </Text>

        {concomitant.map((c, idx) => (
          <View key={`con-${idx}`} style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Concomitant {idx + 1}</Text>
              {concomitant.length > 1 && (
                <Pressable
                  style={styles.removeBtn}
                  onPress={() => removeConcomitant(idx)}
                >
                  <Text style={styles.removeBtnText}>Remove</Text>
                </Pressable>
              )}
            </View>

            {renderFieldLabel("Name (Brand / Generic)")}
            <TextInput
              style={styles.input}
              placeholder="e.g. Diclofenac"
              placeholderTextColor="#9ca0c0"
              value={c.name}
              onChangeText={(v) => updateConcomitant(idx, "name", v)}
            />

            {renderFieldLabel("Dose")}
            <TextInput
              style={styles.input}
              placeholder="e.g. 50 mg"
              placeholderTextColor="#9ca0c0"
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
                <Picker.Item label="Select route" value="" />
                {ROUTE_OPTIONS.map((r) => (
                  <Picker.Item key={r} label={r} value={r} />
                ))}
              </Picker>
            </View>

            {renderFieldLabel("Frequency (OD, BD, etc.)")}
            <TextInput
              style={styles.input}
              placeholder="Frequency"
              placeholderTextColor="#9ca0c0"
              value={c.frequency}
              onChangeText={(v) => updateConcomitant(idx, "frequency", v)}
            />

            {renderFieldLabel("Therapy Start Date")}
            <TouchableOpacity
              style={styles.input}
              onPress={() =>
                openDatePicker("concomitant", idx, "dateStarted", c.dateStarted)
              }
            >
              <Text
                style={[styles.inputText, !c.dateStarted && styles.placeholder]}
              >
                {c.dateStarted || "Select start date"}
              </Text>
            </TouchableOpacity>

            {renderFieldLabel("Therapy Stop Date")}
            <TouchableOpacity
              style={styles.input}
              onPress={() =>
                openDatePicker("concomitant", idx, "dateStopped", c.dateStopped)
              }
            >
              <Text
                style={[styles.inputText, !c.dateStopped && styles.placeholder]}
              >
                {c.dateStopped || "Select stop date"}
              </Text>
            </TouchableOpacity>

            {renderFieldLabel("Indication / Reason")}
            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder="Why this medicine was being taken"
              placeholderTextColor="#9ca0c0"
              multiline
              value={c.indication}
              onChangeText={(v) => updateConcomitant(idx, "indication", v)}
            />
          </View>
        ))}

        <Pressable style={styles.addButton} onPress={addConcomitant}>
          <Text style={styles.addButtonText}>+ Add Concomitant Medication</Text>
        </Pressable>

        <View style={styles.navRow}>
          <Pressable
            style={[styles.navButton, styles.navButtonSecondary]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.navButtonSecondaryText}>Previous</Text>
          </Pressable>
          <Pressable
            style={styles.navButton}
            onPress={() => navigation.navigate("AMCUseOnly")}
          >
            <Text style={styles.navButtonText}>Next</Text>
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
          visible={!!warning}
          transparent
          animationType="fade"
          onRequestClose={() => setWarning(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {warning?.warningTitle || "Clinical note"}
              </Text>
              <Text style={styles.modalMessage}>
                {warning?.warningMessage ||
                  "Reference information only. Always consult current prescribing guidelines."}
              </Text>

              <Pressable
                style={styles.modalBtn}
                onPress={() => setWarning(null)}
              >
                <Text style={styles.modalBtnText}>Got it</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 60 },
  sectionHeader: {
    backgroundColor: "#414071",
    color: "#fff",
    padding: 12,
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subnote: {
    color: "#5b5e80",
    fontSize: 12,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7f0",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1f2147" },
  removeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fdecec",
    borderRadius: 16,
  },
  removeBtnText: { color: "#a73e3e", fontWeight: "600", fontSize: 12 },
  fieldHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1f2147",
    marginBottom: 4,
    marginTop: 8,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dde0ec",
    backgroundColor: "#fafbff",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    color: "#23264c",
    fontSize: 15,
  },
  multiline: { minHeight: 64, textAlignVertical: "top" },
  inputText: { color: "#23264c", fontSize: 15 },
  placeholder: { color: "#9ca0c0" },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#dde0ec",
    backgroundColor: "#fafbff",
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: { height: 48, color: "#23264c" },
  helperBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#eef0ff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginTop: 8,
  },
  helperBtnText: { color: "#414071", fontWeight: "600", fontSize: 13 },
  aiDropdown: {
    marginTop: 10,
    backgroundColor: "#f5f7ff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#dee3ff",
  },
  aiTitle: { fontWeight: "700", color: "#1f2147", marginBottom: 2 },
  aiHint: { color: "#6b6f8e", fontSize: 11, marginBottom: 6 },
  aiItem: { paddingVertical: 6 },
  aiText: { fontSize: 13, color: "#1f2147" },
  subHeader: {
    fontWeight: "700",
    color: "#1f2147",
    marginTop: 12,
    marginBottom: 6,
  },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 6 },
  chip: {
    borderWidth: 1,
    borderColor: "#dde0ec",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fafbff",
  },
  chipActive: { backgroundColor: "#414071", borderColor: "#414071" },
  chipText: { color: "#414071", fontWeight: "600", fontSize: 13 },
  chipTextActive: { color: "#fff" },
  addButton: {
    backgroundColor: "#eef0ff",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#dde0ec",
  },
  addButtonText: { color: "#414071", fontWeight: "700" },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  navButton: {
    backgroundColor: "#414071",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 26,
    flex: 1,
    marginHorizontal: 6,
    alignItems: "center",
  },
  navButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  navButtonSecondary: { backgroundColor: "#eef0ff" },
  navButtonSecondaryText: {
    color: "#414071",
    fontWeight: "700",
    fontSize: 15,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2147",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#23264c",
    marginBottom: 14,
    lineHeight: 20,
  },
  modalBtn: {
    backgroundColor: "#414071",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "700" },
});
