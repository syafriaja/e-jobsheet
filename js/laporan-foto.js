// ============================================================
// laporan-foto.js
// Menampilkan semua foto dokumentasi di halaman laporan.
// Setiap <img data-foto="..."> diisi dari localStorage dengan key yang sama
// dengan id input di praktik.html. Foto yang belum diambil disembunyikan,
// jadi laporan cetak tidak berisi kotak kosong.
// Letakkan SETELAH laporan.js.
// ============================================================

document.querySelectorAll("img[data-foto]").forEach(function (img) {
  const data = localStorage.getItem(img.dataset.foto);
  const kotak = img.closest(".report-photo");

  if (data) {
    img.src = data;
  } else if (kotak) {
    kotak.style.display = "none";
  }
});
