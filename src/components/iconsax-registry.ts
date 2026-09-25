/**
 * Status registrasi ikon Iconsax di browser (store kecil untuk useSyncExternalStore).
 * <Icon> baru merender <iconsax-icon> setelah subset ikon terdaftar → tidak ada peringatan
 * "not resolved yet" dan tidak ada render ganda. Ukuran ikon tetap dipesan (tanpa CLS).
 */
let ready = false;
const listeners = new Set<() => void>();

export function markIconsReady(): void {
  ready = true;
  for (const l of listeners) l();
}

export function subscribeIcons(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getIconsReady = () => ready;
export const getIconsReadyServer = () => false;
