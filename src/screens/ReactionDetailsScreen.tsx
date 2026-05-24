import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { useForm } from "../contexts/FormContext";

export default function ReactionDetailsScreen({ navigation }: any) {
  const { form, setForm } = useForm();

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showStopPicker, setShowStopPicker] = useState(false);

  const formatDate = (date: Date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;

  const updateField = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionHeader}>B. Suspected Adverse Reaction</Text>

        <View style={styles.card}>
          <Text style={styles.label}>
            Event / Reaction Start Date (dd/mm/yyyy)
          </Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.inputText}>
              {form.eventStartDate || "Select date"}
            </Text>
          </TouchableOpacity>

          {showStartPicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              onChange={(e, selected) => {
                setShowStartPicker(false);
                if (selected) updateField("eventStartDate", formatDate(selected));
              }}
            />
          )}

          <Text style={styles.label}>
            Event / Reaction Stop Date (dd/mm/yyyy)
          </Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowStopPicker(true)}
          >
            <Text style={styles.inputText}>
              {form.eventStopDate || "Select date"}
            </Text>
          </TouchableOpacity>

          {showStopPicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              onChange={(e, selected) => {
                setShowStopPicker(false);
                if (selected) updateField("eventStopDate", formatDate(selected));
              }}
            />
          )}

          <Text style={styles.label}>
            Describe the Event / Reaction (with management details)
          </Text>
          <TextInput
            style={styles.textArea}
            multiline
            value={form.reactionManagement}
            placeholder="Describe what happened, when, how it was managed, and any clinical findings."
            placeholderTextColor="#9ca0c0"
            onChangeText={(v) => updateField("reactionManagement", v)}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.navRow}>
          <Pressable
            style={[styles.navButton, styles.navButtonSecondary]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.navButtonSecondaryText}>Previous</Text>
          </Pressable>
          <Pressable
            style={styles.navButton}
            onPress={() => navigation.navigate("MedicationDetails")}
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
  input: {
    borderWidth: 1,
    borderColor: "#dde0ec",
    backgroundColor: "#fafbff",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 4,
  },
  inputText: { color: "#23264c", fontSize: 15 },
  textArea: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: "#dde0ec",
    backgroundColor: "#fafbff",
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    color: "#23264c",
  },
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
});
