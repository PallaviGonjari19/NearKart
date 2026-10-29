import { AvailabilityStatus, Product, Shop } from '@/types';
import { SYNONYM_MAP } from '@/data/catalog';

export function timeAgo(epochMs: number): string {
  const diff = Date.now() - epochMs;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} day${day > 1 ? 's' : ''} ago`;
  const wk = Math.floor(day / 7);
  return `${wk} wk ago`;
}

export function formatTime(epochMs: number): string {
  return new Date(epochMs).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function isOpenNow(openHour: string, closeHour: string): boolean {
  const now = new Date();
  const [oh, om] = openHour.split(':').map(Number);
  const [ch, cm] = closeHour.split(':').map(Number);
  const cur = now.getHours() * 60 + now.getMinutes();
  const open = oh * 60 + om;
  const close = ch * 60 + cm;
  return cur >= open && cur < close;
}

export function statusRank(status: AvailabilityStatus): number {
  switch (status) {
    case 'stocked':
      return 0;
    case 'usually':
      return 1;
    case 'unverified':
      return 2;
    case 'out':
      return 3;
  }
}

/**
 * Search products by name, category label, and synonyms.
 * Supports English / Hindi / Marathi aliases via SYNONYM_MAP.
 */
export function searchProducts(
  query: string,
  products: Product[],
): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const matchedIds = new Set<string>();
  // direct synonym-map hits
  if (SYNONYM_MAP[q]) {
    SYNONYM_MAP[q].forEach((id) => matchedIds.add(id));
  }
  // partial synonym matches
  Object.entries(SYNONYM_MAP).forEach(([key, ids]) => {
    if (key.includes(q) || q.includes(key)) {
      ids.forEach((id) => matchedIds.add(id));
    }
  });

  return products.filter((p) => {
    if (matchedIds.has(p.id)) return true;
    if (p.name.toLowerCase().includes(q)) return true;
    return p.aliases.some((a) => a.includes(q) || q.includes(a));
  });
}

export function shopById(shops: Shop[], id: string): Shop | undefined {
  return shops.find((s) => s.id === id);
}

export function productsForShop(products: Product[], shopId: string): Product[] {
  return products.filter((p) => p.shopId === shopId);
}

export function availabilitySummary(
  products: Product[],
  getAvail: (pid: string, sid: string) => { status: AvailabilityStatus } | undefined,
  shopId: string,
): string {
  const items = products
    .filter((p) => p.shopId === shopId)
    .map((p) => getAvail(p.id, shopId)?.status);
  const stocked = items.filter((s) => s === 'stocked').length;
  const total = items.length;
  if (stocked === 0) return `${total} items listed`;
  return `${stocked} of ${total} stocked today`;
}

export function safeTel(phone: string): string | null {
  // strip everything except digits and leading +
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned.length >= 6 ? `tel:${cleaned}` : null;
}

export function safeWhatsapp(phone: string, text: string): string | null {
  const cleaned = phone.replace(/[^\d]/g, '');
  if (cleaned.length < 8) return null;
  const msg = encodeURIComponent(text);
  return `https://wa.me/${cleaned}?text=${msg}`;
}

export function safeMapsUrl(query: string): string | null {
  if (!query.trim()) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
