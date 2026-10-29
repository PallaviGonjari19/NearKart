import { useState } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors, radius, spacing, typography, shadows } from './theme';

interface Props {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  autoFocus?: boolean;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'What are you looking for?',
  onSubmit,
  autoFocus,
  onClear,
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <Search
        size={19}
        color={focused ? colors.primary : colors.textMuted}
        strokeWidth={2.2}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          style={styles.clearBtn}
          hitSlop={8}>
          <X size={15} color={colors.textSecondary} strokeWidth={2.5} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.sm + 2,
    ...shadows.sm,
  },
  containerFocused: {
    borderColor: colors.primary,
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text,
    padding: 0,
    fontSize: 14,
  },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
