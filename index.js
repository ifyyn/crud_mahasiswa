import express from "express";
import mysql from "mysql2";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Menentukan __dirname untuk ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfigurasi EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware untuk parsing form
app.use(express.urlencoded({ extended: true }));

// Route untuk halaman home
app.get("/", (req, res) => {
  const query = "SELECT * FROM nilai";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.render("home", { data: results });
  });
});
app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", (req, res) => {
  const {
    nim,
    nama,
    prodi,
    semester,
    nilai_presensi,
    nilai_tugas,
    nilai_uts,
    nilai_uas,
  } = req.body;

  const query = `
      INSERT INTO nilai (nim, nama, prodi, semester, nilai_presensi, nilai_tugas, nilai_uts, nilai_uas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

  const values = [
    nim,
    nama,
    prodi,
    semester,
    nilai_presensi,
    nilai_tugas,
    nilai_uts,
    nilai_uas,
  ];
  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.redirect("/?create=true");
  });
});

app.get("/update/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM nilai WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).send("Data tidak ditemukan");
    }
    res.render("update", { data: results[0] });
  });
});

app.post("/update/:id", (req, res) => {
  const { id } = req.params;
  const {
    nim,
    nama,
    prodi,
    semester,
    nilai_presensi,
    nilai_tugas,
    nilai_uts,
    nilai_uas,
  } = req.body;
  const query =
    "UPDATE nilai SET nim = ?, nama = ?, prodi = ?, semester = ?, nilai_presensi = ?, nilai_tugas = ?, nilai_uts = ?, nilai_uas = ? WHERE id = ?";
  db.query(
    query,
    [
      nim,
      nama,
      prodi,
      semester,
      nilai_presensi,
      nilai_tugas,
      nilai_uts,
      nilai_uas,
      id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.redirect("/");
    }
  );
});

app.post("/delete/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery = "DELETE FROM nilai WHERE id = ?";
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const resetAutoIncrementQuery = "ALTER TABLE nilai AUTO_INCREMENT = 1";
    db.query(resetAutoIncrementQuery, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.redirect("/?deleted=true");
    });
  });
});

// Koneksi ke database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mahasiswa",
  port: "3306",
});

db.connect((err) => {
  if (err) {
    console.error("Koneksi database gagal:", err.message);
    process.exit(1);
  }
  console.log("Koneksi database berhasil!");
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
