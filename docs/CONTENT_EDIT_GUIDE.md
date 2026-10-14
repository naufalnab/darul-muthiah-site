# MADUM — Panduan Pengemaskinian Kandungan Berpusat (Content Edit Guide)

Dokumen ini menerangkan cara pihak pengurusan atau pembangun mengemas kini maklumat institusi, nombor hubungan, sesi, yuran, kurikulum, galeri, dan soalan lazim **di satu tempat** tanpa perlu menyunting fail HTML halaman secara manual.

---

## 1. Lokasi Fail Kandungan Utama

Semua fail data berpusat terletak di dalam direktori `src/content/`:

| Bidang Maklumat | Lokasi Fail | Keterangan |
|---|---|---|
| **Maklumat Institusi & Hubungan** | `src/content/siteConfig.ts` | Nombor WhatsApp, tahun sesi, alamat, telefon pejabat, emel, domain, mod penerbitan. |
| **Pendaftaran Dakwaan & Polisi** | `src/content/claimsRegistry.ts` | Status pengesahan fakta, teks penafian dan dasar paparan. |
| **Program & Kurikulum** | `src/content/programs.ts` | 3 laluan pengajian, 4 pilar sukatan pelajaran, jadual rutin harian. |
| **Yuran & Syarat Kemasukan** | `src/content/fees.ts` | Struktur yuran pendaftaran/bulanan, 3 langkah pendaftaran, syarat kelayakan. |
| **Foto Galeri & Video** | `src/content/gallery.ts` | Senarai 12 foto terpilih, kategori, teks alternatif, kapsyen, dan 2 video MP4. |
| **Soalan Lazim (FAQ)** | `src/content/faq.ts` | Senarai soalan dan jawapan akordion di halaman Hubungi Kami. |

---

## 2. Cara Mengemas Kini Maklumat Khusus

### 2.1 Mengubah Nombor WhatsApp atau Telefon Pejabat
Buka fail [`src/content/siteConfig.ts`](../src/content/siteConfig.ts):

```typescript
export const siteConfig = {
  // Nombor WhatsApp format antarabangsa tanpa simbol '+' untuk pautan API
  whatsappE164: '60123108902',
  
  // Format paparan mesra pembaca pada laman web dan footer
  whatsappDisplay: '+60 12-310 8902',
  
  // Nombor telefon talian tetap pejabat
  phoneOffice: '03-5524 7296',
  ...
};
```
*Kesan perubahan:* Secara automatik mengemas kini pautan borang WhatsApp, pautan kad hubungan, footer di kesemua 6 halaman, serta teks prapapar mesej.

---

### 2.2 Mengubah Tahun Sesi Kemasukan
Buka fail [`src/content/siteConfig.ts`](../src/content/siteConfig.ts):

```typescript
export const siteConfig = {
  admissionsSession: '2027', // Contoh pertukaran ke sesi baharu
  ...
};
```
*Kesan perubahan:* Palang pengumuman atas, tajuk borang WhatsApp, teks draf mesej automatik, dan seksyen CTA bawah akan dikemas kini serta-merta di seluruh laman web.

---

### 2.3 Mengemas Kini Struktur Yuran
Buka fail [`src/content/claimsRegistry.ts`](../src/content/claimsRegistry.ts):

```typescript
fee_registration_annual: {
  value: 'RM 1,310', // Ubah nilai yuran pendaftaran
  ...
},
fee_hostel_monthly: {
  value: 'RM 500',   // Ubah yuran asrama bulanan
  ...
},
fee_day_monthly: {
  value: 'RM 450',   // Ubah yuran harian bulanan
  ...
}
```
Jika yuran belum disahkan dan ingin digantikan dengan arahan terus menghubungi maahad, ubah polisi paparan:
```typescript
public_display_policy: 'replace_with_contact_cta'
```

---

### 2.4 Menukar Alamat Kampus atau Pautan Google Maps
Buka fail [`src/content/siteConfig.ts`](../src/content/siteConfig.ts):

```typescript
address: {
  street: 'No. 61, Jalan Gunung Nuang U11/28',
  subdistrict: 'Seksyen U11, Bukit Bandaraya',
  cityStatePostcode: '40170 Shah Alam, Selangor',
  full: 'No. 61, Jalan Gunung Nuang U11/28, Seksyen U11, Bukit Bandaraya, 40170 Shah Alam, Selangor.'
},
googleMapsUrl: 'https://maps.google.com/?q=...'
```

---

### 2.5 Menambah atau Menggantikan Foto Galeri
1. Letakkan fail imej baharu yang telah dioptimumkan (disyorkan format `.webp`, saiz < 200 KB) ke dalam folder `public/assets/`.
2. Buka fail [`src/content/gallery.ts`](../src/content/gallery.ts) dan kemas kini entri:

```typescript
{
  id: 'photo-13',
  src: '/assets/nama-foto-baharu.webp',
  cat: 'kelas', // Pilihan kategori: 'kelas' | 'ilmiah' | 'tvet' | 'sukan'
  catLabel: 'Hafazan & Kelas',
  title: 'Tajuk Ringkas Gambar',
  alt: 'Penerangan visual imej untuk pembaca skrin (aksesibiliti)'
}
```

---

### 2.6 Menambah Soalan Lazim (FAQ)
Buka fail [`src/content/faq.ts`](../src/content/faq.ts) dan tambah objek soalan baharu:

```typescript
{
  id: 'faq-5',
  question: 'Adakah kemudahan dobi disediakan untuk pelajar asrama?',
  answer: 'Ya, perkhidmatan mencuci pakaian disediakan sebagai sebahagian daripada pengurusan kebajikan asrama maahad.',
  defaultOpen: false
}
```

---

## 3. Langkah Membina Semula Selepas Perubahan

Selepas sebarang fail di atas disimpan, jalankan arahan berikut di terminal untuk menghasilkan pakej statik baharu:

```bash
pnpm run build
```
Hasil binaan terkini akan berada di dalam direktori `dist/` dan sedia untuk dimuat naik ke pelayan hosting.
