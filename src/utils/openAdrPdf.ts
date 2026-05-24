import { Platform } from "react-native";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

/**
 * Copies the bundled ADR report PDF out of app assets to a readable cache
 * path, then asks the OS to open it. On Android `showOpenWithDialog: true`
 * forces the system "Open with…" chooser, which lists every installed app
 * that can view a PDF (PDF readers, Drive, file managers, share targets).
 *
 * Pure on-device operation — no network, no backend.
 */
export async function openAdrPdf(): Promise<void> {
  const filename = "ADR_Report.pdf";
  const destPath =
    Platform.OS === "android"
      ? `${RNFS.CachesDirectoryPath}/${filename}`
      : `${RNFS.DocumentDirectoryPath}/${filename}`;

  // Always overwrite — guarantees a fresh, readable copy.
  try {
    const exists = await RNFS.exists(destPath);
    if (exists) await RNFS.unlink(destPath);
  } catch {
    /* ignore — best effort cleanup */
  }

  if (Platform.OS === "android") {
    await RNFS.copyFileAssets("adr_form.pdf", destPath);
  } else {
    await RNFS.copyFile(`${RNFS.MainBundlePath}/adr_form.pdf`, destPath);
  }

  await FileViewer.open(destPath, {
    showOpenWithDialog: true,   // Android intent chooser
    showAppsSuggestions: true,  // surface install suggestions if none installed
  });
}
