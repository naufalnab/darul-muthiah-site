# MADUM — 28 Oktober 2026 | Handoff pembaruan aman

Status: **Internal review / bukan persetujuan publikasi**.
Sumber: arkib percakapan WhatsApp Cik Nor Hayati (Yatt) pada 28 Oktober 2026 (tidak disalin ke GitHub).

## Keputusan editorial yang telah disiapkan
- Menyediakan kempen pengambilan **sesi 2027**, menggantikan poster lama dengan QR rosak. Gambar poster baharu TIDAK dimasukkan ke GitHub sehingga ujian borang dan persetujuan selesai.
- Menambah seksyen **Kejayaan Alumni** dengan tempat untuk enam profil. Nama, potret dan testimoni tidak disertakan ke repo awam sebelum izin penerbitan peribadi diperoleh.
- Menambah seksyen **Keahlian PITAS** pada halaman profil, sebagai dokumen yang diterima namun belum disahkan untuk paparan salinan sijil.
- Menambah pautan keluar **https://www.mudahzakat.com/** yang dikongsi oleh pihak maahad; website MADUM sendiri tidak memproses pembayaran.
- Semua kadar yuran rujukan PDF **2026/2027** disembunyikan apabila belum mendapat kelulusan (termasuk pada preview awam).
- Dalam output binaan apabila consent media pelajar belum diluluskan, gambar dan video pelajar disekat, diganti visual neutral. Ini bukan jaminan bahawa fail yang pernah diterbitkan pada GitHub atau sejarah commit sudah hilang.

## Aset klien untuk penempatan selepas izin
- Poster baharu: `00000247-PHOTO-2026-10-28-13-54-24.jpg`; lokasi cadangan: halaman `/kemasukan` dan ringkasan CTA homepage.
- Header baru: `00000273-PHOTO-2026-10-28-14-02-01.jpg`; lokasi cadangan: homepage hero. Pastikan hak siar dan kesesuaian mobile crop.
- JAIS: `00000238`, `00000239`, `00000240`; gunakan data terverifikasi sahaja tanpa memuat naik scan sijil mentah.
- LZS: `00000242`; PITAS: `00000244`; scan tidak boleh dipaparkan sebelum izin dan pembuangan metadata sensitif.
- Enam alumni: `00000257`, `00000259`, `00000262`, `00000266`, `00000269`, `00000271`; izin foto dan atribusi individu masih perlu dikonfirmasi.
- Satu testimoni peribadi diserahkan sebagai teks WhatsApp dan menunggu persetujuan atribusi. Nama tidak dicantumkan dalam handoff awam.

## Keputusan yang memerlukan Cik Yatt / pihak maahad
1. Pastikan pendaftaran aktif ialah **sesi 2027** dan semak Google Form `https://forms.gle/vyLMqLJpaHBkwyvJ9` sampai penghantaran ujian; jangan gunakan QR sebelum lulus.
2. Pastikan nombor rasmi CTA: **+60 12-310 8902** (preview lama) atau **+60 12-202 3024** (poster/profil).
3. Pastikan jumlah yuran sesi 2027; nilai rujukan 2026/2027 ialah RM1,310 (pendaftaran/tahunan), RM500 (asrama/bulan), RM450 (harian/bulan), **bukan kadar terkini yang telah diluluskan**.
4. Dapatkan izin bertulis penerbitan media pelajar bawah umur, dan izin/atribusi alumni untuk nama, gambar dan testimoni.
5. Sahkan domain akhir, pemilik cPanel, lokasi penerbitan, HTTPS dan rollback backup.
6. Sahkan hak siar sijil JAIS, LZS, PITAS serta penggunaan logo pihak berkuasa.
7. Sahkan pautan Facebook yang tepat; hanya nama halaman diterima, tidak ada URL yang disahkan.
8. Pastikan pemilik/penerima bayaran di portal Mudah Zakat; jangan menyalin butiran transaksi ke laman MADUM.

## Perlindungan akses
- Kredensial cPanel daripada chat **tidak pernah** dimasukkan ke dalam repo, dokumentasi, ataupun alat pembangunan.
- Setelah akses operasi diuji, **rotasi password cPanel** yang pernah dihantar dalam chat.
- Folder `public/assets` dalam sejarah repo awam mungkin masih mempunyai media asal; pembersihan output build tidak menghapus sejarah Git atau cache CDN. Periksa dan tangani bersama pemilik institusi.
- Jangan merge, aktifkan `publicationMode: public`, atau deploy cPanel sebelum semua gate sign-off sah.

## Verifikasi sebelum PR merge
- `pnpm run typecheck`
- `pnpm run build`
- `pnpm run test:gate`
- `pnpm run test:qa` (jika tersedia browser tempatan)
- Semak output `dist/assets` tiada foto/video pelajar ketika consent=false, dan halaman tidak memaut gambar yang dibuang.
- Semak semua 6 halaman, responsive desktop/mobile, keyboard, kontrak copy dan link luaran.
