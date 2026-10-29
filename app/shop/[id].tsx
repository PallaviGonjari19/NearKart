import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ChevronLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  Check,
  X,
  Search,
  Info,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { CATEGORY_MAP } from '@/data/catalog';
import { AvailabilityBadge } from '@/components/AvailabilityBadge';
import { EmptyState } from '@/components/EmptyState';
import {
  isOpenNow,
  timeAgo,
  formatTime,
  safeTel,
  safeWhatsapp,
  safeMapsUrl,
} from '@/utils/helpers';
import { colors, spacing, typography, radius, shadows } from '@/components/theme';

export default function ShopDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { shops, products, getAvailability, confirmAvailability, hasConfirmed } = useApp();

  const shop = shops.find((s) => s.id === id);
  const [shopQuery, setShopQuery] = useState('');
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);

  const shopProducts = useMemo(() => {
    if (!shop) return [];
    let list = products.filter((p) => p.shopId === shop.id);
    if (shopQuery.trim()) {
      const q = shopQuery.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.aliases.some((a) => a.includes(q)),
      );
    }
    return list;
  }, [shop, products, shopQuery]);

  if (!shop) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorWrap}>
          <EmptyState icon={Info} title="Shop not found" subtitle="This shop may no longer be listed." />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const cat = CATEGORY_MAP[shop.category];
  const open = isOpenNow(shop.openHour, shop.closeHour);
  const confirmProduct = confirmTarget ? products.find((p) => p.id === confirmTarget) : null;

  const handleCall = () => {
    const url = safeTel(shop.phone);
    if (!url) {
      Alert.alert('Call unavailable', 'No valid phone number is configured for this demo shop.');
      return;
    }
    Linking.openURL(url).catch(() =>
      Alert.alert('Call unavailable', 'A phone app could not be opened on this device.'),
    );
  };

  const handleWhatsApp = () => {
    const url = safeWhatsapp(shop.whatsapp, `Hello ${shop.name}, I found you on NearKart and would like to check availability.`);
    if (!url) {
      Alert.alert('WhatsApp unavailable', 'No valid WhatsApp number is configured for this demo shop.');
      return;
    }
    Linking.openURL(url).catch(() =>
      Alert.alert('WhatsApp unavailable', 'WhatsApp could not be opened on this device.'),
    );
  };

  const handleDirections = () => {
    const url = safeMapsUrl(shop.mapQuery);
    if (!url) {
      Alert.alert('Directions unavailable', 'No map location is configured for this shop.');
      return;
    }
    Linking.openURL(url).catch(() =>
      Alert.alert('Directions unavailable', 'A maps app could not be opened on this device.'),
    );
  };

  const submitConfirm = (available: boolean) => {
    if (!confirmProduct) return;
    confirmAvailability(confirmProduct.id, shop.id, available);
    setConfirmTarget(null);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={styles.coverWrap}>
          <Image source={{ uri: shop.coverImage }} style={styles.cover} />
          <View style={styles.coverOverlay} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} hitSlop={10}>
            <ChevronLeft size={24} color="#ffffff" strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.coverInfo}>
            <View style={[styles.openBadge, open ? styles.openBadgeOpen : styles.openBadgeClosed]}>
              <View style={[styles.openDot, { backgroundColor: open ? '#22c55e' : '#ef4444' }]} />
              <Text style={[styles.openBadgeText, { color: open ? '#15803d' : '#b91c1c' }]}>
                {open ? 'Open now' : 'Closed'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.shopName}>{shop.name}</Text>
          <View style={styles.categoryRow}>
            <View style={[styles.categoryTag, { backgroundColor: cat.color + '18' }]}>
              <Text style={[styles.categoryTagText, { color: cat.color }]}>{cat.label}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.ratingRow}>
              <Star size={15} color="#f59e0b" fill="#f59e0b" strokeWidth={1.5} />
              <Text style={styles.ratingText}>{shop.rating.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({shop.ratingCount})</Text>
            </View>
            <View style={styles.distRow}>
              <MapPin size={15} color={colors.textSecondary} strokeWidth={2} />
              <Text style={styles.distText}>{shop.distanceKm} km away</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Clock size={16} color={colors.primary} strokeWidth={2} />
              <Text style={styles.infoText}>
                {shop.openHour} – {shop.closeHour} • {open ? 'Open now' : 'Closed'}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <MapPin size={16} color={colors.primary} strokeWidth={2} />
              <Text style={styles.infoText}>{shop.address}</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleCall} activeOpacity={0.85}>
              <Phone size={18} color={colors.primary} strokeWidth={2} />
              <Text style={styles.actionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
              <MessageCircle size={18} color={colors.primary} strokeWidth={2} />
              <Text style={styles.actionText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleDirections} activeOpacity={0.85}>
              <Navigation size={18} color={colors.primary} strokeWidth={2} />
              <Text style={styles.actionText}>Directions</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.contactNote}>
            Contact details shown are sample data for this demo.
          </Text>

          {/* Products list */}
          <View style={styles.productsHeader}>
            <Text style={styles.productsTitle}>Products at this shop</Text>
            <Text style={styles.productsCount}>{shopProducts.length}</Text>
          </View>

          <View style={styles.shopSearchRow}>
            <Search size={16} color={colors.textMuted} strokeWidth={2} />
            <TextInput
              value={shopQuery}
              onChangeText={setShopQuery}
              placeholder="Search this shop's products"
              placeholderTextColor={colors.textMuted}
              style={styles.shopSearchInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {shopProducts.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No products match"
              subtitle="Try a different search term for this shop."
            />
          ) : (
            <View style={styles.productList}>
              {shopProducts.map((p) => {
                const av = getAvailability(p.id, shop.id);
                const alreadyConfirmed = hasConfirmed(p.id, shop.id);
                return (
                  <View key={p.id} style={styles.productRow}>
                    <Image source={{ uri: p.image }} style={styles.productImage} />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                      <View style={styles.productMeta}>
                        <AvailabilityBadge status={av?.status ?? 'unverified'} />
                        <Text style={styles.productTime}>
                          {av ? `Verified ${timeAgo(av.lastVerifiedAt)}` : 'Not verified'}
                        </Text>
                      </View>
                      <Text style={styles.productFullTime}>
                        {av ? `Last updated ${formatTime(av.lastVerifiedAt)}` : 'No verification record'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.confirmBtn,
                        alreadyConfirmed && styles.confirmBtnDone,
                      ]}
                      onPress={() => setConfirmTarget(p.id)}
                      disabled={alreadyConfirmed}>
                      {alreadyConfirmed ? (
                        <Check size={14} color={colors.primary} strokeWidth={2.5} />
                      ) : (
                        <Text style={styles.confirmBtnText}>Confirm</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.disclaimerCard}>
            <Info size={16} color={colors.textMuted} strokeWidth={2} />
            <Text style={styles.disclaimerText}>
              Availability can change during the day. Please call or message the shop before travelling to avoid disappointment.
            </Text>
          </View>

          <View style={styles.demoNote}>
            <Text style={styles.demoNoteText}>
              This is a demo shop with sample data. It is not a real, verified business listing.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirm availability modal */}
      <Modal
        visible={!!confirmTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmTarget(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setConfirmTarget(null)}>
          <Pressable style={styles.confirmSheet} onPress={(e) => e.stopPropagation()}>
            {confirmProduct && (
              <>
                <Text style={styles.confirmTitle}>Confirm availability</Text>
                <Text style={styles.confirmProduct}>{confirmProduct.name}</Text>
                <Text style={styles.confirmShop}>at {shop.name}</Text>

                <View style={styles.confirmOptions}>
                  <TouchableOpacity
                    style={[styles.confirmOption, styles.confirmOptionYes]}
                    onPress={() => submitConfirm(true)}>
                    <Check size={22} color={colors.primaryDark} strokeWidth={2.5} />
                    <Text style={styles.confirmOptionTextYes}>Available</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.confirmOption, styles.confirmOptionNo]}
                    onPress={() => submitConfirm(false)}>
                    <X size={22} color={colors.danger} strokeWidth={2.5} />
                    <Text style={styles.confirmOptionTextNo}>Not available</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setConfirmTarget(null)} style={styles.confirmCancel}>
                  <Text style={styles.confirmCancelText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  coverWrap: {
    position: 'relative',
    height: 220,
  },
  cover: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceAlt,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,23,42,0.25)',
  },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: spacing.lg,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverInfo: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.lg,
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#ffffff',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  openBadgeOpen: {
    backgroundColor: '#dcfce7',
  },
  openBadgeClosed: {
    backgroundColor: '#fee2e2',
  },
  openDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  openBadgeText: {
    ...typography.smallMedium,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
    marginTop: -24,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.lg,
  },
  shopName: {
    ...typography.h1,
  },
  categoryRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  categoryTag: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  categoryTagText: {
    ...typography.smallMedium,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  ratingCount: {
    ...typography.small,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  infoText: {
    ...typography.body,
    flex: 1,
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  actionText: {
    ...typography.smallMedium,
    color: colors.primary,
    fontFamily: 'Inter-SemiBold',
  },
  contactNote: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  productsTitle: {
    ...typography.h2,
  },
  productsCount: {
    ...typography.smallMedium,
    color: colors.textMuted,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  shopSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 42,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  shopSearchInput: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text,
    padding: 0,
  },
  productList: {
    gap: spacing.md,
  },
  productRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.sm + 2,
    gap: spacing.sm,
    alignItems: 'center',
    ...shadows.sm,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  productTime: {
    ...typography.caption,
  },
  productFullTime: {
    ...typography.caption,
    fontSize: 10,
  },
  confirmBtn: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  confirmBtnDone: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  confirmBtnText: {
    ...typography.smallMedium,
    color: colors.primaryDark,
  },
  disclaimerCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: spacing.xl,
  },
  disclaimerText: {
    ...typography.small,
    flex: 1,
  },
  demoNote: {
    marginTop: spacing.md,
  },
  demoNoteText: {
    ...typography.caption,
    fontStyle: 'italic',
  },
  errorWrap: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
  },
  backBtnText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.5)',
    padding: spacing.xl,
  },
  confirmSheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 360,
  },
  confirmTitle: {
    ...typography.h2,
    textAlign: 'center',
  },
  confirmProduct: {
    ...typography.bodyMedium,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  confirmShop: {
    ...typography.small,
    textAlign: 'center',
  },
  confirmOptions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  confirmOption: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 2,
  },
  confirmOptionYes: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryLight,
  },
  confirmOptionNo: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  confirmOptionTextYes: {
    ...typography.bodyMedium,
    color: colors.primaryDark,
  },
  confirmOptionTextNo: {
    ...typography.bodyMedium,
    color: colors.danger,
  },
  confirmCancel: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  confirmCancelText: {
    ...typography.bodyMedium,
    color: colors.textMuted,
  },
});
