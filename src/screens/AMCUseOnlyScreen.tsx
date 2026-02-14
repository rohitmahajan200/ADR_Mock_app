import React from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from "react-native";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { useForm } from "../contexts/FormContext";

export default function AMCUseOnlyScreen({ navigation }: any) {
  const { form, setForm } = useForm();

  const updateField = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const seriousnessList = [
    "Death",
    "Life threatening",
    "Hospitalization-Initial/Prolonged",
    "Congenital-anomaly",
    "Disability",
    "Other Medically important",
  ];

  const outcomeList = [
    "Recovered",
    "Recovering",
    "Not Recovered",
    "Fatal",
    "Recovered with sequelae",
    "Unknown",
  ];

  return (
    <BackgroundWrapper>
      <ScrollView style={{ padding: 16 }}>

        {/* --- SECTION HEADER --- */}
        <Text style={styles.sectionHeader}>FOR AMC / NCC USE ONLY</Text>

        {/* --- 12. Relevant investigations --- */}
        <View style={styles.block}>
          <Text style={styles.label}>12. Relevant investigations with dates :</Text>
          <TextInput
            style={styles.textArea}
            multiline
            value={form.investigations || ""}
            onChangeText={(t) => updateField("investigations", t)}
            placeholder="Enter investigations and dates"
          />
        </View>

        {/* --- 13. Medication history --- */}
        <View style={styles.block}>
          <Text style={styles.label}>
            13. Relevant medical / medication history (e.g. allergies, pregnancy, addiction, hepatic, renal dysfunction etc.)
          </Text>
          <TextInput
            style={styles.textArea}
            multiline
            value={form.medicalHistory || ""}
            onChangeText={(t) => updateField("medicalHistory", t)}
            placeholder="Enter medical/medication history"
          />
        </View>

        {/* --- 14. Seriousness --- */}
        <View style={styles.block}>
          <Text style={styles.label}>14. Seriousness of the reaction : </Text>

          <View style={{ marginBottom: 10 }}>
            <View style={styles.row}>
              <Text style={styles.smallLabel}>No</Text>
              <Pressable
                style={[
                  styles.checkBox,
                  form.seriousnessNo === true && styles.checkBoxActive,
                ]}
                onPress={() => updateField("seriousnessNo", !form.seriousnessNo)}
              />
              <Text style={[styles.smallLabel, { marginLeft: 20 }]}>Yes (please tick anyone)</Text>
            </View>
          </View>

          {seriousnessList.map((item) => (
            <View style={styles.row} key={item}>
              <Pressable
                style={[
                  styles.checkBox,
                  form.seriousness?.includes(item) && styles.checkBoxActive,
                ]}
                onPress={() => {
                  let list = form.seriousness || [];
                  if (list.includes(item)) {
                    list = list.filter((v: any) => v !== item);
                  } else {
                    list.push(item);
                  }
                  updateField("seriousness", list);
                }}
              />
              <Text style={styles.smallLabel}>{item}</Text>
            </View>
          ))}
        </View>

        {/* --- 15. Outcome --- */}
        <View style={styles.block}>
          <Text style={styles.label}>15. Outcome :</Text>

          {outcomeList.map((item) => (
            <View style={styles.row} key={item}>
              <Pressable
                style={[
                  styles.checkBox,
                  form.outcome === item && styles.checkBoxActive,
                ]}
                onPress={() => updateField("outcome", item)}
              />
              <Text style={styles.smallLabel}>{item}</Text>
            </View>
          ))}
        </View>

        {/* --- NAV BUTTONS --- */}
        <View style={styles.navRow}>
          <Pressable
            style={[styles.navButton, { backgroundColor: "#ccc" }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: "#000" }}>Previous</Text>
          </Pressable>

          <Pressable
            style={styles.navButton}
            onPress={() => navigation.navigate("ReporterDetails")}
          >
            <Text style={{ color: "#fff" }}>Next</Text>
          </Pressable>
        </View>
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: "#660000",
    color: "#fff",
    padding: 10,
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 14,
  },
  block: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    marginBottom: 16,
  },
  label: {
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
    padding: 10,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  smallLabel: {
    fontSize: 14,
    color: "#000",
    marginLeft: 8,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  checkBoxActive: {
    backgroundColor: "#23264c",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
  },
  navButton: {
    backgroundColor: "#414071",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
});
