import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import Card from '@/components/Card';
import ListItem from '@/components/ListItem';
import PrimaryButton from '@/components/PrimaryButton';
import EmptyState from '@/components/EmptyState';
import { colors, spacing, typography, borderRadius } from '@/styles/colors';
import { useLocalSearchParams, router } from 'expo-router';
import { useDocs } from '@/hooks/useDocs';

export default function DocDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { byDoc, renameDoc, sharePDF, deleteDoc } = useDocs();
  const { doc, pages } = byDoc(id!);
  const [title, setTitle] = useState(doc?.title ?? '');

  const total = pages.length;

  if (!doc) return null;

  async function onExport() {
    if (!doc) return;
    const file = await sharePDF(doc.id);
    if (!file) Alert.alert('Export failed', 'Could not create a PDF.');
  }

  return (
    <View style={styles.container}>
      <Card variant="elevated" style={styles.header}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          onBlur={() => renameDoc(doc.id, title.trim() || 'Scan')}
          style={styles.title}
        />
        <Text style={styles.sub}>{total} page{total>1?'s':''} • Updated {new Date(doc.updatedAt).toLocaleString()}</Text>
      </Card>

      {pages.length === 0 ? (
        <EmptyState icon="image" title="No pages" subtitle="Use the scanner to add pages." />
      ) : (
        <Card variant="flat" style={styles.card}>
          {pages.map((p, i) => (
            <ListItem
              key={p.id}
              title={`Page ${i+1}`}
              subtitle={`${Math.round(p.width)}×${Math.round(p.height)} px • ${p.filter?.toUpperCase()}`}
              leftIcon="photo"
              rightIcon="edit"
              onPress={() => router.push(`/edit/${p.id}`)}
            />
          ))}
        </Card>
      )}

      <View style={{ gap: spacing.sm }}>
        <PrimaryButton title="Export as PDF" onPress={onExport} />
        <PrimaryButton title="Open Scanner" onPress={() => router.push('/scan')} />
        <PrimaryButton title="Delete Document" onPress={() => { deleteDoc(doc.id); router.replace('/(tabs)/documents'); }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.lg },
  header: { padding: spacing.lg, borderRadius: borderRadius.lg, gap: spacing.xs },
  title: { ...typography.h1, color: colors.textPrimary },
  sub: { ...typography.body, color: colors.textSecondary },
  card: { borderRadius: borderRadius.lg, paddingVertical: spacing.sm },
});
