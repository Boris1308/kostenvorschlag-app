const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Tesseract = require("tesseract.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Speicherort für Uploads festlegen
const upload = multer({ dest: "uploads/" });

// Damit wir Formulare (manuelle Eingaben) verarbeiten können
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Statische Dateien (Frontend)
app.use(express.static("public"));

// Startseite
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Upload Route: Fahrzeugschein
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // OCR mit Tesseract
    const { data: { text } } = await Tesseract.recognize(filePath, "deu");

    // Temporäre Datei löschen
    fs.unlinkSync(filePath);

    // Rückgabe: erkannter Text
    res.json({
      success: true,
      message: "Fahrzeugschein erfolgreich erkannt.",
      ocrText: text,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Fehler bei Texterkennung." });
  }
});

// Manuelle Eingabe
app.post("/manual", (req, res) => {
  const fahrzeugdaten = req.body;
  console.log("Manuell eingegebene Fahrzeugdaten:", fahrzeugdaten);

  res.json({
    success: true,
    message: "Manuelle Fahrzeugdaten erfolgreich übernommen.",
    fahrzeugdaten,
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
