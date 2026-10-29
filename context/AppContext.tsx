import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  AvailabilityRecord,
  Contribution,
  AvailabilityStatus,
  Shop,
  Product,
} from '@/types';
import {
  SHOPS,
  PRODUCTS,
  AVAILABILITY_SEED,
  DEMO_USER,
} from '@/data/mockData';

interface AppState {
  shops: Shop[];
  products: Product[];
  availability: AvailabilityRecord[];
  contributions: Contribution[];
  user: typeof DEMO_USER;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  getAvailability: (productId: string, shopId: string) => AvailabilityRecord | undefined;
  confirmAvailability: (
    productId: string,
    shopId: string,
    confirmedAvailable: boolean,
  ) => void;
  hasConfirmed: (productId: string, shopId: string) => boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [availability, setAvailability] = useState<AvailabilityRecord[]>(AVAILABILITY_SEED);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>(DEMO_USER.area);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '9V battery',
    'agarbatti',
    'plumbing tape',
  ]);

  const getAvailability = useCallback(
    (productId: string, shopId: string) =>
      availability.find((a) => a.productId === productId && a.shopId === shopId),
    [availability],
  );

  const hasConfirmed = useCallback(
    (productId: string, shopId: string) =>
      contributions.some(
        (c) => c.productId === productId && c.shopId === shopId,
      ),
    [contributions],
  );

  const confirmAvailability = useCallback(
    (productId: string, shopId: string, confirmedAvailable: boolean) => {
      // Prevent duplicate confirmations from inflating the count.
      setContributions((prev) => {
        if (
          prev.some(
            (c) => c.productId === productId && c.shopId === shopId,
          )
        ) {
          return prev;
        }
        const contribution: Contribution = {
          id: `c_${Date.now()}_${productId}`,
          productId,
          shopId,
          status: confirmedAvailable ? 'stocked' : 'out',
          confirmedAt: Date.now(),
          confirmedAvailable,
        };
        return [contribution, ...prev];
      });

      setAvailability((prev) => {
        const nowMs = Date.now();
        const status: AvailabilityStatus = confirmedAvailable ? 'stocked' : 'out';
        const idx = prev.findIndex(
          (a) => a.productId === productId && a.shopId === shopId,
        );
        if (idx === -1) {
          return [
            {
              productId,
              shopId,
              status,
              lastVerifiedAt: nowMs,
              lastVerifiedBy: DEMO_USER.name,
            },
            ...prev,
          ];
        }
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          status,
          lastVerifiedAt: nowMs,
          lastVerifiedBy: DEMO_USER.name,
        };
        return next;
      });
    },
    [],
  );

  const addRecentSearch = useCallback((term: string) => {
    const t = term.trim();
    if (!t) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (s) => s.toLowerCase() !== t.toLowerCase(),
      );
      return [t, ...filtered].slice(0, 8);
    });
  }, []);

  const value = useMemo<AppState>(
    () => ({
      shops: SHOPS,
      products: PRODUCTS,
      availability,
      contributions,
      user: DEMO_USER,
      selectedArea,
      setSelectedArea,
      recentSearches,
      addRecentSearch,
      getAvailability,
      confirmAvailability,
      hasConfirmed,
    }),
    [
      availability,
      contributions,
      selectedArea,
      recentSearches,
      addRecentSearch,
      getAvailability,
      confirmAvailability,
      hasConfirmed,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
