export enum Category {
  ALL = 'All',
  HEAVY = 'Heavy Materials',
  TOOLS = 'Tools & Hardware',
  ELECTRICAL = 'Electrical',
  PLUMBING = 'Plumbing',
  FINISHING = 'Finishing & Paint'
}

export interface Review {
  id: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  unit: string; // e.g., 'bag', 'piece', 'meter'
  description: string;
  tags: string[]; // For AI matching
  originalPrice?: number; // For discount calculation
  reviews: Review[];
  rating: number; // Average rating 0-5
}

export interface CartItem extends Product {
  quantity: number;
}

export interface BundleItem {
  productId: string;
  quantity: number;
  reason: string;
}

export interface ProjectBundle {
  title: string;
  description: string;
  items: BundleItem[];
  totalPriceEstimate: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  relatedProductIds?: string[];
  bundle?: ProjectBundle;
  isThinking?: boolean;
}

export interface AIResponseSchema {
  response: string;
  recommendedProductIds?: string[];
  bundle?: ProjectBundle;
}