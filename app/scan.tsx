import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, StatusBar } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/colors';
import PrimaryButton from '../components/PrimaryButton';
import Card from '../components/Card';
import { useDocs } from '../hooks/useDocs';
import { router } from 'expo-router';

export default function Scan() {
  const [perm, request] = useCameraPermissions();
  const camRef = useRef<CameraView>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const { createDoc, addPage } = useDocs();
  const [taking, setTaking] = useState(false);
  const [flash, setFlash] = useState<'off'|'on'>('off');

  if (!perm) return null;
  
  if (!perm.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.permissionContent}>
          <View style={styles.permissionIcon}>
            <MaterialIcons name="camera-alt" size={48} color={colors.primary} />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionSubtitle}>
            We need access to your camera to scan documents and convert them to PDF files.
          </Text>
          <PrimaryButton 
            title="Enable Camera Access" 
            onPress={request} 
            style={styles.permissionButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  async function ensureDoc() {
    if (docId) return docId;
    const id = await createDoc('Scan');
    setDocId(id);
    return id;
  }

  async function capture() {
    if (taking) return;
    try {
      setTaking(true);
      const photo = await camRef.current?.takePictureAsync({ quality: 0.9, skipProcessing: true });
      if (!photo?.uri) return;
      const id = await ensureDoc();
      // camera gives exif size sometimes; fallback to dummy
      await addPage(id, photo.uri, { width: photo.width ?? 2000, height: photo.height ?? 3000 });
    } finally {
      setTaking(false);
    }
  }

  async function importFromLibrary() {
    const res = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ['images'], 
      quality: 1,
      allowsEditing: false
    });
    if (res.canceled || res.assets.length === 0) return;
    const asset = res.assets[0];
    const id = await ensureDoc();
    await addPage(id, asset.uri, { width: asset.width ?? 2000, height: asset.height ?? 3000 });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Camera View */}
      <CameraView ref={camRef} style={styles.camera} flash={flash} />
      
      {/* Document Detection Overlay */}
      <View pointerEvents="none" style={styles.overlay}>
        {/* Top gradient */}
        <View style={styles.topGradient} />
        
        {/* Scanning Frame */}
        <View style={styles.frameContainer}>
          <View style={styles.frame}>
            {/* Corner indicators */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.frameText}>Position document within frame</Text>
        </View>
        
        {/* Bottom gradient */}
        <View style={styles.bottomGradient} />
      </View>

      {/* Top Controls */}
      <SafeAreaView style={styles.topControls}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.textInverse} />
        </Pressable>
        
        <View style={styles.topRightControls}>
          <Pressable 
            onPress={() => setFlash(flash === 'off' ? 'on' : 'off')} 
            style={[styles.controlButton, flash === 'on' && styles.controlButtonActive]}
          >
            <MaterialIcons 
              name={flash === 'on' ? 'flash-on' : 'flash-off'} 
              size={20} 
              color={flash === 'on' ? colors.warning : colors.textInverse} 
            />
          </Pressable>
          
          <Pressable 
            onPress={importFromLibrary} 
            style={styles.controlButton}
          >
            <MaterialIcons name="photo-library" size={20} color={colors.textInverse} />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <Card variant="flat" style={styles.controlsCard}>
          <View style={styles.captureSection}>
            {/* Capture Button */}
            <Pressable
              style={[styles.captureButton, taking && styles.captureButtonDisabled]}
              onPress={capture}
              disabled={taking}
            >
              <View style={styles.captureButtonInner}>
                {taking ? (
                  <View style={styles.capturingIndicator} />
                ) : (
                  <MaterialIcons name="camera" size={32} color={colors.textInverse} />
                )}
              </View>
            </Pressable>
            
            <Text style={styles.captureText}>
              {taking ? 'Capturing...' : 'Tap to capture'}
            </Text>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <PrimaryButton 
              title={docId ? `Finish (${docId.slice(-4)})` : 'Finish'} 
              onPress={() => docId ? router.replace(`/doc/${docId}`) : router.back()}
              style={styles.finishButton}
            />
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Permission screen
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  permissionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screen,
    gap: spacing.xl,
  },
  
  permissionIcon: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  
  permissionTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  
  permissionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  
  permissionButton: {
    minWidth: 240,
  },

  // Camera screen
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  camera: {
    flex: 1,
  },
  
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  
  topGradient: {
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  
  frameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screen,
  },
  
  frame: {
    width: '90%',
    aspectRatio: 0.7, // A4-ish ratio
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.scannerFrame,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.scannerFrame,
    borderWidth: 3,
  },
  
  topLeft: {
    top: -3,
    left: -3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: borderRadius.md,
  },
  
  topRight: {
    top: -3,
    right: -3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: borderRadius.md,
  },
  
  bottomLeft: {
    bottom: -3,
    left: -3,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: borderRadius.md,
  },
  
  bottomRight: {
    bottom: -3,
    right: -3,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: borderRadius.md,
  },
  
  frameText: {
    ...typography.caption,
    color: colors.textInverse,
    textAlign: 'center',
    marginTop: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  bottomGradient: {
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
  },
  
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  topRightControls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  controlButtonActive: {
    backgroundColor: 'rgba(255, 193, 7, 0.3)',
    borderColor: colors.warning,
  },
  
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.screen,
  },
  
  controlsCard: {
    padding: spacing.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    ...shadows.large,
  },
  
  captureSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.medium,
  },
  
  captureButtonDisabled: {
    backgroundColor: colors.textDisabled,
  },
  
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.textInverse,
  },
  
  capturingIndicator: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    backgroundColor: colors.warning,
  },
  
  captureText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  
  actionButtons: {
    gap: spacing.sm,
  },
  
  finishButton: {
    backgroundColor: colors.success,
  },

  // Legacy styles (keeping for compatibility)
  center: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: colors.background, 
    gap: spacing.md, 
    padding: spacing.lg 
  },
  title: { ...typography.h1, color: colors.textPrimary },
  sub: { ...typography.body, color: colors.textSecondary },
  guides: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  toolbar: { position: 'absolute', top: spacing.lg, left: spacing.lg, right: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pill: { backgroundColor: 'rgba(0,0,0,0.45)', paddingVertical: 6, paddingHorizontal: spacing.md, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  pillText: { ...typography.caption, color: '#fff' },
  bottom: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: spacing.lg, borderRadius: borderRadius.lg, gap: spacing.sm, padding: spacing.md },
});
