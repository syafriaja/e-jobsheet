function simpanIdentitas() {
  let nama = document.getElementById("namaSiswa").value;

  let kelas = document.getElementById("kelasSiswa").value;

  let kelompok = document.getElementById("kelompokSiswa").value;

  let tanggal = document.getElementById("tanggalPraktik").value;

  localStorage.setItem("namaSiswa", nama);

  localStorage.setItem("kelasSiswa", kelas);

  localStorage.setItem("kelompokSiswa", kelompok);

  localStorage.setItem("tanggalPraktik", tanggal);
}
