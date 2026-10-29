import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { CategoryId } from '@/types';
import { CATEGORIES } from '@/data/catalog';
import * as Lucide from 'lucide-react-native';
import { colors, radius, spacing, typography, shadows } from './theme';

interface Props {
  category: CategoryId;
  selected?: boolean;
  onPress: (id: CategoryId) => void;
  compact?: boolean;
}

export function CategoryChip({ category, selected, onPress, compact }: Props) {
  const cat = CATEGORIES.find((c) => c.id === category)!;
  const Icon = (Lucide as any)[cat.icon] ?? Lucide.Tag;

  return (
    <TouchableOpacity
      onPress={() => onPress(category)}
      style={[
        styles.chip,
        compact && styles.chipCompact,
        selected
          ? [styles.chipSelected, { backgroundColor: cat.color, borderColor: cat.color }]
          : { backgroundColor: colors.surface },
      ]}
      activeOpacity={0.75}>
      <View
        style={[
          styles.iconWrap,
          compact && styles.iconWrapCompact,
          {
            backgroundColor: selected ? 'rgba(255,255,255,0.22)' : cat.color + '15',
          },
        ]}>
        <Icon
          size={compact ? 13 : 15}
          color={selected ? '#ffffff' : cat.color}
          strokeWidth={2.2}
        />
      </View>
      <Text
        style={[
          styles.label,
          compact && styles.labelCompact,
          selected ? styles.labelSelected : { color: colors.text },
        ]}>
        {cat.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: spacing.xs + 2,
    paddingRight: spacing.md + 2,
    paddingVertical: 5,
    gap: spacing.xs + 2,
    ...shadows.sm,
  },
  chipCompact: {
    paddingLeft: spacing.xs,
    paddingRight: spacing.sm + 2,
    paddingVertical: 3,
    gap: 4,
  },
  chipSelected: {
    borderWidth: 1,
    ...shadows.md,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapCompact: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  label: {
    ...typography.smallMedium,
    fontSize: 12,
  },
  labelCompact: {
    fontSize: 11,
  },
  labelSelected: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
});
