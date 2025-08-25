import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../styles/colors';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string | React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  variant?: 'default' | 'chevron' | 'switch' | 'checkbox';
  emphasis?: 'low' | 'medium' | 'high';
}

const ListItem = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
  style,
  accessibilityLabel,
  variant = 'default',
  emphasis = 'medium',
}: ListItemProps) => {
  const finalRightIcon = variant === 'chevron' ? 'chevron-right' : rightIcon;

  const content = (
    <View style={[styles.container, style]}>
      {leftIcon && (
        <MaterialIcons
          name={leftIcon as any}
          size={24}
          color={colors.textSecondary}
          style={styles.leftIcon}
        />
      )}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            emphasis === 'high' && styles.titleHigh,
            emphasis === 'low' && styles.titleLow,
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
      {finalRightIcon && (
        typeof finalRightIcon === 'string' ? (
          <MaterialIcons
            name={finalRightIcon as any}
            size={20}
            color={colors.textTertiary}
            style={styles.rightIcon}
          />
        ) : (
          <View style={styles.rightIcon}>
            {finalRightIcon}
          </View>
        )
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole="button"
        style={({ pressed }) => [
          pressed && styles.pressed,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  leftIcon: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
  },
  titleHigh: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  titleLow: {
    color: colors.textSecondary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default ListItem;
