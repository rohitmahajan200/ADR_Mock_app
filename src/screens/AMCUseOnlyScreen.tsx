import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { useForm } from "../contexts/FormContext";

const SERIOUSNESS_OPTIONS = [
  "Death",
  "Life threatening",
  "Hospitalization (Initial / Prolonged)",
  "Congenital anomaly",
  "Disability",
  "Other Medically important",
];

const OUTCOME_OPTIONS = [
  "Recovered",
  "Recovering",
  "Not Recovered",
  "Fatal",
  "Recovered with sequelae",
  "Unknown",
];

export default function AMCUseOnlyScreen({ navigation }: any) {
  const { form, setForm } = useForm();

  const updateField = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const toggleSeriousness = (item: string) => {
    const list: string[] = Array.isArray(form.seriousness)
      ? [...form.seriousness]
      : [];
    const i = list.indexOf(item);
    if (i >= 0) list.splice(i, 1);
    else list.push(item);
    updateField("seriousness", list);
    // If a serious condition is selected, ensure "No" is cleared.
    if (list.length > 0) updateField("seriousnessNo", false);
  };

  const seriousnessSet: string[] = Array.isArray(form.seriousness)
    ? form.seriousness
    : [];

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionHeader}>For AMC / NCC Use Only</Text>

        {/* 12. Relevant investigations */}
        <View style={styles.block}>
          <Text style={styles.label}>
            12. Relevant investigations with dates
          </Text>
          <TextInput
            style={styles.textArea}
            multiline
            value={form.relevantInvestigations || ""}
            onChangeText={(t) => updateField("relevantInvestigations", t)}
            placeholder="e.g. 12.01.2016: Alkaline Phosphatase = 180 U/L, ALT = 205 U/L"
            placeholderTextColor="#9ca0c0"
            textAlignVertical="top"
          />
        </View>

        {/* 13. Medication history */}
        <View style={styles.block}>
          <Text style={styles.label}>
            13. Relevant medical / medication history
          </Text>
          <Text style={styles.hint}>
            e.g. allergies, pregnancy, addiction, hepatic / renal dysfunction
          </Text>
          <TextInput
            style={styles.textArea}
            multiline
            value={form.medicalHistory || ""}
            onChangeText={(t) => updateField("medicalHistory", t)}
            placeholder="Enter medical / medication history"
            placeholderTextColor="#9ca0c0"
            textAlignVertical="top"
          />
        </View>

        {/* 14. Seriousness */}
        <View style={styles.block}>
          <Text style={styles.label}>14. Seriousness of the reaction</Text>

          <Pressable
            style={styles.row}
            onPress={() => {
              const next = !form.seriousnessNo;
              updateField("seriousnessNo", next);
              if (next) updateField("seriousness", []);
            }}
          >
            <View
              style={[
                styles.checkBox,
                form.seriousnessNo === true && styles.checkBoxActive,
              ]}
            />
            <Text style={styles.smallLabel}>No</Text>
            <Text style={[styles.smallLabel, styles.muted]}>
              {"   "}or tick any that apply:
            </Text>
          </Pressable>

          {SERIOUSNESS_OPTIONS.map((item) => (
            <Pressable
              style={styles.row}
              key={item}
              onPress={() => toggleSeriousness(item)}
            >
              <View
                style={[
                  styles.checkBox,
                  seriousnessSet.includes(item) && styles.checkBoxActive,
                ]}
              />
              <Text style={styles.smallLabel}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {/* 15. Outcome */}
        <View style={styles.block}>
          <Text style={styles.label}>15. Outcome</Text>

          {OUTCOME_OPTIONS.map((item) => (
            <Pressable
              style={styles.row}
              key={item}
              onPress={() => updateField("outcome", item)}
            >
              <View
                style={[
                  styles.checkBox,
                  styles.radio,
                  form.outcome === item && styles.checkBoxActive,
                ]}
              />
              <Text style={styles.smallLabel}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {/* Additional Information */}
        <View style={styles.block}>
          <Text style={styles.label}>Additional Information</Text>
          <TextInput
            style={styles.textArea}
            multiline
            value={form.additionalInformation || ""}
            onChangeText={(t) => updateField("additionalInformation", t)}
            placeholder="Any other relevant details"
            placeholderTextColor="#9ca0c0"
            textAlignVertical="top"
          />
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          <Pressable
            style={[styles.navButton, styles.navButtonSecondary]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.navButtonSecondaryText}>Previous</Text>
          </Pressable>

          <Pressable
            style={styles.navButton}
            onPress={() => navigation.navigate("ReporterDetails")}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </Pressable>
        </View>
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  sectionHeader: {
    backgroundColor: "#414071",
    color: "#fff",
    padding: 12,
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  block: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7f0",
    marginBottom: 14,
  },
  label: {
    fontWeight: "700",
    color: "#1f2147",
    marginBottom: 6,
    fontSize: 15,
  },
  hint: { color: "#6b6f8e", fontSize: 12, marginBottom: 6 },
  textArea: {
    minHeight: 92,
    borderWidth: 1,
    borderColor: "#dde0ec",
    borderRadius: 10,
    backgroundColor: "#fafbff",
    padding: 12,
    color: "#1f2147",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  smallLabel: {
    fontSize: 14,
    color: "#1f2147",
    marginLeft: 10,
  },
  muted: { color: "#6b6f8e", marginLeft: 4 },
  checkBox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: "#9da1bf",
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  radio: { borderRadius: 11 },
  checkBoxActive: {
    backgroundColor: "#414071",
    borderColor: "#414071",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
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
  navButtonSecondary: {
    backgroundColor: "#eef0ff",
  },
  navButtonSecondaryText: {
    color: "#414071",
    fontWeight: "700",
    fontSize: 15,
  },
});
