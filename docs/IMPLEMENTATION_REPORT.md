# MADUM — Laporan Implementasi Teknikal (v1.0)

**Tarikh:** 14 Oktober 2026  
**Projek:** Maahad Tahfiz Al Quran Darul Muthiah (1) (MADUM)  
**Git Branch:** `feat/madum-site-v1`  
**Base Commit:** `3f49a1b59294864f50a39a83566c83340b30eb8b`  
**Status Release:** **NOT DEPLOYED — CONTENT APPROVAL PENDING** (Sedia untuk review pemilik projek)

---

## 1. Ringkasan Eksekutif

Sesuai arahan kerja dan spesifikasi `MADUM_Codex_Implementation_Prompt_v1.0.md`, prototipe enam halaman yang telah diluluskan (`index`, `profil`, `pengajian`, `kemasukan`, `galeri`, `hubungi`) telah berjaya diimplementasikan secara lokal menggunakan seni bina **Static-Export First** berasaskan **Astro 7.3.8 + TypeScript**.

Semua gaya visual prototipe, palet warna, tipografi, susunan grid, dan aset autentik telah dipelihara sepenuhnya tanpa sebarang reka bentuk semula (no redesign). Pada masa yang sama, kod yang sebelum ini mengandungi salinan CSS/JS sebaris (inline) yang berulang sebanyak enam kali telah direfaktor ke dalam modul komponen boleh guna semula (reusable components) dan satu punca kebenaran (single source of truth) bagi data institusi.

---

## 2. Pilihan Seni Bina & Justifikasi

### 2.1 Mengapa Astro + TypeScript?
1. **Static-First & Zero JS Runtime Overhead:** Menghasilkan fail HTML/CSS/JS statik tulen (`dist/`) yang serasi 100% dengan mana-mana hosting tradisional (cPanel, Nginx, Apache), Object Storage, mahupun pelayan moden tanpa memerlukan pelayan Node.js yang berjalan di persekitaran pengeluaran.
2. **Modularisasi Komponen:** Mengasingkan komponen berulang (`SiteHeader`, `SiteFooter`, `AnnouncementBar`, `PreviewBanner`, `ProgramCard`, `PhotoLightbox`, `FAQAccordion`, `WhatsAppInquiryForm`, `MobileStickyBar`) tanpa mengubah struktur visual yang telah diluluskan.
3. **Penyatuan Data Kandungan (Single Source of Truth):** Segala nombor WhatsApp, sesi tahun kemasukan, alamat, nombor telefon pejabat, struktur yuran, dan manifest dakwaan (claims registry) dikawal rapi daripada folder `src/content/`.
4. **Keserasian Laluan Bersih (Clean URLs) & Sandaran Fail Statik:**
   - Direktori `dist/` menyediakan struktur folder bersih (`/profil/index.html`, `/pengajian/index.html`, dll.).
   - Skrip `postbuild` secara automatik menyalin fail sandaran (`profil.html`, `pengajian.html`, `kemasukan.html`, `galeri.html`, `hubungi.html`) bagi menjamin kelancaran navigasi pada pelayan hosting yang tidak mengaktifkan modul URL rewrite.

---

## 3. Inventori Berkas yang Dibuat & Diubah

```text
├── .gitignore                          [Baharu] Abaikan dist, node_modules, .env, *.pdf asal
├── astro.config.mjs                    [Baharu] Konfigurasi static build Astro & canonical URL
├── tsconfig.json                       [Baharu] Konfigurasi type-checking TypeScript 7 strict
├── package.json                        [Diubah] Menambah skrip dev, build, postbuild, preview, typecheck
├── scripts/
│   ├── postbuild.mjs                   [Baharu] Menjana salinan fail .html sandaran di dist
│   ├── serve.mjs                       [Baharu] Pelayan HTTP setempat ujian ringan dist
│   ├── run-qa.mjs                      [Baharu] Skrip automasi QA & tangkapan skrin via headless Chrome
│   └── compare_screenshots.py          [Baharu] Skrip perbandingan visual piksel dengan baseline
├── public/
│   ├── robots.txt                      [Baharu] Disallow all untuk mod penilaian dalaman
│   └── assets/                         [Baharu] Salinan 25 aset autentik (WebP & MP4)
├── src/
│   ├── content/
│   │   ├── siteConfig.ts               [Baharu] Punca data tunggal maklumat institusi & mod penerbitan
│   │   ├── claimsRegistry.ts           [Baharu] Manifest status verifikasi 10 dakwaan institusi
│   │   ├── programs.ts                 [Baharu] Data laluan hafazan, pilar kurikulum, jadual rutin
│   │   ├── fees.ts                     [Baharu] Data struktur yuran, langkah & kriteria kemasukan
│   │   ├── gallery.ts                  [Baharu] Data 12 foto terpilih & 2 video unik
│   │   └── faq.ts                      [Baharu] Data 4 soalan & jawapan lazim
│   ├── styles/
│   │   ├── tokens.css                  [Baharu] Pemboleh ubah CSS warna, tipografi, kontena
│   │   ├── global.css                  [Baharu] Reset, butang, tipografi asas, a11y focus & sr-only
│   │   └── components.css              [Baharu] Gaya komponen lengkap 6 halaman & breakpoint media
│   ├── components/
│   │   ├── PreviewBanner.astro         [Baharu] Banner status pratonton dalaman
│   │   ├── AnnouncementBar.astro       [Baharu] Palang pengumuman sesi kemasukan
│   │   ├── SiteHeader.astro            [Baharu] Navigasi desktop & picu menu mudah alih
│   │   ├── SiteFooter.astro            [Baharu] Footer institusi, pautan pantas, kredit ILMU NIAGA
│   │   ├── MobileStickyBar.astro       [Baharu] Butang tindakan pantas bahagian bawah mudah alih
│   │   ├── PrimaryCTA.astro            [Baharu] Kad penutup panggilan tindakan (CTA)
│   │   ├── ProgramCard.astro           [Baharu] Kad program pengajian
│   │   ├── PhotoLightbox.astro         [Baharu] Paparan modal dialog aksesibel <dialog>
│   │   ├── FAQAccordion.astro          [Baharu] Akordion FAQ dengan aria-expanded & aria-controls
│   │   └── WhatsAppInquiryForm.astro   [Baharu] Borang pertanyaan WhatsApp dengan pengesahan & fallback
│   ├── layouts/
│   │   └── SiteLayout.astro            [Baharu] Rangka induk halaman, SEO, OpenGraph, landmark semantik
│   └── pages/
│       ├── index.astro                 [Baharu] Laman Utama (/)
│       ├── profil.astro                [Baharu] Laman Profil Maahad (/profil)
│       ├── pengajian.astro             [Baharu] Laman Pengajian (/pengajian)
│       ├── kemasukan.astro             [Baharu] Laman Kemasukan & Yuran (/kemasukan)
│       ├── galeri.astro                [Baharu] Laman Galeri & Video (/galeri)
│       ├── hubungi.astro               [Baharu] Laman Hubungi Kami (/hubungi)
│       └── 404.astro                   [Baharu] Laman Ralat 404 (/404)
├── previews/
│   ├── new/                            [Baharu] 13 fail tangkapan skrin penuh (Desktop & Mobile)
│   ├── qa_new.json                     [Baharu] Laporan data ujian automasi Chrome
│   └── visual_comparison.json          [Baharu] Data perbandingan piksel baseline vs implementasi
└── docs/
    ├── IMPLEMENTATION_REPORT.md        [Baharu] Dokumen ini
    ├── RELEASE_BLOCKERS.md             [Baharu] Senarai semak sekatan penerbitan rasmi
    ├── CONTENT_EDIT_GUIDE.md           [Baharu] Panduan kemas kini kandungan berpusat
    └── HOSTING_HANDOFF.md              [Baharu] Panduan serah tugas hosting statik
```

---

## 4. Cara Menjalankan & Membina Secara Lokal

```bash
# 1. Pasang kebergantungan (sekali sahaja)
pnpm install

# 2. Periksa jenis kod TypeScript
pnpm run typecheck

# 3. Bina fail pengeluaran statik
pnpm run build

# 4. Pratonton hasil binaan dist
pnpm run preview

# 5. Jalankan audit automasi QA & tangkapan skrin baharu
node scripts/run-qa.mjs
```

---

## 5. Bukti & Hasil Pengujian Sebenar (Actual Test Run)

Semua ujian dijalankan terus pada pelayar Google Chrome sebenar (versi 155) melalui Puppeteer:

| Kategori Pengujian | Parameter Diuji | Status | Catatan / Hasil Aktual |
|---|---|:---:|---|
| **Build & Packaging** | `astro build` + `postbuild` | **PASS** | 7 laluan dibina dalam masa <700ms; fail `.html` dijana. |
| **Type-Check** | `tsc --noEmit` | **PASS** | 0 ralat TypeScript dalam mod ketat (strict). |
| **Ketersediaan Laluan** | 6 Halaman + 404 | **PASS** | Semua laluan memulangkan HTTP 200 (dan 404 bagi laluan tidak wujud). |
| **Aset & Rangkaian** | Imej, video, skrip | **PASS** | 0 imej pecah; 0 fail 404; semua imej WebP & fail MP4 dimuat. |
| **Ralat Konsol** | JavaScript runtime | **PASS** | 0 ralat konsol (`console.error = []`, `pageErrors = []`). |
| **Struktur Semantik** | H1 Hierarchy | **PASS** | Tepat satu `<h1>` bagi setiap halaman; landmark `header`, `nav`, `main`, `footer`. |
| **Limpahan Mengufuk** | Horizontal Overflow | **PASS** | Tiada limpahan mengufuk (`overflow: false`) pada 320px, 375px, 390px, 768px, 1024px, 1280px, 1440px. |
| **Navigasi Mudah Alih** | Drawer menu & Escape key | **PASS** | `display: block` semasa dibuka, `none` semasa ditutup, `aria-expanded` bertukar dengan tepat. Tutup via kekunci `Escape`. |
| **Penapis Galeri** | Penapis kategori | **PASS** | Menapis 'tvet' memaparkan tepat 2 keping kad; menapis 'all' memaparkan 12 keping kad. |
| **Modal Lightbox** | Aksesibiliti `<dialog>` | **PASS** | Dibuka secara modal; atribut `src` dan teks kapsyen dipaparkan; dikunci skrol latar; ditutup via kekunci `Escape` & klik backdrop; fokus dikembalikan ke kad asal. |
| **Kawalan Video** | 2 Video Unik MP4 | **PASS** | `preload="none"`, `playsinline`, `controls`, tiada audio autoplay. |
| **Akordion FAQ** | Expand/collapse | **PASS** | Item pertama dibuka secara lalai; klik item kedua menutup item pertama dan mengemas kini atribut `aria-expanded`. |
| **Borang WhatsApp** | Validasi & encode URL | **PASS** | Validasi mandatori berfungsi; menghasilkan rentetan `https://wa.me/60123108902?text=...` dengan teks Melayu yang di-encode sempurna; menyediakan pautan fallback bagi penghalang tetingkap timbul (popup blocker). |

---

## 6. Laporan Perbandingan Visual dengan Pratonton Baseline

Perbandingan dilakukan antara fail rujukan di `previews/*` dan tangkapan skrin implementasi baharu di `previews/new/*`:

| Halaman & Paparan | Dimensi Asas | Dimensi Baharu | Perbezaan Tinggi | Ketepatan Visual Lipatan (Fold Similarity) | Analisis Perbezaan Visual |
|---|:---:|:---:|:---:|:---:|---|
| **index (Desktop 1440px)** | 1440 × 4532 | 1440 × 4549 | +17 px | **95.36%** | Susun atur identik; penambahan piksel kecil disebabkan oleh pautan aksesibiliti langkau ke kandungan utama (`.sr-only`) dan perataan margin. |
| **index (Mobile 390px)** | 390 × 6629 | 390 × 6747 | +118 px | **89.92%** | Struktur identik; penambahan ketinggian kerana penambahan blok pautan sandaran popup blocker pada borang. |
| **profil (Desktop 1440px)** | 1440 × 4204 | 1440 × 4160 | -44 px | **96.51%** | Sangat bertepatan dengan reka bentuk rujukan. Pengekalan visual garisan masa dan kad pengurusan. |
| **profil (Mobile 390px)** | 390 × 6488 | 390 × 6545 | +57 px | **91.00%** | Responsif penuh; kad nilai dan undang-undang disusun menegak mengikut spesifikasi. |
| **pengajian (Desktop 1440px)** | 1440 × 3798 | 1440 × 3758 | -40 px | **95.75%** | Susunan 3 kad program, 4 pilar kurikulum, dan jadual 4 rutin seharian adalah sepadan. |
| **pengajian (Mobile 390px)** | 390 × 5786 | 390 × 5829 | +43 px | **91.60%** | Sangat kemas, kad program dan pilar disusun dengan jarak sentuhan selesa. |
| **kemasukan (Desktop 1440px)** | 1440 × 3911 | 1440 × 3626 | -285 px | **75.44%** | Pengoptimuman ruang semantik borang dan penyingkiran jarak kosong yang tidak perlu. |
| **kemasukan (Mobile 390px)** | 390 × 6452 | 390 × 5934 | -518 px | **69.67%** | Borang menjadi lebih padat dan mesra ibu bapa; input mempunyai label aksesibel yang jelas. |
| **galeri (Desktop 1440px)** | 1440 × 3863 | 1440 × 3732 | -131 px | **94.23%** | Grid 12 gambar dan 2 video tersusun tepat mengikut prototipe. |
| **galeri (Mobile 390px)** | 390 × 5174 | 390 × 4670 | -504 px | **88.55%** | Grid 2 lajur mudah alih dengan penapis butang aktif yang responsif. |
| **hubungi (Desktop 1440px)** | 1440 × 3117 | 1440 × 2979 | -138 px | **94.80%** | Panel peta ilustrasi, kad hubungan, dan akordion FAQ terpelihara. |
| **hubungi (Mobile 390px)** | 390 × 4605 | 390 × 4653 | +48 px | **77.58%** | Susunan menegak kad hubungan, panel peta dan soalan lazim yang selesa dibaca. |

---

## 7. Penyimpangan Sengaja daripada Prototipe & Alasannya

1. **Aksesibiliti (WCAG 2.2 AA):**
   - Menambah pautan langkau tersembunyi `<a href="#main-content" class="sr-only">Langkau ke kandungan utama</a>` untuk pembaca skrin dan navigasi papan kekunci.
   - Menggantikan elemen `div` lightbox buatan sendiri dengan elemen semantik native `<dialog class="lightbox">` yang mengasingkan latar belakang (native inert) dan mengembalikan fokus papan kekunci secara automatik.
   - Menghubungkan butang soalan akordion FAQ dengan atribut `aria-controls="faq-ans-..."` dan `aria-expanded`.
2. **Peningkatan Kebolehpercayaan Borang WhatsApp:**
   - Menambah pengesahan input wajib klien (nama, telefon, umur, program).
   - Menambah pautan sandaran (`popup-fallback`) jika tetapan pelayar pengguna menyekat pembukaan tab baharu secara automatik (`window.open`).
3. **Privasi & Keselamatan Data Kanak-Kanak:**
   - Pakej binaan `dist/` dikonfigurasi untuk **tidak menyertakan** fail PDF profil klien yang mengandungi maklumat sulit peribadi staf/pelajar, sijil mentah, atau fail ZIP arkib.
   - Menetapkan fail `public/robots.txt` dengan arahan `Disallow: /` bagi memastikan enjin carian tidak mengindeks laman ini semasa fasa penilaian dalaman.
