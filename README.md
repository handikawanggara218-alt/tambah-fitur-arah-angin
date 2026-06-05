# WeatherFinder ⛅

Aplikasi pencari cuaca berbasis mobile yang dibangun menggunakan **React Native** dan **Expo Go**. Aplikasi ini mengintegrasikan **Open-Meteo API** (tanpa API Key) dengan alur interaksi dua langkah (Geocoding untuk mencari koordinat kota, diikuti dengan Fetch Forecast untuk mengambil data cuaca terkini). Dikembangkan sebagai pemenuhan Tugas Praktikum Misi 10.

---

## 🚀 Fitur Aplikasi

Berikut adalah daftar fitur yang telah diimplementasikan sesuai dengan rubrik penilaian:

### 🟢 Level 1 — Fitur Wajib (Core)
* [x] **TextInput Controlled Component**: Menggunakan state `searchInput` dan `onChangeText` untuk menangani perubahan input secara dinamis.
* [x] **Debounce 500ms**: Mengoptimalkan performa jaringan dengan membatasi request API (1 kota = 1 request, bukan per ketukan huruf) menggunakan `setTimeout` dan `clearTimeout`.
* [x] **useEffect & Cleanup**: Sinkronisasi data pencarian berbasis dependency array `[searchInput]` lengkap dengan `AbortController` untuk membatalkan request lama jika input berubah cepat.
* [x] **Fetch 2-Langkah (Open-Meteo)**: Alur asinkronus runtun dari pencarian nama kota (Geocoding API) menuju pencarian cuaca aktual berdasarkan koordinat (Forecast API).
* [x] **4 Kondisi State UI**: Menangani kondisi layar secara visual saat **Kosong (Hint)**, **Loading (Spinner)**, **Error (Pesan Kesalahan)**, dan **Sukses (Kartu Cuaca)**.
* [x] **WMO Weather Code Mapping**: Mengonversi kode cuaca standar World Meteorological Organization (minimal 8 kode) menjadi deskripsi teks bahasa Indonesia dan emoji yang relevan.

### 🟡 Level 2 — Pengembangan (Pilih Minimal 2)
* [x] **🧭 Arah & Kecepatan Angin**: Menampilkan data kecepatan angin (`windspeed` dalam km/jam) dan mengonversi derajat arah angin (`winddirection`) menjadi mata angin tekstual (U, TL, T, TG, S, BD, B, BL).
* [x] **🎨 Background Dinamis & Indikator Siang/Malam**: Menggunakan parameter `is_day` dari API untuk mengubah skema warna latar belakang secara real-time (Biru langit cerah untuk Siang dan Biru Gelap/Slate untuk Malam).

### 🔴 Level 3 — Tantangan Bonus (Opsional)
* [x] **Pull-to-refresh**: Mengintegrasikan komponen `RefreshControl` di dalam `ScrollView` untuk memperbarui data cuaca kota aktif secara langsung dengan menarik layar ke bawah.

---

## 🛠️ Tech Stack
* **Framework**: React Native (Expo Ecosystem)
* **Runtime Tester**: Expo Go (Physical Device)
* **Language**: JavaScript (ES6)
* **API Provider**: [Open-Meteo API](https://open-meteo.com/)

🔗 **Link Expo Snack**: [Masukkan Link Expo Snack Kamu di Sini]([https://snack.expo.dev/@username/weatherfinder](https://snack.expo.dev/@handika_14/tambah-fitur-arah-angin)

---

## 📦 Panduan Menjalankan Project (Setup Instructions)

Ikuti langkah-langkah berikut untuk menjalankan project di lingkungan lokal Anda:

1.  **Clone Repository**
    ```bash
    git clone https://github.com/USERNAME_KAMU/REPO_KAMU.git
    cd REPO_KAMU
    ```

2.  **Instalasi Dependencies**
    Pastikan Anda sudah menginstal Node.js, kemudian jalankan perintah:
    ```bash
    npm install
    ```

3.  **Menjalankan Expo Development Server**
    Mulai server Expo menggunakan perintah berikut:
    ```bash
    npx expo start
    ```

4.  **Menjalankan di HP Fisik**
    * Unduh aplikasi **Expo Go** di Android (Play Store) atau iOS (App Store).
    * Pastikan HP dan Laptop terhubung ke jaringan **Wi-Fi yang sama**.
    * Scan QR Code yang muncul di terminal menggunakan aplikasi Expo Go (atau kamera bawaan pada iOS).

---

## 📸 Dokumentasi Antarmuka (Screenshots)

*Catatan: Ganti placeholder di bawah ini dengan file gambar asli hasil screenshot dari HP fisik Anda sebelum melakukan push.*

| 1. Kondisi Kosong (Hint) 
| ![Kosong](https://www.image2url.com/r2/default/images/1780641295247-f7b65e15-a33f-476e-af0f-05b5dc111d70.jpeg)) |

| 2. Kondisi Loading |
| ![Loading](https://www.image2url.com/r2/default/images/1780641469779-f46f10e0-bd8b-4140-94c9-16d96c344b65.jpeg)) |

| 3. Kondisi Sukses (Data Muncul)|
| ![Sukses](https://www.image2url.com/r2/default/images/1780641519263-be08f840-25c4-41a8-be4b-9502150eb2e0.jpeg)) |

| 4. Kondisi Error / Tidak Ditemukan |
| ![Error](https://www.image2url.com/r2/default/images/1780641563377-18165e4a-78bf-4c36-88ea-06dfe71aca28.jpeg)) |

---

## 📝 Contoh Riwayat Commit (Conventional Commits)
Project ini dikembangkan menggunakan standar penulisan pesan commit yang rapi:
* `feat: implementasi core search dan debounce 500ms`
* `feat: tambah integrasi fetch 2-langkah open-meteo api`
* `feat: tambah fitur arah angin dan background dinamis siang malam`
* `style: penyesuaian tata letak kartu cuaca dan skema warna`
