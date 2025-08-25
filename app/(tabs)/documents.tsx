import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '@/components/Card';
import ListItem from '@/components/ListItem';
import EmptyState from '@/components/EmptyState';
import PrimaryButton from '@/components/PrimaryButton';
import { colors, spacing, typography, borderRadius, shadows } from '@/styles/colors';
import { useDocs } from '@/hooks/useDocs';
import { router } from 'expo-router';

export default function Documents() {
  const { docs, deleteDoc } = useDocs();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Documents</Text>
          <Text style={styles.headerSubtitle}>
            {docs.length === 0 ? 'No documents yet' : `${docs.length} document${docs.length > 1 ? 's' : ''}`}
          </Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialIcons name="folder" size={28} color={colors.primary} />
        </View>
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {docs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState 
              icon="description" 
              title="No documents yet" 
              subtitle="Scan your first document to get started with organizing your files"
              actionTitle="Start Scanning" 
              onAction={() => router.push('/scan')} 
            />
          </View>
        ) : (
          <>
            {/* Documents List */}
            <Card variant="flat" style={styles.documentsCard}>
              {docs.map((d, index) => (
                <View key={d.id}>
                  <ListItem
                    title={d.title}
                    subtitle={`${d.pageIds.length} pages • ${formatDate(d.updatedAt)}`}
                    leftIcon="description"
                    rightIcon="chevron-right"
                    onPress={() => router.push(`/doc/${d.id}`)}
                    style={styles.documentItem}
                  />
                  {index < docs.length - 1 && <View style={styles.itemDivider} />}
                </View>
              ))}
            </Card>

            {/* Quick Stats */}
            <Card style={styles.statsCard}>
              <Text style={styles.statsTitle}>Library Statistics</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{docs.length}</Text>
                  <Text style={styles.statLabel}>Documents</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {docs.reduce((total, doc) => total + doc.pageIds.length, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Total Pages</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {docs.filter(d => isRecentlyUpdated(d.updatedAt)).length}
                  </Text>
                  <Text style={styles.statLabel}>Recent</Text>
                </View>
              </View>
            </Card>
          </>
        )}

        {/* Action Button */}
        <Card style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={styles.actionIcon}>
              <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Scan New Document</Text>
              <Text style={styles.actionSubtitle}>Add more pages to your library</Text>
            </View>
          </View>
          <PrimaryButton 
            title="Scan" 
            onPress={() => router.push('/scan')}
            style={styles.actionButton}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper functions
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

function isRecentlyUpdated(timestamp: number): boolean {
  const now = new Date().getTime();
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
  return timestamp > sevenDaysAgo;
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
    gap: spacing.xl,
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.massive,
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
  
  statsCard: {
    padding: spacing.lg,
    ...shadows.small,
  },
  
  statsTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  
  statValue: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: 2,
  },
  
  statLabel: {
    ...typography.small,
    color: colors.textTertiary,
  },
  
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.md,
  },
  
  actionCard: {
    padding: spacing.lg,
    ...shadows.small,
  },
  
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  
  actionText: {
    flex: 1,
  },
  
  actionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  
  actionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  
  actionButton: {
    width: '100%',
  },
});
