// ============================================================
// dokumentasi.js
// Satu fungsi untuk SEMUA foto dokumentasi di halaman praktik.
// - Ambil foto langsung dari kamera HP atau pilih dari galeri
// - Foto dikecilkan otomatis sebelum disimpan
// - Disimpan di IndexedDB (kapasitas jauh lebih besar dari localStorage)
// - Foto lama di localStorage otomatis dipindahkan ke IndexedDB
// Key penyimpanan = id input (contoh: "fotoPembongkaran").
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

const DB_NAMA = "ejobsheet-suspensi";
const DB_STORE = "foto";

// ---------- IndexedDB ----------

let dbPromise = null;

function bukaDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise(function (resolve, reject) {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB tidak tersedia"));
      return;
    }

    const req = indexedDB.open(DB_NAMA, 1);

    req.onupgradeneeded = function () {
      req.result.createObjectStore(DB_STORE);
    };
    req.onsuccess = function () {
      resolve(req.result);
    };
    req.onerror = function () {
      reject(req.error);
    };
  });

  return dbPromise;
}

function simpanFoto(key, dataUrl) {
  return bukaDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction(DB_STORE, "readwrite");
      tx.objectStore(DB_STORE).put(dataUrl, key);
      tx.oncomplete = function () {
        resolve();
      };
      tx.onerror = function () {
        reject(tx.error);
      };
      tx.onabort = function () {
        reject(tx.error);
      };
    });
  });
}

function ambilFoto(key) {
  return bukaDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      const req = db.transaction(DB_STORE).objectStore(DB_STORE).get(key);
      req.onsuccess = function () {
        resolve(req.result || null);
      };
      req.onerror = function () {
        reject(req.error);
      };
    });
  });
}

// Ambil foto: cari di IndexedDB, kalau belum ada cek localStorage (foto lama)
// lalu pindahkan ke IndexedDB supaya jatah localStorage kosong kembali.
function muatFoto(key) {
  return ambilFoto(key)
    .then(function (data) {
      if (data) return data;

      let lama = null;
      try {
        lama = localStorage.getItem(key);
      } catch (e) {}

      if (!lama) return null;

      return simpanFoto(key, lama).then(function () {
        try {
          localStorage.removeItem(key);
        } catch (e) {}
        return lama;
      });
    })
    .catch(function () {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    });
}

// ---------- Kompres foto ----------

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

// ---------- Input foto ----------

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

    simpanFoto(storageID, hasil).catch(function () {
      // Cadangan terakhir kalau IndexedDB tidak bisa dipakai
      try {
        localStorage.setItem(storageID, hasil);
      } catch (err) {
        alert(
          "Foto tampil, tetapi tidak bisa disimpan di browser ini. " +
            "Coba buka halaman bukan di mode Private/Incognito, lalu ulangi.",
        );
      }
    });
  });
}

DAFTAR_FOTO.forEach(function (pasangan) {
  const inputID = pasangan[0];
  const previewID = pasangan[1];

  const input = document.getElementById(inputID);
  if (!input) return; // lewati kalau step ini tidak ada di halaman

  input.addEventListener("change", function () {
    tampilkanFoto(this, previewID, inputID);
  });

  muatFoto(inputID).then(function (data) {
    const preview = document.getElementById(previewID);
    if (data && preview) preview.src = data;
  });
});
