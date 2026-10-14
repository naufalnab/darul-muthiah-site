# MADUM — Panduan Serah Tugas Hosting Statik (Hosting Handoff)

**Sasaran Domain:** `madum.ilmuniaga.com` (Subdomain ILMU NIAGA)  
**Seni Bina Binaan:** Static HTML/CSS/JS (Export Folder: `dist/`)  
**Status Pengeluaran Semasa:** **TIDAK DITERBITKAN (NOT DEPLOYED)**

---

## 1. Keperluan Persekitaran Hosting

Oleh kerana laman web ini dibina menggunakan penjanaan statik tulen (`static export`), ia tidak memerlukan persekitaran runtime Node.js, pelayan pangkalan data MySQL, mahupun kontena Docker di pelayan pengeluaran.

### Spesifikasi Pelayan Minimum:
- Mana-mana pelayan web standard: **cPanel / DirectAdmin / Apache / Nginx / Cloudflare Pages / Vercel / Netlify**.
- Sokongan protokol fail statik dengan sokongan pemampatan Gzip/Brotli.
- Sijil Keselamatan **SSL / TLS (HTTPS)** aktif untuk subdomain `madum.ilmuniaga.com`.

---

## 2. Struktur Pakej Binaan (`dist/`)

Sebelum muat naik, bina pakej pengeluaran dengan arahan:
```bash
pnpm run build
```

Kandungan folder `dist/` yang dihasilkan:
```text
dist/
├── index.html                   (Laman Utama)
├── profil/index.html            (Laman Profil - mod laluan folder)
├── profil.html                  (Laman Profil - mod fail sandaran)
├── pengajian/index.html         (Laman Pengajian - mod laluan folder)
├── pengajian.html               (Laman Pengajian - mod fail sandaran)
├── kemasukan/index.html         (Laman Kemasukan - mod laluan folder)
├── kemasukan.html               (Laman Kemasukan - mod fail sandaran)
├── galeri/index.html            (Laman Galeri - mod laluan folder)
├── galeri.html                  (Laman Galeri - mod fail sandaran)
├── hubungi/index.html           (Laman Hubungi Kami - mod laluan folder)
├── hubungi.html                 (Laman Hubungi Kami - mod fail sandaran)
├── 404.html                     (Laman Ralat 404)
├── robots.txt                   (Polisi perayap enjin carian)
├── assets/                      (Semua fail imej WebP & video MP4)
└── _astro/                      (Fail CSS dan bundle JavaScript terkompres)
```

> **Perhatian Keselamatan:** Pakej `dist/` sengaja tidak menyertakan sebarang fail arkib asal klien (`.pdf`, dokumen profil 16 halaman, atau arkib mentah). Jangan sekali-kali menyalin fail asal klien ke folder awam.

---

## 3. Langkah Pelaksanaan Penerbitan (Deployment Procedures)

### Kaedah A: Melalui Pengurus Fail cPanel / File Manager (Paling Lazim)
1. Buka cPanel akaun hosting ILMU NIAGA.
2. Navigasi ke bahagian **Subdomains** dan pastikan document root bagi `madum.ilmuniaga.com` ditetapkan (contohnya: `public_html/madum` atau direktori yang ditetapkan).
3. Mampatkan (zip) keseluruhan fail dan folder di dalam direktori `dist/` (pastikan kandungan dalaman dizip, bukan folder `dist` itu sendiri).
4. Buka **File Manager**, pergi ke folder sasaran subdomain, dan muat naik fail ZIP tersebut.
5. Ekstrak fail ZIP dan padamkan arkib zip muat naik.
6. Pastikan fail `index.html` berada terus di bawah aras direktori akar subdomain berkenaan.

### Kaedah B: Melalui SFTP / SSH (Jika Akses Disediakan)
```bash
# Contoh muat naik menggunakan rsync (gantikan hos dan laluan sebenar)
rsync -avz --delete dist/ user@server.ilmuniaga.com:/var/www/madum.ilmuniaga.com/html/
```

---

## 4. Konfigurasi Pelayan Web (Nginx / Apache)

### Konfigurasi Apache (`.htaccess`):
Jika pelayan menyokong Apache/cPanel, fail `.htaccess` berikut boleh diletakkan di akar subdomain untuk memastikan rute bersih dan pengendalian halaman 404:

```apache
# Aktifkan mod rewrite untuk rute bersih jika diperlukan
RewriteEngine On
RewriteBase /

# Tetapkan dokumen ralat 404
ErrorDocument 404 /404.html

# Pastikan sambungan HTTPS dipaksa
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Konfigurasi Nginx:
```nginx
server {
    listen 80;
    server_name madum.ilmuniaga.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name madum.ilmuniaga.com;

    root /var/www/madum.ilmuniaga.com/html;
    index index.html;

    error_page 404 /404.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    location ~* \.(webp|png|jpg|jpeg|mp4|css|js|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 5. Prosedur Sandaran & Rollback (Undur Balik)

1. Sebelum sebarang proses muat naik versi baharu dilakukan, lakukan salinan arkib versi sedia ada di pelayan (contoh: salin folder kepada `madum_backup_YYYYMMDD/`).
2. Jika berlaku sebarang kecacatan visual atau ralat kandungan selepas kemas kini, padamkan kandungan folder aktif dan gantikan semula dengan kandungan folder `madum_backup_YYYYMMDD/`.
3. Di peringkat kawalan versi tempatan Git, setiap versi pelepasan boleh ditandai menggunakan tag Git (contoh: `git tag -a v1.0.0 -m "Pelepasan v1.0.0"`).
