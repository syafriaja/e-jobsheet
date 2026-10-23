/* =====================================================================
   ui.js — lapisan tampilan E-Jobsheet
   Hanya mengatur tampilan dan umpan balik. TIDAK mengubah fungsi di
   praktik.js / identitas.js / dokumentasi.js / laporan.js / evaluasi.js
   dan TIDAK menulis ke localStorage.
   ===================================================================== */
(function () {
  "use strict";

  var doc = document;

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || doc).querySelectorAll(selector));
  }

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  /* ---------- Notifikasi singkat ---------- */
  var toastEl = null;
  var toastTimer = null;

  function toast(message, type) {
    if (!toastEl) {
      toastEl = doc.createElement("div");
      toastEl.id = "uiToast";
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      doc.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.className = "toast" + (type === "error" ? " error" : "");
    // paksa reflow agar transisi berjalan ulang
    void toastEl.offsetWidth;
    toastEl.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove("show");
    }, 3500);
  }

  /* ---------- Navbar: tombol menu ponsel + halaman aktif ---------- */
  function setupNav() {
    var nav = doc.querySelector(".navbar");
    if (!nav) return;

    var button = nav.querySelector(".nav-toggle");
    if (button) {
      button.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        button.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        if (button) button.setAttribute("aria-expanded", "false");
      }
    });

    var current = window.location.pathname.split("/").pop() || "index.html";
    qsa("a", nav).forEach(function (link) {
      var target = (link.getAttribute("href") || "").split("/").pop();
      if (target === current) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Baris daftar: "1. ...", "✓ ...", "☐ ...", "⚠ ..." ---------- */
  function enhanceLines() {
    qsa("p").forEach(function (p) {
      if (p.children.length > 0 || p.classList.contains("line-item")) return;
      var text = p.textContent.replace(/\s+/g, " ").trim();
      var kind = "";
      var marker = "";
      var rest = "";
      var match;

      if ((match = /^(\d{1,2})\.\s+(.+)$/.exec(text))) {
        kind = "num";
        marker = String(parseInt(match[1], 10));
        rest = match[2];
      } else if ((match = /^(✓|☐|⚠)\s*(.+)$/.exec(text))) {
        kind = match[1] === "✓" ? "tick" : match[1] === "☐" ? "box" : "warn";
        marker = match[1];
        rest = match[2];
      } else {
        return;
      }

      p.textContent = "";
      p.className =
        (p.className ? p.className + " " : "") + "line-item " + kind;

      var mk = doc.createElement("span");
      mk.className = "mk";
      mk.setAttribute("aria-hidden", "true");
      mk.textContent = marker;

      var tx = doc.createElement("span");
      tx.className = "tx";
      tx.textContent = rest;

      p.appendChild(mk);
      p.appendChild(tx);
    });
  }

  /* ---------- Pilihan (checkbox / radio) sebagai baris besar ---------- */
  function refreshChoice(input) {
    var label = input.closest("label");
    if (!label) return;
    if (input.type === "radio" && input.name) {
      qsa('input[type="radio"]').forEach(function (other) {
        if (other.name === input.name && other.closest("label")) {
          other.closest("label").classList.toggle("is-checked", other.checked);
        }
      });
    } else {
      label.classList.toggle("is-checked", input.checked);
    }
  }

  function enhanceChoices() {
    qsa("label").forEach(function (label) {
      var input = label.querySelector(
        'input[type="checkbox"], input[type="radio"]',
      );
      if (input) {
        label.classList.add("choice");
        refreshChoice(input);
      }
    });
    doc.addEventListener("change", function (event) {
      var t = event.target;
      if (
        t &&
        t.tagName === "INPUT" &&
        (t.type === "checkbox" || t.type === "radio")
      ) {
        refreshChoice(t);
      }
    });
  }

  /* ---------- Tabel: pembungkus + label kolom untuk tampilan ponsel ---------- */
  function setupTables() {
    qsa("table.inspection-table").forEach(function (table) {
      if (!table.parentNode.classList.contains("table-wrap")) {
        var wrap = doc.createElement("div");
        wrap.className = "table-wrap";
        table.parentNode.insertBefore(wrap, table);
        wrap.appendChild(table);
      }

      var rows = qsa("tr", table);
      var head = null;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].querySelector("th")) {
          head = rows[i];
          break;
        }
      }
      if (!head) return;

      head.classList.add("is-head");
      var labels = qsa("th", head).map(function (th) {
        return th.textContent.trim();
      });

      rows.forEach(function (row) {
        if (row === head) return;
        qsa("td", row).forEach(function (cell, index) {
          if (labels[index]) cell.setAttribute("data-label", labels[index]);
        });
      });
    });
  }

  /* ---------- Textarea otomatis melebar saat cetak ---------- */
  function fitTextarea(area) {
    area.style.height = "auto";
    area.style.height = area.scrollHeight + 4 + "px";
  }

  function setupPrintTextareas() {
    var areas = qsa("textarea");
    areas.forEach(function (area) {
      area.addEventListener("input", function () {
        fitTextarea(area);
      });
    });
    window.addEventListener("beforeprint", function () {
      areas.forEach(fitTextarea);
    });
  }

  /* ---------- Umpan balik saat menyimpan ---------- */
  function setupSaveFeedback() {
    qsa("button[onclick]").forEach(function (button) {
      var handler = button.getAttribute("onclick") || "";

      if (handler.indexOf("simpanPraktik") !== -1) {
        button.addEventListener("click", function () {
          if (readStorage("hasilPegas") !== null) {
            toast(
              "✓ Hasil praktik tersimpan. Lanjutkan ke laporan bila sudah selesai.",
            );
          } else {
            toast(
              "⚠ Data belum tersimpan. Periksa pengaturan penyimpanan browser.",
              "error",
            );
          }
        });
      }

      if (handler.indexOf("simpanIdentitas") !== -1) {
        button.addEventListener("click", function () {
          var nama = readStorage("namaSiswa");
          if (nama) {
            toast("✓ Identitas siswa tersimpan.");
          } else {
            toast(
              "⚠ Nama siswa masih kosong. Isi nama lalu simpan lagi.",
              "error",
            );
          }
        });
      }

      if (handler.indexOf("cekNilai") !== -1) {
        button.addEventListener("click", function () {
          window.setTimeout(function () {
            var hasil = doc.getElementById("hasil");
            if (hasil && hasil.scrollIntoView) {
              hasil.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
          }, 50);
        });
      }
    });
  }
  /* Foto: dokumentasi.js menyimpan foto ke IndexedDB (dengan localStorage
     sebagai cadangan). Pemeriksaan di sini memakai muatFoto() dari
     dokumentasi.js supaya hasilnya akurat untuk kedua jenis penyimpanan. */
  function setupPhotoFeedback() {
    qsa('input[type="file"][id^="foto"]').forEach(function (input) {
      input.addEventListener("change", function () {
        if (!input.files || !input.files[0]) return;

        var preview = doc.getElementById("preview" + input.id.slice(4));
        var initial = preview ? preview.getAttribute("src") : null;
        var tries = 0;

        function verify() {
          var current = preview ? preview.getAttribute("src") : null;

          if (typeof window.muatFoto === "function") {
            window.muatFoto(input.id).then(function (saved) {
              if (current && saved && saved === current) {
                toast("✓ Foto tersimpan.");
              } else {
                toast(
                  "⚠ Foto belum tersimpan (kemungkinan ukurannya terlalu besar). Coba foto dengan ukuran lebih kecil.",
                  "error",
                );
              }
            });
          } else {
            // Cadangan kalau muatFoto() entah kenapa tidak tersedia
            var saved = readStorage(input.id);
            if (current && saved && saved === current) {
              toast("✓ Foto tersimpan.");
            } else {
              toast(
                "⚠ Foto belum tersimpan (kemungkinan ukurannya terlalu besar). Coba foto dengan ukuran lebih kecil.",
                "error",
              );
            }
          }
        }

        (function wait() {
          tries += 1;
          var current = preview ? preview.getAttribute("src") : null;
          if (current && current !== initial) {
            verify();
          } else if (tries < 24) {
            window.setTimeout(wait, 250);
          } else {
            verify();
          }
        })();
      });
    });
  }

  /* ---------- Progres praktik (halaman praktik) ---------- */
  function setupProgress() {
    var cards = qsa(".step-card");
    var boxes = qsa('.step-card input[type="checkbox"]');
    if (!cards.length) return;

    var bar = doc.createElement("div");
    bar.className = "praktik-progress no-print";
    bar.setAttribute("role", "status");
    bar.innerHTML =
      '<div class="pp-row"><span class="pp-step"></span><span class="pp-count"></span></div>' +
      '<div class="pp-track"><div class="pp-fill"></div></div>';

    var nav = doc.querySelector(".navbar");
    if (nav && nav.parentNode) {
      nav.parentNode.insertBefore(bar, nav.nextSibling);
    } else {
      doc.body.insertBefore(bar, doc.body.firstChild);
    }

    var stepText = bar.querySelector(".pp-step");
    var countText = bar.querySelector(".pp-count");
    var fill = bar.querySelector(".pp-fill");

    // penghitung per langkah
    var counters = cards.map(function (card) {
      var inside = qsa('input[type="checkbox"]', card);
      if (!inside.length) return null;
      var badge = card.querySelector("h3");
      var span = doc.createElement("span");
      span.className = "step-count";
      if (badge && badge.parentNode === card) {
        badge.parentNode.insertBefore(span, badge.nextSibling);
      } else {
        card.insertBefore(span, card.firstChild);
      }
      return { boxes: inside, el: span };
    });

    function label(card) {
      var badge = card.querySelector("h3");
      var title = card.querySelector("h2");
      return (
        (badge ? badge.textContent.trim() : "") +
        (title ? " · " + title.textContent.trim() : "")
      );
    }

    function update() {
      var done = boxes.filter(function (b) {
        return b.checked;
      }).length;
      var total = boxes.length;
      countText.textContent = "Checklist " + done + "/" + total;
      fill.style.width = (total ? Math.round((done / total) * 100) : 0) + "%";

      counters.forEach(function (c) {
        if (!c) return;
        var d = c.boxes.filter(function (b) {
          return b.checked;
        }).length;
        c.el.textContent = "✓ " + d + "/" + c.boxes.length;
      });
    }

    var ticking = false;
    function updateCurrent() {
      ticking = false;
      var line = window.innerHeight * 0.3;
      var active = null;
      cards.forEach(function (card) {
        if (card.getBoundingClientRect().top <= line) active = card;
      });
      stepText.textContent = active
        ? label(active)
        : "Mulai dari Identitas Siswa";
    }

    doc.addEventListener("change", function (event) {
      if (event.target && event.target.type === "checkbox") update();
    });
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateCurrent);
        }
      },
      { passive: true },
    );

    update();
    updateCurrent();
  }

  /* ---------- Laporan: tandai kotak foto yang kosong ---------- */
  function markEmptyPhotos() {
    function mark() {
      qsa(".report-photo").forEach(function (box) {
        var img = box.querySelector("img");
        var empty =
          !img || img.style.display === "none" || !img.getAttribute("src");
        box.classList.toggle("is-empty", empty);
      });
    }
    // laporan.js mengisi foto pada window.onload; jalankan setelahnya
    window.addEventListener("load", function () {
      window.setTimeout(mark, 0);
    });
    window.addEventListener("beforeprint", mark);
  }

  /* ---------- Jalankan ---------- */
  function init() {
    setupNav();
    enhanceLines();
    enhanceChoices();
    setupTables();
    setupSaveFeedback();
    setupPhotoFeedback();

    var body = doc.body;
    if (body.classList.contains("page-praktik")) setupProgress();
    if (body.classList.contains("page-laporan")) {
      setupPrintTextareas();
      markEmptyPhotos();
    }
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
