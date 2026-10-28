# MADUM — Audit privasi fasa 2

Tarikh: 28 Oktober 2026 (Asia/Jakarta). Baseline: main `7b38d1b`. Mod: internal; semua releaseApprovals false. Audit baca sahaja bagi GitHub/Pages; tiada deploy, perubahan visibility, pemadaman sumber atau penulisan semula sejarah.

## Keputusan

**Preview binaan ditapis; repository/sejarah belum selamat untuk media tanpa izin.** Penilaian “clean snapshot” pada 15 Oktober dalam `PRIVACY_AUDIT.md` telah luput: commit `3d7753f` mengembalikan media asal. Jangan anggap robots/noindex sebagai kawalan akses.

| Permukaan | Bukti | Risiko / tindakan |
| --- | --- | --- |
| `public/` tempatan dan Git main | 27 fail; 24 fail bukan allowlist (22 WebP + 2 MP4), 13,101,083 bait. Termasuk `sijil.webp`, yang audit lama menandakan mungkin mengandungi pengenal peribadi. Isi sijil tidak disalin ke laporan ini. | Tinggi. Sumber dikekalkan atas batasan pengguna; jangan jalankan pelayan fail terus dari root repo/public. |
| `dist/` fasa 2 | Hanya logo dan SVG neutral boleh disalin dari public, dengan hash kandungan. Output diaudit rekursif; media baharu/bersarang, dokumen, data URI dan media import ditolak. | Mitigasi dilaksanakan sebelum salinan Astro, termasuk dev dan build. Approval global sahaja tidak cukup untuk menambah aset: allowlist juga perlu review. |
| GitHub repository | API GitHub menunjukkan visibility PUBLIC. HEAD read-only contoh raw foto dari main dan commit `3d7753f` mengembalikan 200. | **Tinggi dan belum selesai.** Binaan tidak boleh menarik balik fail Git/source, clone, fork, cache atau salinan pihak ketiga. |
| Riwayat reachable semua refs tempatan selepas fetch, sebelum commit fasa 2 | 75 objek binari pada 38 path unik: 44 WebP, 4 MP4, 27 PNG; tiada path PDF/ZIP/DOC/DOCX. Angka objek merangkumi versi lama, bukan jumlah individu. | Semakan sejarah tidak membuktikan tiada PII di semua blob teks, metadata atau refs GitHub yang tidak diiklankan. Tidak melakukan rewrite/force push. |
| GitHub Pages semasa | Deployment berjaya dari `7b38d1b`, run `40664377165`. Enam halaman HTTP 200, semua 24 URL media ditahan HTTP 404, robots Disallow, sitemap 404. | Snapshot semasa sahaja; URL lama, cache global dan salinan pihak ketiga tidak boleh dijamin hilang. |
| Artifact deployment semasa | Artifact `12805292193`, 75,321 bait ZIP; manifest tar hanya HTML, CSS, robots, logo dan SVG neutral. | Tiada media pelajar dalam artifact yang masih disenaraikan API. Artifact deployment lama tidak lagi disenaraikan, bukan bukti semua cache terhapus. |
| Screenshot lama `previews/new/` | Sampel homepage mobile baseline diperiksa visual: placeholder neutral, beberapa gambar gagal; sumber screenshot lama tidak diubah/dihapus. | Sejarah PNG kekal kategori perlu review pemilik; tiada jaminan semua screenshot sejarah bebas PII. Screenshot baharu fasa 2 dihasilkan hanya selepas allowlist output lulus. |
| Kredensial / dokumen dalaman | Tidak membuka arkib WhatsApp, PDF dalaman atau kredensial cPanel. Tiada fail tersebut dimuat naik. Tiada path dokumen/arkib sedemikian dalam audit objek reachable. | Ini bukan attestasi bahawa semua sejarah Git bebas rahsia; audit kandungan forensik penuh belum dilakukan. |

## Mitigasi yang dilaksanakan

- `publicDir` Astro menunjuk direktori terbitan `.astro/safe-public`, dibina semula daripada dua aset yang dipin hash. Sumber asli tidak dipadam, dipindah atau ditulis semula. Laluan fail sumber `public/` turut disekat melalui Vite fs.deny: ujian `/@fs/.../public/assets/hero-kelas.webp` berubah daripada 200 kepada 403; laluan normal media yang ditahan memberi 404. Pelayan dev hanya diuji pada loopback, bukan untuk penerbitan awam.
- `ConsentImage` memilih visual neutral dan alt yang benar sebelum HTML dihasilkan; OG memakai visual neutral, bukan URL foto yang dibuang.
- Audit output menolak fail asing, symlink, media terselit dan rujukan gambar tanpa review. Gate dijalankan dalam Astro core serta postbuild.
- QA memeriksa media, broken requests, link dan mode internal sebelum artifact Pages boleh diupload. CI PR hanya melakukan validation, tidak deploy.
- QR/Form pendaftaran tidak dimasukkan ke HTML. Borang WhatsApp dan pautan kontak aktif ditahan selagi penerima belum diluluskan.
- Semua ujian konfigurasi negatif/publik berada dalam direktori sementara berisi fixture sintetis dan hanya logo/placeholder; konfigurasi sebenar dan dist sebenar tidak diubah oleh regression suite.

Satu atribusi nama peribadi dalam handoff versi lama telah dineutralkan pada snapshot dokumentasi semasa. Sumber WhatsApp tidak diubah atau dipadam; nama dalam sejarah commit terdahulu tetap termasuk risiko review pemilik.

## Memerlukan keputusan pemilik

1. Tentukan containment repository: contohnya jadikan private dan semak akses kolaborator (tidak dilakukan automatik). Jangan menganggap ini menarik balik salinan lama.
2. Putuskan sama ada membuang media dari snapshot semasa melalui commit biasa, selepas sumber selamat diarkibkan secara private. Pemadaman ini tetap tidak membersihkan sejarah.
3. Jika perlu, minta bantuan GitHub bagi cache/sensitive-data exposure; apa-apa rewrite sejarah atau force push memerlukan arahan baharu yang jelas dan di luar PR ini.
4. Dapatkan izin ibu bapa/institusi untuk media pelajar, serta izin setiap alumni untuk nama/foto/testimoni. Jangan memuat naik bukti consent berisi data peribadi ke repo awam.
5. Semak `sijil.webp` dan semua PNG sejarah secara private dengan pemilik; jangan mengedarkan contoh PII dalam issue/PR.
6. Setelah pemilik mengesahkan akses operasi, urus rotasi kredensial yang pernah dikongsi melalui saluran private. Tiada kredensial digunakan dalam kerja ini.

Bukti metadata selamat: `docs/qa/phase2-source-inventory.json`, `phase2-live-pages.json`, `phase2-deployed-artifact.json`. Fail bukti tidak mengandungi kandungan foto, sijil atau dokumen dalaman.

Rujukan pelaksanaan: [Vite server.fs.deny](https://vite.dev/config/server-options#server-fs-deny). Sekatan ini melengkapi allowlist output dan tidak menggantikan kawalan akses repository.
