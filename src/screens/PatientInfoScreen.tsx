import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import Checkbox from "expo-checkbox";

import { useForm } from "../contexts/FormContext";
import BackgroundWrapper from "../components/BackgroundWrapper.js"

export default function PatientInfoScreen({ navigation }: any) {
  const { form, setForm } = useForm();

  const handleNext = () => {
    if (!form.patientInitials?.trim() || !form.patientAgeOrDob?.trim() || !form.gender) {
      Alert.alert("Please fill all required fields.");
      return;
    }
    navigation.navigate("ReactionDetails");
    // navigation.navigate("MedicineScreen");
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>

        {/* Initial Case */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={form.caseType === "Initial"}
            onValueChange={(value) =>
              setForm((f) => ({
                ...f,
                caseType: value ? "Initial" : undefined,
              }))
            }
          />
          <Text style={styles.checkboxLabel}>Initial Case</Text>
        </View>

        {/* Follow-up Case */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={form.caseType === "Follow-up"}
            onValueChange={(value) =>
              setForm((f) => ({
                ...f,
                caseType: value ? "Follow-up" : undefined,
              }))
            }
          />
          <Text style={styles.checkboxLabel}>Follow-up Case</Text>
        </View>

        {/* Patient Initials */}
        <Text style={styles.label}>Patient Name Initials</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter patient initials"
          value={form.patientInitials}
          maxLength={2}
          onChangeText={(v) => setForm((f) => ({ ...f, patientInitials: v }))}
        />

        {/* Age or DOB */}
        <Text style={styles.label}>Age / DOB</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Age or DOB"
          value={form.patientAgeOrDob}
          onChangeText={(v) => setForm((f) => ({ ...f, patientAgeOrDob: v }))}
        />

        {/* Weight */}
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter weight"
          value={form.weightKg}
          onChangeText={(v) => setForm((f) => ({ ...f, weightKg: v }))}
          keyboardType="numeric"
        />

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          {[
            { label: "Male", value: "M" },
            { label: "Female", value: "F" },
            { label: "Other", value: "Other" },
          ].map((g) => (
            <View style={styles.checkboxContainer} key={g.value}>
              <Checkbox
                value={form.gender === g.value}
                onValueChange={() =>
                  setForm((f) => ({ ...f, gender: g.value }))
                }
              />
              <Text style={styles.checkboxLabel}>{g.label}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 24,
    justifyContent: "flex-start",
  },
  label: {
    marginTop: 14,
    marginBottom: 7,
    fontSize: 16,
    fontWeight: "600",
    color: "#414071",
  },
  input: {
    borderWidth: 1,
    borderColor: "#bfc3d8",
    backgroundColor: "#fff",
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 15,
    color: "#23264c",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 15,
    color: "#23264c",
  },
  genderContainer: {
    flexDirection: "column",
    marginTop: 4,
    marginBottom: 18,
  },
  button: {
    backgroundColor: "#414071",
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    elevation: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
