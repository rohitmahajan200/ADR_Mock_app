// src/screens/MedicineScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from 'react-native';
import { getMockSideEffects, SideEffect } from '../utils/mockAI'

type Props = {
  // add your navigation props if you use React Navigation
};

const MedicineScreen: React.FC<Props> = () => {
  const [medicine, setMedicine] = useState('');
  const [sideEffects, setSideEffects] = useState<SideEffect[]>([]);
  const [selectedSideEffect, setSelectedSideEffect] = useState<SideEffect | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleSearch = () => {
    const results = getMockSideEffects(medicine);
    setSideEffects(results);
  };

  const handleSelectSideEffect = (item: SideEffect) => {
    setSelectedSideEffect(item);
    // “Paste” the text into the medicine field or another field
    setMedicine(prev => (prev ? `${prev} - ${item.label}` : item.label));
    if (item.warningTitle || item.warningMessage) {
      setShowWarning(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Medicine name</Text>
      <TextInput
        style={styles.input}
        value={medicine}
        onChangeText={setMedicine}
        placeholder="Enter medicine, e.g. paracetamol"
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Check side effects (Mock)</Text>
      </TouchableOpacity>

      {sideEffects.length > 0 && (
        <View style={styles.dropdown}>
          <Text style={styles.dropdownTitle}>Possible side effects (mock):</Text>
          <FlatList
            data={sideEffects}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectSideEffect(item)}
              >
                <Text style={styles.dropdownText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <Modal
        visible={showWarning}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWarning(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedSideEffect?.warningTitle ?? 'Condition warning'}
            </Text>
            <Text style={styles.modalMessage}>
              {selectedSideEffect?.warningMessage ??
                'This is only a prototype and not real medical advice.'}
            </Text>

            {/* Example “conditions” */}
            <View style={styles.conditionsBox}>
              <Text style={styles.conditionsTitle}>Mock conditions:</Text>
              <Text>- Pregnancy related restriction (prototype).</Text>
              <Text>- Age based caution (children / seniors) (prototype).</Text>
              <Text>- Renal / liver caution (prototype).</Text>
              <Text>- Allergy or hypersensitivity note (prototype).</Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowWarning(false)}
            >
              <Text style={styles.buttonText}>OK, understood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MedicineScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  dropdown: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 8,
  },
  dropdownTitle: { fontWeight: '600', marginBottom: 4 },
  dropdownItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownText: { fontSize: 14 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  modalMessage: { fontSize: 14, marginBottom: 12 },
  conditionsBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  conditionsTitle: { fontWeight: '600', marginBottom: 4 },
});
