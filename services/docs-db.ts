// services/docs-db.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DocFile, DocPage } from '@/types/docs';

const DOCS_KEY = 'scan.docs.v1';
const PAGES_KEY = 'scan.pages.v1';

export async function loadDocs(): Promise<DocFile[]> {
  const raw = await AsyncStorage.getItem(DOCS_KEY);
  return raw ? JSON.parse(raw) : [];
}
export async function saveDocs(list: DocFile[]) {
  await AsyncStorage.setItem(DOCS_KEY, JSON.stringify(list));
}

export async function loadPages(): Promise<Record<string, DocPage>> {
  const raw = await AsyncStorage.getItem(PAGES_KEY);
  return raw ? JSON.parse(raw) : {};
}
export async function savePages(map: Record<string, DocPage>) {
  await AsyncStorage.setItem(PAGES_KEY, JSON.stringify(map));
}
