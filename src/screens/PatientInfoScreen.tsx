import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
  ScrollView,
} from "react-native";

import { useForm } from "../contexts/FormContext";
import BackgroundWrapper from "../components/BackgroundWrapper.js";

const CASE_TYPES: { label: string; value: "Initial" | "Follow-Up" }[] = [
  { label: "Initial", value: "Initial" },
  { label: "Follow-Up", value: "Follow-Up" },
];

const GENDERS: { label: string; value: "M" | "F" | "Other" }[] = [
  { label: "Male", value: "M" },
  { label: "Female", value: "F" },
  { label: "Other", value: "Other" },
];

export default function PatientInfoScreen({ navigation }: any) {
  const { form, setForm } = useForm();

  const handleNext = () => {
    if (
      !form.patientInitials?.trim() ||
      !form.patientAgeOrDob?.trim() ||
      !form.gender
    ) {
      Alert.alert(
        "Missing information",
        "Please enter patient initials, age (or date of birth) and gender before continuing."
      );
      return;
    }
    navigation.navigate("ReactionDetails");
  };

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionHeader}>A. Patient Information</Text>

        {/* Case type */}
        <View style={styles.card}>
          <Text style={styles.label}>Case Type</Text>
          <View style={styles.pillRow}>
            {CASE_TYPES.map((g) => {
              const selected = form.caseType === g.value;
              return (
                <Pressable
                  key={g.value}
                  style={[styles.pill, selected && styles.pillActive]}
                  onPress={() => setForm((f) => ({ ...f, caseType: g.value }))}
                >
                  <Text
                    style={[
                      styles.pillText,
                      selected && styles.pillTextActive,
                    ]}
                  >
                    {g.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Identifiers */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Patient Initials <Text style={styles.req}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. ML"
            placeholderTextColor="#9ca0c0"
            value={form.patientInitials}
            maxLength={4}
            autoCapitalize="characters"
            onChangeText={(v) =>
              setForm((f) => ({ ...f, patientInitials: v.toUpperCase() }))
            }
          />

          <Text style={styles.label}>
            Age or Date of Birth <Text style={styles.req}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 65 or 12/04/1960"
            placeholderTextColor="#9ca0c0"
            value={form.patientAgeOrDob}
            onChangeText={(v) =>
              setForm((f) => ({ ...f, patientAgeOrDob: v }))
            }
          />

          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 72"
            placeholderTextColor="#9ca0c0"
            value={form.weightKg}
            onChangeText={(v) => setForm((f) => ({ ...f, weightKg: v }))}
            keyboardType="numeric"
          />

          <Text style={styles.label}>
            Gender <Text style={styles.req}>*</Text>
          </Text>
          <View style={styles.pillRow}>
            {GENDERS.map((g) => {
              const selected = form.gender === g.value;
              return (
                <Pressable
                  key={g.value}
                  style={[styles.pill, selected && styles.pillActive]}
                  onPress={() => setForm((f) => ({ ...f, gender: g.value }))}
                >
                  <Text
                    style={[
                      styles.pillText,
                      selected && styles.pillTextActive,
                    ]}
                  >
                    {g.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Reference numbers */}
        <View style={styles.card}>
          <Text style={styles.label}>Reg. No. / IPD / OPD / CR No.</Text>
          <TextInput
            style={styles.input}
            placeholder="Hospital registration number"
            placeholderTextColor="#9ca0c0"
            value={form.regNo}
            onChangeText={(v) => setForm((f) => ({ ...f, regNo: v }))}
          />

          <Text style={styles.label}>AMC Report No.</Text>
          <TextInput
            style={styles.input}
            placeholder="ADR Monitoring Centre report number"
            placeholderTextColor="#9ca0c0"
            value={form.amcReportNo}
            onChangeText={(v) => setForm((f) => ({ ...f, amcReportNo: v }))}
          />

          <Text style={styles.label}>Worldwide Unique No.</Text>
          <TextInput
            style={styles.input}
            placeholder="If applicable"
            placeholderTextColor="#9ca0c0"
            value={form.worldWideUniqueNo}
            onChangeText={(v) =>
              setForm((f) => ({ ...f, worldWideUniqueNo: v }))
            }
          />
        </View>

        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
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
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7f0",
    marginBottom: 14,
  },
  label: {
    marginTop: 8,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2147",
  },
  req: { color: "#c0392b" },
  input: {
    borderWidth: 1,
    borderColor: "#dde0ec",
    backgroundColor: "#fafbff",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    fontSize: 15,
    color: "#23264c",
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#dde0ec",
    backgroundColor: "#fafbff",
    marginRight: 10,
    marginBottom: 8,
  },
  pillActive: {
    backgroundColor: "#414071",
    borderColor: "#414071",
  },
  pillText: { color: "#414071", fontWeight: "600" },
  pillTextActive: { color: "#fff", fontWeight: "700" },
  button: {
    backgroundColor: "#414071",
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
