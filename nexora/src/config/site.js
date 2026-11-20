// Ganti nilai di bawah ini dengan akun / kontak NEXOGIL yang asli.
export const SITE = {
  name: 'NEXOGIL',
  // Format internasional tanpa "+" atau spasi, contoh: '6281234567890'.
  // Kosong = WhatsApp akan membuka pilihan kontak.
  whatsappNumber: '6285213938037',
  email: 'agilgustiana20@gmail.com',
  instagram: 'https://www.instagram.com/@syaagielz',
  tiktok: 'https://www.tiktok.com/@callme_gilll',
}

export const whatsappLink = (text = '') =>
  `https://wa.me/${SITE.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`
