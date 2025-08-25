import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, PanResponder, LayoutChangeEvent } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Card from '@/components/Card';
import PrimaryButton from '@/components/PrimaryButton';
import { colors, spacing, typography, borderRadius } from '@/styles/colors';
import { useDocs } from '@/hooks/useDocs';
import type { CropRect, FilterKind } from '@/types/docs';

export default function EditPage() {
  const { pageId } = useLocalSearchParams<{ pageId: string }>();
  const { pages, updatePage } = useDocs();
  const p = pages[pageId!];
  const [filter, setFilter] = useState<FilterKind>(p?.filter ?? 'auto');
  const [crop, setCrop] = useState<CropRect>(p?.crop ?? { x:0.05, y:0.05, w:0.9, h:0.9 });

  const layout = useRef({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout; layout.current = { w: width, h: height };
  };

  // Drag handles (tl, tr, bl, br)
  function handleDrag(which: 'tl'|'tr'|'bl'|'br') {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const L = layout.current; if (!L.w || !L.h) return;
        const dx = g.dx / L.w; const dy = g.dy / L.h;
        setCrop(c => {
          const n = { ...c };
          if (which.includes('t')) { n.y = clamp(n.y + dy, 0, n.y + n.h - 0.1); n.h = clamp(c.h - dy, 0.1, 1 - n.y); }
          if (which.includes('b')) { n.h = clamp(c.h + dy, 0.1, 1 - n.y); }
          if (which.includes('l')) { n.x = clamp(n.x + dx, 0, n.x + n.w - 0.1); n.w = clamp(c.w - dx, 0.1, 1 - n.x); }
          if (which.includes('r')) { n.w = clamp(c.w + dx, 0.1, 1 - n.x); }
          return n;
        });
      },
    }).panHandlers;
  }

  if (!p) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit page</Text>
      <Card variant="flat" style={styles.canvas}>
        <View style={styles.canvasContent} onLayout={onLayout}>
        <Image source={{ uri: p.uri }} resizeMode="contain" style={styles.img} />
        {/* Crop overlay */}
        <View pointerEvents="none" style={[styles.mask]} />
        <View style={[styles.crop, { left: `${crop.x*100}%`, top: `${crop.y*100}%`, width: `${crop.w*100}%`, height: `${crop.h*100}%` }]} />
        {/* Handles (touchable zones) */}
        <View style={[styles.handle, styles.tl]} {...handleDrag('tl')} />
        <View style={[styles.handle, styles.tr]} {...handleDrag('tr')} />
        <View style={[styles.handle, styles.bl]} {...handleDrag('bl')} />
        <View style={[styles.handle, styles.br]} {...handleDrag('br')} />
        </View>
      </Card>

      <Card variant="flat" style={styles.controls}>
        <Text style={styles.label}>Filter</Text>
        <View style={styles.row}>
          {(['auto','bw','color'] as FilterKind[]).map(k => (
            <Pill key={k} active={filter===k} onPress={() => setFilter(k)}>{k.toUpperCase()}</Pill>
          ))}
        </View>
      </Card>

      <PrimaryButton title="Save" onPress={async () => {
        await updatePage(p.id, { crop, filter });
        router.back();
      }} />
    </View>
  );
}

function Pill({ active, onPress, children }: { active?: boolean; onPress: () => void; children: React.ReactNode }) {
  return (
    <Text onPress={onPress} style={[styles.pill, active && styles.pillActive]}>{children}</Text>
  );
}

const clamp = (n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary },
  canvas: { height: 420, borderRadius: borderRadius.lg, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  canvasContent: { flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  img: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  mask: { position: 'absolute', left:0, right:0, top:0, bottom:0, backgroundColor: 'rgba(0,0,0,0.15)' },
  crop: { position: 'absolute', borderColor: colors.primary, borderWidth: 2, backgroundColor: 'rgba(0,0,0,0.1)' },
  handle: { position: 'absolute', width: 24, height: 24, backgroundColor: colors.cardBackground, borderWidth: 2, borderColor: colors.primary, borderRadius: 999 },
  tl: { left: 0, top: 0, transform: [{ translateX: -12 }, { translateY: -12 }] },
  tr: { right: 0, top: 0, transform: [{ translateX: 12 }, { translateY: -12 }] },
  bl: { left: 0, bottom: 0, transform: [{ translateX: -12 }, { translateY: 12 }] },
  br: { right: 0, bottom: 0, transform: [{ translateX: 12 }, { translateY: 12 }] },
  controls: { padding: spacing.lg, borderRadius: borderRadius.lg, gap: spacing.sm },
  label: { ...typography.body, color: colors.textSecondary },
  row: { flexDirection: 'row', gap: spacing.sm },
  pill: { paddingVertical: 6, paddingHorizontal: spacing.md, borderRadius: 999, borderWidth: 1, borderColor: colors.border, color: colors.textPrimary },
  pillActive: { backgroundColor: colors.primary, color: '#fff', borderColor: colors.primary },
});
