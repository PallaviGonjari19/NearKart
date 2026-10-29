import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Map as MapIcon,
  List,
  MapPin,
  Star,
  ChevronRight,
  X,
  Navigation,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { CategoryChip } from '@/components/CategoryChip';
import { ShopCard } from '@/components/ShopCard';
import { EmptyState } from '@/components/EmptyState';
import { CATEGORIES, CATEGORY_MAP } from '@/data/catalog';
import { CategoryId, Shop } from '@/types';
import { availabilitySummary, isOpenNow } from '@/utils/helpers';
import { colors, spacing, typography, radius, shadows } from '@/components/theme';

const MAP_HEIGHT = 320;

export default function NearbyScreen() {
  const router = useRouter();
  const { shops } = useApp();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [maxDistance, setMaxDistance] = useState(5);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  const filteredShops = useMemo(() => {
    let list = [...shops];
    if (activeCategory !== 'all') list = list.filter((s) => s.category === activeCategory);
    list = list.filter((s) => s.distanceKm <= maxDistance);
    return list.sort((a, b) => a.distanceKm - b.distanceKm);
  }, [shops, activeCategory, maxDistance]);

  const toggleView = (v: 'map' | 'list') => {
    if (Platform.OS !== 'web') LayoutAnimation.easeInEaseOut();
    setView(v);
  };

  const goToShop = (shopId: string) => {
    router.push({ pathname: '/shop/[id]', params: { id: shopId } });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Header title="Nearby" />
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, view === 'map' && styles.toggleBtnActive]}
              onPress={() => toggleView('map')}>
              <MapIcon size={15} color={view === 'map' ? colors.primary : colors.textMuted} strokeWidth={2} />
              <Text style={[styles.toggleText, view === 'map' && styles.toggleTextActive]}>Map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, view === 'list' && styles.toggleBtnActive]}
              onPress={() => toggleView('list')}>
              <List size={15} color={view === 'list' ? colors.primary : colors.textMuted} strokeWidth={2} />
              <Text style={[styles.toggleText, view === 'list' && styles.toggleTextActive]}>List</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          style={styles.filterBar}>
          <CategoryChip
            category={'grocery' as CategoryId}
            selected={activeCategory === 'all'}
            onPress={() => setActiveCategory('all')}
            compact
          />
          {CATEGORIES.map((c) => (
            <CategoryChip
              key={c.id}
              category={c.id}
              selected={activeCategory === c.id}
              onPress={(id) => setActiveCategory(id)}
              compact
            />
          ))}
          <View style={styles.distDivider} />
          {[1, 2, 5, 10].map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.distChip, maxDistance === d && styles.distChipActive]}
              onPress={() => setMaxDistance(d)}>
              <Text style={[styles.distChipText, maxDistance === d && styles.distChipTextActive]}>
                {d} km
              </Text>
            </TouchableOpacity>
          ))}
          {(activeCategory !== 'all' || maxDistance < 10) && (
            <TouchableOpacity
              style={styles.clearFilter}
              onPress={() => { setActiveCategory('all'); setMaxDistance(10); }}>
              <X size={13} color={colors.danger} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </ScrollView>

        {view === 'map' ? (
          <>
            <View style={styles.mapContainer}>
              <MapView
                shops={filteredShops}
                selectedShop={selectedShop}
                onSelect={(s) => setSelectedShop(s)}
                onOpen={goToShop}
              />
            </View>

            {/* Shop list below map */}
            <View style={styles.listSection}>
              <Text style={styles.listSectionTitle}>
                {filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''} nearby
              </Text>
              <FlatList
                data={filteredShops}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <ShopCard shop={item} onPress={() => goToShop(item.id)} />
                )}
                ListEmptyComponent={
                  <EmptyState
                    icon={MapPin}
                    title="No shops in range"
                    subtitle="Try increasing the distance filter."
                  />
                }
              />
            </View>
          </>
        ) : (
          <View style={styles.listOnly}>
            {filteredShops.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title="No shops in range"
                subtitle="Try increasing the distance filter."
              />
            ) : (
              filteredShops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} onPress={() => goToShop(shop.id)} />
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function MapView({
  shops,
  selectedShop,
  onSelect,
  onOpen,
}: {
  shops: Shop[];
  selectedShop: Shop | null;
  onSelect: (s: Shop) => void;
  onOpen: (id: string) => void;
}) {
  const { products, getAvailability } = useApp();
  const active = selectedShop ?? shops[0] ?? null;

  return (
    <View style={styles.mapInner}>
      {/* Stylised map background */}
      <View style={styles.mapBg}>
        {/* grid roads */}
        {[0.25, 0.5, 0.75].map((p) => (
          <View key={`h${p}`} style={[styles.roadH, { top: `${p * 100}%` }]} />
        ))}
        {[0.2, 0.45, 0.7, 0.9].map((p) => (
          <View key={`v${p}`} style={[styles.roadV, { left: `${p * 100}%` }]} />
        ))}
        {/* parks */}
        <View style={styles.park1} />
        <View style={styles.park2} />
        {/* water */}
        <View style={styles.water} />
        {/* "you are here" */}
        <View style={styles.userMarker}>
          <View style={styles.userPulse} />
          <View style={styles.userDot} />
        </View>
      </View>

      {/* Shop markers */}
      {shops.map((shop) => {
        const isSelected = active?.id === shop.id;
        return (
          <TouchableOpacity
            key={shop.id}
            style={[
              styles.marker,
              {
                left: `${shop.coord.x * 100}%`,
                top: `${shop.coord.y * 100}%`,
                transform: [{ translateX: -16 }, { translateY: -34 }],
              },
            ]}
            onPress={() => onSelect(shop)}
            activeOpacity={0.85}>
            <View style={[styles.markerPin, isSelected && styles.markerPinActive]}>
              <MapPin
                size={isSelected ? 26 : 22}
                color={isSelected ? colors.primary : CATEGORY_MAP[shop.category].color}
                fill={isSelected ? colors.primaryLight : '#ffffff'}
                strokeWidth={2.5}
              />
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Selected shop card */}
      {active && (
        <View style={styles.selectedCard}>
          <View style={styles.selectedCardTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.selectedName} numberOfLines={1}>{active.name}</Text>
              <Text style={styles.selectedCategory}>{CATEGORY_MAP[active.category].label}</Text>
              <View style={styles.selectedMeta}>
                <View style={styles.selectedRatingRow}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" strokeWidth={1.5} />
                  <Text style={styles.selectedRating}>{active.rating.toFixed(1)}</Text>
                </View>
                <View style={styles.selectedDistRow}>
                  <MapPin size={12} color={colors.textMuted} strokeWidth={2} />
                  <Text style={styles.selectedDist}>{active.distanceKm} km</Text>
                </View>
                <View style={[styles.openDotSmall, { backgroundColor: isOpenNow(active.openHour, active.closeHour) ? '#22c55e' : '#ef4444' }]} />
                <Text style={styles.selectedOpen}>{isOpenNow(active.openHour, active.closeHour) ? 'Open' : 'Closed'}</Text>
              </View>
              <Text style={styles.selectedSummary} numberOfLines={1}>
                {availabilitySummary(products, getAvailability, active.id)}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.detailsBtn} onPress={() => onOpen(active.id)}>
            <Text style={styles.detailsBtnText}>View details</Text>
            <ChevronRight size={15} color={colors.primary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      )}

      {shops.length === 0 && (
        <View style={styles.mapEmpty}>
          <Text style={styles.mapEmptyText}>No shops match your filters</Text>
        </View>
      )}

      <View style={styles.mapLegend}>
        <Navigation size={11} color={colors.textMuted} strokeWidth={2} />
        <Text style={styles.mapLegendText}>Demo map · not real GPS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 8,
    paddingBottom: spacing.xxxl * 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
    marginTop: spacing.xs,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  toggleBtnActive: {
    backgroundColor: colors.primarySoft,
  },
  toggleText: {
    ...typography.smallMedium,
    color: colors.textMuted,
  },
  toggleTextActive: {
    color: colors.primary,
  },
  filterBar: {
    marginTop: spacing.lg,
  },
  filterScroll: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
    alignItems: 'center',
  },
  distDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  distChip: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 1,
  },
  distChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  distChipText: {
    ...typography.smallMedium,
    color: colors.textSecondary,
  },
  distChipTextActive: {
    color: colors.primary,
  },
  clearFilter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    marginTop: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  mapInner: {
    height: MAP_HEIGHT,
    position: 'relative',
  },
  mapBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#eef2f7',
  },
  roadH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dbe2ec',
  },
  roadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#dbe2ec',
  },
  park1: {
    position: 'absolute',
    left: '8%',
    top: '10%',
    width: 90,
    height: 60,
    backgroundColor: '#d7ecd9',
    borderRadius: 12,
  },
  park2: {
    position: 'absolute',
    right: '6%',
    bottom: '18%',
    width: 70,
    height: 50,
    backgroundColor: '#d7ecd9',
    borderRadius: 12,
  },
  water: {
    position: 'absolute',
    right: 0,
    top: '55%',
    width: 80,
    height: 70,
    backgroundColor: '#cfe2f5',
    borderTopLeftRadius: 24,
  },
  userMarker: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPulse: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(37,99,235,0.18)',
  },
  userDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563eb',
    borderWidth: 2.5,
    borderColor: '#ffffff',
  },
  marker: {
    position: 'absolute',
  },
  markerPin: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPinActive: {
    transform: [{ scale: 1.15 }],
  },
  selectedCard: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...shadows.lg,
  },
  selectedCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  selectedName: {
    ...typography.h3,
  },
  selectedCategory: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 2,
  },
  selectedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  selectedRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  selectedRating: {
    ...typography.smallMedium,
  },
  selectedDistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  selectedDist: {
    ...typography.smallMedium,
    color: colors.textSecondary,
  },
  openDotSmall: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  selectedOpen: {
    ...typography.small,
  },
  selectedSummary: {
    ...typography.small,
    marginTop: spacing.xs,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  detailsBtnText: {
    ...typography.smallMedium,
    color: colors.primary,
  },
  mapEmpty: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(248,250,252,0.8)',
  },
  mapEmptyText: {
    ...typography.bodyMedium,
    color: colors.textMuted,
  },
  mapLegend: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  mapLegendText: {
    ...typography.caption,
    fontFamily: 'Inter-Medium',
  },
  listSection: {
    marginTop: spacing.xl,
  },
  listSectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  listOnly: {
    marginTop: spacing.lg,
  },
});
