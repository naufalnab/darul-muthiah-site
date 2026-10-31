# MADUM — Integrasi kandungan asal, Fasa 3

28 Oktober 2026 · baseline `78e693f` (PR #3) · branch `feat/madum-phase3-real-content`.

**Sedia untuk semakan kandungan; belum sedia untuk penerbitan rasmi.** Enam halaman serta token jenama v1.0 dikekalkan. Enam kad alumni kini mempunyai nama, tahun dan pencapaian sebenar; testimoni asal berada dalam seksyen berasingan. Poster baharu menggunakan karya klien yang disunting untuk preview. Header penuh dan enam potret sudah dioptimumkan, tetapi paparan wajah kekal ditahan oleh gate atau padanan identiti yang belum terbukti.

## Sumber dan batas semakan

Arahan keselamatan terkini diikuti: **ZIP mentah dan `_chat.txt` tidak dibaca**. Hanya media curated di `/Users/mac/Documents/MADUM-Phase3-Source/client-assets/` dan fakta dalam brief digunakan. PDF 16 halaman diperiksa secara setempat, termasuk susun atur halaman; ia tidak mempunyai padanan enam potret alumni baharu. Tiada PDF, scan sijil, chat, VCF, kredensial atau sumber mentah baharu dimasukkan ke repo.

Pemilik membenarkan media website terpilih berada dalam repo yang boleh diakses umum. Oleh itu, output gambar terpilih tanpa EXIF/XMP disimpan dalam `public/assets/phase3/`. Ini **bukan** rekod persetujuan penjaga/individu dan tidak mengubah release approvals. Tiada audit atau rewrite sejarah Git dilakukan.

## Matriks permintaan Cik Yatt / brief

| Permintaan | Status | Pelaksanaan / perkara belum selesai |
| --- | --- | --- |
| Kekalkan enam halaman dan identiti v1.0 | DONE | Laluan, token warna dan struktur utama dikekalkan; tiada halaman pemasaran tambahan. |
| Header terkini 00000273 | DONE / NEEDS_APPROVAL | Crop desktop/mobile, WebP dan JPEG fallback disediakan. Preview memaparkan petikan motif gerbang tanpa wajah daripada fail yang sama. Paparan penuh memerlukan izin media serta penambahan hash yang disemak ke allowlist. |
| Ganti poster lama dengan 00000247 | DONE | Poster sebenar sesi 2027, versi semakan tanpa foto pelajar, QR dan butiran kontak/domain di dalam gambar. Poster 00000125 tidak digunakan untuk output baharu. |
| QR dan pautan alternatif | DONE / PENDING | QR dinyahkod secara offline dan disahkan dengan BCH/RS. Destinasi akhir serta akses borang tidak dapat dibuktikan; tiada pautan alternatif aktif. |
| Pendaftaran sesi 2027 | NEEDS_APPROVAL | Sesi pada poster ialah 2027. Poster disediakan tidak bermaksud pendaftaran dibuka; status laman kekal belum diaktifkan. |
| Enam profil alumni | DONE | Nama, tahun alumni, pencapaian dan institusi mengikut brief, tanpa menganggap semua pencapaian sebagai kelulusan yang telah diperoleh. |
| Enam potret pada kad yang tepat | PENDING / NEEDS_APPROVAL | Semua foto dioptimumkan. Media curated tidak menyertakan bukti pasangan foto–nama; `portrait: null` disengajakan. Tiada pemetaan berdasarkan urutan indeks, rupa atau andaian. Soalan pemetaan telah dihantar kepada pemilik. |
| Testimoni Nur Zulaikha | DONE / NEEDS_APPROVAL | Teks verbatim, atribusi tepat, seksyen berasingan dan nota semakan izin akhir. Tiada testimoni alumni lain dicipta. |
| Perakuan JAIS | DONE / NEEDS_APPROVAL | Ringkasan teks kod, nombor perakuan dan tarikh tamat **yang tercetak**. Status semasa dan izin logo/salinan sijil berasingan. |
| Tauliah LZS Penolong Amil IPIS | DONE / NEEDS_APPROVAL | Tajuk pelantikan dan kod institusi diringkaskan; tiada dakwaan tempoh semasa atau penerima transaksi. |
| Keahlian PITAS | DONE / NEEDS_APPROVAL | Ringkasan teks dan tarikh 26 Mac 2020, bukan dakwaan keahlian aktif hari ini. |
| Foto/video aktiviti | DONE untuk penyediaan / NEEDS_APPROVAL untuk paparan | Media sedia ada digunakan semula pada laluan berizin. Tiada fail video besar baharu diduplikasi, tiada autoplay audio/video. Media aktiviti kekal dikecualikan daripada build semasa kerana consent=false. |
| Mudah Zakat | DONE / PENDING | Pautan luar klien dikekalkan, halaman portal boleh dibaca melalui alat web dan menyebut MADUM; penerima serta status hubungan semasa masih perlu pengesahan. Tiada pembayaran. |
| Kontak / WhatsApp | DONE / PENDING | Baseline tidak diubah. Konflik nombor poster ditunjukkan; tel/mailto/WhatsApp dan submit borang terus ditahan. Tiada mesej atau panggilan dibuat. |
| Facebook | DONE / PENDING | Nama tepat halaman ditunjukkan. Tiada URL direka; menunggu URL sah. |
| Domain/cPanel | DONE untuk handoff / NEEDS_APPROVAL untuk release | `darulmuthiah.com` direkod sebagai domain cPanel yang dikongsi; canonical staging `madum.ilmuniaga.com` kekal. Tiada login atau deployment. |

## Provenance tepat dan alt

Semua hash sumber/output, saiz fail dan dimensi terdapat dalam [manifest aset](qa/phase3-assets.json). Hash sijil/PDF tanpa kandungan sensitif terdapat dalam [provenance sumber persendirian](qa/phase3-private-source-provenance.json). Fail asal kekal di folder curated; alat pemprosesan setempat disimpan di `MADUM-Phase3-Source/tools/`.

| Sumber curated | Output / penggunaan | Dimensi | Alt / keputusan |
| --- | --- | --- | --- |
| `00000273-PHOTO-2026-10-28-14-02-01.jpg` | `header-detail.webp`, preview tanpa wajah | 780×390 | “Petikan motif gerbang hijau daripada header pilihan pihak maahad, tanpa paparan wajah” |
| Sumber header yang sama | `header-desktop.webp`; crop asal x390,y0,w1210,h900 | 1020×760 | Paparan penuh ditahan; alt: “Header pilihan pihak maahad: sekumpulan wanita dan pelajar membaca Al-Quran bersama”. Tidak dianggap bukti dokumentasi aktiviti sebenar. |
| Sumber header yang sama | `header-mobile.webp`; crop asal x550,y0,w1050,h900 | 630×540 | `<source media="(max-width: 750px)">`, dimensi sumber dinyatakan. |
| Sumber header yang sama | `header-fallback.jpg` | 765×570 | Fallback JPEG, eager/high priority hanya untuk hero; petikan tanpa wajah digunakan selagi gate belum lulus. |
| `00000247-PHOTO-2026-10-28-13-54-24.jpg` | `poster-2027-review.webp` / `.jpg` | 854×1280 | “Poster pengambilan MADUM sesi 2027 untuk pelajar perempuan 10–17 tahun; foto, QR dan butiran hubungan ditutup sementara untuk semakan”. Tiada QR lama/baharu yang boleh diimbas dalam preview. |
| `00000257-PHOTO-2026-10-28-13-55-52.jpg` | `portrait-00000257.webp` | 490×700 | Identiti belum dipadankan; tidak dirender dalam kad. |
| `00000259-PHOTO-2026-10-28-13-55-53.jpg` | `portrait-00000259.webp` | 230×382 | Tiada upscale; identiti belum dipadankan. |
| `00000262-PHOTO-2026-10-28-13-55-53.jpg` | `portrait-00000262.webp` | 600×817 | Identiti belum dipadankan. |
| `00000266-PHOTO-2026-10-28-13-58-01.jpg` | `portrait-00000266.webp` | 600×797 | Identiti belum dipadankan. |
| `00000269-PHOTO-2026-10-28-13-59-26.jpg` | `portrait-00000269.webp` | 275×210 | Petikan kepala orang dewasa, x120,y10,w275,h210; anak dan orang lain dikecualikan. Identiti belum dipadankan. |
| `00000271-PHOTO-2026-10-28-14-00-02.jpg` | `portrait-00000271.webp` | 572×715 | Identiti belum dipadankan. |
| `00000238-SIJIL DAFTAR BZH8026 2026.jpg` | Teks dalam `recognitions.ts` sahaja | — | Kod BZH8026; perakuan 13S(8)18/59; tamat tercetak 13 Oktober 2028. ID pegawai, nama penandatangan, tandatangan dan logo tidak diterbitkan. |
| `00000239-JAIS BZH8026 2026.jpg` / `00000240-JAIS BZH8026 2026 PAGE 2.jpg` | Pengesahan silang butiran perakuan | — | Surat dua halaman disemak; tiada scan atau butiran pegawai disalin. |
| `00000242-PHOTO-2026-10-28-13-54-23.jpg` | Teks tauliah LZS | — | Penolong Amil Institusi Pendidikan Islam Swasta; kod PA IPIS 1290. Tiada tempoh semasa direka. |
| `00000244-PHOTO-2026-10-28-13-54-23.jpg` | Teks keahlian PITAS | — | Tarikh tercetak 26 Mac 2020; tiada nombor individu, tandatangan atau logo disalin. |
| `00000245-profail MADUM 1 utk IK WEB.pdf` | Rujukan semakan setempat 16 halaman | — | Bukan aset public. Yuran 2026/2027 tidak dijadikan kadar rasmi 2027; sejarah kekal melalui gate sedia ada. |

Alt potret selepas pasangan disahkan ialah `Potret [nama tepat]`; ia tidak digunakan sekarang. `alumni.ts` menyediakan medan foto dan dimensi untuk pemetaan yang boleh diaudit. Kad menunggu pemetaan memaparkan nama dan pencapaian sebenar, bukannya “Ruang profil”.

Jumlah 12 output gambar baharu: **682,681 bait**, termasuk fallback dan potret yang belum disiarkan. Tiga derivatif yang dibenarkan masuk build semasa berjumlah **382,885 bait**; browser memilih WebP poster apabila disokong, bukan memuat turun kedua-dua format. Hero preview hanya 3,364 bait. Ini saiz aset, **bukan** ukuran kelajuan atau Core Web Vitals.

## Bukti QR dan pautan

[Bukti QR terstruktur](qa/phase3-qr.json): grid 29×29 (QR versi 3), ECI UTF-8 26, byte mode, mask 2, error correction L. Kedua-dua pengesahan bebas payload lulus: BCH format **0 bit ralat** dan **15 sindrom Reed–Solomon semuanya sifar**. Tiada pembetulan ralat diperlukan.

Payload tepat: `https://forms.gle/vyLMqLJpaHBkwyvJ9`, sama dengan rujukan handoff terdahulu. Ini tidak membuktikan destinasi akhir, sesi pada borang atau keaktifan pendaftaran. Alat web tidak dapat membuka short URL; shell pula gagal DNS. Kaedah Vision macOS turut terhalang oleh akses model/pixel buffer, maka decoder offline berdasarkan modul digunakan. Tiada serahan sintetis atau data calon sebenar dihantar. QR di poster preview ditutup dan tiada pautan teks alternatif aktif.

| Pautan / saluran | Hasil semakan semasa |
| --- | --- |
| `https://www.mudahzakat.com/` | Alat web gagal pada host www; varian `https://mudahzakat.com/` boleh dibaca. Portal menyebut MADUM, alamat institusi dan penolong amil. Bukti bacaan alat web boleh berupa cache; redirect/live HTTPS dari mesin ini tidak dibuktikan kerana DNS shell disekat. Pautan klien dikekalkan; penerima transaksi tidak dianggap disahkan. |
| `wa.me/60123108902` | Alat web gagal membuka; tiada bukti baharu keaktifan/pemilikan. Nombor baseline tidak diganti dengan +60 12-202 3024 pada poster. |
| Telefon/e-mel | Tiada panggilan atau e-mel dihantar; tiada dakwaan keaktifan. Portal juga menyenaraikan e-mel berbeza, jadi baseline tidak diubah tanpa arahan institusi. |
| Facebook | Hanya nama halaman dibekalkan; tiada percubaan meneka URL. |
| Pautan dalaman | Audit statik root dan Pages: semua sasaran fail, anchor, gambar dan srcset wujud. Ini bukan pengujian HTTP live. |

Sumber portal: [Mudah Zakat](https://mudahzakat.com/). Kenyataan laman itu tentang penerima/tauliah tidak menggantikan pengesahan semasa oleh institusi atau LZS.

## Gate, privasi dan CI

- `siteConfig.json` tidak berubah: `publicationMode: internal`; semua lima `releaseApprovals` kekal **false**.
- `phase3Review.json` mengekalkan lima status **false** untuk padanan identiti, izin alumni, atribusi testimoni, aktivasi poster dan ujian borang. Public build turut ditolak jika semakan ini belum selesai. Approval true dalam fixture ujian hanya data sintetis.
- Allowlist hash Phase 2 diperluas secara terbatas kepada petikan header tanpa wajah dan dua format poster yang disunting. Header penuh, enam potret, foto aktiviti dan video tidak masuk `dist` atau direktori public terbitan.
- `picture/source/srcset` disokong dengan semakan setiap URL dan hash, termasuk subpath. Rujukan luar, data URI, media baharu tanpa review dan penggantian fail bernama sama terus ditolak.
- Paparan penuh header memerlukan **dua perkara**: consent sebenar dan penambahan hash aset yang disemak ke allowlist. Menukar flag sahaja tidak menjadikan URL header yang belum tersedia dirender. Potret juga memerlukan pasangan identiti, consent dan allowlist.
- PR CI mengekalkan browser QA wajib serta menambah audit statik. Trigger deployment Pages pada main tidak diubah, workflow cPanel tidak ditambah. Tiada skip QA untuk menjadikan CI hijau.
- Tiada aset besar lama dipadam atau diduplikasi; tiada tindakan terhadap sejarah Git. Noindex/nofollow, robots Disallow dan ketiadaan sitemap preview dikekalkan.

## QA sebenar

| Semakan | Hasil |
| --- | --- |
| `pnpm typecheck` | Lulus; 44 fail, 0 error/warning/hint. |
| `pnpm build` root | Lulus, termasuk audit hash dan privasi. |
| Build Pages `/darul-muthiah-site` | Lulus, termasuk srcset/pautan subpath. Dist akhir dikembalikan kepada root. |
| `pnpm test:gate` | **16/16 lulus**. Termasuk public release fail-closed, semakan Fasa 3, hash derivatif berubah, srcset asing, suffix spoof dan data URI. |
| `pnpm test:content` root / Pages | **39/39 setiap binaan**. Pautan fail/anchor, aset, dimensi/alt, noindex, kontak/Form ditahan, enam nama dan satu testimoni verbatim. |
| `pnpm test:qa` root / Pages | **BLOCKED**, exit non-zero: `listen EPERM: operation not permitted 127.0.0.1`. Tiada halaman diuji oleh browser. |
| Chrome alternatif tanpa server | Gagal dilancarkan oleh sandbox. Inventori browser CUA kosong. |
| Viewport 320/375/390/768/1024/1280/1440 | Disediakan dalam suite QA, tetapi **belum dilaksanakan** pada Fasa 3. Jangan anggap bukti Fasa 2 sebagai keputusan semasa. |
| Screenshot desktop/mobile Fasa 3 | **BLOCKED**; tiada screenshot laman selepas perubahan dicipta atau dilabel palsu. |
| axe, keyboard, LCP/FCP/CLS, throttled mobile | **Belum diukur** pada Fasa 3. Tiada angka prestasi atau klaim WCAG penuh. |
| Visual aset | Poster yang disunting, petikan header dan crop potret ditinjau secara langsung. Semua 12 output diuji tiada EXIF/XMP. |
| `git diff --check` | Lulus. |

Bukti mesin: [statik root](qa/phase3-static.json), [statik Pages](qa/phase3-static-pages.json), [browser root terhalang](../previews/phase3/qa.json), [browser Pages terhalang](../previews/phase3/qa-pages.json). Browser QA masih perlu dijalankan oleh CI atau mesin yang membenarkan Chrome dan loopback sebelum merge.

## Bukti visual

| Artefak | Maksud |
| --- | --- |
| [Thumbnail sebelum, Fasa 2](../previews/phase3/before-phase2-thumbnails.webp) | Thumbnail daripada screenshot baseline yang sedia ada; bukan QA baharu. Screenshot desktop/mobile penuh kekal di `previews/phase2/`. |
| [Aset selepas integrasi](../previews/phase3/after-assets-only.webp) | Petikan header dan poster yang benar-benar digunakan sekarang; **semakan aset, bukan screenshot laman**. |
| [Enam potret tanpa padanan nama](../previews/phase3/portrait-review-unmapped.webp) | Bukti output pilihan untuk semakan pemetaan, ID fail sahaja. Kedudukan gambar tidak menyatakan pasangan dengan susunan kad. |

Perbandingan screenshot laman sebelum/selepas pada desktop dan mobile masih PENDING kerana browser terhalang. Ambil screenshot melalui `pnpm test:qa` selepas rangkaian setempat dan Chrome tersedia; suite menyimpan 390px dan 1440px full-page serta memeriksa tujuh viewport.

## Keputusan yang masih diperlukan

1. Pasangan enam ID foto kepada nama. Konteks ini tidak tersedia dalam media curated; larangan membaca chat diutamakan.
2. Izin akhir nama/foto alumni, atribusi testimoni dan izin media pelajar bawah umur. Jangan merekodkan borang consent peribadi dalam Git.
3. Konfirmasi pendaftaran 2027 telah dibuka, tarikh dan syarat; sahkan akses/redirect Google Form, kemudian ujian hujung-ke-hujung oleh pihak maahad tanpa data calon sebenar.
4. Tetapkan nombor WhatsApp rasmi dan sahkan talian pejabat/e-mel. Tiada nombor baseline diubah secara automatik.
5. Yuran rasmi sesi 2027 dan kronologi institusi; kadar PDF rujukan tidak didedahkan dalam UI.
6. Status JAIS/LZS/PITAS semasa serta izin logo/salinan sijil. Dokumen sumber sahaja tidak membuktikan status hari ini.
7. URL Facebook tepat; hubungan penerima pembayaran Mudah Zakat; domain/canonical dan hosting akhir.
8. Browser QA dan screenshot semasa sebelum merge/release.

## Handoff cPanel — backup/rollback sahaja

Tiada login, penggunaan kredensial, penukaran password atau deployment dilakukan. `darulmuthiah.com` ialah domain operasi yang dikongsi, berasingan daripada canonical staging.

Apabila pemilik mengizinkan release secara berasingan: sahkan document root melalui pentadbir, ambil backup fail laman sedia ada serta konfigurasi berkaitan di luar repo, rekod masa dan checksum backup, dan sahkan backup boleh dipulihkan. Simpan build terdahulu untuk rollback. Jangan menyalin rahsia atau backup ke Git/public. Jika release kelak gagal, pulihkan document root daripada backup yang telah diuji dan semak semula enam laluan serta HTTPS. Tiada arahan upload/deploy atau kredensial disediakan dalam laporan ini.

## Penghantaran Git

Repo kerja asal bersih ketika mula dan tepat pada baseline; kerja orang lain tidak ditimpa. Sandbox menolak `git add` dengan `Unable to create .../.git/index.lock: Operation not permitted`; penulisan `.git` asal tidak boleh dilakukan.

Checkout berasingan disediakan pada `/Users/mac/Documents/MADUM-Phase3-Source/phase3-review-checkout` bagi menghasilkan **satu commit** pada branch yang sama tanpa mengubah Git repo asal. Kod suntingan dikekalkan juga dalam repo kerja asal; oleh itu status asal belum boleh dianggap committed/bersih. Semak hash commit dan hasil push pada jawapan penghantaran. Salinan sumber curated tidak disalin masuk checkout ini.

[Draf teks PR](PHASE3_DRAFT_PR.md) disediakan untuk review klien. Push/PR memerlukan akses GitHub; sekiranya rangkaian sandbox menolak, jalankan dari checkout bersih tersebut:

```sh
cd /Users/mac/Documents/MADUM-Phase3-Source/phase3-review-checkout
git push -u origin feat/madum-phase3-real-content
gh pr create --draft --base main --head feat/madum-phase3-real-content --title "feat(madum): integrate client content for Phase 3 review" --body-file docs/PHASE3_DRAFT_PR.md
```

Tiada merge main, force push, rewrite sejarah atau deployment dilakukan. Commit/PR untuk review tidak bermaksud kelulusan penerbitan.
