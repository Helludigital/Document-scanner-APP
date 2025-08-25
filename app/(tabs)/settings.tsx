import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, Switch, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../../components/Card';
import ListItem from '../../components/ListItem';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/colors';
import useSettings from '../../hooks/useSettings';

export default function Settings() {
  const { settings, updateSetting, resetSettings } = useSettings();

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to their default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetSettings },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Document Scanner',
      'Version 1.0.0\n\nA professional document scanner app built with React Native and Expo.\n\nFeatures:\n• Multi-page scanning\n• PDF export\n• Image enhancement\n• Cloud sharing',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your scanning experience</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialIcons name="settings" size={28} color={colors.primary} />
        </View>
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Scanning Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scanning</Text>
          <Card variant="flat" style={styles.settingsCard}>
            <ListItem
              title="Auto Flash"
              subtitle="Automatically enable flash in low light"
              leftIcon="flash-auto"
              rightIcon={
                <Switch
                  value={settings.autoFlash}
                  onValueChange={(value) => updateSetting('autoFlash', value)}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={settings.autoFlash ? colors.primary : colors.textDisabled}
                />
              }
            />
            <View style={styles.itemDivider} />
            <ListItem
              title="Auto Enhance"
              subtitle="Automatically enhance scanned images"
              leftIcon="auto-fix-high"
              rightIcon={
                <Switch
                  value={settings.autoEnhance}
                  onValueChange={(value) => updateSetting('autoEnhance', value)}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={settings.autoEnhance ? colors.primary : colors.textDisabled}
                />
              }
            />
            <View style={styles.itemDivider} />
            <ListItem
              title="High Quality"
              subtitle="Use highest quality for scanning (larger files)"
              leftIcon="high-quality"
              rightIcon={
                <Switch
                  value={settings.highQuality}
                  onValueChange={(value) => updateSetting('highQuality', value)}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={settings.highQuality ? colors.primary : colors.textDisabled}
                />
              }
            />
          </Card>
        </View>

        {/* Export Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export & Sharing</Text>
          <Card variant="flat" style={styles.settingsCard}>
            <ListItem
              title="PDF Quality"
              subtitle={`Current: ${settings.pdfQuality}`}
              leftIcon="picture-as-pdf"
              rightIcon="chevron-right"
              onPress={() => {
                const qualities: ('Standard' | 'High' | 'Maximum')[] = ['Standard', 'High', 'Maximum'];
                const currentIndex = qualities.indexOf(settings.pdfQuality);
                const nextIndex = (currentIndex + 1) % qualities.length;
                updateSetting('pdfQuality', qualities[nextIndex]);
              }}
            />
            <View style={styles.itemDivider} />
            <ListItem
              title="Auto Save to Gallery"
              subtitle="Save scanned images to photo library"
              leftIcon="photo-library"
              rightIcon={
                <Switch
                  value={settings.autoSaveToGallery}
                  onValueChange={(value) => updateSetting('autoSaveToGallery', value)}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={settings.autoSaveToGallery ? colors.primary : colors.textDisabled}
                />
              }
            />
          </Card>
        </View>

        {/* Storage Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          <Card variant="flat" style={styles.settingsCard}>
            <ListItem
              title="Storage Usage"
              subtitle="View and manage app storage"
              leftIcon="storage"
              rightIcon="chevron-right"
              onPress={() => Alert.alert('Storage Usage', 'This feature will show detailed storage breakdown in a future update.')}
            />
            <View style={styles.itemDivider} />
            <ListItem
              title="Auto Delete Old Files"
              subtitle="Delete files older than 30 days"
              leftIcon="auto-delete"
              rightIcon={
                <Switch
                  value={settings.autoDeleteOldFiles}
                  onValueChange={(value) => updateSetting('autoDeleteOldFiles', value)}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={settings.autoDeleteOldFiles ? colors.primary : colors.textDisabled}
                />
              }
            />
          </Card>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <Card variant="flat" style={styles.settingsCard}>
            <ListItem
              title="Haptic Feedback"
              subtitle="Vibrate on button taps and actions"
              leftIcon="vibration"
              rightIcon={
                <Switch
                  value={settings.hapticFeedback}
                  onValueChange={(value) => updateSetting('hapticFeedback', value)}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={settings.hapticFeedback ? colors.primary : colors.textDisabled}
                />
              }
            />
            <View style={styles.itemDivider} />
            <ListItem
              title="Dark Mode"
              subtitle="Use dark theme (coming soon)"
              leftIcon="dark-mode"
              rightIcon={
                <Switch
                  value={false}
                  disabled={true}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={colors.textDisabled}
                />
              }
            />
          </Card>
        </View>

        {/* Support & Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Info</Text>
          <Card variant="flat" style={styles.settingsCard}>
            <ListItem
              title="Help & Support"
              subtitle="Get help and contact support"
              leftIcon="help"
              rightIcon="chevron-right"
              onPress={() => Alert.alert('Help & Support', 'For support, please contact us at support@documentscanner.app')}
            />
            <View style={styles.itemDivider} />
            <ListItem
              title="Privacy Policy"
              subtitle="View our privacy policy"
              leftIcon="privacy-tip"
              rightIcon="chevron-right"
              onPress={() => Alert.alert('Privacy Policy', 'Your privacy is important to us. All scanned documents are stored locally on your device.')}
            />
            <View style={styles.itemDivider} />
            <ListItem
              title="About"
              subtitle="App version and information"
              leftIcon="info"
              rightIcon="chevron-right"
              onPress={handleAbout}
            />
          </Card>
        </View>

        {/* Reset Settings */}
        <View style={styles.section}>
          <Card style={styles.resetCard}>
            <View style={styles.resetContent}>
              <View style={styles.resetIcon}>
                <MaterialIcons name="restore" size={24} color={colors.warning} />
              </View>
              <View style={styles.resetText}>
                <Text style={styles.resetTitle}>Reset Settings</Text>
                <Text style={styles.resetSubtitle}>Restore all settings to default values</Text>
              </View>
            </View>
            <PrimaryButton 
              title="Reset All" 
              onPress={handleResetSettings}
              style={styles.resetButton}
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  
  headerSubtitle: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  scrollContent: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.massive,
  },
  
  section: {
    marginBottom: spacing.xl,
  },
  
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  
  itemDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: spacing.lg + 32, // Account for icon width
  },
  
  resetCard: {
    padding: spacing.lg,
    ...shadows.small,
  },
  
  resetContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  resetIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  
  resetText: {
    flex: 1,
  },
  
  resetTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  
  resetSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  
  resetButton: {
    backgroundColor: colors.warning,
    width: '100%',
  },
});
