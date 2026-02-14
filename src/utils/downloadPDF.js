import RNFS from 'react-native-fs';
import axios from 'axios';
import { Buffer } from "buffer";


export async function downloadPdf(formData) {
  const url = "http://localhost:4000/fill-form";

  const response = await axios.post(url, formData, {
    responseType: "arraybuffer",
  });

  const pdfPath = `${RNFS.DownloadDirectoryPath}/report.pdf`;

  await RNFS.writeFile(pdfPath, Buffer.from(response.data), "base64");

  return pdfPath;  // return saved file path
}
