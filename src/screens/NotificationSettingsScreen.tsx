import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import BackgroundWrapper from "../components/BackgroundWrapper";
import {
  loadPrefs,
  savePrefs,
  NotificationPrefs,
  DEFAULT_PREFS,
} from "../services/storage";
import * as Notifications from "../services/NotificationService";

export default function NotificationSettingsScreen({ navigation }: any) {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);

  useEffect(() => {
    loadPrefs().then(setPrefs);
  }, []);

  const update = async (patch: Partial<NotificationPrefs>) => {
    const next = { ...(prefs ?? DEFAULT_PREFS), ...patch };
    setPrefs(next);
    await savePrefs(next);
    // Re-register recurring notifications to reflect the new choice.
    await Notifications.applyPrefs();
  };

  if (!prefs) {
    return (
      <BackgroundWrapper>
        <View style={styles.center}>
          <ActivityIndicator color="#414071" />
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Notifications</Text>
        <Text style={styles.subheading}>
          Choose which reminders you'd like to receive. Report follow-up and
          draft reminders are always on so nothing slips through the cracks.
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Weekly reporting nudge</Text>
              <Text style={styles.rowSubtitle}>
                A gentle weekly reminder to report any reactions you observed.
              </Text>
            </View>
            <Switch
              value={prefs.weeklyNudge}
              onValueChange={(v) => update({ weeklyNudge: v })}
              trackColor={{ true: "#414071", false: "#c7c9e6" }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Weekly safety tip</Text>
              <Text style={styles.rowSubtitle}>
                A short drug-safety tip drawn from the medicine reference.
              </Text>
            </View>
            <Switch
              value={prefs.safetyTips}
              onValueChange={(v) => update({ safetyTips: v })}
              trackColor={{ true: "#414071", false: "#c7c9e6" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <Pressable
          style={styles.linkBtn}
          onPress={() => navigation.navigate("MedicineScreen")}
        >
          <Text style={styles.linkBtnText}>Open Medicine Reference</Text>
        </Pressable>
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
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
    lineHeight: 18,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: "#e5e7f0",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  rowText: { flex: 1, paddingRight: 12 },
  rowTitle: { fontSize: 15, fontWeight: "700", color: "#1f2147" },
  rowSubtitle: { fontSize: 12, color: "#6b6f8e", marginTop: 2, lineHeight: 16 },
  divider: { height: 1, backgroundColor: "#eef0f7", marginHorizontal: 12 },
  linkBtn: {
    backgroundColor: "#eef0ff",
    paddingVertical: 13,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dde0ec",
  },
  linkBtnText: { color: "#414071", fontWeight: "700", fontSize: 15 },
});
