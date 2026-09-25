/**
 * ============================================================================
 *  KONTEN HALAMAN (placeholder) — ubah teks di sini tanpa menyentuh komponen.
 *  Nama ikon: ikon GRATIS Iconsax (https://iconsax.io). Pakai ikon dari kategori yang
 *  sudah dipakai (essential, arrow, weather, emails-messages, call, location) agar
 *  tidak menambah unduhan data ikon — lihat docs/design.md §Ikon.
 * ============================================================================
 */
import type { IconName } from "@/components/icon";

export const nav = [
  { href: "/#layanan", label: "Layanan" },
  { href: "/#keunggulan", label: "Keunggulan" },
  { href: "/#testimoni", label: "Testimoni" },
  { href: "/contact", label: "Kontak" },
] as const;

export const hero = {
  badge: "Baru: paket website + maintenance bulanan",
  titleBefore: "Bangun kehadiran digital yang",
  titleHighlight: "benar-benar bekerja",
  titleAfter: "untuk bisnis Anda.",
  description:
    "Dari desain hingga peluncuran, kami menyiapkan website yang cepat dibuka di ponsel, aman, dan dirancang untuk mengubah pengunjung menjadi pelanggan.",
  primaryCta: { href: "/contact", label: "Konsultasi Gratis" },
  secondaryCta: { href: "/#layanan", label: "Lihat Layanan" },
  trust: "Dipercaya 120+ bisnis di seluruh Indonesia",
  cards: [
    { icon: "speedometer", title: "Skor Lighthouse", value: "95+" },
    { icon: "verify", title: "Keamanan", value: "CSP ketat" },
    { icon: "chart", title: "Konversi", value: "+38%" },
  ] satisfies { icon: IconName; title: string; value: string }[],
};

export const features = {
  eyebrow: "Layanan",
  title: "Semua yang Anda butuhkan untuk tampil profesional",
  description: "Satu tim untuk desain, pengembangan, dan perawatan — tanpa pusing urusan teknis.",
  items: [
    {
      icon: "3dcube",
      name: "Desain yang berkarakter",
      description: "Tampilan unik sesuai identitas brand Anda, konsisten di semua ukuran layar.",
      span: "lg:col-span-2",
    },
    {
      icon: "flash-circle",
      name: "Super cepat",
      description: "Dioptimalkan untuk Core Web Vitals sehingga nyaman dibuka bahkan dengan sinyal lemah.",
      span: "lg:col-span-1",
    },
    {
      icon: "verify",
      name: "Aman sejak awal",
      description: "Header keamanan, validasi input, dan pembaruan rutin sudah termasuk.",
      span: "lg:col-span-1",
    },
    {
      icon: "chart",
      name: "Siap SEO & analitik",
      description: "Struktur halaman, metadata, dan sitemap yang disukai mesin pencari.",
      span: "lg:col-span-1",
    },
    {
      icon: "smart-home",
      name: "Mudah dikelola",
      description: "Perubahan konten cepat dan terdokumentasi. Kami tetap mendampingi setelah rilis.",
      span: "lg:col-span-1",
    },
  ] satisfies { icon: IconName; name: string; description: string; span: string }[],
};

export const stats = {
  eyebrow: "Keunggulan",
  title: "Hasil yang bisa diukur",
  items: [
    { value: 120, suffix: "+", label: "Proyek selesai" },
    { value: 98, suffix: "%", label: "Klien puas" },
    { value: 8, suffix: " thn", label: "Pengalaman" },
    { value: 24, suffix: " jam", label: "Waktu respons" },
  ],
};

export const steps = {
  title: "Cara kerja kami",
  items: [
    { title: "Diskusi", description: "Kami pelajari tujuan bisnis, audiens, dan konten Anda." },
    { title: "Desain & bangun", description: "Prototipe cepat, revisi terarah, lalu pengembangan." },
    { title: "Luncurkan & rawat", description: "Go-live, pemantauan, dan perbaikan berkelanjutan." },
  ],
};

export const testimonials = {
  eyebrow: "Testimoni",
  title: "Apa kata klien kami",
  items: [
    { name: "Rina Wulandari", role: "Pemilik, Kopi Senja", quote: "Website baru kami jauh lebih cepat dan pesanan online naik dalam sebulan." },
    { name: "Budi Santoso", role: "Direktur, CV Maju Jaya", quote: "Prosesnya rapi dan komunikatif. Tim paham kebutuhan bisnis, bukan hanya teknis." },
    { name: "Sari Hidayat", role: "Founder, Batik Lestari", quote: "Desainnya elegan dan mudah kami perbarui sendiri. Pelanggan sering memuji." },
    { name: "Andi Pratama", role: "Manajer, Klinik Sehat", quote: "Formulir janji temu online mengurangi antrean telepon secara signifikan." },
    { name: "Dewi Kartika", role: "Marketing, Properti Nusantara", quote: "Skor kecepatan dan SEO meningkat, trafik organik ikut naik." },
    { name: "Yoga Saputra", role: "CEO, Logistik Cepat", quote: "Aman, stabil, dan dukungan setelah rilis sangat responsif." },
  ],
};

export const cta = {
  title: "Siap tampil lebih profesional secara online?",
  description: "Ceritakan kebutuhan Anda. Kami balas dalam 1 hari kerja dengan rekomendasi dan estimasi.",
  button: { href: "/contact", label: "Mulai Konsultasi" },
};

export const contactPage = {
  title: "Hubungi kami",
  description: "Punya pertanyaan atau ingin memulai proyek? Kirim pesan dan tim kami akan segera membalas.",
  formTitle: "Kirim pesan",
  disabledTitle: "Hubungi kami lewat email",
  disabledText: "Form kontak belum diaktifkan untuk website ini. Silakan kirim email langsung ke kami.",
  success: "Terima kasih! Pesan Anda sudah kami terima dan akan dibalas secepatnya.",
};

export const notFoundPage = {
  title: "Halaman tidak ditemukan",
  description: "Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.",
  cta: "Kembali ke beranda",
};
