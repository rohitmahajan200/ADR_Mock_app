import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { useForm } from "../contexts/FormContext";

export default function ReactionDetailsScreen({ navigation }: any) {
  const { form, setForm } = useForm();

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showStopPicker, setShowStopPicker] = useState(false);

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        
        {/* HEADER */}
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>
            B. SUSPECTED ADVERSE REACTION *
          </Text>
        </View>

        {/* Start Date */}
        <Text style={styles.label}>
          5. Event / Reaction start date (dd/mm/yyyy)
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

        {/* Stop Date */}
        <Text style={styles.label}>
          6. Event / Reaction stop date (dd/mm/yyyy)
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

        {/* Reaction Description */}
        <Text style={styles.label}>
          7. Describe Event/Reaction management with details, if any
        </Text>

        <TextInput
          style={styles.textArea}
          multiline
          value={form.reactionManagement}
          placeholder="Type here..."
          onChangeText={(v) => updateField("reactionManagement", v)}
          textAlignVertical="top"
        />

        {/* NEXT BUTTON */}
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("MedicationDetails")}
        >
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  headerRow: {
    backgroundColor: "#B20000",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 20,
  },

  headerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 12,
  },

  inputText: {
    color: "#23264c",
    fontSize: 15,
  },

  textArea: {
    height: 160,
    borderWidth: 1,
    borderColor: "#bfc3d8",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    fontSize: 15,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#414071",
    marginTop: 10,
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
