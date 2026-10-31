# MADUM — Desktop Visual Refinement

31 Oktober 2026 · Branch `feat/madum-phase3-real-content` · Baseline `8623d71` · Draft [PR #4](https://github.com/naufalnab/darul-muthiah-site/pull/4).

**Desktop telah diperhalus untuk semakan akhir; penerbitan rasmi masih ditahan.** Enam halaman, logo, navigasi, heading serif dan empat warna rasmi dikekalkan. Tiada merge, deployment, akses cPanel, penghantaran borang atau perubahan approval institusi dilakukan.

## 1. Keadaan awal dan keselamatan checkout

Direktori kerja utama ialah `/Users/mac/Documents/MADUM-Phase3-Source/phase3-review-checkout`, pada branch dan commit yang diminta. Checkout ini bukan sepenuhnya bersih: `previews/phase3/qa.json` telah diubah dan 14 screenshot Fasa 3 belum dijejak sebelum kerja bermula. Semua hasil sedia ada itu dikekalkan, tidak dipadam, ditimpa atau dimasukkan dalam commit kerja ini. Folder `darul-muthiah-site` juga mempunyai banyak perubahan tempatan; ia diperiksa secara read-only dan tidak diubah. `darul-muthiah` kekal sebagai rujukan.

Fetch branch mengesahkan remote dan baseline sama sebelum commit. Tiada checkout main, force push atau rewrite sejarah. Sebelum perubahan visual, tiga screenshot penuh artefak Fasa 3 yang tersedia diambil sebagai baseline. Ia dilabel **Phase 3 checkout artifact**, bukan v1.0 dan bukan QA baharu untuk build lama.

Masalah utama ialah `studentMediaConsentApproved=false` menukar setiap foto menjadi placeholder dan membuang seluruh galeri/video. Brief baharu membenarkan dokumentasi website terpilih direview untuk paparan tanpa memalsukan persetujuan institusi. Allowlist berasaskan SHA-256 kini membenarkan hanya aset tersebut; public release gate masih berasingan dan fail-closed.

## 2. Before / after setiap halaman

| Halaman | Sebelum (Fasa 3) | Selepas |
| --- | --- | --- |
| Utama | Hero motif hijau, dua placeholder pengenalan dan mosaic neutral; teks sekunder kecil | Foto kelas asli; frame desktop mengikuti komposisi foto; dua foto pengenalan overlapping; empat foto mosaic; CTA Profil/Galeri lebih tepat; teks desktop lebih terbaca |
| Profil | Dokumentasi ditahan; teks kad/timeline kecil; nota pengiktirafan panjang | Foto warga, halaqah dan majlis ilmu; objektif, peranan dan timeline lebih jelas; tiga kad JAIS/LZS/PITAS dengan fakta dokumen dan batas status semasa yang ringkas |
| Pengajian | Foto neutral; empat kad rutin sempit; fokus program kurang jelas | Foto bacaan Al-Quran, akademik dan TVET; ringkasan perbezaan tiga program; empat rutin dengan masa di atas teks; Diniyyah diseragamkan |
| Kemasukan | Hero placeholder, poster dengan foto ditutup di seksyen berasingan; tiga kad “Hubungi Kami” | Poster asal 28 Oktober sesi 2027 menjadi visual hero, foto dikembalikan; buka saiz penuh; QR/kontak ditahan; kelayakan mudah dipindai; satu panel editorial yuran tanpa angka belum diluluskan |
| Galeri | Foto/penapis/video disembunyikan; enam monogram DM berulang | 12 foto asli, penapis berfungsi, lightbox native dengan keyboard, dua video native; kad alumni editorial dengan initial nama dan tahun, tanpa potret tidak terverifikasi; testimoni verbatim kekal |
| Hubungi | Status tiga saluran tidak sejajar; teks kecil dan CTA akhir menjanjikan alur belum tersedia | Status bagi setiap saluran jelas; penjajaran kad lebih konsisten; foto FAQ dipulihkan; penerangan CTA sesuai keadaan belum aktif; alamat dan peta ilustrasi kekal dilabel |

[Homepage 1440](../previews/phase3-desktop-refinement/index_Desktop_1440_Full.png) · [Profil](../previews/phase3-desktop-refinement/profil_Desktop_1440_Full.png) · [Pengajian](../previews/phase3-desktop-refinement/pengajian_Desktop_1440_Full.png) · [Kemasukan](../previews/phase3-desktop-refinement/kemasukan_Desktop_1440_Full.png) · [Galeri](../previews/phase3-desktop-refinement/galeri_Desktop_1440_Full.png) · [Hubungi](../previews/phase3-desktop-refinement/hubungi_Desktop_1440_Full.png).

## 3. Pembetulan UI/UX dan komponen

`src/styles/desktop-refinement.css` dimuatkan selepas stylesheet sedia ada. Refinement utama dibatasi `min-width:768px`: body/supporting copy 15–16px, label 12–14px, line-height lebih lapang, kontras pada Forest Green, padding kad/section, keseimbangan program dan testimonial. Desktop diuji khusus pada 1024/1280/1440/1920; container 1200px mengekalkan panjang baris pada skrin besar.

Hero utama menggunakan `hero-kelas.webp` kerana ia dokumentasi kelas sebenar dan lebih meyakinkan untuk konteks ibu bapa. Header komposit klien dalam Fasa 3 dibandingkan secara visual tetapi tidak dijadikan bukti dokumentasi aktiviti sebenar. Foto asli tidak dipaksa ke arch tinggi yang memotong konteks; radius desktop lebih terbuka dan caption berada di bawah kanan frame.

`ConsentImage` sekarang memilih aset dokumentasi yang hash-nya direview, dengan `srcset`, `sizes`, dimensi, alt kontekstual, async decode dan lazy loading di bawah fold. Hero diberi eager/high priority. `HomeHeader` menggunakan komponen yang sama. Aset tidak direview masih memperoleh fallback.

`AdmissionsPoster` mengekalkan karya asal klien, bukan hasil rekonstruksi AI. Foto/poster lengkap di atas y1120 tidak diubah; hanya footer y1120–1280 yang mengandungi QR dan tindakan kontak belum sah ditutup dengan status semakan. Pembaca boleh membuka derivative resolusi penuh. Poster 14 Oktober tidak digunakan. Tiga fee cards diganti satu panel yang menjelaskan perkara untuk ditanya, tanpa RM1,310/RM500/RM450 atau tarif rasmi 2027. Fieldset dan penghantaran kekal disabled, serta fallback navigasi dalaman tersedia.

`PhotoLightbox` memakai dialog native, butang tutup, sebelumnya/seterusnya, ArrowLeft/ArrowRight, Escape dan pemulihan fokus. Kad galeri ditukar daripada `figure role=button` kepada `button` native selepas axe mengenal pasti role tidak sah; caption dan teks video turut dibetulkan kontrasnya. Tiada dependency lightbox ditambah.

## 4. Aset dan provenance

[Manifest provenance](qa/desktop-media-provenance.json) dan [allowlist SHA-256](../scripts/lib/documentationAssets.json) merekod sumber/keputusan. Semua 31 derivative WebP baharu diperiksa: tiada EXIF/XMP, jumlah **1,939,956 bait**. Logo, fail asal dan video sedia ada tidak ditulis semula.

| Aset sedia ada | Penggunaan |
| --- | --- |
| hero-kelas | Hero Utama, galeri kelas |
| aktiviti-tarbiah, belajar-halaqah | Pengenalan Utama, Profil/Pengajian dan galeri |
| kelas-akademik, kemahiran-tvet, sukan-pelajar, rehlah-pelajar | Mosaic Utama, rutin/amali Pengajian dan galeri |
| aktiviti-maahad, majlis-ilmu | Hero/Sejarah Profil dan foto FAQ Hubungi |
| seminar, keselamatan, outdoor, lawatan-ilmu | Dokumentasi galeri mengikut kategori |
| video-intro, video-nasyid | Thumbnail dua video |
| intro-madum.mp4, nasyid-pelajar.mp4 | Digunakan pada laluan asal; tiada salinan video baharu |
| 00000247-PHOTO-2026-10-28-13-54-24.jpg | Poster klien sesi 2027, derivative 480/854px dengan footer tindakan ditahan |

Semua foto yang dipilih disemak melalui contact sheet; sumbernya dokumentasi website sedia ada yang dinyatakan dalam brief. Tiada stock photo, imej AI baharu, raw chat, sijil, PDF, tandatangan atau ID pegawai ditambah. Video sedia ada ialah H.264/AAC: intro 10.005s, persembahan 32.181s; metadata dapat didekod oleh browser. Video berjumlah sekitar 9.8MiB, tidak diduplikasi dan memakai `controls`, `playsinline`, poster serta `preload=none`; tiada autoplay.

## 5. Kandungan dan aset yang masih menunggu pengesahan

- `ALUMNI_MAPPING.md` dibaca. Pemetaan menyatakan urutan mesej dan lampiran; ini belum merupakan pengesahan bebas nama–potret. Semua enam nama, tahun, pencapaian dan institusi dalam `alumni.ts` dikekalkan; medan potret terus null. Tiada gelaran atau pekerjaan baharu dicipta. Enam potret tidak masuk allowlist output.
- Atribusi/izin testimoni Nur Zulaikha masih menunggu approval; teks kekal verbatim dan nota semakan tetap dipaparkan.
- JAIS: kod BZH8026, perakuan 13S(8)18/59, tamat tercetak 13 Oktober 2028. LZS: Penolong Amil IPIS, kod PA IPIS 1290. PITAS: rekod 26 Mac 2020. Tiada dakwaan status aktif semasa, sokongan pihak berkuasa atau kepastian penerima pembayaran.
- Sesi/tarikh pembukaan, yuran 2027, sejarah akhir, hak penggunaan logo/sijil, nombor rasmi, e-mel, Facebook dan alamat/pin masih mengikut gate/nota sedia ada.
- Header komposit dan gambar anugerah/sijil yang tidak diperlukan tidak ditambah kepada allowlist. Ini pilihan editorial, bukan menggantikan foto yang telah direview dengan placeholder.

`siteConfig.json` dan `phase3Review.json` tidak diubah: mode **internal**, semua **10 flags** kekal false. Allowlist hanya meluaskan paparan aset tertentu; ia bukan rekod parental consent atau kelulusan penerbitan rasmi.

## 6. QR / borang — penemuan baharu

Read-only GET pada 31 Oktober: short URL memberi redirect dan HTTP 200 ke Google Forms. Tajuk halaman ialah **“BORANG MAKLUMAT CALON PELAJAR MADUM 2026”**, bukan 2027. [Bukti terstruktur](qa/desktop-form-readonly.json).

Akses ini tidak membuktikan kesesuaian sesi 2027, penghantaran atau penerimaan admin. Tiada POST, data calon, pendaftaran fiktif, mesej atau panggilan dibuat. QR, CTA registration dan kontak tidak diaktifkan. Institusi perlu memperbetulkan/menetapkan borang sesi 2027 serta menjalankan ujian penerimaan yang diberi izin.

## 7. Responsive dan mobile regression

Desktop: 1024, 1280, 1440, 1920px. Baseline mobile/tablet: 320, 375, 390, 768px. Tiada perubahan besar urutan section mobile, navigasi atau breakpoint sedia ada. Mobile kini menerima dokumentasi asli melalui komponen yang sama; poster menjadi visual Kemasukan menggantikan foto neutral. Panel yuran baharu mempunyai fallback stacked minimum. Pembetulan button semantic/kontras galeri berlaku pada semua saiz kerana isu aksesibilitas yang dipulihkan.

Tiada overflow baharu pada 56 kombinasi route/viewport untuk setiap binaan. Menu hamburger sedia ada pada <=1060px dikekalkan; 1024px diuji dengan menu tersebut, bukan navigasi desktop yang dipaksa mengecil.

Perkara untuk review mobile berasingan: kepadatan banner/header, crop arch hero asal mobile, kebolehbacaan poster pada 320–390px dan pautan saiz penuh, panjang kad alumni, text sekunder lama yang belum diperbesar pada mobile, sticky CTA/footer, serta pilihan susunan poster terhadap teks hero. Ini keputusan reka bentuk lanjutan, bukan blocker regression semasa.

## 8. Accessibility

Axe berjalan pada 390 dan 1440px bagi tujuh route, juga menu terbuka. **0 violations automatik** dalam root dan Pages. Keyboard skip-link/main focus, buka/tutup menu, Escape, resize closure, FAQ, gallery filter, pembukaan lightbox melalui Enter dan pemulihan fokus diuji. Fokus visible sedia ada dikekalkan; butang galeri kini native. Form disabled serta percubaan submit programmatik tidak boleh memintas gate.

Axe mempunyai incomplete manual checks pada teks di atas gambar/gradient, accessible names tertentu dan `video-caption`. Semakan visual dibuat untuk teks/frame/caption dan keterbacaan desktop. Dua video belum mempunyai transkrip/caption audio yang disahkan; jangan menganggap 0 violations sebagai pensijilan WCAG menyeluruh. Caption/perihalan audio memerlukan review kandungan institusi, bukan transkrip rekaan.

## 9. Performance

Semua foto di bawah fold lazy; saiz responsive 480/800px tanpa upscale untuk foto kecil. Derivative poster dipilih menurut saiz paparan; versi penuh disediakan untuk membaca butiran. Video tidak dimuatkan secara sengaja sehingga interaksi; QA secara berasingan meminta metadata untuk memeriksa decode.

Root lab browser tanpa throttling: LCP maksimum 420ms, CLS 0. Pages: LCP maksimum 356ms, CLS 0. Ini ukuran localhost dalam suite, bukan data lapangan atau jaminan prestasi hosting.

`test:cwv` juga menjalankan cold cache desktop 1440, latency 150ms, download 1.6Mbps, upload 750Kbps, CPU 4x. [Ukuran throttled](../previews/phase3-desktop-refinement/cwv-throttled.json). Sampel awal semasa QA/build serentak menunjukkan variasi LCP hingga 4476ms; ia diulang tanpa beban QA/build selepas semua selesai. Nilai akhir: Utama LCP 1976ms/FCP 1960ms; Profil 2424/2424ms; Pengajian 1788/1788ms; Kemasukan 1428/1276ms; Galeri 1540/1540ms; Hubungi 1296/1296ms. CLS semua 0. FCP Utama dan Profil masih melebihi ambang 1800ms. Tiada dakwaan semua FCP/LCP pasti memenuhi ambang pada peranti/rangkaian sebenar.

## 10. QA baharu

| Pemeriksaan | Keputusan |
| --- | --- |
| pnpm install --frozen-lockfile | Lulus, lockfile tidak berubah |
| pnpm run typecheck | Lulus: 44 fail, 0 error/warning/hint |
| pnpm run test:gate | Lulus **17/17**, fixture sintetis; real approvals/dist tidak diubah |
| pnpm run build — root | Lulus, termasuk hash/media policy, noindex dan robots Disallow |
| pnpm run build — ASTRO_BASE=/darul-muthiah-site GITHUB_PAGES=true | Lulus; semua pautan, srcset, poster dan metadata subpath diperiksa |
| pnpm run test:content — root / Pages | Lulus **40/40 setiap binaan** |
| pnpm run test:qa — root / QA_BASE=/darul-muthiah-site | Lulus **442/442 pemeriksaan + 19 pautan setiap binaan**, 7 route × 8 viewport |
| pnpm run test:cwv | Selesai; ukuran throttled sebenar, bukan assertion semua rating GOOD |
| Derivative metadata | 31 WebP, tiada EXIF/XMP |
| git diff --check | Lulus |

Bukti: [root browser](../previews/phase3-desktop-refinement/qa.json), [Pages browser](../previews/phase3-desktop-refinement/qa-pages.json), [statik root](qa/desktop-static.json), [statik Pages](qa/desktop-static-pages.json).

Semua status HTTP (200 dan 404 sebenar), decode gambar, sumber media, internal links, anchor, metadata/canonical/noindex, console, unhandled exceptions, konten alumni/testimoni, disabled form dan pengiktirafan diuji semula. Kegagalan awal axe pada galeri diperbaiki pada root cause; tiada test dipadam atau dilemahkan. Aturan lama yang melarang semua media institusi diganti dengan hash aset direview, disertai regresi baru terhadap sumber video asing, autoplay dan hash foto berubah.

## 11. Screenshot dan semakan visual

Folder baharu: `previews/phase3-desktop-refinement/`. Enam halaman + 404 mempunyai viewport screenshot 1024/1280px dan full-page 1440/1920px; tujuh screenshot mobile smoke 390px turut disediakan. Baseline disimpan di `before/`; tiada screenshot Phase 2/3 lama ditimpa. Full-page 1440/1920 dan contact sheets viewport desktop ditinjau secara visual untuk frame, crop, spacing, hierarchy dan footer.

Enam perbandingan berlabel, semuanya before **Fasa 3**, bukan v1.0:

- [Hero Utama](../previews/phase3-desktop-refinement/comparisons/home-hero_Before-Phase3_After.png)
- [Pengenalan Utama](../previews/phase3-desktop-refinement/comparisons/home-introduction_Before-Phase3_After.png)
- [Mosaic Utama](../previews/phase3-desktop-refinement/comparisons/home-mosaic_Before-Phase3_After.png)
- [Galeri](../previews/phase3-desktop-refinement/comparisons/gallery_Before-Phase3_After.png)
- [Alumni](../previews/phase3-desktop-refinement/comparisons/alumni_Before-Phase3_After.png)
- [Kemasukan 2027](../previews/phase3-desktop-refinement/comparisons/admissions-2027_Before-Phase3_After.png)

Perbandingan ialah crop screenshot browser yang disusun bersebelahan, bukan mockup rekaan. Fail penuh asal disimpan untuk konteks.

## 12. Siasatan kapsul hitam

Bentuk kapsul hitam pada sempadan section tidak dapat direproduksi pada screenshot Chromium baharu, sama ada viewport atau full-page. Site mempunyai sticky header, sticky bar mobile, dialog fixed yang tertutup secara default, serta butang penapis berkapsul yang sah dalam galeri. Tiada widget floating asing ditemukan dalam sumber/layout. Tiada CSS workaround ditambah untuk menyembunyikan artefak yang tidak dapat direproduksi. Asal screenshot/PDF lama masih belum dapat dipastikan; bukti baharu tidak menyokong dakwaan bug kapsul pada halaman semasa.

## 13. Fail diubah

- `src/components/`: HomeHeader, ConsentImage, AdmissionsPoster, AlumniCard, PhotoLightbox.
- `src/pages/`: keenam halaman utama.
- `src/content/`: fees (alur langkah), programs (ejaan), recognitions (nota ringkas tanpa perubahan fakta).
- `src/layouts/SiteLayout.astro`, `src/styles/components.css`, stylesheet desktop baharu.
- `scripts/lib/previewAssets.mjs`, allowlist dokumentasi baharu; audit statik, browser QA, CWV dan release gate regression.
- 31 derivative WebP dalam `public/assets/refinement/`; provenance, borang read-only, bukti QA dan screenshot baharu.

## 14. GitHub handoff dan baki keputusan

Implementasi: commit `93a6157` — `feat(madum): refine desktop layouts and restore reviewed documentation`. Bukti QA dan laporan dihantar dalam commit dokumentasi berasingan pada branch yang sama. Draft PR #4 diperbarui; status CI akhir dicatat di PR selepas push. PR kekal Draft, tidak digabung ke main.

Baki keputusan institusi: potret/consent alumni, atribusi testimoni, public media consent, yuran 2027, sejarah akhir, nombor rasmi/e-mel/Facebook, status semasa JAIS/LZS/PITAS, serta borang yang masih bertajuk 2026. Semakan caption/audio video dan reka bentuk mobile diteruskan pada tahap berikutnya. Semua ini dinyatakan secara spesifik; tiada approval dianggap diberikan secara automatik.

### Susulan CI dan kestabilan harness

Run GitHub `41163217498` pada `00e4686` gagal satu pemeriksaan request poster 854px pada Kemasukan; HTTP, decode dan pemeriksaan visual route itu lulus. Pergantian viewport pada dokumen hidup boleh memulakan request srcset sebelum navigasi seterusnya. Harness kini menunggu network idle selepas resize supaya request itu tidak dibatalkan oleh navigasi QA sendiri; jenis error rangkaian turut direkod. Semua assertion request gagal, HTTP dan image decode dikekalkan. Root browser QA selepas pembetulan lulus semula 442/442 + 19 pautan. CI bagi commit akhir diverifikasi dan dipautkan pada Draft PR.

Commit panduan editorial `fff4be5` turut menyelaraskan README, release blockers dan content edit guide dengan polisi review aset semasa; approval institusi tetap false.
