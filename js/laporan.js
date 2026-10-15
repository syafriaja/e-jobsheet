window.onload = function () {
  let fotoPembongkaran = localStorage.getItem("fotoPembongkaran");

  let fotoPemeriksaan = localStorage.getItem("fotoPemeriksaan");

  let fotoAkhir = localStorage.getItem("fotoAkhir");

  let imgPembongkaran = document.getElementById("laporanFotoPembongkaran");

  let imgPemeriksaan = document.getElementById("laporanFotoPemeriksaan");

  let imgAkhir = document.getElementById("laporanFotoAkhir");

  if (fotoPembongkaran) {
    imgPembongkaran.src = fotoPembongkaran;
  } else {
    imgPembongkaran.style.display = "none";
  }

  if (fotoPemeriksaan) {
    imgPemeriksaan.src = fotoPemeriksaan;
  } else {
    imgPemeriksaan.style.display = "none";
  }

  if (fotoAkhir) {
    imgAkhir.src = fotoAkhir;
  } else {
    imgAkhir.style.display = "none";
  }

  // IDENTITAS

  document.getElementById("tampilNama").innerHTML =
    localStorage.getItem("namaSiswa") || "-";

  document.getElementById("tampilKelas").innerHTML =
    localStorage.getItem("kelasSiswa") || "-";

  document.getElementById("tampilKelompok").innerHTML =
    localStorage.getItem("kelompokSiswa") || "-";

  document.getElementById("tampilTanggal").innerHTML =
    localStorage.getItem("tanggalPraktik") || "-";

  // PEMERIKSAAN

  document.getElementById("laporanPegas").innerHTML =
    localStorage.getItem("hasilPegas") || "-";

  document.getElementById("statusPegas").innerHTML =
    localStorage.getItem("kondisiPegas") || "-";

  document.getElementById("laporanTabung").innerHTML =
    localStorage.getItem("hasilTabung") || "-";

  document.getElementById("statusTabung").innerHTML =
    localStorage.getItem("kondisiTabung") || "-";

  document.getElementById("laporanSealOli").innerHTML =
    localStorage.getItem("kondisiSealOli") || "-";

  document.getElementById("statusSealOli").innerHTML =
    localStorage.getItem("kondisiSealOli") || "-";

  document.getElementById("laporanSealDebu").innerHTML =
    localStorage.getItem("kondisiSealDebu") || "-";

  document.getElementById("statusSealDebu").innerHTML =
    localStorage.getItem("kondisiSealDebu") || "-";

  document.getElementById("laporanTorak").innerHTML =
    localStorage.getItem("kondisiTorak") || "-";

  document.getElementById("statusTorak").innerHTML =
    localStorage.getItem("kondisiTorak") || "-";

  let jenisMinyak = localStorage.getItem("jenisMinyak") || "-";

  let volumeMinyak = localStorage.getItem("volumeMinyak");

  document.getElementById("laporanMinyak").innerHTML = volumeMinyak
    ? jenisMinyak + " (" + volumeMinyak + ")"
    : jenisMinyak;

  document.getElementById("statusMinyak").innerHTML =
    localStorage.getItem("kondisiMinyak") || "-";
};
