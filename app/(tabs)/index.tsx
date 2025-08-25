import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '@/components/Card';
import StatsCard from '@/components/StatsCard';
import ListItem from '@/components/ListItem';
import PrimaryButton from '@/components/PrimaryButton';
import EmptyState from '@/components/EmptyState';
import { colors, spacing, typography, borderRadius, shadows } from '@/styles/colors';
import { useDocs } from '@/hooks/useDocs';

export default function Home() {
  const { docs, stats } = useDocs();
  const recent = docs.slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.headerTitle}>Document Scanner</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialIcons name="document-scanner" size={28} color={colors.primary} />
        </View>
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <StatsCard 
                value={`${stats.docsCount}`} 
                label="Documents" 
                tone="brand"
              />
            </View>
            <View style={styles.statCard}>
              <StatsCard 
                value={`${stats.pagesCount}`} 
                label="Pages" 
                tone="success"
              />
            </View>
            <View style={styles.lastUpdatedCard}>
              <Text style={styles.lastUpdatedValue}>
                {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : '—'}
              </Text>
              <Text style={styles.lastUpdatedLabel}>Last Updated</Text>
            </View>
          </View>
        </View>

        {/* Main Action Card */}
        <View style={styles.section}>
          <Card variant="elevated" style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <MaterialIcons name="camera-alt" size={32} color={colors.primary} />
            </View>
            <Text style={styles.heroTitle}>Scan New Document</Text>
            <Text style={styles.heroSubtitle}>
              Point your camera at a document, crop it perfectly, and export as PDF
            </Text>
            <PrimaryButton 
              title="Start Scanning" 
              onPress={() => router.push('/scan')}
              style={styles.heroButton}
            />
          </Card>
        </View>

        {/* Recent Documents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Documents</Text>
            {docs.length > 5 && (
              <Text 
                style={styles.sectionAction}
                onPress={() => router.push('/(tabs)/documents')}
              >
                View All
              </Text>
            )}
          </View>
          
          {recent.length === 0 ? (
            <Card style={styles.emptyCard}>
              <EmptyState 
                icon="description" 
                title="No documents yet" 
                subtitle="Start by scanning your first document to see it here"
              />
            </Card>
          ) : (
            <Card variant="flat" style={styles.documentsCard}>
              {recent.map((d, index) => (
                <View key={d.id}>
                  <ListItem
                    title={d.title}
                    subtitle={`${d.pageIds.length} page${d.pageIds.length > 1 ? 's' : ''} • ${formatDate(d.updatedAt)}`}
                    leftIcon="picture-as-pdf"
                    rightIcon="chevron-right"
                    onPress={() => router.push(`/doc/${d.id}`)}
                    style={styles.documentItem}
                  />
                  {index < recent.length - 1 && <View style={styles.itemDivider} />}
                </View>
              ))}
            </Card>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <Card style={styles.quickActionCard} onPress={() => router.push('/scan')}>
              <View style={styles.quickActionIcon}>
                <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Scan</Text>
            </Card>
            
            <Card style={styles.quickActionCard} onPress={() => router.push('/(tabs)/documents')}>
              <View style={styles.quickActionIcon}>
                <MaterialIcons name="folder" size={24} color={colors.info} />
              </View>
              <Text style={styles.quickActionText}>Browse</Text>
            </Card>
            
            <Card style={styles.quickActionCard}>
              <View style={styles.quickActionIcon}>
                <MaterialIcons name="share" size={24} color={colors.success} />
              </View>
              <Text style={styles.quickActionText}>Share</Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function for date formatting
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return 'Today';
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)} days ago`;
  } else {
    return date.toLocaleDateString();
  }
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
  
  greeting: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
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
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  sectionAction: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  
  statCard: {
    flex: 1,
  },
  
  lastUpdatedCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  
  lastUpdatedValue: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  
  lastUpdatedLabel: {
    ...typography.small,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  
  heroCard: {
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.medium,
  },
  
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  
  heroTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  
  heroSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  
  heroButton: {
    minWidth: 200,
  },
  
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  
  documentsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  
  documentItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  
  itemDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: spacing.lg + 32, // Account for icon width
  },
  
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  
  quickActionCard: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.small,
  },
  
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  
  quickActionText: {
    ...typography.captionMedium,
    color: colors.textPrimary,
  },
});
