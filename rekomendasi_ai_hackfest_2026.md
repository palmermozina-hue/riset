# AI HackFest 2026: Rangkuman Kompetisi dan Rekomendasi Proyek

**Disusun oleh:** Manus AI  
**Tanggal analisis:** 18 Agustus 2026  
**Sumber utama:** halaman resmi IDwebhost dan artikel pengumuman resmi.

## Ringkasan eksekutif

AI HackFest 2026 adalah kompetisi nasional pengembangan **AI Agent** dengan tema **“Build Agent, Deliver Impact.”** Fokus utamanya bukan membuat chatbot yang sekadar dapat menjawab, melainkan membangun agen yang menyelesaikan masalah nyata melalui alur kerja end-to-end dan menghasilkan dampak yang dapat diukur.[1] [2]

Berdasarkan bobot penilaian resmi, strategi dengan peluang kompetitif paling tinggi adalah memilih masalah yang sangat konkret, membangun agen yang benar-benar dapat dieksekusi dari awal sampai akhir, menunjukkan metrik sebelum–sesudah, dan menyajikannya melalui demo yang rapi. Rekomendasi utama saya adalah **“TuntasUMKM”**, yaitu AI Agent operasional untuk usaha mikro dan kecil yang mengubah pesan pelanggan menjadi alur kerja terstruktur: memahami pesanan, memeriksa stok, membuat ringkasan/invoice, menyiapkan balasan, dan mencatat tindak lanjut dengan persetujuan manusia.

Tidak ada ide yang dapat dijamin menang. Namun, TuntasUMKM paling rasional untuk memaksimalkan skor karena dapat mencakup **Business Automation**, **Customer Service**, dan **Productivity & Automation**, sekaligus mudah diuji dengan data sintetis yang aman, mudah didemokan secara end-to-end, dan memungkinkan pengukuran dampak yang jelas tanpa memerlukan akses ke sistem sensitif.

> “Kami percaya AI Agent paling berharga adalah yang benar-benar dipakai dan menyelesaikan masalah — bukan yang paling rumit.” — IDwebhost [1] [2]

## 1. Informasi lengkap kompetisi

### Identitas, tema, dan tujuan

Kompetisi ini bernama **AI HackFest 2026** dan diselenggarakan oleh IDwebhost, dengan PANDI sebagai Strategic Partner dan AI Club Indonesia sebagai Community Partner.[1] [2] Kompetisi dilaksanakan secara daring dan terbuka bagi developer, pelajar, mahasiswa, startup, profesional teknologi, hobbyist AI, serta masyarakat umum di Indonesia. Peserta dapat mendaftar secara individu maupun dalam squad.[1] [2]

Tujuan yang secara eksplisit ditekankan pada halaman kompetisi adalah menyelesaikan tantangan dunia nyata, menghadirkan workflow end-to-end, dan menghasilkan dampak yang terukur.[2]

### Kategori dan subkategori

| Kategori utama | Ruang masalah | Subkategori yang tercantum resmi |
|---|---|---|
| **Digital Safety & Public Good** | Keamanan digital, anti-penipuan, literasi digital, serta layanan yang mendukung kepentingan publik | Cyber Security & Anti Scam, Education, Healthcare, Public Service |
| **Business Automation** | Otomatisasi proses bisnis dan operasional perusahaan | Productivity & Automation, Customer Service |
| **Productivity & Personal AI** | Asisten kerja, aktivitas harian, manajemen waktu, dan peningkatan produktivitas individu | Productivity & Automation, Creative AI |
| **Open Innovation** | Eksplorasi agen AI di luar ruang kategori spesifik, selama berdampak nyata dan dapat diimplementasikan | Agriculture, AI Agent, Open Innovation, serta ide lain yang relevan |

Artikel pengumuman menguraikan empat kategori utama tersebut, sedangkan halaman kompetisi menampilkan daftar subkategori di atas.[1] [2] Karena halaman tidak menjelaskan apakah satu proyek boleh diklaim pada lebih dari satu subkategori, sebaiknya pilih satu kategori utama saat registrasi dan meminta konfirmasi pada technical meeting jika formulir menyediakan lebih dari satu pilihan.

### Infrastruktur dan teknologi

Panitia menyediakan Cloud VPS dengan spesifikasi **4 Core CPU, 4 GB RAM, dan 20 GB SSD**, beserta framework dan AI Model default selama periode kompetisi.[1] [2] Peserta memilih framework **OpenClaw** atau **Hermes** saat registrasi. Resource diaktifkan secara bertahap sesuai pembagian batch.[2]

Penggunaan AI Model, API, atau token AI di luar default menjadi tanggung jawab peserta. Oleh sebab itu, rancangan proyek sebaiknya tetap dapat berjalan dengan model default, menggunakan API eksternal hanya sebagai peningkatan opsional, dan menyediakan fallback deterministik untuk validasi data penting.[2]

### Hadiah

| Penghargaan | Hadiah resmi |
|---|---|
| **Best of All** | Uang tunai Rp5.000.000, domain .ID selama 12 bulan, dan Cloud VPS CloudBaik gratis selama 12 bulan dengan spesifikasi 4 Core CPU / 4 GB RAM / 20 GB SSD |
| **Best Innovation** | HUAWEI MatePad 11.5”, domain .ID selama 12 bulan, dan Cloud VPS CloudBaik gratis selama 6 bulan dengan spesifikasi 4 Core CPU / 4 GB RAM / 20 GB SSD |
| **Favorite Project** | HUAWEI WATCH FIT 4 Pro, domain .ID selama 12 bulan, dan Cloud VPS CloudBaik gratis selama 3 bulan dengan spesifikasi 4 Core CPU / 4 GB RAM / 20 GB SSD |

Rincian hadiah tersebut tercantum pada kedua halaman resmi.[1] [2]

### Bobot penilaian

| Kriteria | Bobot | Implikasi untuk proyek |
|---|---:|---|
| Relevansi dan kejelasan masalah | **20%** | Problem harus spesifik, nyata, mudah dipahami, dan memiliki pengguna yang jelas. |
| Efektivitas solusi | **30%** | Agen wajib benar-benar bekerja dan menyelesaikan masalah, bukan sekadar menghasilkan jawaban teks. |
| Kreativitas dan orisinalitas | **15%** | Harus ada pendekatan atau kombinasi workflow yang membedakan proyek dari chatbot generik. |
| Kualitas eksekusi teknis | **20%** | Tunjukkan arsitektur, reliability, tool-calling, validasi, serta pemanfaatan environment AI Hosting. |
| Storytelling video dan artikel | **15%** | Problem, demo, arsitektur, bukti dampak, dan keterbatasan harus disampaikan dengan runtut. |

Bobot resmi berjumlah 100% dan tercantum pada halaman kompetisi.[2] Karena efektivitas solusi memperoleh bobot terbesar, proyek yang sederhana tetapi berfungsi penuh lebih strategis daripada proyek yang luas tetapi banyak bagian palsu atau belum selesai.

### Timeline dan tahapan

| Tahap | Jadwal resmi | Hal yang harus dilakukan |
|---|---|---|
| Registrasi | **1–31 Agustus 2026** | Isi formulir dan wajib bergabung ke grup WhatsApp resmi. |
| Technical meeting dan pembagian batch | **1 September 2026** | Mengikuti pengarahan dan pembagian batch dengan sistem undian. |
| Development dan submission | **1–30 September 2026** | Membangun agent, melakukan pengujian, membuat video, menulis artikel, lalu mengirim link submission. |
| Judging period | **1–31 Oktober 2026** | Karya dinilai dari video demo dan artikel yang dikirimkan. |
| Pengumuman pemenang | **6 November 2026** | Diumumkan dalam webinar spesial AI HackFest 2026. |

Jadwal tersebut konsisten pada artikel pengumuman dan halaman kompetisi.[1] [2] Pada saat analisis ini dibuat, periode registrasi masih berada dalam rentang jadwal resmi.

### Persyaratan umum

Kompetisi terbuka untuk umum, baik solo maupun squad. Panitia menyediakan infrastruktur, framework, dan AI Model default; penggunaan resource eksternal menjadi tanggung jawab peserta. Solusi harus mematuhi hukum Indonesia, termasuk UU ITE dan UU PDP, serta Terms of Service platform pihak ketiga.[2]

Untuk track deteksi konten ilegal, agen hanya boleh melakukan **deteksi dan pelaporan melalui kanal resmi**, bukan tindakan main hakim sendiri. Panitia berhak mendiskualifikasi peserta yang melanggar aturan. Hak cipta artikel tetap milik peserta, sementara panitia memperoleh izin non-eksklusif untuk melakukan repost sebagai materi promosi.[1] [2]

Larangan eksplisit meliputi hacking atau unauthorized access, DDoS, scraping yang melanggar ToS, penyimpanan atau penyebaran data pribadi tanpa izin, serta konten yang menyerang individu tertentu.[2]

### Persyaratan video demo

Halaman kompetisi menetapkan durasi **5–10 menit**, format landscape 16:9, dan resolusi minimum 1080p.[2] Video harus menunjukkan proses kerja agent secara end-to-end serta sekurang-kurangnya satu bagian yang memperlihatkan environment VPS AI Hosting sedang digunakan, termasuk dashboard dan terminal. Nama produk AI Hosting dan IDwebhost wajib disebutkan secara verbal atau melalui lower-third minimal satu kali, dan watermark logo IDwebhost wajib terlihat di sudut video.[2]

Video harus diunggah ke platform publik seperti YouTube, TikTok, atau Instagram Reels dalam keadaan publik atau unlisted, bukan private, dan tidak boleh menggunakan musik atau footage berhak cipta tanpa izin.[2]

**Catatan penting:** artikel pengumuman menyebut durasi video **3–5 menit**, sedangkan tab aturan terbaru pada halaman kompetisi menyebut **5–10 menit**.[1] [2] Untuk menghindari diskualifikasi atau penalti administratif, gunakan ketentuan yang lebih spesifik pada halaman aturan, yaitu video landscape 1080p berdurasi 5–10 menit, lalu konfirmasi kembali pada technical meeting.

### Persyaratan artikel

Artikel harus minimal **800 kata**, orisinal, dan belum pernah dipublikasikan sebelumnya. Artikel wajib dipublikasikan di platform publik yang dapat diindeks mesin pencari, misalnya blog pribadi, forum, atau LinkedIn Articles, bukan platform private atau paywall.[2]

Artikel harus menjelaskan latar belakang masalah, pendekatan solusi, arsitektur AI Agent, serta dampak yang diharapkan.[1] Artikel juga wajib menyertakan dua backlink dengan anchor yang ditentukan: **“AI Hosting”** menuju [idwebhost.com/ai-hosting/](https://idwebhost.com/ai-hosting/) dan **“Cloud VPS”** menuju [cloudbaik.com](https://cloudbaik.com/).[2]

### Cara daftar dan submit

Pendaftaran dilakukan melalui [formulir resmi pendaftaran](https://forms.gle/aFnhbAPvs3q1zZD3A), kemudian peserta wajib bergabung ke grup WhatsApp. Submission dilakukan melalui [formulir resmi submit](https://forms.gle/s6y8vLzTgosz8rZ39) dan meliputi link video demo serta link artikel.[2]

Karya harus orisinal dan belum pernah diikutsertakan dalam kompetisi lain. Penggunaan AI untuk membantu pengembangan diperbolehkan, tetapi penggunaannya harus dijelaskan secara transparan dalam artikel. Setiap submission harus mencantumkan nama proyek, nama anggota, dan kategori yang dipilih.[1]

## 2. Analisis strategi untuk memaksimalkan peluang menang

Dengan bobot resmi, sasaran optimasi yang paling masuk akal adalah mendapatkan nilai tinggi pada efektivitas solusi sebesar 30% dan kualitas eksekusi teknis sebesar 20%, sambil menjaga relevansi masalah 20%. Artinya, jangan memulai dari teknologi yang ingin dipamerkan. Mulailah dari satu workflow yang sering terjadi, memiliki titik sakit jelas, dan dapat dibuktikan selesai dengan tiga sampai lima langkah otomatis.

Proyek juga sebaiknya memiliki **human-in-the-loop** pada keputusan berisiko, misalnya pengiriman invoice, perubahan stok, pengiriman laporan, atau pengiriman pesan kepada pelanggan. Pola ini memperkuat reliability dan kepatuhan tanpa mengurangi sifat agentic. Hindari klaim “menghemat 80% waktu” tanpa pengukuran. Lebih baik gunakan benchmark terkontrol, misalnya 30 percakapan pesanan yang sama sebelum dan sesudah memakai agent, lalu laporkan waktu, akurasi ekstraksi, dan jumlah intervensi manusia.

Berikut perbandingan ide berdasarkan penilaian heuristik, bukan skor resmi juri. Nilai ini mengukur seberapa mudah masing-masing ide memenuhi kriteria kompetisi dalam satu bulan dengan resource yang tersedia.

| Kandidat | Kategori utama | Relevansi | Efektivitas terukur | Orisinalitas | Teknis & VPS | Demo/story | Total heuristik / 10 |
|---|---|---:|---:|---:|---:|---:|---:|
| **TuntasUMKM** | Business Automation / Customer Service | 9 | 9 | 8 | 9 | 9 | **8,8** |
| **LaporAman** | Digital Safety & Public Good / Cyber Security & Anti Scam | 9 | 8 | 8 | 8 | 8 | **8,2** |
| **DesaSatuPintu** | Digital Safety & Public Good / Public Service | 9 | 8 | 8 | 7 | 8 | **8,1** |
| **GuruPulih** | Productivity & Personal AI / Education | 8 | 8 | 7 | 8 | 8 | **7,8** |
| **PadiSiaga** | Open Innovation / Agriculture | 8 | 7 | 8 | 6 | 7 | **7,2** |

TuntasUMKM menempati posisi pertama bukan karena idenya paling futuristis, melainkan karena memiliki rasio terbaik antara dampak, keterukuran, kemampuan demonstrasi, dan risiko implementasi. LaporAman sangat kuat secara sosial, tetapi memerlukan kehati-hatian tinggi agar tidak melakukan tindakan terhadap pihak lain, tidak salah menuduh, dan selalu mengarahkan pelaporan melalui kanal resmi. DesaSatuPintu menjanjikan dampak publik besar, tetapi kualitasnya sangat bergantung pada ketersediaan SOP layanan yang akurat. PadiSiaga dan solusi kesehatan memiliki risiko validasi, keselamatan, serta ketergantungan model yang lebih tinggi.

## 3. Rekomendasi utama: TuntasUMKM

### Konsep satu kalimat

**TuntasUMKM adalah AI Agent yang mengubah percakapan pelanggan usaha mikro menjadi pekerjaan operasional yang selesai: memahami kebutuhan, mengecek katalog dan stok, membuat draft pesanan, menyiapkan invoice, menyusun balasan, dan mencatat tindak lanjut dengan persetujuan pemilik.**

### Masalah yang diangkat

Banyak usaha mikro mengelola pesanan melalui chat yang bercampur dengan pertanyaan harga, ketersediaan barang, alamat pengiriman, permintaan variasi produk, dan komplain. Pemilik usaha harus membaca percakapan satu per satu, menyalin data secara manual, memeriksa spreadsheet, lalu menulis balasan. Akibatnya, pesanan berisiko terlewat, stok tidak sinkron, dan pelanggan menunggu terlalu lama.

Masalah ini relevan, mudah dipahami juri, dan tidak membutuhkan data pribadi nyata untuk didemokan. Gunakan dataset sintetis berisi katalog, stok, jam operasional, kebijakan retur, biaya pengiriman, dan 30–50 percakapan uji yang dibuat khusus untuk kompetisi.

### Alur end-to-end yang harus benar-benar bekerja

| Tahap | Perilaku agent | Bukti di demo |
|---|---|---|
| 1. Intake | Menerima pesan pelanggan melalui web inbox atau dataset chat yang menyerupai kanal bisnis. | Tampilkan pesan mentah pelanggan. |
| 2. Understanding | Mengekstrak produk, jumlah, varian, alamat atau kebutuhan pengiriman, serta intent seperti order, tanya stok, atau komplain. | Tampilkan JSON terstruktur dan confidence. |
| 3. Grounding | Mengambil informasi dari knowledge base katalog dan kebijakan toko melalui RAG. | Tampilkan sumber dokumen yang dipakai. |
| 4. Tool execution | Memanggil tool untuk cek stok, menghitung total, membuat draft invoice, dan mencatat task tindak lanjut. | Tampilkan log tool call dan perubahan status. |
| 5. Guardrail | Meminta persetujuan manusia sebelum mengurangi stok final atau mengirim balasan yang bersifat komitmen. | Klik tombol approve/reject. |
| 6. Response | Menghasilkan balasan pelanggan yang akurat dan ringkas. | Tampilkan balasan final. |
| 7. Analytics | Mencatat waktu proses, kesalahan ekstraksi, kebutuhan intervensi, dan status order. | Tampilkan dashboard metrik. |

Agar tidak tampak sebagai chatbot biasa, agent harus memiliki **state**, memanggil beberapa tool, mengubah status workflow, dan dapat berhenti untuk meminta approval. Jika waktu terbatas, implementasikan dua workflow utama secara sempurna: **order baru** dan **pertanyaan stok**. Komplain dapat dijadikan fitur bonus.

### Arsitektur teknis yang disarankan

Gunakan Cloud VPS sebagai host aplikasi, database ringan, knowledge base, dan worker agent. Frontend sederhana dapat menampilkan inbox, detail order, approval queue, serta dashboard metrik. Backend menyediakan endpoint untuk menerima pesan, menjalankan agent, memanggil tool katalog/stok/invoice, dan menyimpan audit log.

Arsitektur minimal yang cukup kuat adalah: web inbox → agent orchestrator OpenClaw atau Hermes → retrieval knowledge base → tool registry → database order/inventory → approval queue → response generator → metrics dashboard. Untuk reliability, tambahkan schema validation, timeout, retry terbatas, idempotency key untuk mencegah order ganda, serta fallback berbasis aturan untuk harga dan stok. Jangan membiarkan model bebas mengarang harga, stok, atau kebijakan.

Data demo sebaiknya sintetis. Jangan mengunggah nomor telepon, alamat, nama, atau dokumen identitas pelanggan nyata tanpa izin. Hal ini sekaligus mematuhi larangan penyimpanan/penyebaran data pribadi tanpa izin.[2]

### Metrik keberhasilan

Gunakan metrik yang dapat dihitung otomatis dan tampilkan nilai baseline serta nilai setelah memakai agent. Contoh benchmark adalah 40 percakapan sintetis dengan variasi typo, bahasa informal, produk tidak tersedia, jumlah ambigu, dan permintaan komplain.

| Metrik | Cara pengukuran |
|---|---|
| Akurasi ekstraksi order | Persentase percakapan dengan produk, jumlah, dan varian yang teridentifikasi benar. |
| Akurasi jawaban stok/harga | Persentase jawaban yang sesuai dengan database sumber. |
| Completion rate workflow | Persentase kasus yang mencapai draft order atau tiket tindak lanjut tanpa error. |
| Waktu pemrosesan | Waktu dari pesan masuk sampai draft balasan/invoice tersedia. |
| Human intervention rate | Persentase kasus yang membutuhkan koreksi manual. |
| Duplicate prevention | Jumlah order ganda pada pengujian retry atau pesan duplikat. |
| Citation/grounding rate | Persentase jawaban kebijakan yang memiliki rujukan dokumen sumber. |

Jangan memalsukan hasil. Jika benchmark menghasilkan akurasi 86%, laporkan 86%, jelaskan kasus gagal, dan tunjukkan perbaikan yang dilakukan. Transparansi terhadap keterbatasan sering lebih meyakinkan daripada klaim sempurna.

### Keunikan yang cukup untuk nilai kreativitas

Pembeda TuntasUMKM bukan “AI membalas chat”, melainkan **agent yang menyelesaikan pekerjaan operasional dengan kontrol risiko**. Tiga pembeda yang bisa ditonjolkan adalah: pertama, agent menghasilkan workflow state machine, bukan satu jawaban; kedua, setiap keputusan stok/harga dapat ditelusuri ke sumber; ketiga, agent mempunyai approval gate dan audit log sehingga pemilik tetap memegang kendali.

### Kategori yang paling cocok

Pilih **Business Automation** sebagai kategori utama dan **Customer Service** sebagai subkategori jika formulir menggunakannya. Bila formulir hanya menyediakan pilihan kategori utama, jangan menambahkan klaim kategori yang tidak tersedia; cukup jelaskan bahwa use case berada pada irisan customer service dan produktivitas operasional.

## 4. Dua alternatif kuat

### Alternatif A: LaporAman

LaporAman adalah agent yang menganalisis pesan, tautan, atau pola transaksi mencurigakan, menjelaskan indikator risikonya, membuat ringkasan bukti, dan membantu pengguna menyiapkan laporan ke kanal resmi. Agen tidak menghubungi pelaku, tidak melakukan blocking sepihak, tidak melakukan hacking, dan tidak mengumumkan tuduhan kepada publik. Kategori utamanya adalah Digital Safety & Public Good dengan subkategori Cyber Security & Anti Scam.

Ide ini berpotensi kuat untuk Best Innovation karena dampak sosialnya jelas. Namun, guardrail harus sangat ketat: gunakan data sintetis, tampilkan tingkat keyakinan dan alasan, sediakan disclaimer, dan arahkan pelaporan hanya ke kanal resmi. Jangan menyimpan atau menyebarkan nomor telepon/identitas nyata. Pilih alternatif ini jika tim memiliki kemampuan kuat di bidang keamanan digital dan dapat membuat demo yang bertanggung jawab.

### Alternatif B: DesaSatuPintu

DesaSatuPintu adalah agent layanan publik berbasis RAG yang menjawab pertanyaan warga berdasarkan SOP, memeriksa daftar dokumen yang diperlukan, membuat draft permohonan, dan meneruskan tiket kepada petugas. Gunakan SOP publik atau dataset fiktif yang jelas diberi label demo. Ukur pengurangan waktu mencari informasi, kelengkapan dokumen, dan konsistensi jawaban.

Ide ini cocok untuk Public Service dan memiliki narasi dampak yang kuat, tetapi jangan membuat klaim bahwa agent mengambil keputusan administratif final. Agent hanya membantu navigasi layanan dan menyiapkan draft; keputusan tetap pada petugas berwenang. Risiko utamanya adalah ketidakakuratan SOP dan pemrosesan data pribadi.

## 5. Rencana eksekusi satu bulan

| Periode | Deliverable utama |
|---|---|
| Sebelum 1 September | Registrasi, bergabung ke WhatsApp, memilih kategori, menyiapkan problem statement, dataset sintetis, dan definisi metrik. |
| 1–3 September | Mengikuti technical meeting, memastikan batch/resource, mengunci framework, dan menguji akses VPS. |
| 4–10 September | Menyelesaikan database, RAG, tool registry, dan satu workflow order dari input sampai draft invoice. |
| 11–17 September | Menambahkan approval gate, audit log, idempotency, retry/timeout, dashboard, dan workflow pertanyaan stok. |
| 18–22 September | Menjalankan benchmark 30–50 kasus, memperbaiki failure mode, dan mengumpulkan screenshot metrik. |
| 23–25 September | Freeze fitur, deploy versi final, uji dari VPS bersih, dan siapkan backup/demo script. |
| 26–28 September | Rekam video 5–10 menit dalam 1080p landscape; pastikan dashboard/terminal AI Hosting, penyebutan IDwebhost, dan watermark terlihat. |
| 29 September | Publikasikan artikel minimal 800 kata dengan dua backlink wajib, lalu cek indeksabilitas dan semua link. |
| 30 September | Submit link video dan artikel melalui formulir resmi; simpan bukti submission. |

## 6. Struktur video demo yang disarankan

Video ideal berdurasi sekitar 8 menit agar cukup memenuhi aturan tanpa menjadi bertele-tele. Menit pertama menjelaskan masalah dan siapa penggunanya. Menit kedua memperkenalkan arsitektur. Menit ketiga sampai keenam memperlihatkan satu order end-to-end, termasuk tool call, RAG source, perubahan status, approval, dan balasan. Menit ketujuh memperlihatkan dashboard VPS AI Hosting dan terminal. Menit terakhir menyajikan benchmark, keterbatasan, roadmap, serta ajakan penggunaan.

Pastikan nama **AI Hosting** dan **IDwebhost** disebut secara verbal atau melalui lower-third. Pasang watermark logo IDwebhost secara permanen di sudut video. Gunakan screen recording buatan sendiri, suara narasi sendiri, dan musik bebas lisensi atau tanpa musik.[2]

## 7. Checklist sebelum submit

| Area | Pemeriksaan wajib |
|---|---|
| Kepatuhan | Tidak ada hacking, DDoS, scraping yang melanggar ToS, data pribadi tanpa izin, atau tuduhan terhadap individu. |
| Fungsionalitas | Agent menerima input, mengambil konteks, memanggil tool, mengubah state, meminta approval, dan menghasilkan output. |
| Infrastruktur | Video memperlihatkan VPS AI Hosting, dashboard, terminal, serta deployment yang benar-benar berjalan. |
| Video | 5–10 menit, landscape 16:9, minimal 1080p, publik/unlisted, watermark, penyebutan IDwebhost dan AI Hosting. |
| Artikel | Minimal 800 kata, orisinal, belum pernah dipublikasikan, platform publik yang dapat diindeks, dua backlink wajib. |
| Pengukuran | Ada baseline, dataset uji, metrik, hasil aktual, contoh berhasil, dan contoh gagal. |
| Administrasi | Nama proyek, nama anggota, kategori, link video, link artikel, dan formulir submit telah diperiksa. |

## Kesimpulan

Jika targetnya adalah memaksimalkan peluang menang secara realistis, bangun **TuntasUMKM** sebagai agent operasional yang sempit tetapi tuntas. Jangan menjualnya sebagai “asisten AI untuk semua hal”; posisikan sebagai sistem yang menyelesaikan dua workflow bernilai tinggi secara konsisten, dapat diaudit, dan dapat diukur. Fokus tersebut paling sesuai dengan tema kompetisi, memperoleh manfaat dari bobot efektivitas 30%, dapat menunjukkan kualitas teknis 20%, dan menghasilkan video yang mudah dipahami juri.

Prioritas pengembangan harus berurutan: **workflow yang bekerja → guardrail dan reliability → metrik → pemanfaatan VPS → storytelling**. Jika technical meeting mengubah durasi video atau detail framework, ikuti ketentuan terbaru dari panitia dan revisi checklist sebelum submission.

## Referensi

[1]: <https://idwebhost.com/blog/ai-hackfest-2026/> "AI Hackfest 2026 Resmi Dibuka! Developer, Sudah Siap Belum? — IDwebhost"

[2]: <https://idwebhost.com/competition> "AI HackFest 2026 — Halaman Kompetisi Resmi IDwebhost"
