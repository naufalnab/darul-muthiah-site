# MADUM — Laporan refinement fasa 2

28 Oktober 2026 · Repository `naufalnab/darul-muthiah-site` · Branch `feat/madum-phase2-refinement` · Baseline `7b38d1b` (PR #2).

## Keputusan untuk reviewer

**Selamat untuk review kod dan preview yang ditapis; belum diluluskan untuk penerbitan rasmi.** Publication mode kekal `internal` dan kelima-lima release approvals kekal `false`, tanpa perubahan pada `siteConfig.json`. Tiada merge, force push, rewrite sejarah, deploy cPanel atau penggunaan kredensial cPanel. Palet Forest Green `#123F35`, Emerald `#206452`, Warm Cream `#FBF8F0`, Muted Gold `#D2AD6A` dalam tokens tidak berubah.

## Selesai

| Bidang | Perubahan dan sebab |
| --- | --- |
| Git | Working tree awal bersih, fetch origin, main fast-forward kepada `7b38d1b`, branch baharu daripada main. Tiada perubahan lokal ditimpa. |
| Kemasukan 2027 | Komponen `AdmissionsPoster` berasaskan HTML/CSS dan token jenama, CTA pengajian/semakan saluran, status pendaftaran belum aktif. Tiada foto poster asal, URL Form atau QR dalam output. |
| Kejayaan Alumni | Enam `AlumniCard` profesional, grid 3/2/1 kolum, monogram DM dan nombor ruang profil. Tiada nama, potret, institusi destinasi, testimoni atau pencapaian individu yang belum disahkan. |
| JAIS / LZS / PITAS | Tiga kad teks ringkas yang membezakan bahan diterima daripada status rasmi semasa. Tiada logo agensi, scan sijil atau nombor pengenal penandatangan diterbitkan. |
| Kontak | Data baseline tidak diubah. Nombor/keaktifan ditandai belum disahkan; WhatsApp/tel/mailto aktif serta penghantaran borang ditahan. CTA masih membawa pengguna ke semakan saluran/kemasukan. |
| Mudah Zakat | Kekal pautan luar dengan nota penerima belum disahkan; tiada pembayaran atau data transaksi diproses laman MADUM. HEAD URL diperiksa tanpa transaksi. |
| Dokumentasi | Atribusi nama peribadi dalam handoff lama diganti rujukan neutral tanpa memadam fail sumber. Sejarah commit lama tetap perlu review privasi. |
| Privasi media | Astro menyalin hanya allowlist berhash ke direktori public terbitan. `ConsentImage` memilih placeholder dengan alt yang benar sebelum rendering. Audit output menolak fail asing, media tersembunyi/bersarang dan rujukan media tanpa review. Sumber asli kekal. |
| Dev | Aset normal tanpa izin memberi 404; laluan Vite `/@fs/` ke sumber public kini 403. Ujian menggunakan loopback, pelayan dihentikan selepas QA. |
| Accessibility | Kontras teks/angka diperbaiki dengan token sedia ada; semantik heading footer, landmark sticky CTA, label logo, ikon dekoratif, fokus skip link, Escape menu, tutup menu ketika resize/klik luar dan ruang scroll untuk sticky bar diperbaiki. |
| SEO | Noindex/nofollow internal dan 404, robots Disallow tanpa sitemap, canonical tanpa subpath preview yang mencemarkan domain akhir, OG memakai aset neutral yang tersedia. Domain akhir masih menunggu pengesahan. |
| Typecheck | `astro check` kini merangkumi komponen/halaman `.astro`, diikuti `tsc --noEmit`. TypeScript diselaraskan ke 6.0.3 kerana checker Astro yang digunakan menyokong TS 5/6; tidak lagi bergantung pada semakan TS sahaja yang tidak memeriksa template Astro. |
| Dependency | Dependency transitif build undici dinaikkan dari 8.12.1 ke 8.12.3 dalam lockfile; audit akhir melaporkan 0 advisory. Tiada dependency runtime pelawat ditambah. |
| Regression / CI | Fixture ujian konfigurasi diasingkan ke direktori sementara; approval sebenar tidak ditulis semasa ujian. QA kini mempunyai exit non-zero apabila gagal. Workflow PR menjalankan validation tanpa deploy; workflow Pages sedia ada memerlukan semakan sebelum upload artifact. |

## QA dan bukti

| Semakan | Keputusan |
| --- | --- |
| Typecheck Astro + TypeScript | Lulus; 41 fail, 0 error/warning/hint |
| Build root dan Pages subpath | Lulus; dist akhir dikembalikan ke root internal |
| Regression release gate | 14/14 lulus, fixture sintetis sahaja |
| Browser root | 392 pemeriksaan halaman + 18 pautan dalaman lulus |
| Browser Pages subpath | 392 pemeriksaan halaman + 18 pautan dalaman lulus |
| Dependency audit (semua dependency) | 0 advisory |

| Halaman | Viewport lulus | axe violations desktop/mobile | LCP desktop / mobile (ms) | CLS desktop / mobile |
| --- | --- | --- | --- | --- |
| index | 7/7 | 0 / 0 | 52 / 48 | 0.000 / 0.000 |
| profil | 7/7 | 0 / 0 | 40 / 60 | 0.000 / 0.000 |
| pengajian | 7/7 | 0 / 0 | 52 / 48 | 0.000 / 0.000 |
| kemasukan | 7/7 | 0 / 0 | 56 / 52 | 0.000 / 0.000 |
| galeri | 7/7 | 0 / 0 | 40 / 60 | 0.000 / 0.000 |
| hubungi | 7/7 | 0 / 0 | 48 / 48 | 0.000 / 0.000 |
| 404 | 7/7 | 0 / 0 | 56 / 28 | 0.000 / 0.000 |

Bukti terstruktur: [root QA](../previews/phase2/qa.json), [Pages QA](../previews/phase2/qa-pages.json), [dependency audit](qa/phase2-dependency-audit.json). Semua halaman tanpa broken asset, console error tak dijangka atau runtime exception; 404 HTTP dijangka dikecualikan daripada ralat dokumen.


Browser: Chrome headless tempatan, Puppeteer; tujuh viewport 320, 375, 390, 768, 1024, 1280 dan 1440 px bagi setiap enam halaman serta 404. Screenshot mobile 390 px dan desktop 1440 px, full page. Pemeriksaan menggunakan binaan statik sebenar, bukan source dev.

QA meliputi status HTTP 200/404, overflow termasuk elemen keluar viewport, image decode, media consent, console/runtime/network failures, metadata, semua pautan dalaman dan target anchor; keyboard skip link, menu, Escape, resize, FAQ; enam alumni, tiga pengiktirafan; dan penghalang submit programmatic pada borang. Browser QA menyekat request luar; tiada penghantaran ke institusi.

Accessibility memakai [axe-core](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md) dengan WCAG 2 A/AA, 2.1 A/AA, 2.2 AA serta best practices pada desktop/mobile, termasuk menu dibuka. Hasil automatik bukan pengesahan pematuhan penuh; item `incomplete` kekal dalam JSON untuk review manual, terutamanya kontras pada lapisan/gradient dan ikon. Screenshot semua halaman ditinjau visual; ujian pembaca skrin sebenar dan peranti fizikal belum dilakukan.

Prestasi ialah pengukuran makmal localhost tanpa throttling (LCP/FCP/CLS), bukan data Core Web Vitals pengguna sebenar atau ukuran rangkaian mudah alih. Tiada font pihak ketiga, video atau muatan media pelajar pada preview. OG SVG ialah aset neutral untuk review; keserasian kad sosial dan domain akhir perlu diuji sebelum penerbitan.

## Screenshot

| Halaman | Desktop 1440 | Mobile 390 |
| --- | --- | --- |
| Utama | [Desktop](../previews/phase2/index_Desktop_Full.png) | [Mobile](../previews/phase2/index_Mobile_Full.png) |
| Profil | [Desktop](../previews/phase2/profil_Desktop_Full.png) | [Mobile](../previews/phase2/profil_Mobile_Full.png) |
| Pengajian | [Desktop](../previews/phase2/pengajian_Desktop_Full.png) | [Mobile](../previews/phase2/pengajian_Mobile_Full.png) |
| Kemasukan | [Desktop](../previews/phase2/kemasukan_Desktop_Full.png) | [Mobile](../previews/phase2/kemasukan_Mobile_Full.png) |
| Galeri / Alumni | [Desktop](../previews/phase2/galeri_Desktop_Full.png) | [Mobile](../previews/phase2/galeri_Mobile_Full.png) |
| Hubungi | [Desktop](../previews/phase2/hubungi_Desktop_Full.png) | [Mobile](../previews/phase2/hubungi_Mobile_Full.png) |
| 404 | [Desktop](../previews/phase2/404_Desktop_Full.png) | [Mobile](../previews/phase2/404_Mobile_Full.png) |

Semua screenshot baharu hanya memaparkan logo, placeholder dan teks review; tiada wajah pelajar/alumni atau sijil asal. Fail lama `previews/new/` tidak ditimpa.

## Tertunda kerana maklumat / izin

| Blocker | Pemilik / bukti yang diperlukan |
| --- | --- |
| Pendaftaran dan poster asal | Institusi: sahkan sesi, tarikh, syarat dan poster; uji akses, penghantaran sintetis, pengesahan selesai dan penerimaan pentadbir. Aktifkan Form/QR hanya selepas ujian lulus dan konfirmasi institusi. |
| Media pelajar | Institusi dan penjaga: izin bertulis yang sah serta daftar aset yang boleh disiarkan. Jangan simpan bukti consent peribadi dalam repo awam. |
| Enam alumni | Izin individu bagi nama/foto/atribusi/testimoni serta pengesahan pencapaian. Placeholder kekal sehingga selesai. |
| JAIS/LZS/PITAS | Pengesahan status semasa, tempoh pelantikan/keahlian, butiran yang boleh disiarkan dan hak penggunaan. |
| Kontak / yuran / sejarah | Tetapkan nombor rasmi dan uji saluran, semak pejabat/e-mel/alamat/pin, luluskan yuran 2027 dan kronologi institusi. |
| Mudah Zakat | Institusi: sahkan organisasi penerima dan hubungan dengan MADUM; tiada dakwaan penerima rasmi sebelum itu. |
| Domain / release | Tetapkan domain dan hosting, HTTPS, backup/rollback dan semua sign-off. Kerja ini tidak deploy ke cPanel. |

## Risiko privasi yang belum dapat diselesaikan automatik

**Repository PUBLIC masih mengandungi media asal dalam tree dan sejarah Git.** Pemeriksaan raw contoh foto pada main serta commit lama memberi HTTP 200. Perubahan ini melindungi preview build, bukan menghapus pendedahan GitHub, cache atau clone yang sudah ada. Pemilik perlu menentukan containment visibility/akses, pengarkiban private, pemadaman melalui commit biasa atau proses penanganan sensitif bersama GitHub; sumber tidak dipadam dan sejarah tidak ditulis semula dalam PR ini.

Pages semasa yang diperiksa masih versi main `7b38d1b`, bukan deployment branch ini: 24 URL media tanpa izin memberi 404 dan artifact semasa hanya mengandungi aset neutral. Tiada deployment baharu dibuat. Lihat [audit privasi lengkap](PHASE2_PRIVACY_AUDIT.md) dan [review kontak](PHASE2_CONTACT_REVIEW.md).
