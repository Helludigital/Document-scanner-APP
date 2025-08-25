// hooks/useDocs.ts
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { loadDocs, loadPages, saveDocs, savePages } from '../services/docs-db';
import type { CropRect, DocFile, DocPage, FilterKind } from '../types/docs';

const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);

export function useDocs() {
  const [docs, setDocs] = useState<DocFile[]>([]);
  const [pages, setPages] = useState<Record<string, DocPage>>({});

  useEffect(() => { (async () => {
    const [d, p] = await Promise.all([loadDocs(), loadPages()]);
    setDocs(d); setPages(p);
  })(); }, []);

  const allPages = useMemo(() => Object.values(pages).sort((a,b) => a.order - b.order), [pages]);

  const byDoc = useCallback((docId: string) => {
    const d = docs.find(x => x.id === docId);
    if (!d) return { doc: undefined, pages: [] as DocPage[] };
    const ps = d.pageIds.map(pid => pages[pid]).filter(Boolean).sort((a,b) => a.order - b.order);
    return { doc: d, pages: ps };
  }, [docs, pages]);

  const createDoc = useCallback(async (title = 'Scan') => {
    const d: DocFile = { id: id(), title, createdAt: Date.now(), updatedAt: Date.now(), pageIds: [] };
    const list = [d, ...docs];
    setDocs(list); await saveDocs(list);
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    return d.id;
  }, [docs]);

  const addPage = useCallback(async (docId: string, srcUri: string, size: {width:number;height:number}) => {
    const d = docs.find(x => x.id === docId);
    if (!d) return;
    const page: DocPage = {
      id: id(), docId, uri: srcUri, width: size.width, height: size.height,
      createdAt: Date.now(), order: d.pageIds.length, crop: { x:0.05, y:0.05, w:0.9, h:0.9 }, filter: 'auto'
    };
    const nextPages = { ...pages, [page.id]: page };
    const nextDoc = { ...d, pageIds: [...d.pageIds, page.id], updatedAt: Date.now() };
    const nextDocs = docs.map(x => x.id === d.id ? nextDoc : x);
    setPages(nextPages); setDocs(nextDocs);
    await Promise.all([savePages(nextPages), saveDocs(nextDocs)]);
  }, [docs, pages]);

  const updatePage = useCallback(async (pageId: string, patch: Partial<DocPage>) => {
    const p = pages[pageId]; if (!p) return;
    const np = { ...p, ...patch };
    const next = { ...pages, [pageId]: np };
    setPages(next); await savePages(next);
  }, [pages]);

  const renameDoc = useCallback(async (docId: string, title: string) => {
    const next = docs.map(d => d.id === docId ? { ...d, title, updatedAt: Date.now() } : d);
    setDocs(next); await saveDocs(next);
  }, [docs]);

  const deleteDoc = useCallback(async (docId: string) => {
    const d = docs.find(x => x.id === docId); if (!d) return;
    const nextDocs = docs.filter(x => x.id !== docId);
    const nextPages = { ...pages };
    d.pageIds.forEach(pid => delete nextPages[pid]);
    setDocs(nextDocs); setPages(nextPages);
    await Promise.all([saveDocs(nextDocs), savePages(nextPages)]);
  }, [docs, pages]);

  // --- Image processing
  async function materializePage(p: DocPage): Promise<string> {
    // convert relative crop to absolute px
    const crop = p.crop ?? { x:0, y:0, w:1, h:1 };
    const originX = Math.max(0, Math.round(crop.x * p.width));
    const originY = Math.max(0, Math.round(crop.y * p.height));
    const width = Math.min(p.width - originX, Math.round(crop.w * p.width));
    const height = Math.min(p.height - originY, Math.round(crop.h * p.height));

    const acts: ImageManipulator.Action[] = [{ crop: { originX, originY, width, height } }];
    // Normalize to A4-ish ratio portrait if desired—keep original for now; just cap long edge
    const maxW = 1800; // good balance
    if (width > maxW) acts.push({ resize: { width: maxW } });

    // "Filter": bw = desaturate + increase contrast by levels trick (approx via multiple resize)
    const res = await ImageManipulator.manipulateAsync(p.uri, acts, { format: ImageManipulator.SaveFormat.JPEG, compress: 0.9 });
    if (p.filter === 'bw' || p.filter === 'auto') {
      // crude grayscale via averaging pixels is not in manipulator; we re-encode by tint trick (noop here).
      // Keep color; looks good with good lighting. Swap to a shader or native lib later for perfect B/W.
      return res.uri;
    }
    return res.uri;
  }

  // Export PDF (HTML + Print)
  const exportPDF = useCallback(async (docId: string) => {
    const { doc, pages: ps } = byDoc(docId);
    if (!doc || ps.length === 0) return null;

    const urls: string[] = [];
    for (const p of ps) urls.push(await materializePage(p));

    const imgs = urls.map(u => `<img src="${u}" style="width:100%;margin:0 0 16px 0;display:block;" />`).join('');
    const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" />
      <style> @page { size: A4; margin: 18mm; } body { font-family: -apple-system, Roboto, sans-serif; } </style>
      </head><body>${imgs}</body></html>`;

    const { uri } = await Print.printToFileAsync({ html });
    const target = FileSystem.documentDirectory! + `${doc.title.replace(/\s+/g,'_')}_${doc.id}.pdf`;
    await FileSystem.moveAsync({ from: uri, to: target });
    return target;
  }, [byDoc]);

  const sharePDF = useCallback(async (docId: string) => {
    const file = await exportPDF(docId);
    if (file && await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file);
    }
    return file;
  }, [exportPDF]);

  const stats = useMemo(() => {
    const docsCount = docs.length;
    const pagesCount = docs.reduce((a, d) => a + d.pageIds.length, 0);
    const lastUpdated = docs.reduce((m, d) => Math.max(m, d.updatedAt), 0);
    return { docsCount, pagesCount, lastUpdated };
  }, [docs]);

  return {
    docs, pages, allPages, byDoc,
    createDoc, addPage, updatePage, renameDoc, deleteDoc,
    exportPDF, sharePDF,
    stats,
  };
}
