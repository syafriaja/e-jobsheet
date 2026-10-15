function cekNilai() {
  let totalSoal = 9;

  let jumlahBenar = 0;

  for (let i = 1; i <= totalSoal; i++) {
    let jawaban = document.querySelector('input[name="q' + i + '"]:checked');

    if (jawaban && jawaban.value === "1") {
      jumlahBenar++;
    }
  }

  let nilai = Math.round((jumlahBenar / totalSoal) * 100);

  let keterangan = "";

  if (jumlahBenar === totalSoal) {
    keterangan = "Sangat Baik! Pemahaman kamu tentang sistem suspensi depan sudah sangat baik.";
  } else if (jumlahBenar >= totalSoal - 2) {
    keterangan = "Baik. Sebagian besar konsep sistem suspensi sudah kamu pahami.";
  } else if (jumlahBenar >= Math.ceil(totalSoal / 2)) {
    keterangan = "Cukup. Pelajari kembali beberapa bagian materi sistem suspensi.";
  } else {
    keterangan = "Perlu Belajar Lagi. Silakan pelajari kembali materi sebelum melanjutkan praktik.";
  }

  document.getElementById("hasil").innerHTML =
    "Skor Anda: " + jumlahBenar + " / " + totalSoal + " (Nilai: " + nilai + ") — " + keterangan;
}
