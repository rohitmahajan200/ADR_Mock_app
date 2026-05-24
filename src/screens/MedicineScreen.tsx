import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";
import BackgroundWrapper from "../components/BackgroundWrapper";
import {
  getMockSideEffects,
  SideEffect,
  KNOWN_MEDICINES,
} from "../utils/mockAI";

const MedicineScreen: React.FC = () => {
  const [medicine, setMedicine] = useState("");
  const [results, setResults] = useState<SideEffect[]>([]);
  const [selected, setSelected] = useState<SideEffect | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const suggestions = useMemo(() => {
    const q = medicine.trim().toLowerCase();
    if (!q) return [];
    return KNOWN_MEDICINES.filter((m) => m.startsWith(q)).slice(0, 6);
  }, [medicine]);

  const lookup = (name?: string) => {
    const target = (name ?? medicine).trim();
    if (!target) return;
    if (name) setMedicine(name);
    const items = getMockSideEffects(target);
    setResults(items);
  };

  const handleSelectSideEffect = (item: SideEffect) => {
    setSelected(item);
    if (item.warningTitle || item.warningMessage) setShowWarning(true);
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <Text style={styles.heading}>Medicine Reference</Text>
        <Text style={styles.subheading}>
          Look up known side effects and conditions for a medicine.
        </Text>

        <Text style={styles.label}>Medicine name</Text>
        <TextInput
          style={styles.input}
          value={medicine}
          onChangeText={setMedicine}
          placeholder="e.g. paracetamol, warfarin, amoxicillin"
          placeholderTextColor="#9ca0c0"
          onSubmitEditing={() => lookup()}
          autoCapitalize="none"
        />

        {suggestions.length > 0 && (
          <View style={styles.suggestionsBox}>
            {suggestions.map((s) => (
              <Pressable
                key={s}
                style={styles.suggestion}
                onPress={() => lookup(s)}
              >
                <Text style={styles.suggestionText}>{s}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable style={styles.button} onPress={() => lookup()}>
          <Text style={styles.buttonText}>Check side effects</Text>
        </Pressable>

        {results.length > 0 ? (
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>Reference side effects</Text>
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.dropdownItem}
                  onPress={() => handleSelectSideEffect(item)}
                >
                  <Text style={styles.dropdownText}>• {item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        ) : medicine ? (
          <Text style={styles.empty}>
            No reference data for “{medicine}”. Try one of:{" "}
            {KNOWN_MEDICINES.slice(0, 6).join(", ")}…
          </Text>
        ) : null}

        <Modal
          visible={showWarning}
          transparent
          animationType="fade"
          onRequestClose={() => setShowWarning(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selected?.warningTitle ?? "Clinical note"}
              </Text>
              <Text style={styles.modalMessage}>
                {selected?.warningMessage ??
                  "Reference information only. Always consult current prescribing guidelines."}
              </Text>
              <Pressable
                style={styles.modalBtn}
                onPress={() => setShowWarning(false)}
              >
                <Text style={styles.modalBtnText}>Got it</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </BackgroundWrapper>
  );
};

export default MedicineScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1f2147",
    textAlign: "center",
    marginBottom: 4,
  },
  subheading: {
    color: "#5b5e80",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 13,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2147",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dde0ec",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    fontSize: 15,
    color: "#23264c",
  },
  suggestionsBox: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dde0ec",
    overflow: "hidden",
  },
  suggestion: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eef0f7",
  },
  suggestionText: { color: "#414071", fontSize: 14, fontWeight: "600" },
  button: {
    backgroundColor: "#414071",
    paddingVertical: 13,
    borderRadius: 26,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#dde0ec",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  dropdownTitle: {
    fontWeight: "700",
    marginBottom: 6,
    color: "#1f2147",
    fontSize: 14,
  },
  dropdownItem: { paddingVertical: 8 },
  dropdownText: { fontSize: 14, color: "#23264c" },
  empty: {
    color: "#6b6f8e",
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2147",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#23264c",
    marginBottom: 14,
    lineHeight: 20,
  },
  modalBtn: {
    backgroundColor: "#414071",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "700" },
});
