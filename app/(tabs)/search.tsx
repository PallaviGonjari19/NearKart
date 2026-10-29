import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SlidersHorizontal, X, ArrowUpDown, Check } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { SearchBar } from '@/components/SearchBar';
import { CategoryChip } from '@/components/CategoryChip';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { CATEGORIES } from '@/data/catalog';
import { CategoryId, AvailabilityStatus } from '@/types';
import { searchProducts } from '@/utils/helpers';
import { colors, spacing, typography, radius, shadows } from '@/components/theme';

type SortMode = 'nearest' | 'recent';
const STATUS_OPTIONS: { value: AvailabilityStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'stocked', label: 'Stocked today' },
  { value: 'usually', label: 'Usually available' },
  { value: 'out', label: 'Out of stock' },
  { value: 'unverified', label: 'Not recently verified' },
];

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string; category?: string }>();
  const { products, shops, getAvailability, addRecentSearch } = useApp();

  const [query, setQuery] = useState(params.q ?? '');
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>(
    (params.category as CategoryId) ?? 'all',
  );
  const [maxDistance, setMaxDistance] = useState<number>(5);
  const [statusFilter, setStatusFilter] = useState<AvailabilityStatus | 'all'>('all');
  const [sortMode, setSortMode] = useState<SortMode>('nearest');
  const [filterOpen, setFilterOpen] = useState(false);

  const [prevQ, setPrevQ] = useState(params.q);
  const [prevCategory, setPrevCategory] = useState(params.category);

  if (params.q !== prevQ) {
    setPrevQ(params.q);
    if (params.q) setQuery(params.q);
  }

  if (params.category !== prevCategory) {
    setPrevCategory(params.category);
    if (params.category) setActiveCategory(params.category as CategoryId);
  }

  const results = useMemo(() => {
    let list = searchProducts(query, products);
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }
    list = list.filter((p) => {
      const shop = shops.find((s) => s.id === p.shopId);
      return shop ? shop.distanceKm <= maxDistance : true;
    });
    if (statusFilter !== 'all') {
      list = list.filter((p) => {
        const av = getAvailability(p.id, p.shopId);
        return (av?.status ?? 'unverified') === statusFilter;
      });
    }
    list = list.sort((a, b) => {
      const sa = shops.find((s) => s.id === a.shopId)!;
      const sb = shops.find((s) => s.id === b.shopId)!;
      if (sortMode === 'nearest') return sa.distanceKm - sb.distanceKm;
      const avA = getAvailability(a.id, a.shopId)?.lastVerifiedAt ?? 0;
      const avB = getAvailability(b.id, b.shopId)?.lastVerifiedAt ?? 0;
      return avB - avA;
    });
    return list;
  }, [query, products, shops, activeCategory, maxDistance, statusFilter, sortMode, getAvailability]);

  const onSubmit = () => {
    if (query.trim()) addRecentSearch(query.trim());
  };

  const goToShop = (shopId: string) => {
    router.push({ pathname: '/shop/[id]', params: { id: shopId } });
  };

  const activeFilterCount =
    (activeCategory !== 'all' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0) +
    (maxDistance < 5 ? 1 : 0);

  const clearFilters = () => {
    setActiveCategory('all');
    setStatusFilter('all');
    setMaxDistance(5);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={onSubmit}
          autoFocus={!params.q && !params.category}
        />
      </View>

      {/* Category row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catScroll}
        style={styles.catBar}>
        <TouchableOpacity
          style={[
            styles.allChip,
            activeCategory === 'all' && styles.allChipActive,
          ]}
          onPress={() => setActiveCategory('all')}
          activeOpacity={0.75}>
          <Text
            style={[
              styles.allChipText,
              activeCategory === 'all' && styles.allChipTextActive,
            ]}>
            All
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((c) => (
          <CategoryChip
            key={c.id}
            category={c.id}
            selected={activeCategory === c.id}
            onPress={(id) => setActiveCategory(id)}
            compact
          />
        ))}
      </ScrollView>

      {/* Filter / sort bar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolBtn, activeFilterCount > 0 && styles.toolBtnActive]}
          onPress={() => setFilterOpen(true)}
          activeOpacity={0.7}>
          <SlidersHorizontal size={15} color={activeFilterCount > 0 ? colors.primary : colors.textSecondary} strokeWidth={2} />
          <Text style={[styles.toolText, activeFilterCount > 0 && styles.toolTextActive]}>Filters</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolBtn}
          onPress={() => setSortMode((m) => (m === 'nearest' ? 'recent' : 'nearest'))}
          activeOpacity={0.7}>
          <ArrowUpDown size={15} color={colors.textSecondary} strokeWidth={2} />
          <Text style={styles.toolText}>
            {sortMode === 'nearest' ? 'Nearest' : 'Recently verified'}
          </Text>
        </TouchableOpacity>

        {activeFilterCount > 0 && (
          <TouchableOpacity onPress={clearFilters} style={styles.clearBtn}>
            <X size={14} color={colors.danger} strokeWidth={2} />
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.resultCountRow}>
        <Text style={styles.resultCount}>{results.length} result{results.length !== 1 ? 's' : ''}</Text>
      </View>

      {results.length === 0 ? (
        <EmptyState
          icon={SlidersHorizontal}
          title="No products found"
          subtitle={query ? `No matches for "${query}". Try a different spelling or synonym.` : 'Type a product name or pick a category to start.'}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const shop = shops.find((s) => s.id === item.shopId);
            return (
              <ProductCard
                product={item}
                shop={shop}
                onPress={() => goToShop(item.shopId)}
              />
            );
          }}
        />
      )}

      {/* Filter modal */}
      <Modal
        visible={filterOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setFilterOpen(false)}>
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterOpen(false)} hitSlop={8}>
                <X size={22} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>Availability</Text>
              <View style={styles.optionWrap}>
                {STATUS_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.optionChip,
                      statusFilter === opt.value && styles.optionChipActive,
                    ]}
                    onPress={() => setStatusFilter(opt.value)}>
                    <Text
                      style={[
                        styles.optionText,
                        statusFilter === opt.value && styles.optionTextActive,
                      ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Maximum distance</Text>
              <Text style={styles.distanceValue}>{maxDistance.toFixed(1)} km</Text>
              <View style={styles.distanceOptions}>
                {[1, 2, 5, 10].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.optionChip,
                      maxDistance === d && styles.optionChipActive,
                    ]}
                    onPress={() => setMaxDistance(d)}>
                    <Text
                      style={[
                        styles.optionText,
                        maxDistance === d && styles.optionTextActive,
                      ]}>
                      {d} km
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Category</Text>
              <View style={styles.optionWrap}>
                <TouchableOpacity
                  style={[
                    styles.optionChip,
                    activeCategory === 'all' && styles.optionChipActive,
                  ]}
                  onPress={() => setActiveCategory('all')}>
                  <Text style={[styles.optionText, activeCategory === 'all' && styles.optionTextActive]}>All</Text>
                </TouchableOpacity>
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.optionChip,
                      activeCategory === c.id && styles.optionChipActive,
                    ]}
                    onPress={() => setActiveCategory(c.id)}>
                    <Text style={[styles.optionText, activeCategory === c.id && styles.optionTextActive]}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalClearBtn} onPress={clearFilters}>
                <Text style={styles.modalClearText}>Clear all</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalApplyBtn} onPress={() => setFilterOpen(false)}>
                <Check size={16} color="#ffffff" strokeWidth={2.5} />
                <Text style={styles.modalApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 8,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.md,
  },
  catBar: {
    marginTop: spacing.md,
  },
  catScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  allChip: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  allChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.md,
  },
  allChipText: {
    ...typography.smallMedium,
    color: colors.text,
    fontSize: 12,
  },
  allChipTextActive: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  toolBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  toolText: {
    ...typography.smallMedium,
    color: colors.textSecondary,
  },
  toolTextActive: {
    color: colors.primary,
  },
  filterBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
    fontSize: 10,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 'auto',
  },
  clearText: {
    ...typography.smallMedium,
    color: colors.danger,
  },
  resultCountRow: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  resultCount: {
    ...typography.small,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15,23,42,0.45)',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '85%',
    paddingBottom: spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    ...typography.h2,
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  modalLabel: {
    ...typography.h3,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  distanceValue: {
    ...typography.bodyMedium,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  distanceOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionChip: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  optionText: {
    ...typography.smallMedium,
    color: colors.textSecondary,
  },
  optionTextActive: {
    color: colors.primary,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  modalClearBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalClearText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  modalApplyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  modalApplyText: {
    ...typography.bodyMedium,
    color: '#ffffff',
  },
});
