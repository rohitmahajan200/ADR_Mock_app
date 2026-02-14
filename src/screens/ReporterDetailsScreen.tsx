// src/screens/ReporterDetailsScreen.tsx
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

  /** Update global state directly */
  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const formatDate = (date: Date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Heading */}
        <Text style={styles.header}>D. REPORTER DETAILS *</Text>

        <View style={styles.card}>

          {/* Name & Address */}
          <Text style={styles.label}>16. Name & Address :</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={form.reporterNameAddress}
            onChangeText={(v) => updateField("reporterNameAddress", v)}
          />

          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Full Address"
            multiline
            value={form.reporterNameAddress}
            onChangeText={(v) => updateField("reporterNameAddress", v)}
          />

          {/* PIN + EMAIL */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelSmall}>Pin :</Text>
              <TextInput
                style={styles.input}
                placeholder="Pin Code"
                keyboardType="numeric"
                value={form.reporterPin}
                onChangeText={(v) => updateField("reporterPin", v)}
              />
            </View>

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.labelSmall}>Email :</Text>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={form.reporterEmail}
                onChangeText={(v) => updateField("reporterEmail", v)}
              />
            </View>
          </View>

          {/* Contact */}
          <Text style={styles.labelSmall}>Contact No. :</Text>
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            keyboardType="phone-pad"
            value={form.reporterContact}
            onChangeText={(v) => updateField("reporterContact", v)}
          />

          {/* Occupation + Signature */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelSmall}>Occupation :</Text>
              <TextInput
                style={styles.input}
                placeholder="Occupation"
                value={form.reporterOccupation}
                onChangeText={(v) => updateField("reporterOccupation", v)}
              />
            </View>

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.labelSmall}>Signature :</Text>
              <TextInput
                style={styles.input}
                placeholder="Signature"
                value={form.signature ?? ""}
                onChangeText={(v) => updateField("signature", v)}
              />
            </View>
          </View>

          {/* Date of Report */}
          <Text style={styles.label}>17. Date of this report (dd/mm/yyyy)</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setPickerOpen(true)}
          >
            <Text style={styles.inputText}>
              {form.reportDate || "Select Date"}
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

        {/* Navigation */}
        <View style={styles.navRow}>
          <Pressable
            style={[styles.navButton, { backgroundColor: "#ccc" }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: "#000" }}>Previous</Text>
          </Pressable>

          <Pressable
            style={styles.navButton}
            onPress={() => navigation.navigate("PreviewSubmit")}
          >
            <Text style={{ color: "#fff" }}>Next</Text>
          </Pressable>
        </View>

      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 60 },
  header: {
    backgroundColor: "#B20000",
    color: "#fff",
    padding: 10,
    borderRadius: 6,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  label: { fontWeight: "700", marginBottom: 4, color: "#23264c" },
  labelSmall: { fontWeight: "600", marginBottom: 3, color: "#23264c" },
  input: {
    borderWidth: 1,
    borderColor: "#c9c9d9",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  inputText: { color: "#333" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  navRow: { flexDirection: "row", justifyContent: "space-between" },
  navButton: {
    backgroundColor: "#414071",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
});
