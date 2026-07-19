// ============================================================
//  Design tokens — a small, consistent system so screens share
//  the same colours, spacing, corners, shadows and type scale.
// ============================================================

export const colors = {
  primary: "#414071",
  primaryDark: "#2f2e57",
  primarySoft: "#eef0ff",

  bg: "#f4f5fb",
  surface: "#ffffff",
  surfaceAlt: "#fafbff",

  text: "#1f2147",
  textMuted: "#6b6f8e",
  textFaint: "#9ca0c0",

  border: "#e7e9f4",
  borderStrong: "#dde0ec",

  // Semantic accents (each with a soft tint for badges / chips).
  danger: "#c0392b",
  dangerSoft: "#fdecec",
  warning: "#b7791f",
  warningSoft: "#fbf1de",
  success: "#2f855a",
  successSoft: "#e6f4ec",
  info: "#2b6cb0",
  infoSoft: "#e7f0fb",
  accent: "#6c5ce7",
  accentSoft: "#eeeafd",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: "#1f2147",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  soft: {
    shadowColor: "#1f2147",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
} as const;

export const type = {
  h1: { fontSize: 24, fontWeight: "800" as const, color: colors.text },
  h2: { fontSize: 18, fontWeight: "800" as const, color: colors.text },
  h3: { fontSize: 16, fontWeight: "700" as const, color: colors.text },
  body: { fontSize: 14, color: colors.text, lineHeight: 20 },
  small: { fontSize: 12, color: colors.textMuted },
  tiny: { fontSize: 11, color: colors.textFaint },
};
