import { Category } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'grocery', label: 'Grocery', icon: 'ShoppingBasket', color: '#16a34a' },
  { id: 'hardware', label: 'Hardware', icon: 'Wrench', color: '#0891b2' },
  { id: 'electrical', label: 'Electrical', icon: 'Zap', color: '#d97706' },
  { id: 'stationery', label: 'Stationery', icon: 'Pencil', color: '#7c3aed' },
  { id: 'pharmacy', label: 'Pharmacy', icon: 'Pill', color: '#dc2626' },
  { id: 'household', label: 'Household', icon: 'SprayCan', color: '#db2777' },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);

export const STATUS_LABELS: Record<string, string> = {
  stocked: 'Stocked today',
  usually: 'Usually available',
  out: 'Out of stock',
  unverified: 'Not recently verified',
};

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  stocked: { bg: '#dcfce7', text: '#15803d', dot: '#22c55e' },
  usually: { bg: '#dbeafe', text: '#1d4ed8', dot: '#3b82f6' },
  out: { bg: '#fee2e2', text: '#b91c1c', dot: '#ef4444' },
  unverified: { bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af' },
};

export const DEFAULT_AREA = 'Kothrud, Pune';

export const AREAS = [
  'Kothrud, Pune',
  'Baner, Pune',
  'Hadapsar, Pune',
  'Aundh, Pune',
];

export const RECENT_SEARCH_SEEDS = [
  '9V battery',
  'agarbatti',
  'plumbing tape',
  'notebook',
];

export const SEARCH_SUGGESTIONS = [
  'battery',
  '9V battery',
  'agarbatti',
  'incense sticks',
  'plumbing tape',
  'notebook',
  'LED bulb',
  'paracetamol',
  'rice 5kg',
  'screwdriver',
  'cooking oil',
  'paint roller',
];

// Maps from a search term (lowercased) to canonical product ids.
// This powers English / Hindi / Marathi synonym matching.
export const SYNONYM_MAP: Record<string, string[]> = {
  battery: ['p_9v_battery', 'p_aa_battery', 'p_led_bulb'],
  '9v battery': ['p_9v_battery'],
  'aa battery': ['p_aa_battery'],
  cell: ['p_9v_battery', 'p_aa_battery'],
  agarbatti: ['p_agarbatti'],
  'incense sticks': ['p_agarbatti'],
  incense: ['p_agarbatti'],
  'पुढी': ['p_agarbatti'],
  'ऊदबत्ती': ['p_agarbatti'],
  'plumbing tape': ['p_plumbing_tape'],
  teflon: ['p_plumbing_tape'],
  'thread seal': ['p_plumbing_tape'],
  notebook: ['p_notebook'],
  'writing pad': ['p_notebook'],
  'वही': ['p_notebook'],
  'led bulb': ['p_led_bulb'],
  bulb: ['p_led_bulb'],
  light: ['p_led_bulb'],
  'बल्ब': ['p_led_bulb'],
  paracetamol: ['p_paracetamol'],
  crocin: ['p_paracetamol'],
  'fever medicine': ['p_paracetamol'],
  'ताप गोळी': ['p_paracetamol'],
  rice: ['p_rice_5kg'],
  'rice 5kg': ['p_rice_5kg'],
  'तांदूळ': ['p_rice_5kg'],
  screwdriver: ['p_screwdriver'],
  'screw driver': ['p_screwdriver'],
  'पेचकस': ['p_screwdriver'],
  'cooking oil': ['p_cooking_oil'],
  oil: ['p_cooking_oil'],
  'तेल': ['p_cooking_oil'],
  'paint roller': ['p_paint_roller'],
  roller: ['p_paint_roller'],
  brush: ['p_paint_roller'],
  'detergent powder': ['p_detergent'],
  detergent: ['p_detergent'],
  soap: ['p_detergent'],
  'साबण': ['p_detergent'],
};
