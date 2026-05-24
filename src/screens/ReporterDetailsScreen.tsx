import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { useForm } from "../contexts/FormContext";

export default function ReporterDetailsScreen({ navigation }: any) {
  const { form, setForm } = useForm();
  const [pickerOpen, setPickerOpen] = useState(false);

  const updateField = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const formatDate = (date: Date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionHeader}>D. Reporter Details</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Name &amp; Address</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Full name, department, hospital, city"
            placeholderTextColor="#9ca0c0"
            multiline
            value={form.reporterNameAddress}
            onChangeText={(v) => updateField("reporterNameAddress", v)}
            textAlignVertical="top"
          />

          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.labelSmall}>Pin</Text>
              <TextInput
                style={styles.input}
                placeholder="Pin code"
                placeholderTextColor="#9ca0c0"
                keyboardType="numeric"
                value={form.reporterPin}
                onChangeText={(v) => updateField("reporterPin", v)}
              />
            </View>
            <View style={[styles.flex, { marginLeft: 10 }]}>
              <Text style={styles.labelSmall}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#9ca0c0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.reporterEmail}
                onChangeText={(v) => updateField("reporterEmail", v)}
              />
            </View>
          </View>

          <Text style={styles.label}>Contact No.</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            placeholderTextColor="#9ca0c0"
            keyboardType="phone-pad"
            value={form.reporterContact}
            onChangeText={(v) => updateField("reporterContact", v)}
          />

          <Text style={styles.label}>Occupation</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Doctor, Pharmacist, Nurse"
            placeholderTextColor="#9ca0c0"
            value={form.reporterOccupation}
            onChangeText={(v) => updateField("reporterOccupation", v)}
          />

          <Text style={styles.label}>Date of this Report (dd/mm/yyyy)</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setPickerOpen(true)}
          >
            <Text
              style={[
                styles.inputText,
                !form.reportDate && styles.placeholder,
              ]}
            >
              {form.reportDate || "Select date"}
            </Text>
          </TouchableOpacity>

          {pickerOpen && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={(e, selected) => {
                setPickerOpen(false);
                if (selected) updateField("reportDate", formatDate(selected));
              }}
            />
          )}
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
            onPress={() => navigation.navigate("PreviewSubmit")}
          >
            <Text style={styles.navButtonText}>Review &amp; Generate</Text>
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
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7f0",
    marginBottom: 16,
  },
  label: { fontWeight: "700", marginBottom: 6, marginTop: 6, color: "#1f2147" },
  labelSmall: {
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 6,
    color: "#1f2147",
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dde0ec",
    backgroundColor: "#fafbff",
    padding: 12,
    borderRadius: 10,
    color: "#23264c",
    fontSize: 15,
  },
  multiline: { minHeight: 70, textAlignVertical: "top" },
  inputText: { color: "#23264c", fontSize: 15 },
  placeholder: { color: "#9ca0c0" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  flex: { flex: 1 },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  navButton: {
    backgroundColor: "#414071",
    paddingVertical: 12,
    paddingHorizontal: 24,
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
