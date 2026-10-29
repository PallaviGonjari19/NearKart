import { AvailabilityStatus } from '@/types';
import { STATUS_LABELS, STATUS_COLORS } from '@/data/catalog';
import { View, Text, StyleSheet } from 'react-native';
import { radius, spacing, typography } from './theme';

interface Props {
  status: AvailabilityStatus;
  size?: 'sm' | 'md';
}

export function AvailabilityBadge({ status, size = 'sm' }: Props) {
  const colors = STATUS_COLORS[status];
  const isSm = size === 'sm';
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.dot + '33',
        },
        isSm ? styles.badgeSm : styles.badgeMd,
      ]}>
      <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      <Text
        style={[
          styles.text,
          { color: colors.text },
          isSm ? typography.smallMedium : typography.bodyMedium,
        ]}>
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: spacing.xs,
  },
  badgeSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeMd: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontFamily: 'Inter-Medium',
  },
});
