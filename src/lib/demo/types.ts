export type DemoCategory = "tops" | "bottoms" | "shoes" | "accessories";

export type DemoClothingItem = {
  id: string;
  imageDataUrl: string;
  category: DemoCategory;
  color: string | null;
  createdAt: string;
};

export type DemoOutfitItem = {
  id: string;
  clothingItemId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
};

export type DemoOutfit = {
  id: string;
  name: string;
  thumbnailDataUrl: string | null;
  createdAt: string;
  items: DemoOutfitItem[];
};



