# Maahad Tahfiz Al Quran Darul Muthiah (1) — Official Website

Laman web rasmi Maahad Tahfiz Al Quran Darul Muthiah (1) (MADUM), dibangunkan berasaskan seni bina statik moden menggunakan **Astro**, **HTML Semantik**, dan **Vanilla CSS Design Tokens**.

Repository ini merupakan **snapshot bersih (clean repository)** yang direka khas untuk keselamatan privasi penuh:
- **Zero Raw Client Files:** Dokumen PDF dalaman, data peribadi, dan fail arkib mentah disingkirkan sepenuhnya.
- **Media direview mengikut aset:** Dokumentasi website terpilih dipaparkan dalam preview internal melalui allowlist SHA-256 berdasarkan arahan pemilik. Aset lain kekal ditahan; ini tidak meluluskan parental consent atau pelepasan rasmi.
- **Fail-Closed Publication Gatekeeper:** Sistem kawalan binaan automatik menghalang pelepasan ke khalayak umum tanpa kelulusan institusi yang lengkap.

---

## 1. Seni Bina Projek

Projek ini mengandungi enam halaman utama serta halaman ralat 404:

| Laluan (Route) | Halaman | Deskripsi |
|---|---|---|
| `/` | **Utama (Homepage)** | Hero identiti, modul pendaftaran sesi aktif, ringkasan pengajian, aktiviti teras, dan saluran WhatsApp. |
| `/profil` | **Profil Maahad** | Latar belakang penubuhan, visi & misi, struktur pengurusan, lokasi dan perakuan rasmi JAIS/LZS. |
| `/pengajian` | **Pengajian & Kurikulum** | Aliran Tahfiz 30 Juzuk, akademik bimbingan SPM, kurikulum TVET vokasional, dan adab tarbiah. |
| `/kemasukan` | **Kemasukan & Yuran** | Syarat kelayakan umur 10–17 tahun, carta alir pendaftaran, struktur yuran rujukan, dan borang pertanyaan interaktif. |
| `/galeri` | **Galeri & Pencapaian** | Dokumentasi foto berkategori (penapis interaktif), kad video aktiviti berhemah, dan paparan lightbox. |
| `/hubungi` | **Hubungi Kami** | Maklumat premis, peta interaktif Google Maps, direktori perhubungan, dan soalan lazim (FAQ accordion). |
| `/404` | **Halaman 404** | Halaman mesra pengguna dengan panduan navigasi kembali ke laman utama. |

---

## 2. Struktur Direktori

```text
darul-muthiah-site/
├── docs/                     # Dokumentasi tadbir urus, audit privasi & panduan kandungan
│   ├── CLAIMS_REGISTER.md    # Daftar status pengesahan dakwaan & data institusi
│   ├── CONTENT_EDIT_GUIDE.md # Panduan pengemaskinian kandungan untuk pihak maahad
│   ├── HOSTING_HANDOFF.md    # Panduan penyerahan hosting statis (Cloudflare / Netlify / Vercel)
│   ├── IMPLEMENTATION_REPORT.md # Laporan teknikal seni bina & perbandingan visual
│   ├── PRIVACY_AUDIT.md      # Laporan audit privasi media & dasar perlindungan pelajar
│   └── RELEASE_BLOCKERS.md   # Senarai semak pintu pelepasan (release gates)
├── public/
│   ├── assets/               # Aset berjenama & placeholder rasmi (tiada data peribadi)
│   └── robots.txt            # Dikonfigurasikan Disallow: / secara lalai untuk mod pratonton
├── scripts/
│   ├── prebuild.mjs          # Pemeriksaan keselamatan pra-binaan (fail-closed)
│   ├── postbuild.mjs         # Penjanaan fallback fail statik & penguatkuasaan robots.txt
│   ├── run-qa.mjs            # Ujian automatik 7 halaman (responsif, tangkapan skrin, aset)
│   └── audit_cwv.mjs         # Pengauditan prestasi Core Web Vitals (FCP, LCP, CLS)
├── src/
│   ├── components/           # Komponen UI modular (Header, Footer, FAQ, WhatsApp form, dll)
│   ├── content/              # Konfigurasi data berpusat (siteConfig, fees, gallery, programs)
│   ├── layouts/              # Templat induk SiteLayout.astro
│   ├── pages/                # Fail halaman Astro (.astro)
│   └── styles/               # Tokens CSS, gaya global dan komponen
├── astro.config.mjs          # Konfigurasi Astro (output: 'static')
├── package.json              # Skrip & kebergantungan npm
└── tsconfig.json             # Konfigurasi TypeScript
```

---

## 3. Arahan Pembangunan Tempatan

Pastikan Node.js (v18+) dan `pnpm` telah dipasang pada sistem anda:

```bash
# 1. Pasang kebergantungan
pnpm install

# 2. Jalankan pelayan pembangunan tempatan (http://localhost:4321)
pnpm run dev

# 3. Lakukan semakan taip TypeScript
pnpm run typecheck

# 4. Bina laman web untuk pengeluaran statik
pnpm run build

# 5. Jalankan ujian jaminan kualiti (QA) automatik
node scripts/run-qa.mjs

# 6. Audit prestasi Core Web Vitals
node scripts/audit_cwv.mjs
```

---

## 4. Kawalan Privasi & Keselamatan Penerbitan (Fail-Closed)

Fail [`src/content/siteConfig.ts`](src/content/siteConfig.ts) mengawal mod pelepasan website:

```typescript
export const siteConfig: SiteConfig = {
  // Mod lalai: 'internal' (Pratonton selamat, robots.txt Disallow: /)
  publicationMode: 'internal',

  // Pintu pelepasan (Release gates)
  releaseApprovals: {
    feesApproved: false,                 // Kelulusan yuran semasa
    historyApproved: false,              // Pengesahan narasi sejarah
    studentMediaConsentApproved: false,  // Izin bertulis penerbitan media pelajar
    officialContactApproved: false,      // Pengesahan talian rasmi
    jaisUsageApproved: false             // Kebenaran penggunaan nombor JAIS
  }
};
```

### Mekanisme Keselamatan Automatik:
1. **Public Build Protection:** Sekiranya `publicationMode` ditukar kepada `'public'`, skrip `scripts/prebuild.mjs` akan membatalkan binaan secara automatik sekiranya mana-mana sekatan pelepasan masih bernilai `false`.
2. **Leak Prevention:** Skrip pra-binaan mengimbas direktori `public/` bagi menghalang sebarang fail berformat `.pdf`, `.zip`, `.doc` atau fail klien daripada tersalin ke folder output.
3. **Review Media Mengikut Aset:** Preview internal boleh memaparkan dokumentasi website terpilih yang direview dan terikat hash dalam `scripts/lib/documentationAssets.json`. Fail lain kekal dikecualikan. Public build tetap ditolak selagi persetujuan media institusi dan approval lain belum sah; allowlist bukan parental consent.

---

## 5. Status Semakan Pemilik (Owner Review)

- **Keputusan Pelancaran:** Tertakluk kepada senarai semak dalam [`docs/RELEASE_BLOCKERS.md`](docs/RELEASE_BLOCKERS.md).
- **Subdomain Ujian:** Pratonton dalaman sahaja, tiada pendaftaran awam diaktifkan.
- **Lesen & Hak Cipta:** Hak cipta terpelihara © Maahad Tahfiz Al Quran Darul Muthiah (1).


## Review fasa 2 — 28 Oktober 2026

[Laporan dan screenshot](docs/PHASE2_REPORT.md), [audit privasi](docs/PHASE2_PRIVACY_AUDIT.md), dan [semakan kontak](docs/PHASE2_CONTACT_REVIEW.md). Publication mode kekal internal; semua approval false. Preview hanya daripada build yang lulus allowlist. Jangan hidangkan root repo atau public/ sebagai laman statik, dan kekalkan pelayan dev pada loopback.

## Desktop refinement — 31 Oktober 2026

[Laporan semasa](docs/PHASE3_DESKTOP_REFINEMENT_REPORT.md) mengatasi penerangan preview media dalam laporan fasa terdahulu. Foto asli, 12 foto galeri dan dua video kini dipulihkan secara terpilih; potret alumni dan aktivasi QR/borang kekal ditahan. [Screenshot dan QA root/Pages](previews/phase3-desktop-refinement/) disimpan berasingan daripada bukti lama.
