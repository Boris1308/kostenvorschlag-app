const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Startseite
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Upload-Route
app.post("/upload", upload.single("file"), (req, res) => {
  console.log("Upload erfolgreich:", req.file);
  res.send("Datei erfolgreich hochgeladen!");
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
