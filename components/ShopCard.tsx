import { TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import { Star, MapPin, ChevronRight } from 'lucide-react-native';
import { Shop } from '@/types';
import { CATEGORY_MAP } from '@/data/catalog';
import { useApp } from '@/context/AppContext';
import { availabilitySummary, isOpenNow } from '@/utils/helpers';
import { colors, radius, spacing, typography, shadows } from './theme';

interface Props {
  shop: Shop;
  onPress: () => void;
  style?: object;
}

export function ShopCard({ shop, onPress, style }: Props) {
  const { products, getAvailability } = useApp();
  const cat = CATEGORY_MAP[shop.category];
  const summary = availabilitySummary(products, getAvailability, shop.id);
  const open = isOpenNow(shop.openHour, shop.closeHour);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, style]}
      activeOpacity={0.88}>
      <View style={styles.coverWrap}>
        <Image source={{ uri: shop.coverImage }} style={styles.cover} />
        <View
          style={[
            styles.statusBadge,
            open ? styles.statusBadgeOpen : styles.statusBadgeClosed,
          ]}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: open ? '#10b981' : '#ef4444' },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: open ? '#047857' : '#b91c1c' },
            ]}>
            {open ? 'Open Now' : 'Closed'}
          </Text>
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{shop.name}</Text>
          <ChevronRight size={18} color={colors.textMuted} strokeWidth={2} />
        </View>
        <Text style={styles.category}>{cat.label}</Text>
        <View style={styles.metaRow}>
          <View style={styles.ratingBadge}>
            <Star size={12} color="#f59e0b" fill="#f59e0b" strokeWidth={1.5} />
            <Text style={styles.rating}>{shop.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({shop.ratingCount})</Text>
          </View>
          <View style={styles.distBadge}>
            <MapPin size={12} color={colors.primary} strokeWidth={2} />
            <Text style={styles.distance}>{shop.distanceKm} km</Text>
          </View>
        </View>
        <View style={styles.summaryWrap}>
          <Text style={styles.summary} numberOfLines={1}>{summary}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  coverWrap: {
    position: 'relative',
    width: '100%',
    height: 130,
    backgroundColor: colors.surfaceAlt,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.sm + 2,
    right: spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.pill,
    ...shadows.sm,
  },
  statusBadgeOpen: {
    backgroundColor: '#ffffff',
  },
  statusBadgeClosed: {
    backgroundColor: '#ffffff',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
  },
  info: {
    padding: spacing.md + 2,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...typography.h3,
    fontFamily: 'Inter-Bold',
    flex: 1,
    marginRight: spacing.sm,
  },
  category: {
    ...typography.small,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fffbeb',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  rating: {
    ...typography.smallMedium,
    color: '#b45309',
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  ratingCount: {
    ...typography.caption,
    color: '#d97706',
    fontSize: 10,
  },
  distBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  distance: {
    ...typography.smallMedium,
    color: colors.textSecondary,
    fontSize: 11,
  },
  summaryWrap: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  summary: {
    ...typography.small,
    color: colors.textMuted,
  },
});
