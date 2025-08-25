// types/docs.ts
export type CropRect = { x: number; y: number; w: number; h: number }; // 0..1 relative
export type FilterKind = 'auto' | 'color' | 'bw';

export type DocPage = {
  id: string;
  docId: string;
  uri: string;         // local file URI (jpeg)
  width: number;       // px
  height: number;      // px
  createdAt: number;
  crop?: CropRect;
  filter?: FilterKind;
  order: number;
};

export type DocFile = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  pageIds: string[];
};
