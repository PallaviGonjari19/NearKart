import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, MapPin, Store, Check } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { AREAS } from '@/data/catalog';
import { useState } from 'react';
import { colors, radius, spacing, typography, shadows } from './theme';

interface Props {
  showGreeting?: boolean;
  title?: string;
}

export function Header({ showGreeting, title }: Props) {
  const { selectedArea, setSelectedArea } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <View>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Store size={16} color="#ffffff" strokeWidth={2.5} />
            </View>
            <Text style={styles.logo}>NearKart</Text>
          </View>
          <TouchableOpacity
            style={styles.areaRow}
            onPress={() => setOpen((v) => !v)}
            activeOpacity={0.7}>
            <MapPin size={13} color={colors.primary} strokeWidth={2.5} />
            <Text style={styles.area} numberOfLines={1}>{selectedArea}</Text>
            <ChevronDown size={13} color={colors.textSecondary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
        {title && <Text style={styles.pageTitle}>{title}</Text>}
      </View>

      {open && (
        <View style={styles.dropdown}>
          {AREAS.map((a) => (
            <TouchableOpacity
              key={a}
              style={[
                styles.dropdownItem,
                a === selectedArea && styles.dropdownItemActive,
              ]}
              onPress={() => {
                setSelectedArea(a);
                setOpen(false);
              }}>
              <View style={styles.dropdownItemContent}>
                <Text
                  style={[
                    styles.dropdownText,
                    a === selectedArea && styles.dropdownTextActive,
                  ]}>
                  {a}
                </Text>
                {a === selectedArea && (
                  <Check size={15} color={colors.primary} strokeWidth={2.5} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showGreeting && (
        <Text style={styles.greeting}>Find what you need, near you.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  logo: {
    ...typography.h1,
    color: colors.primary,
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    letterSpacing: -0.5,
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  area: {
    ...typography.smallMedium,
    color: colors.textSecondary,
    fontSize: 12,
  },
  pageTitle: {
    ...typography.h2,
  },
  greeting: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  dropdown: {
    position: 'absolute',
    top: 58,
    left: 0,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    minWidth: 200,
    ...shadows.md,
    zIndex: 20,
  },
  dropdownItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.sm,
    marginHorizontal: 4,
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownItemActive: {
    backgroundColor: colors.primarySoft,
  },
  dropdownText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  dropdownTextActive: {
    color: colors.primary,
    fontFamily: 'Inter-SemiBold',
  },
});
