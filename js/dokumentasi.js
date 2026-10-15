function tampilkanFoto(input, previewID, storageID) {
  let file = input.files[0];

  if (file) {
    let reader = new FileReader();

    reader.onload = function (e) {
      document.getElementById(previewID).src = e.target.result;

      localStorage.setItem(storageID, e.target.result);
    };

    reader.readAsDataURL(file);
  }
}

document
  .getElementById("fotoPembongkaran")
  .addEventListener("change", function () {
    tampilkanFoto(this, "previewPembongkaran", "fotoPembongkaran");
  });

document
  .getElementById("fotoPemeriksaan")
  .addEventListener("change", function () {
    tampilkanFoto(this, "previewPemeriksaan", "fotoPemeriksaan");
  });

document.getElementById("fotoAkhir").addEventListener("change", function () {
  tampilkanFoto(this, "previewAkhir", "fotoAkhir");
});
