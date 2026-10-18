// ============================================================
// laporan-foto.js
// Menampilkan semua foto dokumentasi di halaman laporan.
// Setiap <img data-foto="..."> diisi dari IndexedDB (atau localStorage untuk
// foto lama) dengan key yang sama dengan id input di praktik.html.
// Foto yang belum diambil disembunyikan, jadi laporan cetak tidak berisi
// kotak kosong. Letakkan SETELAH laporan.js.
// ============================================================

const DB_NAMA = "ejobsheet-suspensi";
const DB_STORE = "foto";

function bukaDB() {
  return new Promise(function (resolve, reject) {
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
}

function ambilFoto(db, key) {
  return new Promise(function (resolve, reject) {
    const req = db.transaction(DB_STORE).objectStore(DB_STORE).get(key);
    req.onsuccess = function () {
      resolve(req.result || null);
    };
    req.onerror = function () {
      reject(req.error);
    };
  });
}

function fotoLama(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function isiGaleriLaporan() {
  const daftar = document.querySelectorAll("img[data-foto]");

  bukaDB()
    .catch(function () {
      return null;
    })
    .then(function (db) {
      daftar.forEach(function (img) {
        const key = img.dataset.foto;
        const kotak = img.closest(".report-photo");

        const cari = db
          ? ambilFoto(db, key).catch(function () {
              return null;
            })
          : Promise.resolve(null);

        cari.then(function (data) {
          data = data || fotoLama(key);

          if (data) {
            img.src = data;
          } else if (kotak) {
            kotak.style.display = "none";
          }
        });
      });
    });
}

isiGaleriLaporan();
