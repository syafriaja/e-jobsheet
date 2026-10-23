// ============================================================
// praktik.js
// Menyimpan seluruh hasil pemeriksaan di halaman praktik
// (STEP 3: Pemeriksaan Komponen & STEP 4.2: Pengisian Minyak)
// ke localStorage, supaya bisa ditampilkan di halaman laporan.
// ============================================================

function simpanPraktik() {
  // ====== STANDAR ACUAN (diisi guru) ======
  let standarPegas = ambilNilai("standarPegas");
  let standarTabung = ambilNilai("standarTabung");
  let standarSealOli = ambilNilai("standarSealOli");
  let standarSealDebu = ambilNilai("standarSealDebu");
  let standarTorak = ambilNilai("standarTorak");
  let standarMinyak = ambilNilai("standarMinyak");

  localStorage.setItem("standarPegas", standarPegas);
  localStorage.setItem("standarTabung", standarTabung);
  localStorage.setItem("standarSealOli", standarSealOli);
  localStorage.setItem("standarSealDebu", standarSealDebu);
  localStorage.setItem("standarTorak", standarTorak);
  localStorage.setItem("standarMinyak", standarMinyak);

  // ====== PEGAS ======
  let hasilPegas = ambilNilai("hasilPegas");
  let kondisiPegas = ambilNilai("kondisiPegas");

  localStorage.setItem("hasilPegas", hasilPegas);
  localStorage.setItem("kondisiPegas", kondisiPegas);

  // ====== TABUNG SUSPENSI ======
  let hasilTabung = ambilNilai("hasilTabung");
  let kondisiTabung = ambilNilai("kondisiTabung");

  localStorage.setItem("hasilTabung", hasilTabung);
  localStorage.setItem("kondisiTabung", kondisiTabung);

  // ====== SEAL OLI ======
  let hasilSealOli = ambilNilai("hasilSealOli");
  let kondisiSealOli = ambilNilai("kondisiSealOli");

  localStorage.setItem("hasilSealOli", hasilSealOli);
  localStorage.setItem("kondisiSealOli", kondisiSealOli);

  // ====== SEAL DEBU ======
  let hasilSealDebu = ambilNilai("hasilSealDebu");
  let kondisiSealDebu = ambilNilai("kondisiSealDebu");

  localStorage.setItem("hasilSealDebu", hasilSealDebu);
  localStorage.setItem("kondisiSealDebu", kondisiSealDebu);

  // ====== TORAK / DAMPER ======
  let hasilTorak = ambilNilai("hasilTorak");
  let kondisiTorak = ambilNilai("kondisiTorakGarpu");

  localStorage.setItem("hasilTorak", hasilTorak);
  localStorage.setItem("kondisiTorak", kondisiTorak);

  // ====== OLI SUSPENSI (STEP 4.2) ======
  let jenisMinyak = ambilNilai("jenisMinyak");
  let volumeMinyak = ambilNilai("volumeMinyak");
  let kondisiMinyak = ambilNilai("kondisiSetelahPengisian");

  localStorage.setItem("jenisMinyak", jenisMinyak);
  localStorage.setItem("volumeMinyak", volumeMinyak);
  localStorage.setItem("kondisiMinyak", kondisiMinyak);

  alert("✅ Hasil praktik berhasil disimpan! Silakan buka halaman Laporan.");
}

// ---------- Fungsi bantu ----------
// Ambil value dari elemen berdasarkan id.
// Mengembalikan "" kalau elemen tidak ditemukan di halaman,
// supaya tidak terjadi error "Cannot read property of null".
function ambilNilai(id) {
  let elemen = document.getElementById(id);
  return elemen ? elemen.value : "";
}

// ============================================================
// Muat ulang data tersimpan saat halaman praktik dibuka kembali
// supaya form tidak kosong kalau siswa reload / buka ulang.
// ============================================================

window.addEventListener("DOMContentLoaded", function () {
  isiUlang("standarPegas");
  isiUlang("standarTabung");
  isiUlang("standarSealOli");
  isiUlang("standarSealDebu");
  isiUlang("standarTorak");
  isiUlang("standarMinyak");

  isiUlang("hasilPegas");
  isiUlang("kondisiPegas");

  isiUlang("hasilTabung");
  isiUlang("kondisiTabung");

  isiUlang("hasilSealOli");
  isiUlang("kondisiSealOli");

  isiUlang("hasilSealDebu");
  isiUlang("kondisiSealDebu");

  isiUlang("hasilTorak", "kondisiTorakGarpu", "kondisiTorak");

  isiUlang("jenisMinyak");
  isiUlang("volumeMinyak");
  isiUlang("kondisiSetelahPengisian", null, "kondisiMinyak");
});

// Isi ulang satu elemen dari localStorage.
// idElemen       = id elemen HTML
// idElemenBeda   = pakai ini kalau id HTML beda dengan key localStorage (opsional)
// keyStorage     = nama key di localStorage (opsional, default = idElemen)
function isiUlang(idElemen, idElemenBeda, keyStorage) {
  let elemen = document.getElementById(idElemenBeda || idElemen);
  if (!elemen) return;

  let key = keyStorage || idElemen;
  let nilai = localStorage.getItem(key);

  if (nilai) elemen.value = nilai;
}
