# 🛥️ Royal Travel CMS (Payload + PostgreSQL)

Royal Travel CMS adalah sistem manajemen konten berbasis [Payload CMS](https://payloadcms.com/) dengan PostgreSQL.  
Digunakan untuk mengelola data **Hotels, Yachts, Private Jets, dan Golf** dengan backend + admin panel + frontend (Next.js App Router).

---

## ⚙️ Requirements

- Node.js v18 atau lebih baru (disarankan v20)
- pnpm versi **minimal 9**
- PostgreSQL aktif di lokal

Untuk menginstall `pnpm`:
```bash
npm install -g pnpm
```

Cek versi:
```bash
pnpm -v
```

---

## 🚀 Cara Menjalankan (Mac Silicon)

### 1. Clone Repository
```bash
git clone <your-repo-url> royal-travel
cd royal-travel
```

### 2. Salin File Environment
```bash
cp .env.example .env
```

Lalu edit isi `.env` seperti berikut:

```
DATABASE_URI=postgres://royal_user:royal123@localhost:5432/royaltravel_db
PAYLOAD_SECRET=supersecret123
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_CORS_URL=http://127.0.0.1:5501  your front end url
```

> Gantilah `royal_user`, `royal123`, dan `royaltravel_db` sesuai database lokal PostgreSQL Anda.

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Jalankan dalam Mode Development
```bash
pnpm dev
```

Akses admin panel di:  
👉 http://localhost:3000/admin

---

## 🗄️ Migrasi Database

Untuk PostgreSQL, schema harus dijaga dengan migrasi.

- Buat migrasi:
```bash
pnpm payload migrate:create
```

- Jalankan migrasi:
```bash
pnpm payload migrate
```

> Lakukan setiap kali ada perubahan struktur koleksi.

---

## 🏁 Build & Jalankan Production

```bash
pnpm build     # build frontend dan admin panel
pnpm start     # jalankan server production
```

---

## 📁 Daftar Collections

- Hotels  
- HotelRooms  
- Yachts  
- YachtCharters  
- PrivateJets  
- JetCharters  
- GolfCourses  
- GolfPackages  
- Media  
- Pages  
- Posts  
- Categories  

Semua koleksi mendukung fitur:
- Draft & Preview  
- SEO & Redirects  
- Scheduled Publish  
- Search  

---

## 🔗 Dokumentasi

- Payload CMS: https://payloadcms.com/docs  
- Discord Community: https://discord.com/invite/payload  
- GitHub Repo: https://github.com/payloadcms/payload  

---

## ✅ Selesai

Royal Travel CMS siap dijalankan.  
Gunakan `pnpm dev` untuk mode pengembangan, dan pastikan `.env` sudah berisi `NEXT_PUBLIC_SERVER_URL` dan `NEXT_PUBLIC_CORS_URL` sesuai kebutuhan frontend.
