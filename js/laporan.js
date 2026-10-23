// ============================================================
// laporan.js
// Mengambil seluruh data dari localStorage (diisi siswa di halaman
// praktik.html) dan menampilkannya di halaman laporan.html.
//
// Catatan: dokumentasi foto TIDAK ditangani di sini.
// Foto ditangani sepenuhnya oleh laporan-foto.js (IndexedDB).
// ============================================================

window.onload = function () {
  // ====== IDENTITAS SISWA ======
  tampilkan("tampilNama", localStorage.getItem("namaSiswa"));
  tampilkan("tampilKelas", localStorage.getItem("kelasSiswa"));
  tampilkan("tampilKelompok", localStorage.getItem("kelompokSiswa"));
  tampilkan("tampilTanggal", localStorage.getItem("tanggalPraktik"));

  // ====== PEGAS ======
  tampilkan("standarPegas", localStorage.getItem("standarPegas"));
  tampilkan("laporanPegas", localStorage.getItem("hasilPegas"));
  tampilkan("statusPegas", localStorage.getItem("kondisiPegas"));

  // ====== TABUNG SUSPENSI ======
  tampilkan("standarTabung", localStorage.getItem("standarTabung"));
  tampilkan("laporanTabung", localStorage.getItem("hasilTabung"));
  tampilkan("statusTabung", localStorage.getItem("kondisiTabung"));

  // ====== SEAL OLI ======
  tampilkan("standarSealOli", localStorage.getItem("standarSealOli"));
  tampilkan("laporanSealOli", localStorage.getItem("hasilSealOli"));
  tampilkan("statusSealOli", localStorage.getItem("kondisiSealOli"));

  // ====== SEAL DEBU ======
  tampilkan("standarSealDebu", localStorage.getItem("standarSealDebu"));
  tampilkan("laporanSealDebu", localStorage.getItem("hasilSealDebu"));
  tampilkan("statusSealDebu", localStorage.getItem("kondisiSealDebu"));

  // ====== TORAK / DAMPER ======
  tampilkan("standarTorak", localStorage.getItem("standarTorak"));
  tampilkan("laporanTorak", localStorage.getItem("hasilTorak"));
  tampilkan("statusTorak", localStorage.getItem("kondisiTorak"));

  // ====== OLI SUSPENSI ======
  tampilkan("standarMinyak", localStorage.getItem("standarMinyak"));

  let jenisMinyak = localStorage.getItem("jenisMinyak") || "";
  let volumeMinyak = localStorage.getItem("volumeMinyak") || "";

  let hasilMinyak = "-";
  if (jenisMinyak && volumeMinyak) {
    hasilMinyak = jenisMinyak + " (" + volumeMinyak + ")";
  } else if (jenisMinyak) {
    hasilMinyak = jenisMinyak;
  } else if (volumeMinyak) {
    hasilMinyak = volumeMinyak;
  }

  tampilkan("laporanMinyak", hasilMinyak);
  tampilkan("statusMinyak", localStorage.getItem("kondisiMinyak"));
};

// ---------- Fungsi bantu ----------
// Mengisi innerHTML elemen berdasarkan id.
// Kalau elemen tidak ada di halaman, atau nilainya kosong,
// otomatis diisi tanda "-" supaya laporan tetap rapi.
function tampilkan(id, nilai) {
  let elemen = document.getElementById(id);
  if (!elemen) return;

  elemen.innerHTML = nilai && nilai.trim() !== "" ? nilai : "-";
}
