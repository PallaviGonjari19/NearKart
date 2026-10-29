import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, TrendingUp, ArrowRight } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { CategoryChip } from '@/components/CategoryChip';
import { ShopCard } from '@/components/ShopCard';
import { ProductCard } from '@/components/ProductCard';
import { CATEGORIES, SEARCH_SUGGESTIONS } from '@/data/catalog';
import { CategoryId } from '@/types';
import { colors, spacing, typography, shadows, radius } from '@/components/theme';
import { timeAgo } from '@/utils/helpers';

export default function HomeScreen() {
  const router = useRouter();
  const { shops, products, availability, getAvailability, recentSearches, addRecentSearch } = useApp();
  const [query, setQuery] = useState('');

  const goToSearch = (term?: string) => {
    if (term) addRecentSearch(term);
    router.push({ pathname: '/(tabs)/search', params: term ? { q: term } : {} });
  };

  const goToShop = (shopId: string) => {
    router.push({ pathname: '/shop/[id]', params: { id: shopId } });
  };

  const onCategory = (id: CategoryId) => {
    router.push({ pathname: '/(tabs)/search', params: { category: id } });
  };

  // Popular = stocked items, nearest first
  const popular = [...products]
    .map((p) => {
      const av = getAvailability(p.id, p.shopId);
      const shop = shops.find((s) => s.id === p.shopId);
      return { p, av, shop };
    })
    .filter((x) => x.av && x.av.status === 'stocked' && x.shop)
    .sort((a, b) => (a.shop!.distanceKm - b.shop!.distanceKm))
    .slice(0, 8);

  const nearbyShops = [...shops].sort((a, b) => a.distanceKm - b.distanceKm);

  const recentlyVerified = [...availability]
    .sort((a, b) => b.lastVerifiedAt - a.lastVerifiedAt)
    .slice(0, 5)
    .map((a) => ({
      av: a,
      product: products.find((p) => p.id === a.productId),
      shop: shops.find((s) => s.id === a.shopId),
    }))
    .filter((x) => x.product && x.shop);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <Header showGreeting />

      <View style={styles.searchRow}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={() => goToSearch(query)}
        />
      </View>

      {/* Suggestions */}
      <View style={styles.suggestionsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {SEARCH_SUGGESTIONS.slice(0, 6).map((s) => (
            <TouchableOpacity
              key={s}
              style={styles.suggestionChip}
              onPress={() => goToSearch(s)}
              activeOpacity={0.7}>
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Recent searches</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {recentSearches.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.recentChip}
                onPress={() => goToSearch(s)}
                activeOpacity={0.7}>
                <Clock size={12} color={colors.textMuted} strokeWidth={2} />
                <Text style={styles.recentText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Categories</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((c) => (
            <CategoryChip key={c.id} category={c.id} onPress={onCategory} />
          ))}
        </View>
      </View>

      {/* Popular near you */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <TrendingUp size={16} color={colors.primary} strokeWidth={2} />
            <Text style={styles.sectionTitle}>Popular Near You</Text>
          </View>
          <TouchableOpacity onPress={() => goToSearch()} style={styles.linkRow}>
            <Text style={styles.linkText}>See all </Text>
            <ArrowRight size={12} color={colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={popular}
          keyExtractor={(item) => item.p.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
          ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
          renderItem={({ item }) => (
            <ProductCard
              product={item.p}
              shop={item.shop}
              horizontal
              onPress={() => goToShop(item.shop!.id)}
            />
          )}
        />
      </View>

      {/* Nearby shops */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Shops</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/nearby')} style={styles.linkRow}>
            <Text style={styles.linkText}>View map </Text>
            <ArrowRight size={12} color={colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        {nearbyShops.slice(0, 4).map((shop) => (
          <ShopCard key={shop.id} shop={shop} onPress={() => goToShop(shop.id)} />
        ))}
      </View>

      {/* Recently verified */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Verified</Text>
        <View style={styles.verifiedCard}>
          {recentlyVerified.map((item, i) => (
            <TouchableOpacity
              key={item.av.productId + i}
              style={[styles.verifiedRow, i < recentlyVerified.length - 1 && styles.verifiedBorder]}
              onPress={() => goToShop(item.shop!.id)}
              activeOpacity={0.7}>
              <View style={styles.verifiedLeft}>
                <Text style={styles.verifiedProduct} numberOfLines={1}>{item.product!.name}</Text>
                <Text style={styles.verifiedShop} numberOfLines={1}>{item.shop!.name} · {item.shop!.distanceKm} km</Text>
              </View>
              <View style={styles.verifiedRight}>
                <View style={[styles.statusDot, { backgroundColor: statusDotColor(item.av.status) }]} />
                <Text style={styles.verifiedTime}>{timeAgo(item.av.lastVerifiedAt)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.demoNote}>
        <Text style={styles.demoNoteText}>
          Demo data: shop availability shown here is sample information and has not been verified in the real world.
        </Text>
      </View>
    </ScrollView>
  );
}

function statusDotColor(status: string): string {
  switch (status) {
    case 'stocked': return '#22c55e';
    case 'usually': return '#3b82f6';
    case 'out': return '#ef4444';
    default: return '#9ca3af';
  }
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
  searchRow: {
    marginTop: spacing.lg,
  },
  suggestionsRow: {
    marginTop: spacing.md,
  },
  chipsScroll: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  suggestionChip: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  suggestionText: {
    ...typography.smallMedium,
    color: colors.textSecondary,
    fontSize: 12,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  recentText: {
    ...typography.smallMedium,
    color: colors.textSecondary,
    fontSize: 12,
  },
  section: {
    marginTop: spacing.xxl,
  },
  sectionLabel: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    flexShrink: 1,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 1,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  linkText: {
    ...typography.smallMedium,
    color: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  hList: {
    paddingRight: spacing.lg,
  },
  verifiedCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  verifiedBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  verifiedLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  verifiedProduct: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  verifiedShop: {
    ...typography.caption,
    marginTop: 2,
  },
  verifiedRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  verifiedTime: {
    ...typography.caption,
  },
  demoNote: {
    marginTop: spacing.xxl,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  demoNoteText: {
    ...typography.small,
    fontStyle: 'italic',
  },
});
