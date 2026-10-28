# MADUM — Semakan pautan dan kontak

28 Oktober 2026. Semua nombor/alamat kekal sebagaimana konfigurasi baseline; tiada data direka. Ujian HEAD hanya memeriksa kebolehcapaian, bukan identiti, pemilikan atau kelulusan rasmi. Tiada mesej, e-mel, panggilan, transaksi atau permohonan dihantar.

| Item | Dapatan | Keputusan preview / blocker |
| --- | --- | --- |
| Mudah Zakat `https://www.mudahzakat.com/` | HEAD 200, redirect ke `https://mudahzakat.com/`. | Kekal pautan luar rujukan dengan rel noopener noreferrer. Penerima/afiliasi MADUM belum diverifikasi; tiada dakwaan menerima bayaran. |
| WhatsApp baseline +60 12-310 8902 | HEAD wa.me 200, redirect API WhatsApp ke nombor yang sama. Ini tidak membuktikan nombor aktif atau milik institusi. Poster/profil menyebut nombor lain dalam handoff. | Data tidak ditukar. Pautan aktif dan penghantaran borang ditahan; CTA menuju semakan saluran. Institusi perlu memilih dan menguji penerima rasmi. |
| Pejabat 03-5524 7296 | Tidak membuat panggilan. | Label belum disahkan; pautan tel ditahan. |
| E-mel nunature@yahoo.com | Tidak menghantar e-mel. | Label belum disahkan; pautan mailto ditahan. |
| Lokasi Shah Alam / Google Maps | URL carian dibina daripada alamat sedia ada, bukan koordinat yang diverifikasi. | Kekal pautan carian dengan nota alamat/pin belum disahkan. Tiada embed pihak ketiga. |
| Google Form kemasukan | URL rujukan disimpan dalam handoff terdahulu sahaja. Tidak dipaparkan dalam HTML atau QR. | Akses, sesi, medan, mesej selesai, penerimaan pentadbir dan ujian serahan belum selesai. Tunggu arahan ujian institusi; jangan hantar data calon sebenar. |
| Facebook | Tiada URL yang disahkan. | Tidak menambah pautan rekaan. |
| Domain canonical | Kekal `madum.ilmuniaga.com` dari baseline. | Domain akhir/hosting masih blocker; noindex/nofollow dan tanpa sitemap sepanjang internal. |

## Checklist penerimaan sebelum mengaktifkan pendaftaran

- Institusi mengesahkan sesi 2027, tarikh, syarat dan yuran terkini secara bertulis.
- Institusi mengesahkan URL borang dan nombor penerima, termasuk siapa memantau dan tempoh simpanan data.
- Uji pada telefon dan desktop dengan data sintetis: akses tanpa izin tak dijangka, validasi, serahan, halaman selesai dan penerimaan pentadbir. Hapus rekod ujian oleh pemilik.
- Selepas URL akhir tetap, semak QR dengan sekurang-kurangnya dua peranti dan pautan teks alternatif yang boleh diakses.
- Dapatkan kelulusan institusi bagi poster dan aktivasi CTA. Tiada approval diubah dalam PR fasa 2.
