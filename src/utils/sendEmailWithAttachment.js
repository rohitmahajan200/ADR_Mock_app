import Mailer from "react-native-mail";

export function sendEmailWithAttachment(pdfPath) {
  Mailer.mail(
    {
      subject: "testing process",
      recipients: ["mrdevrm@gmail.com"],
      body: "testing the mail body",
      isHTML: false,
      attachment: {
        path: pdfPath,
        type: "pdf",
        name: "report.pdf",
      },
    },
    (error, event) => {
      if (error) {
        console.log("EMAIL ERROR", error);
      }
    }
  );
}
