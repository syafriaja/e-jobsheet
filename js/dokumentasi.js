// ============================================================
// dokumentasi.js
// Satu fungsi untuk SEMUA foto dokumentasi di halaman praktik.
// - Ambil foto langsung dari kamera HP atau pilih dari galeri
// - Foto dikecilkan otomatis (tidak peduli sebesar apa hasil kamera)
// - Preview tampil, tersimpan di localStorage, dan tampil lagi saat
//   halaman dibuka ulang
// Key penyimpanan = id input (contoh: "fotoPembongkaran"), sama seperti
// sebelumnya, jadi laporan.js yang lama tetap bisa membacanya.
// ============================================================

const DAFTAR_FOTO = [
  ["fotoPemeriksaanAwal", "previewPemeriksaanAwal"], // Step 1
  ["fotoPembongkaran", "previewPembongkaran"], // Step 2
  ["fotoPegasLepas", "previewPegasLepas"], // Step 2.2
  ["fotoMinyakKeluar", "previewMinyakKeluar"], // Step 2.3
  ["fotoSealLepas", "previewSealLepas"], // Step 2.4
  ["fotoTorakTabung", "previewTorakTabung"], // Step 2.5
  ["fotoPemeriksaan", "previewPemeriksaan"], // Step 3
  ["fotoPersiapanOli", "previewPersiapanOli"], // Step 4.1
  ["fotoPengisianOli", "previewPengisianOli"], // Step 4.2
  ["fotoSebelumPerakitan", "previewSebelumPerakitan"], // Step 4.3
  ["fotoPasangTorak", "previewPasangTorak"], // Step 5.1
  ["fotoPasangPegas", "previewPasangPegas"], // Step 5.2
  ["fotoPasangSeal", "previewPasangSeal"], // Step 5.3
  ["fotoPasangGarpu", "previewPasangGarpu"], // Step 5.4
  ["fotoPemeriksaanAkhir", "previewPemeriksaanAkhir"], // Step 5.5
  ["fotoAkhir", "previewAkhir"], // Step 6
];

const FOTO_LEBAR_MAKS = 1280; // piksel
const FOTO_KUALITAS = 0.75; // kualitas JPEG (0 - 1)

// Kecilkan foto lewat canvas, hasilnya data URL JPEG
function kecilkanFoto(file, callback) {
  const reader = new FileReader();

  reader.onerror = function () {
    callback(null);
  };

  reader.onload = function (e) {
    const img = new Image();

    img.onerror = function () {
      callback(null);
    };

    img.onload = function () {
      let lebar = img.width;
      let tinggi = img.height;

      if (lebar > FOTO_LEBAR_MAKS) {
        tinggi = Math.round((tinggi * FOTO_LEBAR_MAKS) / lebar);
        lebar = FOTO_LEBAR_MAKS;
      }

      const canvas = document.createElement("canvas");
      canvas.width = lebar;
      canvas.height = tinggi;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, lebar, tinggi);
      ctx.drawImage(img, 0, 0, lebar, tinggi);

      callback(canvas.toDataURL("image/jpeg", FOTO_KUALITAS));
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

function tampilkanFoto(input, previewID, storageID) {
  const file = input.files && input.files[0];
  if (!file) return;

  const preview = document.getElementById(previewID);

  kecilkanFoto(file, function (hasil) {
    if (!hasil) {
      alert("Foto tidak dapat dibaca. Silakan coba ambil foto lagi.");
      return;
    }

    if (preview) preview.src = hasil;

    try {
      localStorage.setItem(storageID, hasil);
    } catch (err) {
      alert(
        "Foto tampil, tetapi penyimpanan browser penuh sehingga foto ini tidak tersimpan. " +
          "Hapus data situs ini atau kurangi jumlah foto, lalu coba lagi.",
      );
    }
  });
}

// Pasang ke semua input foto + tampilkan foto yang sudah tersimpan
DAFTAR_FOTO.forEach(function (pasangan) {
  const inputID = pasangan[0];
  const previewID = pasangan[1];

  const input = document.getElementById(inputID);
  if (!input) return; // lewati kalau step ini tidak ada di halaman

  input.addEventListener("change", function () {
    tampilkanFoto(this, previewID, inputID);
  });

  const tersimpan = localStorage.getItem(inputID);
  const preview = document.getElementById(previewID);
  if (tersimpan && preview) preview.src = tersimpan;
});
