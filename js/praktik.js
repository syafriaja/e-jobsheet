function simpanPraktik() {
  let hasilPegas = document.getElementById("hasilPegas").value;

  let kondisiPegas = document.getElementById("kondisiPegas").value;

  localStorage.setItem("hasilPegas", hasilPegas);

  localStorage.setItem("kondisiPegas", kondisiPegas);

  let hasilTabung = document.getElementById("hasilTabung")
    ? document.getElementById("hasilTabung").value
    : "";

  let kondisiTabung = document.getElementById("kondisiTabung")
    ? document.getElementById("kondisiTabung").value
    : "";

  localStorage.setItem("hasilTabung", hasilTabung);

  localStorage.setItem("kondisiTabung", kondisiTabung);

  let kondisiSealOli = document.getElementById("kondisiSealOli")
    ? document.getElementById("kondisiSealOli").value
    : "";

  let kondisiSealDebu = document.getElementById("kondisiSealDebu")
    ? document.getElementById("kondisiSealDebu").value
    : "";

  let kondisiTorak = document.getElementById("kondisiTorakGarpu")
    ? document.getElementById("kondisiTorakGarpu").value
    : "";

  localStorage.setItem("kondisiSealOli", kondisiSealOli);

  localStorage.setItem("kondisiSealDebu", kondisiSealDebu);

  localStorage.setItem("kondisiTorak", kondisiTorak);

  let jenisMinyak = document.getElementById("jenisMinyak")
    ? document.getElementById("jenisMinyak").value
    : "";

  let volumeMinyak = document.getElementById("volumeMinyak")
    ? document.getElementById("volumeMinyak").value
    : "";

  let kondisiMinyak = document.getElementById("kondisiSetelahPengisian")
    ? document.getElementById("kondisiSetelahPengisian").value
    : "";

  localStorage.setItem("jenisMinyak", jenisMinyak);

  localStorage.setItem("volumeMinyak", volumeMinyak);

  localStorage.setItem("kondisiMinyak", kondisiMinyak);
}
