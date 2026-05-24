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
import { openAdrPdf } from "../utils/openAdrPdf";

export default function PreviewSubmitScreen() {
  const { form } = useForm();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const renderRow = (label, value) => {
    if (value === undefined || value === null || value === "") return null;
    return (
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{String(value)}</Text>
      </View>
    );
  };

  const handleOpenPdf = async () => {
    try {
      setLoading(true);
      await openAdrPdf();
    } catch (err) {
      Alert.alert(
        "Could not open the report",
        err && err.message
          ? err.message
          : "No PDF viewer is installed on this device. Install one and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Preview & Submit</Text>
      <Text style={styles.subheading}>
        Review the entered details below. Tap Open Report to view the PDF —
        you can pick any installed PDF app from the chooser to read or share
        it.
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

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.primaryBtnFull, loading && styles.disabledBtn]}
          onPress={handleOpenPdf}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Open Report</Text>
          )}
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
  buttonRow: {
    marginTop: 8,
  },
  primaryBtnFull: {
    backgroundColor: "#414071",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 28,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  disabledBtn: { opacity: 0.5, backgroundColor: "#9d9eb5" },
});
