const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Tesseract = require("tesseract.js");

const app = express();
const PORT = process.env.PORT || 3000;

// ----- Statischer Ordner für index.html -----
app.use(express.static(path.join(__dirname, "public")));

// ----- Upload-Konfiguration -----
const upload = multer({ dest: "uploads/" });

// ----- Startseite -----
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ----- Upload-Route mit Texterkennung -----
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Keine Datei hochgeladen!");
  }

  const filePath = path.join(__dirname, req.file.path);

  // Texterkennung starten
  Tesseract.recognize(filePath, "deu", {
    logger: (m) => console.log(m), // optional: Fortschritt in der Konsole
  })
    .then(({ data: { text } }) => {
      console.log("OCR Ergebnis:", text);

      // Hochgeladene Datei nach Verarbeitung löschen
      fs.unlinkSync(filePath);

      // OCR Ergebnis zurücksenden
      res.send(`
        <h1>Texterkennung abgeschlossen</h1>
        <pre>${text}</pre>
        <a href="/">Zurück</a>
      `);
    })
    .catch((err) => {
      console.error("Fehler bei Texterkennung:", err);
      res.status(500).send("Fehler bei Texterkennung");
    });
});

// ----- Server starten -----
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

