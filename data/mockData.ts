import { Shop, Product, AvailabilityRecord, UserProfile } from '@/types';

// Reference time for the demo data. Availability timestamps are computed
// relative to "now" so the app always feels fresh without using real data.
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const now = Date.now();

export const SHOPS: Shop[] = [
  {
    id: 's_grocery_1',
    name: 'Shree Ganesh Kirana',
    category: 'grocery',
    coverImage:
      'https://images.pexels.com/photos/26861411/pexels-photo-26861411.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.4,
    ratingCount: 128,
    distanceKm: 0.4,
    address: '12, Kothrud Bus Stand Rd, Kothrud, Pune 411038',
    area: 'Kothrud, Pune',
    openHour: '07:00',
    closeHour: '21:30',
    phone: '+919812345670',
    whatsapp: '+919812345670',
    mapQuery: 'Kothrud Bus Stand, Pune',
    coord: { x: 0.42, y: 0.35 },
  },
  {
    id: 's_hardware_1',
    name: 'Patil Hardware Mart',
    category: 'hardware',
    coverImage:
      'https://images.pexels.com/photos/735338/pexels-photo-735338.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.6,
    ratingCount: 86,
    distanceKm: 0.9,
    address: '5, Paud Road, Near Hanuman Mandir, Kothrud, Pune 411038',
    area: 'Kothrud, Pune',
    openHour: '09:00',
    closeHour: '20:00',
    phone: '+919812345671',
    whatsapp: '+919812345671',
    mapQuery: 'Paud Road Kothrud, Pune',
    coord: { x: 0.58, y: 0.52 },
  },
  {
    id: 's_electrical_1',
    name: 'Bright Electricals',
    category: 'electrical',
    coverImage:
      'https://images.pexels.com/photos/577513/pexels-photo-577513.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.3,
    ratingCount: 54,
    distanceKm: 1.2,
    address: '212, Karve Road, Opp. COEP Colony, Kothrud, Pune 411038',
    area: 'Kothrud, Pune',
    openHour: '09:30',
    closeHour: '19:30',
    phone: '+919812345672',
    whatsapp: '+919812345672',
    mapQuery: 'Karve Road Kothrud, Pune',
    coord: { x: 0.28, y: 0.6 },
  },
  {
    id: 's_stationery_1',
    name: 'Sai Stationery & Xerox',
    category: 'stationery',
    coverImage:
      'https://images.pexels.com/photos/5490916/pexels-photo-5490916.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.5,
    ratingCount: 73,
    distanceKm: 0.6,
    address: '8, Shivtej Nagar, Kothrud, Pune 411038',
    area: 'Kothrud, Pune',
    openHour: '08:30',
    closeHour: '21:00',
    phone: '+919812345673',
    whatsapp: '+919812345673',
    mapQuery: 'Shivtej Nagar Kothrud, Pune',
    coord: { x: 0.5, y: 0.3 },
  },
  {
    id: 's_pharmacy_1',
    name: 'Sanjivani Medical',
    category: 'pharmacy',
    coverImage:
      'https://images.pexels.com/photos/14797855/pexels-photo-14797855.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.7,
    ratingCount: 211,
    distanceKm: 0.8,
    address: '3, Chandni Chowk, Kothrud, Pune 411038',
    area: 'Kothrud, Pune',
    openHour: '08:00',
    closeHour: '22:00',
    phone: '+919812345674',
    whatsapp: '+919812345674',
    mapQuery: 'Chandni Chowk Kothrud, Pune',
    coord: { x: 0.66, y: 0.4 },
  },
  {
    id: 's_household_1',
    name: 'Daily Needs Bazaar',
    category: 'household',
    coverImage:
      'https://images.pexels.com/photos/12805817/pexels-photo-12805817.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.2,
    ratingCount: 45,
    distanceKm: 1.5,
    address: '44, Bhel Chowk, Kothrud, Pune 411038',
    area: 'Kothrud, Pune',
    openHour: '09:00',
    closeHour: '20:30',
    phone: '+919812345675',
    whatsapp: '+919812345675',
    mapQuery: 'Bhel Chowk Kothrud, Pune',
    coord: { x: 0.74, y: 0.7 },
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p_9v_battery',
    name: '9V Battery (Hi-Watt)',
    category: 'electrical',
    image:
      'https://images.pexels.com/photos/12504497/pexels-photo-12504497.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    shopId: 's_electrical_1',
    aliases: ['9v battery', '9 volt battery', 'battery', 'cell'],
  },
  {
    id: 'p_aa_battery',
    name: 'AA Battery (Pack of 4)',
    category: 'electrical',
    image:
      'https://images.pexels.com/photos/6365187/pexels-photo-6365187.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    shopId: 's_electrical_1',
    aliases: ['aa battery', 'aa cell', 'battery', 'cell'],
  },
  {
    id: 'p_agarbatti',
    name: 'Agarbatti (Mogra)',
    category: 'household',
    image:
      'https://images.pexels.com/photos/8819266/pexels-photo-8819266.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    shopId: 's_household_1',
    aliases: ['agarbatti', 'incense sticks', 'incense', 'पुढी', 'ऊदबत्ती'],
  },
  {
    id: 'p_plumbing_tape',
    name: 'Plumbing Tape (Teflon)',
    category: 'hardware',
    image:
      'https://images.pexels.com/photos/38028966/pexels-photo-38028966.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    shopId: 's_hardware_1',
    aliases: ['plumbing tape', 'teflon tape', 'thread seal tape'],
  },
  {
    id: 'p_notebook',
    name: 'Spiral Notebook (200 pg)',
    category: 'stationery',
    image:
      'https://images.pexels.com/photos/29765813/pexels-photo-29765813.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    shopId: 's_stationery_1',
    aliases: ['notebook', 'writing pad', 'वही'],
  },
  {
    id: 'p_led_bulb',
    name: '9W LED Bulb (Cool White)',
    category: 'electrical',
    image:
      'https://images.pexels.com/photos/577513/pexels-photo-577513.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    shopId: 's_electrical_1',
    aliases: ['led bulb', 'led light', 'bulb', 'light', 'बल्ब'],
  },
  {
    id: 'p_paracetamol',
    name: 'Paracetamol 500mg (Strip)',
    category: 'pharmacy',
    image:
      'https://images.pexels.com/photos/35166625/pexels-photo-35166625.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    shopId: 's_pharmacy_1',
    aliases: ['paracetamol', 'crocin', 'fever medicine', 'ताप गोळी'],
  },
  {
    id: 'p_rice_5kg',
    name: 'Basmati Rice 5kg',
    category: 'grocery',
    image:
      'https://images.pexels.com/photos/9070106/pexels-photo-9070106.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    shopId: 's_grocery_1',
    aliases: ['rice', 'rice 5kg', 'basmati', 'तांदूळ'],
  },
  {
    id: 'p_screwdriver',
    name: 'Screwdriver Set (6 pc)',
    category: 'hardware',
    image:
      'https://images.pexels.com/photos/909256/pexels-photo-909256.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    shopId: 's_hardware_1',
    aliases: ['screwdriver', 'screw driver', 'पेचकस'],
  },
  {
    id: 'p_cooking_oil',
    name: 'Sunflower Cooking Oil 1L',
    category: 'grocery',
    image:
      'https://images.pexels.com/photos/9070120/pexels-photo-9070120.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    shopId: 's_grocery_1',
    aliases: ['cooking oil', 'oil', 'sunflower oil', 'तेल'],
  },
  {
    id: 'p_paint_roller',
    name: 'Paint Roller + Tray',
    category: 'household',
    image:
      'https://images.pexels.com/photos/994164/pexels-photo-994164.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    shopId: 's_household_1',
    aliases: ['paint roller', 'roller', 'paint brush', 'brush'],
  },
  {
    id: 'p_detergent',
    name: 'Detergent Powder 2kg',
    category: 'household',
    image:
      'https://images.pexels.com/photos/14382430/pexels-photo-14382430.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    shopId: 's_household_1',
    aliases: ['detergent', 'detergent powder', 'soap', 'washing powder', 'साबण'],
  },
];

export const AVAILABILITY_SEED: AvailabilityRecord[] = [
  { productId: 'p_9v_battery', shopId: 's_electrical_1', status: 'stocked', lastVerifiedAt: now - 2 * HOUR, lastVerifiedBy: 'Demo User' },
  { productId: 'p_aa_battery', shopId: 's_electrical_1', status: 'usually', lastVerifiedAt: now - 1 * DAY, lastVerifiedBy: 'Shop Owner' },
  { productId: 'p_led_bulb', shopId: 's_electrical_1', status: 'stocked', lastVerifiedAt: now - 3 * HOUR, lastVerifiedBy: 'Demo User' },
  { productId: 'p_agarbatti', shopId: 's_household_1', status: 'usually', lastVerifiedAt: now - 2 * DAY, lastVerifiedBy: null },
  { productId: 'p_detergent', shopId: 's_household_1', status: 'stocked', lastVerifiedAt: now - 5 * HOUR, lastVerifiedBy: 'Demo User' },
  { productId: 'p_paint_roller', shopId: 's_household_1', status: 'out', lastVerifiedAt: now - 8 * HOUR, lastVerifiedBy: 'Shop Owner' },
  { productId: 'p_plumbing_tape', shopId: 's_hardware_1', status: 'usually', lastVerifiedAt: now - 1 * DAY, lastVerifiedBy: null },
  { productId: 'p_screwdriver', shopId: 's_hardware_1', status: 'stocked', lastVerifiedAt: now - 6 * HOUR, lastVerifiedBy: 'Demo User' },
  { productId: 'p_notebook', shopId: 's_stationery_1', status: 'stocked', lastVerifiedAt: now - 4 * HOUR, lastVerifiedBy: 'Demo User' },
  { productId: 'p_paracetamol', shopId: 's_pharmacy_1', status: 'stocked', lastVerifiedAt: now - 1 * HOUR, lastVerifiedBy: 'Demo User' },
  { productId: 'p_rice_5kg', shopId: 's_grocery_1', status: 'stocked', lastVerifiedAt: now - 30 * 60 * 1000, lastVerifiedBy: 'Demo User' },
  { productId: 'p_cooking_oil', shopId: 's_grocery_1', status: 'usually', lastVerifiedAt: now - 3 * DAY, lastVerifiedBy: null },
];

export const DEMO_USER: UserProfile = {
  name: 'Aarav Patil',
  area: 'Kothrud, Pune',
  avatar:
    'https://images.pexels.com/photos/4986291/pexels-photo-4986291.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
  joined: 'Jan 2026',
};
