import { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  BadgeCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { timeAgo } from '@/utils/helpers';
import { colors, spacing, typography, radius, shadows } from '@/components/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, contributions, products, shops } = useApp();

  const contributionCount = contributions.length;

  const recentConfirmed = useMemo(() => {
    return contributions.slice(0, 5).map((c) => ({
      contribution: c,
      product: products.find((p) => p.id === c.productId),
      shop: shops.find((s) => s.id === c.shopId),
    }));
  }, [contributions, products, shops]);

  const allActivity = useMemo(() => {
    return contributions.map((c) => ({
      contribution: c,
      product: products.find((p) => p.id === c.productId),
      shop: shops.find((s) => s.id === c.shopId),
    }));
  }, [contributions, products, shops]);

  const goToShop = (shopId: string) => {
    router.push({ pathname: '/shop/[id]', params: { id: shopId } });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Header title="Profile" />

      {/* Profile card */}
      <View style={styles.profileCard}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}</Text>
            <BadgeCheck size={18} color={colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.area}>{user.area}</Text>
          <Text style={styles.joined}>Contributor since {user.joined}</Text>
        </View>
      </View>

      {/* Stat card */}
      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <TrendingUp size={20} color={colors.primary} strokeWidth={2} />
          <Text style={styles.statValue}>{contributionCount}</Text>
          <Text style={styles.statLabel}>Confirmations</Text>
        </View>
        <View style={styles.statCard}>
          <CheckCircle2 size={20} color={colors.primary} strokeWidth={2} />
          <Text style={styles.statValue}>
            {contributions.filter((c) => c.confirmedAvailable).length}
          </Text>
          <Text style={styles.statLabel}>Marked available</Text>
        </View>
        <View style={styles.statCard}>
          <XCircle size={20} color={colors.danger} strokeWidth={2} />
          <Text style={styles.statValue}>
            {contributions.filter((c) => !c.confirmedAvailable).length}
          </Text>
          <Text style={styles.statLabel}>Marked out</Text>
        </View>
      </View>

      {/* Recently confirmed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Confirmed</Text>
        {recentConfirmed.length === 0 ? (
          <View style={styles.emptyInline}>
            <Info size={16} color={colors.textMuted} strokeWidth={2} />
            <Text style={styles.emptyInlineText}>
              No confirmations yet. Open a shop and tap &quot;Confirm&quot; on any product to contribute.
            </Text>
          </View>
        ) : (
          <View style={styles.listCard}>
            {recentConfirmed.map((item, i) => (
              <TouchableOpacity
                key={item.contribution.id}
                style={[
                  styles.confirmedRow,
                  i < recentConfirmed.length - 1 && styles.rowBorder,
                ]}
                onPress={() => item.shop && goToShop(item.shop.id)}
                activeOpacity={0.7}>
                <View
                  style={[
                    styles.confirmedIcon,
                    { backgroundColor: item.contribution.confirmedAvailable ? '#dcfce7' : '#fee2e2' },
                  ]}>
                  {item.contribution.confirmedAvailable ? (
                    <CheckCircle2 size={16} color={colors.primaryDark} strokeWidth={2.5} />
                  ) : (
                    <XCircle size={16} color={colors.danger} strokeWidth={2.5} />
                  )}
                </View>
                <View style={styles.confirmedInfo}>
                  <Text style={styles.confirmedProduct} numberOfLines={1}>
                    {item.product?.name ?? 'Unknown product'}
                  </Text>
                  <Text style={styles.confirmedShop} numberOfLines={1}>
                    {item.shop?.name ?? 'Unknown shop'}
                  </Text>
                </View>
                <View style={styles.confirmedRight}>
                  <Text style={styles.confirmedStatus}>
                    {item.contribution.confirmedAvailable ? 'Available' : 'Not available'}
                  </Text>
                  <Text style={styles.confirmedTime}>{timeAgo(item.contribution.confirmedAt)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Full activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contribution Activity</Text>
        {allActivity.length === 0 ? (
          <View style={styles.emptyInline}>
            <Clock size={16} color={colors.textMuted} strokeWidth={2} />
            <Text style={styles.emptyInlineText}>
              Your contribution history will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.listCard}>
            {allActivity.map((item, i) => (
              <TouchableOpacity
                key={item.contribution.id}
                style={[
                  styles.activityRow,
                  i < allActivity.length - 1 && styles.rowBorder,
                ]}
                onPress={() => item.shop && goToShop(item.shop.id)}
                activeOpacity={0.7}>
                <View style={styles.activityDotCol}>
                  <View
                    style={[
                      styles.activityDot,
                      { backgroundColor: item.contribution.confirmedAvailable ? '#22c55e' : '#ef4444' },
                    ]}
                  />
                  {i < allActivity.length - 1 && <View style={styles.activityLine} />}
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityText}>
                    Confirmed{' '}
                    <Text style={styles.activityProduct}>
                      {item.product?.name ?? 'a product'}
                    </Text>{' '}
                    as {item.contribution.confirmedAvailable ? 'available' : 'not available'}
                  </Text>
                  <Text style={styles.activityShop}>
                    {item.shop?.name ?? ''} · {timeAgo(item.contribution.confirmedAt)}
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} strokeWidth={2} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Demo note */}
      <View style={styles.demoNoteCard}>
        <Info size={16} color={colors.textMuted} strokeWidth={2} />
        <Text style={styles.demoNoteText}>
          This is a demo profile. Your confirmations and preferences are stored only on this device for this session and are not shared with any server. Sample shop and product data is for illustration only and is not verified real-world inventory.
        </Text>
      </View>
    </ScrollView>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceAlt,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    ...typography.h2,
  },
  area: {
    ...typography.smallMedium,
    color: colors.textSecondary,
    marginTop: 2,
  },
  joined: {
    ...typography.caption,
    marginTop: 2,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  statValue: {
    ...typography.h1,
    fontSize: 20,
  },
  statLabel: {
    ...typography.caption,
    textAlign: 'center',
  },
  section: {
    marginTop: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...shadows.sm,
  },
  confirmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  confirmedIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmedInfo: {
    flex: 1,
  },
  confirmedProduct: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  confirmedShop: {
    ...typography.caption,
    marginTop: 2,
  },
  confirmedRight: {
    alignItems: 'flex-end',
  },
  confirmedStatus: {
    ...typography.smallMedium,
    color: colors.primary,
  },
  confirmedTime: {
    ...typography.caption,
    marginTop: 2,
  },
  emptyInline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  emptyInlineText: {
    ...typography.small,
    flex: 1,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  activityDotCol: {
    alignItems: 'center',
    width: 14,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activityLine: {
    position: 'absolute',
    top: 14,
    width: 2,
    height: 30,
    backgroundColor: colors.border,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  activityProduct: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  activityShop: {
    ...typography.caption,
    marginTop: 2,
  },
  demoNoteCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: spacing.xxl,
  },
  demoNoteText: {
    ...typography.small,
    flex: 1,
  },
});
