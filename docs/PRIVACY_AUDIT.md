> **Pembaruan 28 Oktober 2026 — penilaian lama di bawah tidak mewakili kondisi sekarang.** Media asal dikembalikan pada commit `3d7753f`, repository kini PUBLIC. Binaan Pages semasa sudah menapis media, tetapi Git/source masih mengandunginya. Lihat [audit fasa 2](PHASE2_PRIVACY_AUDIT.md). Jangan gunakan verdict lama sebagai izin penerbitan.

# Laporan Audit Privasi & Migrasi Repository Bersih (MADUM)

**Tarikh Audit:** 15 Oktober 2026  
**Status Audit:** ✅ **LULUS (CLEAN SNAPSHOT VERIFIED)**  
**Repository Baru:** `naufalnab/darul-muthiah-site` (Private)  
**Tindakan Utama:** Pelaksanaan migrasi ke repository baharu berasingan dengan riwayat Git bersih (fresh git history) tanpa menyalin berkas lama atau riwayat commit sebelumnya.

---

## 1. Latar Belakang & Rasional Migrasi Bersih

Repository terdahulu (`naufalnab/darul-muthiah`) pernah berstatus **Public** sebelum dijadikan Private. Berdasarkan sifat Git:
1. Menghapus fail melalui commit baharu **TIDAK** memadam objek blob daripada riwayat commit terdahulu (`3f49a1b`).
2. Melakukan penulisan semula riwayat (`git-filter-repo` atau `git filter-branch`) serta *force-push* membawa risiko memutuskan rujukan Pull Request (#1), merosakkan klon kolaborator lain, dan tidak memberi jaminan bahawa pelayan GitHub tidak mengekalkan cache commit yatim (*orphaned commits*).
3. Oleh itu, pendekatan **Clean Repository Migration** dipilih bagi memastikan asas binaan laman web bermula daripada pohon kod yang 100% suci daripada sebarang fail sensitif.

---

## 2. Inventarisasi Aset & Pengendalian Media Pelajar

### A. Perlindungan Media Pelajar (Minors / Bawah Umur)
Mengikut dasar perlindungan data peribadi dan etika penerbitan institusi pendidikan:
- Foto dan rakaman video pelajar (usia 10–17 tahun) dalam suasana kelas, asrama, riadah, dan hafazan **belum mempunyai borang kebenaran bertulis ibu bapa/penjaga (parental consent)** yang disahkan bagi tujuan penyiaran umum.
- Format WebP atau MP4 yang telah dioptimumkan **TIDAK** dianggap selamat selagi ia memaparkan wajah dan identiti pelajar tanpa izin.

**Tindakan Pengendalian:**
- **21 Foto Pelajar & Aktiviti:** Dikecualikan sepenuhnya daripada repository. Digantikan dengan **Placeholder Berjenama Netral** yang menjana dimensi piksel tepat mengikut fail asal (cth. 1008×756, 1080×810, 810×1080) menggunakan palet warna korporat hijau zamrud (`#0F3E2E`) dan emas (`#D4AF37`) serta corak geometri roset.
- **2 Fail Video Aktiviti (`intro-madum.mp4`, `nasyid-pelajar.mp4`):** Rakaman persembahan pelajar dikecualikan. Digantikan dengan kad video video-placeholder ringan (3 saat, senyap, berdimensi 1280×720 dan 848×480) yang menerangkan status semakan privasi secara telus.
- **Sijil & Dokumen Perakuan (`sijil.webp`):** Dikecualikan kerana memaparkan nombor kad pengenalan (No. K/P) guru pengajar pada dokumen lampiran asal. Digantikan dengan kad placeholder perakuan rasmi.

### B. Aset Identiti Institusi yang Dikekalkan
- **`logo-madum.webp` (860×864, 40 KB):** Dikekalkan kerana merupakan lambang/logo rasmi institusi Maahad Darul Muthiah dan tidak mengandungi sebarang imej individu, wajah manusia, atau data peribadi.

---

## 3. Senarai Fail Dikecualikan daripada Snapshot Bersih

| Kategori | Nama Fail / Corak | Saiz | Sebab Pengecualian |
|---|---|:---:|---|
| **Dokumen Klien Sensitif** | `00000124-profail MADUM 1 utk IK WEB.pdf` | 10.82 MB | Mengandungi No Akaun Maybank, No K/P guru, carta organisasi pengurusan, no tel peribadi, dan foto santri. |
| **Media Mentah Klien** | 28 fail foto `00000070` s.d. `00000136` | ~15.97 MB | Foto mentah WhatsApp memaparkan pelajar tanpa kelulusan bertulis. |
| **Video Mentah Klien** | `00000076`, `00000088`, `00000115` | ~13.39 MB | Rakaman mentah aktiviti santri. |
| **Folder Root Assets Duplikat** | Direktori root `assets/` (27 berkas) | 12.53 MB | Duplikat prototipe awal yang tidak diperlukan dalam projek Astro. |
| **Skrap Prototipe Awal** | `index.html`, `profil.html`, `00000001-README.md`, dll | ~50 KB | Fail statik awal yang telah digantikan sepenuhnya oleh templat Astro. |
| **Tangkapan Skrin Lama** | Folder `previews/` dari repo lama | ~12 MB | Tangkapan skrin lama memaparkan rendering foto wajah pelajar asal. Digantikan dengan tangkapan skrin baharu berplaceholder. |

---

## 4. Konsekuensi Mengekalkan Repository Lama sebagai Arkib Privat

Keputusan mengekalkan repository lama `naufalnab/darul-muthiah` sebagai arkib privat membawa beberapa implikasi penting:
1. **Akses Terhad:** Hanya pemilik akaun GitHub dan kolaborator terpilih yang mempunyai akses kepada repository privat tersebut.
2. **Keterbatasan Data Terdahulu:** Kerana repository pernah dibuka sebagai Public, jika terdapat pihak ketiga yang sempat mengklon atau menyalin fail semasa tempoh awam, penukaran status ke Private tidak memadam salinan di luar GitHub. Namun demikian, repository lama kini selamat daripada carian enjin atau akses awam langsung.
3. **Pemisahan Skop Kerja:** Repository lama berfungsi semata-mata sebagai arkib sejarah penyerahan bahan mentah. Semua aktiviti pembangunan aktif, semakan kod, dan persediaan deployment masa hadapan **wajib** berpindah 100% ke repository baharu `naufalnab/darul-muthiah-site`.

---

## 5. Keputusan & Perakuan (Verdict)

**Keputusan Audit: GO (Sedia untuk Inisialisasi Repository Bersih)**

Snapshot baharu pada direktori `/Users/mac/Documents/darul-muthiah-site` disahkan bersih, tiada sebarang data peribadi atau media pelajar tanpa kebenaran, mempunyai fungsi interaksi dan susun atur yang utuh, serta lulus ujian pembinaan automatik.
