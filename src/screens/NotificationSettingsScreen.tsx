import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import BackgroundWrapper from "../components/BackgroundWrapper";
import NewsImage from "../components/NewsImage";
import {
  loadPrefs,
  savePrefs,
  NotificationPrefs,
  DEFAULT_PREFS,
} from "../services/storage";
import * as Notifications from "../services/NotificationService";
import {
  NEWS,
  RECENT_CASES,
  CATEGORY_STYLE,
  SEVERITY_STYLE,
  NewsItem,
  FeedCategory,
} from "../data/newsFeed";
import { colors, radius, shadow, spacing } from "../theme/theme";

type Filter = "All" | FeedCategory;
const FILTERS: Filter[] = ["All", "Alert", "Research", "News"];

export default function NotificationSettingsScreen({ navigation }: any) {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<NewsItem | null>(null);

  useEffect(() => {
    loadPrefs().then(setPrefs);
  }, []);

  const update = async (patch: Partial<NotificationPrefs>) => {
    const next = { ...(prefs ?? DEFAULT_PREFS), ...patch };
    setPrefs(next);
    await savePrefs(next);
    await Notifications.applyPrefs();
  };

  const [featured, ...rest] = NEWS;
  const list = useMemo(
    () => (filter === "All" ? rest : rest.filter((n) => n.category === filter)),
    [filter, rest],
  );

  return (
    <BackgroundWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroKicker}>DRUG SAFETY</Text>
          <Text style={styles.heroTitle}>Alerts & Research</Text>
          <Text style={styles.heroSubtitle}>
            The latest pharmacovigilance alerts, studies and reported reactions —
            updated continuously.
          </Text>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Featured */}
        {(filter === "All" || filter === featured.category) && (
          <Pressable
            style={({ pressed }) => [styles.featured, pressed && styles.pressed]}
            android_ripple={{ color: "#00000010" }}
            onPress={() => setSelected(featured)}
          >
            <NewsImage
              uri={featured.image}
              glyph={featured.glyph}
              tint={CATEGORY_STYLE[featured.category].soft}
              height={190}
              radius={0}
            />
            <View style={styles.featuredBody}>
              <CategoryBadge category={featured.category} />
              <Text style={styles.featuredTitle}>{featured.title}</Text>
              <Text style={styles.featuredSummary} numberOfLines={2}>
                {featured.summary}
              </Text>
              <Text style={styles.meta}>
                {featured.source} · {featured.date} · {featured.readMins} min read
              </Text>
            </View>
          </Pressable>
        )}

        {/* News list */}
        {list.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            android_ripple={{ color: "#00000010" }}
            onPress={() => setSelected(item)}
          >
            <NewsImage
              uri={item.image}
              glyph={item.glyph}
              tint={CATEGORY_STYLE[item.category].soft}
              style={styles.cardThumb}
              radius={radius.md}
            />
            <View style={styles.cardBody}>
              <CategoryBadge category={item.category} small />
              <Text style={styles.cardTitle} numberOfLines={3}>
                {item.title}
              </Text>
              <Text style={styles.meta} numberOfLines={1}>
                {item.source} · {item.date}
              </Text>
            </View>
          </Pressable>
        ))}

        {list.length === 0 && (
          <Text style={styles.empty}>No items in this category right now.</Text>
        )}

        {/* Recent cases */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recently reported cases</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.caseRow}
        >
          {RECENT_CASES.map((c) => {
            const sev = SEVERITY_STYLE[c.severity];
            return (
              <View key={c.id} style={styles.caseCard}>
                <NewsImage
                  uri={c.image}
                  glyph={c.glyph}
                  tint={sev.soft}
                  height={96}
                  radius={0}
                />
                <View style={styles.caseBody}>
                  <View
                    style={[styles.sevBadge, { backgroundColor: sev.soft }]}
                  >
                    <View style={[styles.sevDot, { backgroundColor: sev.color }]} />
                    <Text style={[styles.sevText, { color: sev.color }]}>
                      {c.severity}
                    </Text>
                  </View>
                  <Text style={styles.caseDrug}>{c.drug}</Text>
                  <Text style={styles.caseReaction} numberOfLines={1}>
                    {c.reaction}
                  </Text>
                  <Text style={styles.caseSummary} numberOfLines={3}>
                    {c.summary}
                  </Text>
                  <Text style={styles.caseDate}>{c.date}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Notification preferences */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>

        {!prefs ? (
          <View style={styles.prefsLoading}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <View style={styles.prefsCard}>
            <PrefRow
              title="Hourly safety updates"
              subtitle="A quick alert each hour when new items land in the feed."
              value={prefs.hourlyNews}
              onChange={(v) => update({ hourlyNews: v })}
            />
            <View style={styles.divider} />
            <PrefRow
              title="Weekly reporting nudge"
              subtitle="A gentle weekly reminder to report reactions you observed."
              value={prefs.weeklyNudge}
              onChange={(v) => update({ weeklyNudge: v })}
            />
            <View style={styles.divider} />
            <PrefRow
              title="Weekly safety tip"
              subtitle="A short drug-safety tip drawn from the reference library."
              value={prefs.safetyTips}
              onChange={(v) => update({ safetyTips: v })}
            />
          </View>
        )}

        <Pressable
          style={({ pressed }) => [styles.linkBtn, pressed && styles.pressed]}
          android_ripple={{ color: colors.primarySoft }}
          onPress={() => navigation.navigate("MedicineScreen")}
        >
          <Text style={styles.linkBtnText}>Open Medicine Reference →</Text>
        </Pressable>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Article detail */}
      <Modal
        visible={!!selected}
        animationType="slide"
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selected && (
                <>
                  <NewsImage
                    uri={selected.image}
                    glyph={selected.glyph}
                    tint={CATEGORY_STYLE[selected.category].soft}
                    height={210}
                    radius={0}
                  />
                  <View style={styles.modalBody}>
                    <CategoryBadge category={selected.category} />
                    <Text style={styles.modalTitle}>{selected.title}</Text>
                    <Text style={styles.meta}>
                      {selected.source} · {selected.date} · {selected.readMins} min
                      read
                    </Text>
                    <Text style={styles.modalText}>{selected.body}</Text>
                  </View>
                </>
              )}
            </ScrollView>
            <Pressable
              style={styles.modalClose}
              onPress={() => setSelected(null)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </BackgroundWrapper>
  );
}

function CategoryBadge({
  category,
  small,
}: {
  category: FeedCategory;
  small?: boolean;
}) {
  const s = CATEGORY_STYLE[category];
  return (
    <View
      style={[
        styles.catBadge,
        { backgroundColor: s.soft },
        small && styles.catBadgeSmall,
      ]}
    >
      <Text style={[styles.catBadgeText, { color: s.color }]}>
        {s.glyph} {category.toUpperCase()}
      </Text>
    </View>
  );
}

function PrefRow({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.prefRow}>
      <View style={styles.prefText}>
        <Text style={styles.prefTitle}>{title}</Text>
        <Text style={styles.prefSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.primary, false: "#c7c9e6" }}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  pressed: { opacity: 0.9, transform: [{ scale: 0.995 }] },

  hero: { marginBottom: spacing.md },
  heroKicker: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  heroTitle: { fontSize: 26, fontWeight: "800", color: colors.text },
  heroSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  filterRow: { paddingVertical: spacing.sm, gap: spacing.sm },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.primary, fontWeight: "700", fontSize: 13 },
  chipTextActive: { color: "#fff" },

  featured: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: "hidden",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  featuredBody: { padding: spacing.lg },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.sm,
    lineHeight: 24,
  },
  featuredSummary: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  meta: { color: colors.textFaint, fontSize: 12, marginTop: spacing.sm },

  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  cardThumb: { width: 92, height: 92 },
  cardBody: { flex: 1, marginLeft: spacing.md, justifyContent: "center" },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 2,
  },

  empty: {
    color: colors.textMuted,
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: spacing.md,
  },

  sectionHeaderRow: { marginTop: spacing.md, marginBottom: spacing.sm },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.text },

  caseRow: { paddingVertical: spacing.xs, paddingRight: spacing.lg },
  caseCard: {
    width: 220,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: "hidden",
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  caseBody: { padding: spacing.md },
  sevBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: radius.pill,
    marginBottom: 6,
  },
  sevDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  sevText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.4 },
  caseDrug: { fontSize: 15, fontWeight: "800", color: colors.text },
  caseReaction: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 4,
  },
  caseSummary: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  caseDate: { fontSize: 11, color: colors.textFaint, marginTop: 6 },

  prefsLoading: { padding: spacing.xl, alignItems: "center" },
  prefsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  prefRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  prefText: { flex: 1, paddingRight: spacing.md },
  prefTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  prefSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md },

  linkBtn: {
    backgroundColor: colors.primarySoft,
    paddingVertical: 14,
    borderRadius: radius.pill,
    alignItems: "center",
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  linkBtnText: { color: colors.primary, fontWeight: "800", fontSize: 15 },

  catBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  catBadgeSmall: { paddingVertical: 3, paddingHorizontal: 8 },
  catBadgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    height: "88%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: "hidden",
  },
  modalBody: { padding: spacing.lg },
  modalTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.sm,
    lineHeight: 28,
  },
  modalText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 23,
    marginTop: spacing.md,
  },
  modalClose: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    alignItems: "center",
  },
  modalCloseText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});
