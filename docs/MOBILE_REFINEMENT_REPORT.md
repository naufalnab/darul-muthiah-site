# MADUM — Mobile UX Refinement

## Baseline dan ruang kerja

Implementasi menggunakan worktree terpisah `MADUM-mobile-refinement`, branch `feat/madum-mobile-refinement`, dari commit desktop stabil `78cfed2cf45f3009a568307d8032fa1d873ef969`. PR ini ditumpuk di atas `feat/madum-phase3-real-content` dan bergantung pada [Draft PR #4](https://github.com/naufalnab/darul-muthiah-site/pull/4). Tidak ada rewrite history, merge, deployment atau perubahan cPanel. Checkout desktop dan perubahan lokal lain tidak disentuh.

Referensi sebelum diberi label berbeda: **UIUX-v1.0** adalah artefak build lama yang tersedia lokal; **Phase3-78cfed2** adalah baseline desktop terakhir. Enam PDF screenshot yang disebut brief tidak tersedia sebagai attachment lokal; gambar pengganti tidak diklaim berasal dari PDF tersebut. [Provenance](../previews/mobile-refinement/before/provenance.json) merekam asal capture. Baseline desktop dibangun ulang dari `git archive` commit tetap untuk perbandingan geometri.

## Temuan dan perbaikan P0

Baseline Phase3 mereproduksi kepadatan banner/header, hero panjang sebelum foto, menu tanpa perilaku modal lengkap, serta CTA hero/menu/sticky yang dapat hadir bersamaan. Tidak ditemukan tombol WhatsApp mengambang kedua dalam source Phase3. Menu kini menggunakan native dialog, backdrop, tombol tutup, focus loop, Escape, pengembalian fokus, scroll lock dan reset saat navigasi/Back/Forward/resize. `aria-controls` menunjuk modal yang benar.

Satu CTA persisten muncul setelah hero pada lebar sampai 767 px. CTA disembunyikan ketika menu/lightbox terbuka, input sedang diedit, viewport keyboard menyempit, area formulir atau CTA akhir terlihat. Safe-area inset diterapkan dan footer menyediakan ruang. Tidak ada kontak atau pendaftaran yang diaktifkan.

Tidak ada kapsul hitam yang berhasil direproduksi pada viewport Chrome biasa. [Debug capture](../previews/mobile-refinement/debug/) memisahkan viewport, full-page dan CDP capture serta merekam elemen fixed. Penempatan elemen fixed pada screenshot full-page dapat berbeda dari tampilan viewport; asal persis artefak PDF lama tetap belum dapat dipastikan. Tidak ditambahkan hack warna hitam. Garis dekoratif yang benar-benar melintasi teks/caption pada implementasi antara dihapus hanya pada mobile.

## Per halaman

| Halaman | Perubahan mobile |
| --- | --- |
| Beranda | Status internal satu baris, ringkasan singkat, CTA ringkas, foto autentik lebih awal, metadata sesudah foto, intro/program lebih mudah dibaca. |
| Profil | Hero lebih ringkas, gambar dan narasi satu kolom, kartu pengiktirafan tetap teks sesuai status sumber. |
| Pengajian | Program/kurikulum satu kolom, jadwal vertikal dan langkah pendaftaran mudah dipindai. |
| Kemasukan | Poster asli tetap proporsional; ringkasan HTML melalui disclosure; label, bantuan dan kontrol formulir diperbesar. Biaya tidak direka. |
| Galeri | Satu kolom di bawah 480 px, dua kolom pada 480–767 px, filter horizontal bertarget sentuh, video native, enam alumni tanpa potret pengganti. |
| Hubungi | Kartu kontak dan FAQ vertikal, target sentuh lebih besar, footer rapi dan ruang CTA aman. |

Palet Forest/Emerald/Cream/Gold dan tipografi serif dipertahankan. Body mobile 16 px, teks sekunder umumnya 14–16 px, kontrol minimal 44–48 px. Breakpoint lama 750 px diselaraskan sampai 767 px agar rentang 751–767 tidak kembali ke grid desktop. Pada 390 px, posisi awal foto hero berpindah dari sekitar 669 ke 466 px (203 px lebih awal); [pengukuran](../previews/mobile-refinement/hero-measurements.json).

## Navigasi, formulir dan media

QA mencakup buka/tutup menu melalui tombol, backdrop, Escape dan link; Tab/Shift+Tab, scroll latar, Back/Forward serta resize ke desktop. Landscape 844×390 memeriksa modal yang tetap dapat digulir. Chrome native responsive digunakan untuk mengecek menu dan sticky di viewport biasa. Review visual final juga memeriksa grid 751/767 px, formulir kosong yang ditahan, dan modal 390 px; tidak ada teks terpotong atau elemen CTA ganda dalam capture tersebut.

Formulir tetap disabled sampai kontak disahkan. Programmatic submit diuji agar tidak melewati gate. Input telepon memakai `type="tel"`, font 16 px dan kontrol setinggi minimal 48 px. Pengujian fokus memakai fixture kosong; tidak ada data pribadi dikirim. Keyboard fisik iOS/Android dan picker native perangkat nyata masih perlu pemeriksaan manual.

Poster sesi 2027 memakai aset sumber yang sama. Ringkasan HTML memuat usia 10–17 dan tiga program dari konten yang ada; QR/tautan pendaftaran tidak diaktifkan. Dua video tetap memiliki controls, tanpa autoplay dan `preload="none"`; metadata diuji hanya sesudah permintaan eksplisit dari harness. Enam profil alumni dan satu testimoni tetap memakai sumber yang sama, dengan fallback inisial/tahun, tanpa foto buatan.

## Bukti visual

[Folder screenshot](../previews/mobile-refinement/) memuat full-page 390 px untuk enam halaman, viewport 320/375/430 px, menu, sticky tampil/tersembunyi, formulir, poster/ringkasan, filter galeri, alumni, FAQ, footer, landscape dan breakpoint 751/767. [Perbandingan berlabel](../previews/mobile-refinement/comparisons/) mencakup enam halaman UIUX-v1.0 versus Phase3+Mobile, serta hero/menu Phase3-before versus Mobile-after. Capture sebelum dan sesudah tidak dicampur sebagai satu baseline.

## Aksesibilitas dan batas pemeriksaan

Axe dijalankan pada mobile dan desktop serta modal. Pemeriksaan keyboard/fokus, dialog, target sentuh, overflow dan nama kontrol melengkapi otomatisasi. Hasil otomatis bukan sertifikasi WCAG menyeluruh; kontras pada gambar, isi audio/caption video dan penggunaan media tetap membutuhkan review manusia/institusi. Penutupan fokus dan perubahan viewport diuji tanpa mengklaim seluruh perilaku perangkat nyata.

## Performa lab mobile

[Data mentah](../previews/mobile-refinement/performance-mobile.json): Chromium 390×844, DPR 2, cache dingin, latency 150 ms, unduh 1.6 Mbps, unggah 750 Kbps, CPU 4×. Ini satu sampel pada mesin bersama, bukan pengukuran lapangan atau INP. Beban aplikasi lain dapat memengaruhi waktu; tidak diklaim peningkatan terhadap baseline yang tidak diukur pada kondisi identik.

| Halaman | FCP (ms) | LCP (ms) | CLS | Resource transfer (byte) |
| --- | ---: | ---: | ---: | ---: |
| index | 3060 | 3060 | 0 | 243015 |
| profil | 3068 | 3068 | 0 | 222473 |
| pengajian | 2016 | 2016 | 0 | 139991 |
| kemasukan | 2468 | 3592 | 0 | 405063 |
| galeri | 1696 | 1696 | 0 | 423227 |
| hubungi | 1628 | 1628 | 0 | 99337 |

Seluruh halaman mencatat nol request video awal. LCP sampel 1.63–3.59 detik; tiga halaman melampaui 2.5 detik pada sampel ini. CLS seluruh halaman 0. Aset responsif, gambar lazy di bawah fold dan video tanpa preload dipertahankan; pemeriksaan perangkat nyata dan pengukuran field tetap diperlukan sebelum klaim performa publik. Transfer resource tidak termasuk byte dokumen utama.

## Validasi akhir

| Pemeriksaan | Hasil |
| --- | --- |
| `pnpm install --frozen-lockfile` | Lulus, lockfile tidak berubah |
| `pnpm typecheck` | 50 file, 0 error/warning/hint |
| `pnpm test:gate` | 17/17 |
| Build root dan Pages | Lulus |
| Content audit root dan Pages | Masing-masing 40/40 |
| Browser QA root | 862/862, 7 route termasuk 404, 19 link |
| Browser QA Pages | 862/862, 7 route termasuk 404, 19 link |
| Axe 390/1440 dan modal | 0 pelanggaran otomatis; item incomplete/manual tercatat dalam JSON |
| Desktop geometry | 24/24 |
| `git diff --check` | Lulus |

[QA root](../previews/mobile-refinement/qa.json), [QA Pages](../previews/mobile-refinement/qa-pages.json), [static root](qa/mobile-static.json), [static Pages](qa/mobile-static-pages.json). Viewport: 320×640, 360×800, 375×812, 390×844, 414×896, 430×932, 768×1024; tambahan 751/767 serta desktop 1024/1280/1440/1920 dan landscape 844×390.

Release gate dan browser QA dijalankan berurutan agar build fixture dan capture terisolasi. Diagnosis timeout menunjukkan `waitForNetworkIdle` setelah tap filter menunggu request gambar lazy yang belum selesai; jeda tersebut hanya dimaksudkan untuk meredakan highlight sentuh. Harness kini menunggu paint feedback selama 500 ms tanpa menjadikan network-idle syarat screenshot. Pemeriksaan request gagal, decode gambar dan hash aset tetap berlaku. Pembatalan transfer video oleh Chromium setelah metadata diminta dicatat terpisah dan byte media diverifikasi SHA-256 terhadap allowlist; decode metadata tetap wajib berhasil. Metadata video diminta secara eksplisit dengan `preload='metadata'` sebelum `load()`, setelah kebijakan produksi `preload='none'` terlebih dahulu diuji.

Desktop diperiksa pada 1024/1280/1440/1920 px untuk enam halaman: posisi/ukuran elemen, font-size dan tinggi dokumen dibandingkan dengan build beku `78cfed2`. [Hasil geometri](../previews/mobile-refinement/desktop-layout-regression.json). [Observasi pixel](../previews/mobile-refinement/desktop-pixel-observations.json) bersifat diagnostik; perbedaan cache srcset dan rasterisasi elemen sticky berarti tidak diklaim pixel-identical.

## Status publikasi dan perubahan

`publicationMode` tetap `internal`; lima release approvals dan lima Phase3 review flags tetap `false`. Nomor, alamat, biaya, sejarah, pengiktirafan, kontak dan persetujuan media tidak diubah atau dianggap disahkan. Observasi formulir 2026 pada laporan desktop adalah bukti sebelumnya, bukan verifikasi eksternal baru pada tugas mobile. Tidak ada publikasi produksi.

Commit implementasi: `a6e69ad`, `10a2616`, `caa27e2`, `3770334`, `36e820c`; `0845020` menambahkan bukti QA dan laporan. Workflow validasi menerima PR bertarget branch Phase3 agar stacked PR mendapatkan CI; workflow deployment tidak diubah.

[Draft PR #5](https://github.com/naufalnab/darul-muthiah-site/pull/5) menggunakan base Phase3 dan bergantung pada Draft PR #4. [Checks PR](https://github.com/naufalnab/darul-muthiah-site/pull/5/checks) menyediakan status CI commit terakhir. PR tetap Draft dan tidak di-merge.
