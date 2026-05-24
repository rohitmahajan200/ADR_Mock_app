import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useForm } from "../contexts/FormContext";
import { useNavigation } from "@react-navigation/native";
import FileViewer from "react-native-file-viewer";
import Mailer from "react-native-mail";
import { generateAdrPdf } from "../utils/generateAdrPdf";

export default function PreviewSubmitScreen() {
  const { form } = useForm();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [pdfPath, setPdfPath] = useState(null);
  const [publicPath, setPublicPath] = useState(null);

  const renderRow = (label, value) => {
    if (value === undefined || value === null || value === "") return null;
    return (
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{String(value)}</Text>
      </View>
    );
  };

  const handleGeneratePdf = async () => {
    try {
      setLoading(true);
      const result = await generateAdrPdf(form);
      setPdfPath(result.path);
      setPublicPath(result.publicPath);

      // Open the freshly saved PDF in the device's default viewer.
      try {
        await FileViewer.open(result.path, { showOpenWithDialog: true });
      } catch (viewErr) {
        // If no PDF viewer installed, still tell the user where the file is.
        Alert.alert(
          "PDF saved",
          `Could not auto-open a PDF viewer.\n\nSaved to:\n${result.publicPath}`
        );
      }
    } catch (err) {
      Alert.alert(
        "Could not generate PDF",
        err && err.message ? err.message : "Unknown error."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = () => {
    if (!pdfPath) {
      Alert.alert("Please generate the PDF first.");
      return;
    }
    const initials = form.patientInitials || "ADR";
    const subject = `ADR Report - ${initials}`;
    const body =
      `Please find attached the Suspected Adverse Drug Reaction Reporting Form.\n\n` +
      `Patient: ${initials}\n` +
      `Report date: ${form.reportDate || "(not set)"}\n` +
      `Reporter: ${form.reporterNameAddress || "(not set)"}\n`;

    Mailer.mail(
      {
        subject,
        recipients: [],
        body,
        isHTML: false,
        attachment: {
          path: pdfPath.replace(/^file:\/\//, ""),
          type: "pdf",
          name: `ADR_Report_${initials}.pdf`,
        },
      },
      (err) => {
        if (err) {
          Alert.alert(
            "Email not available",
            "No mail account is configured on this device. The PDF has still been saved to " +
              (publicPath || "your device storage") +
              "."
          );
        }
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Preview & Submit</Text>
      <Text style={styles.subheading}>
        Review the entered details below. Tap Generate PDF to save the form to
        your device and open it for preview.
      </Text>

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
        {renderRow("Age / Date of Birth", form.patientAgeOrDob)}
        {renderRow("Gender", form.gender)}
        {renderRow("Weight (kg)", form.weightKg)}
        {renderRow("Reg. No. / IPD / OPD / CR No.", form.regNo)}
        {renderRow("AMC Report No.", form.amcReportNo)}
        {renderRow("Worldwide Unique No.", form.worldWideUniqueNo)}
      </View>

      {/* REACTION DETAILS */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>B. Suspected Adverse Reaction</Text>
          <Pressable
            style={styles.editBtn}
            onPress={() => navigation.navigate("ReactionDetails")}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>
        </View>

        {renderRow("Event / Reaction Start Date", form.eventStartDate)}
        {renderRow("Event / Reaction Stop Date", form.eventStopDate)}
        {renderRow("Reaction Description", form.reactionManagement)}
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
              {renderRow("Name (Brand / Generic)", name)}
              {renderRow(
                "Manufacturer",
                form[`suspectedMedicationManufacturer${idx}`]
              )}
              {renderRow("Batch / Lot No.", form[`suspectedMedicationBatch${idx}`])}
              {renderRow("Expiry Date", form[`suspectedMedicationExpiry${idx}`])}
              {renderRow("Dose", form[`suspectedMedicationDose${idx}`])}
              {renderRow("Route", form[`suspectedMedicationRoute${idx}`])}
              {renderRow("Frequency", form[`suspectedMedicationFrequency${idx}`])}
              {renderRow(
                "Therapy Start Date",
                form[`suspectedMedicationDateStarted${idx}`]
              )}
              {renderRow(
                "Therapy Stop Date",
                form[`suspectedMedicationDateStopped${idx}`]
              )}
              {renderRow(
                "Indication",
                form[`suspectedMedicationIndication${idx}`]
              )}
              {renderRow(
                "Causality Assessment",
                form[`suspectedMedicationCausality${idx}`]
              )}
              {renderRow("Action Taken", form[`actionTaken${idx}`])}
              {renderRow(
                "Reaction Reappeared after Reintroduction",
                form[`reintroducedEffect${idx}`]
              )}
              {renderRow(
                "Dose if Reintroduced",
                form[`reintroducedDose${idx}`]
              )}
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
              {renderRow("Name (Brand / Generic)", name)}
              {renderRow("Dose", form[`concomitantDose${idx}`])}
              {renderRow("Route", form[`concomitantRoute${idx}`])}
              {renderRow("Frequency", form[`concomitantFrequency${idx}`])}
              {renderRow(
                "Therapy Start Date",
                form[`concomitantDateStarted${idx}`]
              )}
              {renderRow(
                "Therapy Stop Date",
                form[`concomitantDateStopped${idx}`]
              )}
              {renderRow("Indication", form[`concomitantIndication${idx}`])}
            </View>
          );
        })}
      </View>

      {/* AMC / NCC USE ONLY */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>For AMC / NCC Use Only</Text>
          <Pressable
            style={styles.editBtn}
            onPress={() => navigation.navigate("AMCUseOnly")}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>
        </View>

        {renderRow("Relevant Investigations", form.relevantInvestigations)}
        {renderRow("Medical / Medication History", form.medicalHistory)}
        {renderRow(
          "Seriousness",
          Array.isArray(form.seriousness)
            ? form.seriousness.join(", ")
            : form.seriousness
        )}
        {renderRow("Outcome", form.outcome)}
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
        {renderRow("Contact No.", form.reporterContact)}
        {renderRow("Occupation", form.reporterOccupation)}
        {renderRow("Date of Report", form.reportDate)}
      </View>

      {/* ADDITIONAL */}
      {form.additionalInformation ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          {renderRow("Notes", form.additionalInformation)}
        </View>
      ) : null}

      {pdfPath ? (
        <View style={styles.savedBanner}>
          <Text style={styles.savedBannerText}>
            Saved to {publicPath}
          </Text>
        </View>
      ) : null}

      {/* BUTTONS */}
      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.primaryBtn, loading && styles.disabledBtn]}
          onPress={handleGeneratePdf}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Generate PDF</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.primaryBtn, !pdfPath && styles.disabledBtn]}
          disabled={!pdfPath}
          onPress={handleEmail}
        >
          <Text style={styles.primaryBtnText}>Email Report</Text>
        </Pressable>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
    color: "#1f2147",
  },
  subheading: {
    textAlign: "center",
    color: "#5b5e80",
    marginBottom: 16,
    fontSize: 13,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7f0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1f2147" },
  editBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#eef0ff",
    borderRadius: 16,
  },
  editBtnText: { color: "#414071", fontWeight: "600", fontSize: 12 },
  row: { marginBottom: 8 },
  rowLabel: { fontSize: 12, color: "#6b6f8e", marginBottom: 2 },
  rowValue: { fontSize: 14, fontWeight: "600", color: "#23264c" },
  group: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eef0f7",
  },
  medTitle: { fontSize: 14, fontWeight: "700", marginBottom: 6, color: "#414071" },
  savedBanner: {
    backgroundColor: "#e8f5ec",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#bfe0c8",
  },
  savedBannerText: { color: "#15622f", fontSize: 13, fontWeight: "600" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  primaryBtn: {
    backgroundColor: "#414071",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 28,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 6,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  disabledBtn: { opacity: 0.5, backgroundColor: "#9d9eb5" },
});
