# NEXOGIL Tech — Futuristic Digital Showroom

E-commerce laptop premium dengan hero 3D interaktif. Stack: React 19, Vite, Tailwind CSS 3, Framer Motion, React Three Fiber + drei, Lucide.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # output ke dist/
```

## Struktur

```
src/
  App.jsx                  susunan halaman + state filter & modal
  config/                  site.js (kontak/sosmed/WhatsApp), theme.js
  data/                    products.js (katalog), specFields.js
  context/CartContext.jsx  keranjang + localStorage ("nexogil-cart-v1")
  hooks/                   useProductFilter, useModalBehavior, useMediaQuery
  three/                   LaptopModel (laptop 3D prosedural), HeroCanvas,
                           FeaturedCanvas, AboutCanvas, RotatableGroup, StageEffects
  components/              Navbar, Hero, Categories, ProductShowcase, FilterBar,
                           ProductCard, ProductModal, Featured, About, Footer,
                           CartDrawer, Toast, ui/*
```

## Yang perlu Anda ganti

- `src/config/site.js` — nomor WhatsApp (format `6281234567890`), email, link Instagram & TikTok. Checkout keranjang membuka WhatsApp dengan ringkasan pesanan.
- `src/data/products.js` — harga dan spesifikasi adalah **data contoh**. Tambah produk dengan menambah objek baru; filter brand/GPU/kategori ikut otomatis.

## Catatan performa

- Tiga scene 3D dimuat lazy dan berhenti merender saat di luar layar (`Scene3D.jsx`).
- Kartu produk memakai laptop CSS-3D (`CssLaptop`), bukan WebGL, agar tidak ada puluhan canvas.
- Jika WebGL tidak tersedia, scene otomatis diganti fallback CSS.
