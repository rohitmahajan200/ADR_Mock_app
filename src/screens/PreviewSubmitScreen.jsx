import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useForm } from "../contexts/FormContext";
import { useNavigation } from "@react-navigation/native";

import RNFS from "react-native-fs";
import Mailer from "react-native-mail";
import { Buffer } from "buffer";

export default function PreviewSubmitScreen() {
  const { form } = useForm();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);

  const serverUrl = "http://localhost:4000/fill-form";

  const renderRow = (label, value) => {
    if (!value) return null;
    return (
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{String(value)}</Text>
      </View>
    );
  };

  // -----------------------------
  // Generate PDF + Save Locally
  // -----------------------------
  const generatePdf = async () => {
    try {
      setLoading(true);

      const res = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      const arrayBuffer = await res.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      const filePath =
        RNFS.DocumentDirectoryPath +
        `/adverse-event-report-${Date.now()}.pdf`;

      await RNFS.writeFile(filePath, base64, "base64");

      const fileUri = `file://${filePath}`;
      setPdfUri(fileUri);

      Alert.alert("Success", "PDF saved to device.");
    } catch (err) {
      console.log("PDF Error:", err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Send Email With PDF
  // -----------------------------
  const openMailWithAttachment = () => {
    if (!pdfUri) {
      Alert.alert("First generate PDF");
      return;
    }

    Mailer.mail(
      {
        subject: "Testing Process",
        recipients: ["mrdevrm@gmail.com"],
        body: "Testing the mail body",
        isHTML: false,
        attachment: {
          path: pdfUri.replace("file://", ""),
          type: "pdf",
          name: "report.pdf",
        },
      },
      (err, event) => {
        if (err) Alert.alert("Email Error", err);
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Preview & Submit</Text>

      {/* CASE TYPE */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Case Type</Text>
          <Pressable
            style={styles.editBtn}
            onPress={() => navigation.navigate("PatientInfo")}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>
        </View>
        {renderRow("Case Type", form.caseType)}
      </View>

      {/* PATIENT INFORMATION */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>A. Patient Information</Text>
          <Pressable
            style={styles.editBtn}
            onPress={() => navigation.navigate("PatientInfo")}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>
        </View>

        {renderRow("Patient Initials", form.patientInitials)}
        {renderRow("Age / DOB", form.patientAgeOrDob)}
        {renderRow("Gender", form.gender)}
        {renderRow("Weight (kg)", form.weightKg)}
        {renderRow("Reg. No.", form.regNo)}
        {renderRow("AMC Report No.", form.amcReportNo)}
        {renderRow("WW Unique No.", form.worldWideUniqueNo)}
      </View>

      {/* REACTION DETAILS */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>B. Adverse Reaction</Text>
          <Pressable
            style={styles.editBtn}
            onPress={() => navigation.navigate("ReactionDetails")}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>
        </View>

        {renderRow("Event Start Date", form.eventStartDate)}
        {renderRow("Event Stop Date", form.eventStopDate)}
        {renderRow("Reaction Management", form.reactionManagement)}
        {renderRow("Relevant Investigations", form.relevantInvestigations)}
        {renderRow("Medical History", form.medicalHistory)}
        {renderRow("Seriousness", form.seriousness)}
        {renderRow("Outcome", form.outcome)}
      </View>

      {/* SUSPECTED MEDICATIONS */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>C. Suspected Medications</Text>
          <Pressable
            style={styles.editBtn}
            onPress={() => navigation.navigate("MedicationDetails")}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>
        </View>

        {Array.from({ length: 4 }).map((_, i) => {
          const idx = i + 1;
          const name = form[`suspectedMedicationName${idx}`];
          if (!name) return null;

          return (
            <View key={idx} style={styles.group}>
              <Text style={styles.medTitle}>Medication {idx}</Text>
              {renderRow("Name", name)}
              {renderRow("Manufacturer", form[`suspectedMedicationManufacturer${idx}`])}
              {renderRow("Batch", form[`suspectedMedicationBatch${idx}`])}
              {renderRow("Dose", form[`suspectedMedicationDose${idx}`])}
              {renderRow("Route", form[`suspectedMedicationRoute${idx}`])}
              {renderRow("Frequency", form[`suspectedMedicationFrequency${idx}`])}
              {renderRow("Start Date", form[`suspectedMedicationDateStarted${idx}`])}
              {renderRow("Stop Date", form[`suspectedMedicationDateStopped${idx}`])}
            </View>
          );
        })}
      </View>

      {/* CONCOMITANT */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Concomitant Medical Products</Text>
          <Pressable
            style={styles.editBtn}
            onPress={() => navigation.navigate("MedicationDetails")}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>
        </View>

        {Array.from({ length: 4 }).map((_, i) => {
          const idx = i + 1;
          const name = form[`concomitantName${idx}`];
          if (!name) return null;

          return (
            <View key={idx} style={styles.group}>
              <Text style={styles.medTitle}>Concomitant {idx}</Text>
              {renderRow("Name", name)}
              {renderRow("Dose", form[`concomitantDose${idx}`])}
              {renderRow("Route", form[`concomitantRoute${idx}`])}
              {renderRow("Frequency", form[`concomitantFrequency${idx}`])}
              {renderRow("Start Date", form[`concomitantDateStarted${idx}`])}
              {renderRow("Stop Date", form[`concomitantDateStopped${idx}`])}
            </View>
          );
        })}
      </View>

      {/* REPORTER */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>D. Reporter Details</Text>
          <Pressable
            style={styles.editBtn}
            onPress={() => navigation.navigate("ReporterDetails")}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>
        </View>

        {renderRow("Name & Address", form.reporterNameAddress)}
        {renderRow("Pin", form.reporterPin)}
        {renderRow("Email", form.reporterEmail)}
        {renderRow("Contact", form.reporterContact)}
        {renderRow("Occupation", form.reporterOccupation)}
        {renderRow("Report Date", form.reportDate)}
      </View>

      {/* BUTTONS */}
      <View style={styles.buttonRow}>
        <Pressable
          style={styles.primaryBtn}
          onPress={generatePdf}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Generate PDF</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.primaryBtn, !pdfUri && styles.disabledBtn]}
          disabled={!pdfUri}
          onPress={openMailWithAttachment}
        >
          <Text style={styles.primaryBtnText}>Report (Email)</Text>
        </Pressable>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f2f2f7" },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#23264c" },
  editBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#efefef",
    borderRadius: 8,
  },
  editBtnText: { color: "#23264c", fontWeight: "600" },
  row: { marginBottom: 8 },
  rowLabel: { fontSize: 13, color: "#6b6b7a" },
  rowValue: { fontSize: 15, fontWeight: "600", color: "#222" },
  group: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  medTitle: { fontSize: 15, fontWeight: "700", marginBottom: 8 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  primaryBtn: {
    backgroundColor: "#414071",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 6,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  disabledBtn: { opacity: 0.6, backgroundColor: "#7a7a8c" },
});
