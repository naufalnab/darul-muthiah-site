> **Status fasa 2 (28 Oktober 2026):** semua gate tetap false. Sesi konsep kini 2027; QR/Form, kontak, alumni dan pengiktirafan masih ditahan. Lihat [laporan terkini](PHASE2_REPORT.md) dan [audit privasi](PHASE2_PRIVACY_AUDIT.md); matriks lama di bawah ialah rujukan sejarah dan tidak boleh dianggap kelulusan.

# MADUM — Senarai Semak Sekatan Pelepasan (Release Blockers)

**Status Keseluruhan:** 🔴 **BLOCKED FOR PUBLIC DEPLOYMENT**  
**Mod Semasa:** `publicationMode = 'internal'` (Pratonton Dalaman Sahaja)  
**Mekanisme Keselamatan:** **Fail-Closed Automated Gatekeeper** ([`scripts/prebuild.mjs`](../scripts/prebuild.mjs) & [`scripts/postbuild.mjs`](../scripts/postbuild.mjs))  
**Tujuan Dokumen:** Memastikan tiada maklumat yang belum disahkan, angka yuran tidak tepat, klaim sejarah palsu, media pelajar bawah umur tanpa izin, atau fail dalaman PDF/klien yang bocor ke output pengeluaran.

---

## 1. Jadual Pintu Pelepasan (Release Gates Matrix)

| No | Bidang Maklumat | Nilai Rujukan (Sumber Asal) | Status Integriti | Mekanisme Fail-Closed (Mod Awam) | Tindakan Diperlukan Sebelum Go-Live |
|:---:|---|---|:---:|---|---|
| **1** | **Tahun Sesi Kemasukan** | `2026/2027` (Pesan Cik Yatt & PDF h.10 vs Poster 00000125: Sesi 2027) | 🔴 **BLOCKED** | Papar label penafian rasmi. | Sahkan sama ada sesi aktif adalah 2026/2027 atau 2027. |
| **2** | **Klaim Sejarah Penubuhan 2003** | **DITOLAK** (Tiada dalam dokumen; PDF h.3 & h.7 catat mula April 2012) | 🔴 **CONFLICTED** | Disingkirkan dari seluruh kod sumber. | Dilarang sama sekali menyiarkan tahun 2003 tanpa dokumen sokongan. |
| **3** | **Nombor WhatsApp Kemasukan** | `+60 12-310 8902` (Cik Yatt) vs `+60 12-202 3024` (Profil h.7) | 🔴 **BLOCKED** | Peringatan pra-tontonan dalaman aktif. | Tetapkan talian rasmi penerima pertanyaan wali santri. |
| **4** | **Jadual & Kadar Yuran** | Pendaftaran: **RM 1,310**<br>Asrama: **RM 500**/bln<br>Harian: **RM 450**/bln (PDF h.10) | 🔴 **BLOCKED** | **Fail-Closed:** Jika belum diluluskan, angka disembunyikan dan diganti teks *"Hubungi Kami"* secara automatik. | Persetujuan bertulis pihak maahad bagi struktur yuran terkini. |
| **5** | **Izin Penerbitan Media Pelajar** | 12 Foto Pelajar & 2 Klip Video (Usia 10–17 tahun) | 🔴 **BLOCKED** | **Fail-Closed:** Galeri foto/video tidak dirender & fail media disingkirkan daripada `dist/assets/` dalam mod awam. | Borang kebenaran bertulis ibu bapa/penjaga (parental consent). |
| **6** | **Pendaftaran JAIS & LZS** | JAIS: `BZH8026` / `13S(8)18/59` (Luput: 13 Okt 2028)<br>LZS: `Kod 1290` | 🟡 **PENDING** | Teks nombor sahaja dipaparkan; tiada imbasan sijil atau data peribadi penandatangan. | Pengesahan hak siar nombor perakuan pada laman awam. |
| **7** | **Domain & Konfigurasi Pelayan** | `madum.ilmuniaga.com` vs `www.madum.edu.my` | 🔴 **BLOCKED** | robots.txt `Disallow: /` dan meta `noindex, nofollow` aktif. | Pengesahan domain pengeluaran akhir dan sijil SSL. |
| **8** | **Lokasi & Pin Google Maps** | No. 61, Jalan Gunung Nuang U11/28, Shah Alam | 🟡 **PENDING** | Peta ditandakan sebagai ilustrasi visual; pautan luar ke carian Maps. | Pengesahan pin koordinat premis bagi panduan pengunjung. |
| **9** | **E-mel Rasmi Pejabat** | `nunature@yahoo.com` (PDF h.7) | 🟡 **PENDING** | Nota semakan institusi dipaparkan. | Sahkan sama ada peti surat Yahoo masih aktif digunakan. |
| **10** | **Kutipan Transaksi Kewangan** | Tiada integrasi pembayaran | 🟢 **CLEARED** | Tiada nombor akaun bank atau kemudahan transaksi dalam kod. | Dikekalkan di luar skop versi 1.0. |

---

## 2. Kriteria Pelepasan Automatik (Automated Gatekeeper Enforcement)

Sistem binaan kini dilengkapi skrip pra-binaan [`scripts/prebuild.mjs`](../scripts/prebuild.mjs):
1. Jika pemboleh ubah `publicationMode` diubah kepada `'public'` dalam [`src/content/siteConfig.ts`](../src/content/siteConfig.ts):
   - Skrip akan menyemak objek `releaseApprovals`:
     - `feesApproved`
     - `historyApproved`
     - `studentMediaConsentApproved`
     - `officialContactApproved`
     - `jaisUsageApproved`
   - Sekiranya terdapat sekurang-kurangnya SATU sekatan yang bernilai `false`, perintah `pnpm run build` akan **TERUS DIBATALKAN (ABORTED with exit code 1)** dengan paparan ralat pelepasan.
2. Skrip keselamatan [`scripts/postbuild.mjs`](../scripts/postbuild.mjs):
   - Mengaudit direktori `dist/` untuk memastikan tiada berkas `.pdf`, `.zip`, `.doc` atau fail arkib klien yang tersalin ke folder umum.
   - Menguatkuasakan `robots.txt` dengan arahan `Disallow: /` bagi mod `internal`.
   - Menggugurkan fail media pelajar dari folder `dist/assets/` jika dibina dalam mod awam tanpa kelulusan media.

---

## 3. Senarai Semak Sebelum Go-Live (Owner Sign-off Checklist)

- [ ] Pengesahan bertulis pihak institusi Maahad Darul Muthiah mengenai sesi kemasukan rasmi (2026/2027 atau 2027).
- [ ] Pengesahan kadar yuran semasa (adakah RM 1,310 / RM 500 / RM 450 masih kekal).
- [ ] Penyerahan borang kebenaran bertulis bagi penyiaran wajah pelajar bawah umur.
- [ ] Pengesahan nombor WhatsApp dan e-mel rasmi untuk penerimaan pendaftaran.
- [ ] Keputusan domain pengeluaran akhir (`madum.edu.my` atau `madum.ilmuniaga.com`).
- [ ] Pengaktifan `releaseApprovals` dalam `siteConfig.ts` dan penukaran `publicationMode` kepada `'public'`.
