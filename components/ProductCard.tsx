import { TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Product, Shop } from '@/types';
import { CATEGORY_MAP } from '@/data/catalog';
import { useApp } from '@/context/AppContext';
import { AvailabilityBadge } from './AvailabilityBadge';
import { timeAgo } from '@/utils/helpers';
import { colors, radius, spacing, typography, shadows } from './theme';

interface Props {
  product: Product;
  shop?: Shop;
  onPress?: () => void;
  horizontal?: boolean;
}

export function ProductCard({ product, shop, onPress, horizontal }: Props) {
  const { getAvailability } = useApp();
  const avail = getAvailability(product.id, product.shopId);
  const cat = CATEGORY_MAP[product.category];

  if (horizontal) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.hCard} activeOpacity={0.85}>
        <Image source={{ uri: product.image }} style={styles.hImage} />
        <View style={styles.hInfo}>
          <Text style={styles.hName} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.hCat}>{cat.label}</Text>
          {shop && (
            <Text style={styles.hShop} numberOfLines={1}>{shop.name}</Text>
          )}
          <AvailabilityBadge status={avail?.status ?? 'unverified'} />
          <Text style={styles.hTime}>
            {avail ? `Verified ${timeAgo(avail.lastVerifiedAt)}` : 'Not verified'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.vCard} activeOpacity={0.85}>
      <Image source={{ uri: product.image }} style={styles.vImage} />
      <View style={styles.vInfo}>
        <View style={styles.vTop}>
          <Text style={styles.vName} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.vCat}>{cat.label}</Text>
          {shop && (
            <View style={styles.vShopRow}>
              <MapPin size={11} color={colors.textMuted} strokeWidth={2} />
              <Text style={styles.vShop} numberOfLines={1}>
                {shop.name} · {shop.distanceKm} km
              </Text>
            </View>
          )}
        </View>
        <View style={styles.vBottom}>
          <AvailabilityBadge status={avail?.status ?? 'unverified'} />
          <Text style={styles.vTime}>
            {avail ? timeAgo(avail.lastVerifiedAt) : 'Not verified'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hCard: {
    width: 156,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  hImage: {
    width: '100%',
    height: 114,
    backgroundColor: colors.surfaceAlt,
  },
  hInfo: {
    padding: spacing.sm + 3,
    gap: 4,
  },
  hName: {
    ...typography.smallMedium,
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
    minHeight: 34,
  },
  hCat: {
    ...typography.caption,
    color: colors.primary,
    fontFamily: 'Inter-Medium',
  },
  hShop: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  hTime: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    fontSize: 10,
  },
  vCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    ...shadows.sm,
  },
  vImage: {
    width: 96,
    height: 96,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
  },
  vInfo: {
    flex: 1,
    paddingLeft: spacing.md,
    paddingVertical: 2,
    justifyContent: 'space-between',
  },
  vTop: {
    gap: 3,
  },
  vName: {
    ...typography.bodyMedium,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
  },
  vCat: {
    ...typography.caption,
    color: colors.primary,
    fontFamily: 'Inter-Medium',
  },
  vShopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  vShop: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  vBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  vTime: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
});
