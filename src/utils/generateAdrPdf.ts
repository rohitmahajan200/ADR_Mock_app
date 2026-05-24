import { Platform } from "react-native";
import RNFS from "react-native-fs";
import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";
import { Buffer } from "buffer";

/**
 * Generates a filled CDSCO Suspected Adverse Drug Reaction Reporting Form PDF
 * from the user's form data, by overlaying text on the bundled blank template.
 *
 * Page is 612 x 792 pts (US Letter). All coordinates here are in pdfplumber
 * style: x from left, `top` measured from the top of the page. The helper
 * `pdfY(top)` converts to pdf-lib's y-up coordinate.
 */

const PAGE_HEIGHT = 792;
const pdfY = (top: number) => PAGE_HEIGHT - top;

const FONT = 9;
const SMALL = 8;
const WHITE = rgb(1, 1, 1);
const BLACK = rgb(0, 0, 0);

type Form = { [k: string]: any };

const s = (v: any): string => (v == null ? "" : String(v).trim());

/** White-rect regions that cover the bundled template's sample data so the
 * user's data prints on a clean canvas. Coordinates are pdfplumber-top. */
const CLEAR_REGIONS: { x: number; top: number; w: number; h: number }[] = [
  // Case-type checkboxes (Initial / Follow-up, top row)
  { x: 137, top: 92, w: 13, h: 12 },
  { x: 273, top: 92, w: 13, h: 12 },

  // Patient initials value
  { x: 125, top: 122, w: 56, h: 10 },
  // Age / DOB value
  { x: 266, top: 122, w: 60, h: 10 },
  // Reg No fill area (top-right)
  { x: 480, top: 107, w: 80, h: 11 },
  // AMC Report No value
  { x: 415, top: 122, w: 145, h: 10 },
  // Worldwide Unique No value
  { x: 417, top: 134, w: 143, h: 10 },

  // Gender checkboxes (sample template ticks one of M/F/Other)
  { x: 93, top: 124, w: 16, h: 16 },
  { x: 113, top: 124, w: 16, h: 16 },
  { x: 154, top: 124, w: 16, h: 16 },
  // Weight value
  { x: 243, top: 135, w: 85, h: 11 },

  // Event start / stop dates
  { x: 208, top: 161, w: 120, h: 13 },
  { x: 208, top: 172, w: 120, h: 13 },

  // Describe reaction (multi-line; the sample fills ~80pt)
  { x: 57, top: 196, w: 270, h: 80 },

  // AMC investigations
  { x: 333, top: 154, w: 225, h: 58 },
  // AMC history
  { x: 333, top: 226, w: 225, h: 50 },

  // Seriousness ticks (the sample ticks Hospitalization-Initial/Prolonged)
  { x: 324, top: 282, w: 14, h: 13 },
  { x: 324, top: 293, w: 14, h: 13 },
  { x: 324, top: 305, w: 14, h: 13 },
  { x: 442, top: 282, w: 14, h: 13 },
  { x: 442, top: 293, w: 14, h: 13 },
  { x: 442, top: 305, w: 14, h: 13 },
  { x: 440, top: 275, w: 14, h: 13 }, // "No" tick
  // Death date
  { x: 358, top: 286, w: 100, h: 14 },

  // Outcome ticks (sample ticks Recovering)
  { x: 324, top: 328, w: 14, h: 13 },
  { x: 378, top: 328, w: 14, h: 13 },
  { x: 476, top: 328, w: 14, h: 13 },
  { x: 324, top: 339, w: 14, h: 13 },
  { x: 378, top: 339, w: 14, h: 13 },
  { x: 476, top: 339, w: 14, h: 13 },

  // Suspected medication table — row i is sample-filled; clear all 4 rows
  ...[399, 410, 421, 432].map((t) => ({ x: 70, top: t - 7, w: 488, h: 11 })),

  // Action-taken table — row i has "Yes" sample text; clear all 4 rows
  ...[496, 507, 518, 530].map((t) => ({ x: 76, top: t - 7, w: 285, h: 11 })),
  // Reintroduction table — clear ticks + dose for 4 rows
  ...[496, 507, 518, 530].map((t) => ({ x: 384, top: t - 7, w: 175, h: 11 })),

  // Concomitant table — row i is sample-filled
  ...[581, 592, 602].map((t) => ({ x: 70, top: t - 7, w: 488, h: 11 })),

  // Reporter section (sample-filled)
  { x: 381, top: 624, w: 178, h: 14 },
  { x: 304, top: 636, w: 256, h: 14 },
  { x: 321, top: 648, w: 41, h: 13 },
  { x: 389, top: 648, w: 171, h: 13 },
  { x: 350, top: 660, w: 130, h: 13 },
  { x: 348, top: 672, w: 130, h: 13 },
  { x: 483, top: 672, w: 76, h: 13 },
  { x: 449, top: 684, w: 110, h: 13 },
];

/** Field text positions (pdfplumber-top). */
type Field = {
  key: string;
  x: number;
  top: number;
  size?: number;
  maxWidth?: number;     // wrap text if provided
  lineHeight?: number;   // for wrapped text
};

const SINGLE_LINE_FIELDS: Field[] = [
  { key: "patientInitials", x: 121, top: 128 },
  { key: "patientAgeOrDob", x: 266, top: 128 },
  { key: "regNo", x: 481, top: 113 },
  { key: "amcReportNo", x: 418, top: 128 },
  { key: "worldWideUniqueNo", x: 420, top: 140 },
  { key: "weightKg", x: 246, top: 142 },
  { key: "eventStartDate", x: 211, top: 172 },
  { key: "eventStopDate", x: 211, top: 183 },
  { key: "deathDate", x: 360, top: 297 },
  { key: "reportDate", x: 451, top: 696 },
];

const MULTI_LINE_FIELDS: Field[] = [
  { key: "reactionManagement", x: 59, top: 205, maxWidth: 265, lineHeight: 11 },
  { key: "relevantInvestigations", x: 335, top: 163, maxWidth: 220, lineHeight: 10, size: SMALL },
  { key: "medicalHistory", x: 335, top: 235, maxWidth: 220, lineHeight: 10, size: SMALL },
  { key: "additionalInformation", x: 60, top: 627, maxWidth: 235, lineHeight: 11 },
  { key: "reporterNameAddress", x: 384, top: 633, maxWidth: 175, lineHeight: 11 },
];

const REPORTER_INLINE: Field[] = [
  { key: "reporterPin", x: 324, top: 658 },
  { key: "reporterEmail", x: 392, top: 658, size: SMALL },
  { key: "reporterContact", x: 353, top: 670 },
  { key: "reporterOccupation", x: 351, top: 682 },
];

/** Suspected medication grid — row top positions for rows 1..4. */
const MED_ROW_TOPS = [407, 418, 429, 440];
const MED_FONT = 7;
const MED_COLS = [
  { sub: "Name", x: 72, max: 68 },
  { sub: "Manufacturer", x: 142, max: 40 },
  { sub: "Batch", x: 184, max: 40 },
  { sub: "Expiry", x: 225, max: 36 },
  { sub: "Dose", x: 262, max: 33 },
  { sub: "Route", x: 297, max: 33 },
  { sub: "Frequency", x: 333, max: 42 },
  { sub: "DateStarted", x: 378, max: 35 },
  { sub: "DateStopped", x: 413, max: 40 },
  { sub: "Indication", x: 456, max: 56 },
  { sub: "Causality", x: 513, max: 45 },
];

const ACTION_ROW_TOPS = [503, 514, 525, 536];
const ACTION_COLS: Record<string, number> = {
  "Drug withdrawn": 95,
  "Dose increased": 150,
  "Dose reduced": 199,
  "Dose not changed": 241,
  "Not applicable": 295,
  "Unknown": 343,
};

const REINTRO_COLS: Record<string, number> = {
  Yes: 408,
  No: 451,
  "Effect unknown": 493,
};
const REINTRO_DOSE_X = 534;

/** Concomitant grid — row top positions for rows 1..3 (page only shows 3). */
const CONC_ROW_TOPS = [589, 600, 610];
const CONC_COLS = [
  { sub: "Name", x: 74, max: 70 },
  { sub: "Dose", x: 145, max: 40 },
  { sub: "Route", x: 192, max: 40 },
  { sub: "Frequency", x: 234, max: 70 },
  { sub: "DateStarted", x: 308, max: 60 },
  { sub: "DateStopped", x: 376, max: 60 },
  { sub: "Indication", x: 465, max: 92 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] {
  if (!text) return [];
  // Honor explicit line breaks first.
  const out: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (!words.length) {
      out.push("");
      continue;
    }
    let line = "";
    for (const w of words) {
      const trial = line ? line + " " + w : w;
      if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
        line = trial;
      } else {
        if (line) out.push(line);
        // Hard-break very long single words
        if (font.widthOfTextAtSize(w, size) > maxWidth) {
          let chunk = "";
          for (const ch of w) {
            const t = chunk + ch;
            if (font.widthOfTextAtSize(t, size) > maxWidth) {
              if (chunk) out.push(chunk);
              chunk = ch;
            } else {
              chunk = t;
            }
          }
          line = chunk;
        } else {
          line = w;
        }
      }
    }
    if (line) out.push(line);
  }
  return out;
}

function drawSingle(
  page: PDFPage,
  font: PDFFont,
  text: string,
  x: number,
  top: number,
  size = FONT,
  maxWidth?: number
) {
  if (!text) return;
  let display = text;
  if (maxWidth) {
    while (display && font.widthOfTextAtSize(display, size) > maxWidth) {
      display = display.slice(0, -1);
    }
  }
  page.drawText(display, { x, y: pdfY(top), size, font, color: BLACK });
}

function drawWrapped(
  page: PDFPage,
  font: PDFFont,
  text: string,
  field: Field
) {
  if (!text) return;
  const size = field.size ?? FONT;
  const lineHeight = field.lineHeight ?? size + 2;
  const lines = wrapText(text, font, size, field.maxWidth ?? 240);
  lines.forEach((ln, i) => {
    page.drawText(ln, {
      x: field.x,
      y: pdfY(field.top + i * lineHeight),
      size,
      font,
      color: BLACK,
    });
  });
}

function drawCheck(page: PDFPage, font: PDFFont, x: number, top: number) {
  // A bold "X" inside the box. Box is roughly 10pt wide so size 10 looks right.
  page.drawText("X", {
    x,
    y: pdfY(top),
    size: 10,
    font,
    color: BLACK,
  });
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export type GeneratePdfResult = {
  path: string;       // file:// path on iOS, plain path on Android
  publicPath: string; // user-visible location string for messaging
};

export async function generateAdrPdf(form: Form): Promise<GeneratePdfResult> {
  // ---- 1. Read bundled template ----
  let templateBase64: string;
  if (Platform.OS === "android") {
    templateBase64 = await RNFS.readFileAssets("adr_form.pdf", "base64");
  } else {
    templateBase64 = await RNFS.readFile(
      `${RNFS.MainBundlePath}/adr_form.pdf`,
      "base64"
    );
  }
  const templateBytes = Buffer.from(templateBase64, "base64");
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPage(0);
  const helv = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // ---- 2. Clear sample regions ----
  for (const r of CLEAR_REGIONS) {
    page.drawRectangle({
      x: r.x,
      y: pdfY(r.top + r.h),
      width: r.w,
      height: r.h,
      color: WHITE,
      borderWidth: 0,
    });
  }

  // ---- 3. Case type checkbox (top row, above "A. PATIENT INFORMATION") ----
  if (form.caseType === "Initial") {
    drawCheck(page, helvBold, 119, 101);
  } else if (form.caseType === "Follow-Up") {
    drawCheck(page, helvBold, 255, 101);
  }

  // ---- 4. Single-line text fields ----
  for (const f of SINGLE_LINE_FIELDS) {
    drawSingle(page, helv, s(form[f.key]), f.x, f.top, f.size ?? FONT, f.maxWidth);
  }

  // ---- 5. Gender ----
  if (form.gender === "M") drawCheck(page, helvBold, 97, 138);
  else if (form.gender === "F") drawCheck(page, helvBold, 117, 138);
  else if (form.gender === "Other") drawCheck(page, helvBold, 158, 138);

  // ---- 6. Multi-line text blocks ----
  for (const f of MULTI_LINE_FIELDS) {
    drawWrapped(page, helv, s(form[f.key]), f);
  }

  // ---- 7. Reporter single-line ----
  for (const f of REPORTER_INLINE) {
    drawSingle(page, helv, s(form[f.key]), f.x, f.top, f.size ?? FONT);
  }

  // ---- 8. Seriousness ticks ----
  const ser = form.seriousness;
  const serArr: string[] = Array.isArray(ser) ? ser : ser ? [ser] : [];
  const isSer = (label: string) =>
    serArr.some((v) => v.toLowerCase().includes(label.toLowerCase()));
  if (form.seriousnessNo === true || form.seriousness === "No") {
    drawCheck(page, helvBold, 442, 282);
  }
  if (isSer("Death") || form.death === true) drawCheck(page, helvBold, 326, 292);
  if (isSer("Life")) drawCheck(page, helvBold, 326, 303);
  if (isSer("Hospital")) drawCheck(page, helvBold, 326, 314);
  if (isSer("Congenital")) drawCheck(page, helvBold, 446, 292);
  if (isSer("Disability")) drawCheck(page, helvBold, 446, 303);
  if (isSer("Other") || isSer("Medically")) drawCheck(page, helvBold, 446, 314);

  // ---- 9. Outcome ----
  const outcomeMap: Record<string, [number, number]> = {
    "Recovered": [328, 333],
    "Recovering": [382, 333],
    "Not Recovered": [480, 333],
    "Fatal": [328, 345],
    "Recovered with sequelae": [382, 345],
    "Unknown": [480, 345],
  };
  if (form.outcome && outcomeMap[form.outcome]) {
    const [x, top] = outcomeMap[form.outcome];
    drawCheck(page, helvBold, x, top);
  }

  // ---- 10. Suspected medication rows (1..4) ----
  for (let i = 0; i < 4; i++) {
    const top = MED_ROW_TOPS[i];
    const idx = i + 1;
    for (const c of MED_COLS) {
      const val = s(form[`suspectedMedication${c.sub}${idx}`]);
      if (val) drawSingle(page, helv, val, c.x, top, MED_FONT, c.max);
    }
  }

  // ---- 11. Action taken / reintroduction rows (1..4) ----
  for (let i = 0; i < 4; i++) {
    const top = ACTION_ROW_TOPS[i];
    const idx = i + 1;
    const action = s(form[`actionTaken${idx}`]);
    if (action && ACTION_COLS[action] !== undefined) {
      drawCheck(page, helvBold, ACTION_COLS[action], top);
    }
    const reintro = s(form[`reintroducedEffect${idx}`]);
    if (reintro && REINTRO_COLS[reintro] !== undefined) {
      drawCheck(page, helvBold, REINTRO_COLS[reintro], top);
    }
    const reintroDose = s(form[`reintroducedDose${idx}`]);
    if (reintroDose) drawSingle(page, helv, reintroDose, REINTRO_DOSE_X, top, SMALL, 26);
  }

  // ---- 12. Concomitant rows (1..3) ----
  for (let i = 0; i < 3; i++) {
    const top = CONC_ROW_TOPS[i];
    const idx = i + 1;
    for (const c of CONC_COLS) {
      const val = s(form[`concomitant${c.sub}${idx}`]);
      if (val) drawSingle(page, helv, val, c.x, top, SMALL, c.max);
    }
  }

  // ---- 13. Save ----
  const out = await pdfDoc.save();
  const outBase64 = Buffer.from(out).toString("base64");

  const stamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19);
  const initials = s(form.patientInitials) || "ADR";
  const filename = `ADR_Report_${initials}_${stamp}.pdf`;

  // Pick a user-visible save location. On Android we try Downloads first; if
  // scoped storage rejects that (API 30+), fall back to the app's external
  // documents directory, which is still browsable via file managers.
  let destPath = "";
  let publicPath = "";

  if (Platform.OS === "android") {
    const candidates: { path: string; label: string }[] = [
      {
        path: `${RNFS.DownloadDirectoryPath}/${filename}`,
        label: `Downloads/${filename}`,
      },
      {
        path: `${RNFS.ExternalDirectoryPath}/${filename}`,
        label: `Files › Android/data › ADR app › files/${filename}`,
      },
      {
        path: `${RNFS.DocumentDirectoryPath}/${filename}`,
        label: filename,
      },
    ];
    let lastErr: any = null;
    for (const c of candidates) {
      try {
        await RNFS.writeFile(c.path, outBase64, "base64");
        destPath = c.path;
        publicPath = c.label;
        break;
      } catch (e) {
        lastErr = e;
      }
    }
    if (!destPath) {
      throw lastErr || new Error("Could not write PDF to device storage.");
    }
  } else {
    destPath = `${RNFS.DocumentDirectoryPath}/${filename}`;
    publicPath = `Files app › On My iPhone › ${filename}`;
    await RNFS.writeFile(destPath, outBase64, "base64");
  }

  return {
    path: Platform.OS === "android" ? destPath : `file://${destPath}`,
    publicPath,
  };
}
