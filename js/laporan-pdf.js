// ============================================================
// laporan-pdf.js
// Tombol "Unduh PDF" yang bekerja di HP maupun laptop, tanpa dialog cetak.
// Memakai html2canvas + jsPDF (dimuat dari CDN di laporan.html).
// Laporan dirender per bagian (dan per foto) supaya tidak melebihi batas
// ukuran canvas di HP, lalu disusun ke halaman A4.
// ============================================================

(function () {
  const tombol = document.getElementById("btnUnduhPdf");
  if (!tombol) return;

  const LEBAR_RENDER = 800; // lebar laporan saat dirender (px)
  const HALAMAN_W = 210; // A4 (mm)
  const HALAMAN_H = 297;
  const MARGIN = 10;
  const ISI_W = HALAMAN_W - MARGIN * 2;
  const ISI_H = HALAMAN_H - MARGIN * 2;
  const JEDA = 2; // jarak antar bagian (mm)

  const teksAwal = tombol.textContent;

  function namaFile() {
    const el = document.getElementById("tampilNama");
    let nama = el ? el.textContent.trim() : "";
    if (!nama || nama === "-") nama = "Siswa";
    nama = nama.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-");
    return "Laporan-Praktik-Suspensi-" + (nama || "Siswa") + ".pdf";
  }

  // Siapkan salinan laporan di luar layar, dibagi menjadi blok-blok
  function siapkanStage() {
    const stage = document.createElement("div");
    stage.className = "pdf-stage";
    stage.style.cssText =
      "position:absolute;left:-10000px;top:0;background:#fff;width:" +
      LEBAR_RENDER +
      "px;";

    const gaya = document.createElement("style");
    gaya.textContent =
      ".pdf-stage, .pdf-stage * { opacity:1 !important; transform:none !important;" +
      " animation:none !important; transition:none !important; }" +
      ".pdf-stage .pdf-textarea { white-space:pre-wrap; word-wrap:break-word;" +
      " border:1px solid #bbb; border-radius:6px; padding:10px; min-height:70px;" +
      " background:#fff; color:#111; font:inherit; }" +
      ".pdf-stage .pdf-foto { padding:8px 24px; text-align:center; background:#fff; }" +
      ".pdf-stage .pdf-foto h3 { text-align:left; margin:0 0 8px; }" +
      ".pdf-stage .pdf-foto img { display:block; margin:0 auto; width:auto; height:auto;" +
      " max-width:100%; max-height:520px; }";
    stage.appendChild(gaya);

    const asli = Array.from(document.querySelectorAll("body > section")).filter(
      function (s) {
        return !s.classList.contains("no-print");
      },
    );

    asli.forEach(function (sec) {
      const salinan = sec.cloneNode(true);

      // textarea: salin isi yang diketik siswa ke <div> agar ikut tercetak
      const taAsli = sec.querySelectorAll("textarea");
      salinan.querySelectorAll("textarea").forEach(function (ta, i) {
        const div = document.createElement("div");
        div.className = "pdf-textarea";
        div.textContent = (taAsli[i] && taAsli[i].value.trim()) || "-";
        ta.parentNode.replaceChild(div, ta);
      });

      salinan.querySelectorAll(".no-print").forEach(function (n) {
        n.remove();
      });

      // foto dipisah menjadi blok sendiri-sendiri
      const foto = [];
      salinan.querySelectorAll(".report-photo").forEach(function (f) {
        if (f.style.display === "none") {
          f.remove();
          return;
        }
        const blok = document.createElement("div");
        blok.className = "pdf-foto";
        blok.appendChild(f.cloneNode(true));
        foto.push(blok);
        f.remove();
      });

      stage.appendChild(salinan);
      foto.forEach(function (b) {
        stage.appendChild(b);
      });
    });

    document.body.appendChild(stage);
    return stage;
  }

  // Taruh satu canvas ke PDF, pindah halaman bila perlu
  function tambahCanvas(doc, canvas, posisi) {
    const tinggi = (canvas.height * ISI_W) / canvas.width;

    if (tinggi <= ISI_H) {
      if (posisi.y + tinggi > HALAMAN_H - MARGIN) {
        doc.addPage();
        posisi.y = MARGIN;
      }
      doc.addImage(
        canvas.toDataURL("image/jpeg", 0.85),
        "JPEG",
        MARGIN,
        posisi.y,
        ISI_W,
        tinggi,
      );
      posisi.y += tinggi + JEDA;
      return;
    }

    // blok lebih tinggi dari satu halaman: potong per halaman
    const pxPerHalaman = Math.floor((ISI_H * canvas.width) / ISI_W);
    let sy = 0;
    if (posisi.y > MARGIN) {
      doc.addPage();
      posisi.y = MARGIN;
    }
    while (sy < canvas.height) {
      const sh = Math.min(pxPerHalaman, canvas.height - sy);
      const potong = document.createElement("canvas");
      potong.width = canvas.width;
      potong.height = sh;
      potong.getContext("2d").drawImage(canvas, 0, sy, canvas.width, sh, 0, 0, canvas.width, sh);
      const th = (sh * ISI_W) / canvas.width;
      doc.addImage(potong.toDataURL("image/jpeg", 0.85), "JPEG", MARGIN, MARGIN, ISI_W, th);
      sy += sh;
      if (sy < canvas.height) doc.addPage();
      posisi.y = MARGIN + th + JEDA;
    }
  }

  async function buatPdf() {
    if (!window.html2canvas || !window.jspdf || !window.jspdf.jsPDF) {
      alert(
        "Komponen pembuat PDF belum termuat. Pastikan internet aktif lalu muat ulang halaman, " +
          "atau gunakan tombol Cetak.",
      );
      return;
    }

    tombol.disabled = true;
    tombol.textContent = "⏳ Menyiapkan PDF...";

    let stage = null;

    try {
      stage = siapkanStage();

      // beri waktu gambar di salinan selesai dimuat
      await new Promise(function (r) {
        setTimeout(r, 400);
      });

      const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
      const posisi = { y: MARGIN };
      const skala = Math.min(2, Math.max(1.25, window.devicePixelRatio || 1.5));

      const blok = Array.from(stage.children).filter(function (el) {
        return el.tagName !== "STYLE" && el.offsetHeight > 0;
      });

      for (let i = 0; i < blok.length; i++) {
        tombol.textContent = "⏳ Menyiapkan PDF... (" + (i + 1) + "/" + blok.length + ")";

        const canvas = await window.html2canvas(blok[i], {
          scale: skala,
          useCORS: true,
          backgroundColor: "#ffffff",
          windowWidth: LEBAR_RENDER,
          logging: false,
        });

        tambahCanvas(doc, canvas, posisi);
      }

      doc.save(namaFile());
    } catch (err) {
      console.error(err);
      alert(
        "PDF gagal dibuat. Coba muat ulang halaman, atau gunakan tombol Cetak. " +
          "Kalau masih gagal, kurangi jumlah foto atau coba browser lain.",
      );
    } finally {
      if (stage && stage.parentNode) stage.parentNode.removeChild(stage);
      tombol.disabled = false;
      tombol.textContent = teksAwal;
    }
  }

  tombol.addEventListener("click", buatPdf);
})();
