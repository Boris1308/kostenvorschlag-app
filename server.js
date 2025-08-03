const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Tesseract = require("tesseract.js");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

// Neuer Upload-Endpoint mit Texterkennung
app.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;

  try {
    // OCR mit Tesseract.js starten
    const result = await Tesseract.recognize(filePath, "deu");
    const text = result.data.text;

    console.log("OCR-Ergebnis:", text);

    // Ausgabe auf der Website
    res.send(`
      <h2>Texterkennung erfolgreich</h2>
      <pre>${text}</pre>
      <a href="/">Zurück</a>
    `);
  } catch (err) {
    console.error("Fehler bei der Texterkennung:", err);
    res.status(500).send("Fehler bei der Texterkennung!");
  } finally {
    // Datei wieder löschen
    fs.unlinkSync(filePath);
  }
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));

