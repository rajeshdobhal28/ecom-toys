import { createSlice } from "@reduxjs/toolkit";

export interface Product {
  id: string | number;
  title: string;
  price: number;
  rating: number;
  imageUrl?: string;
  category: string;
  slug: string;
  quantity: number;
  review_count: number;
}

// Mock data — replace with async thunk from /api/products later
const mockProducts: Product[] = [
  { id: 1, title: "Space Explorer Rocket", price: 1299, rating: 4.8, category: "Outdoor", slug: "space-explorer-rocket", quantity: 15, review_count: 124 },
  { id: 2, title: "Creative Building Blocks Set", price: 899, rating: 4.6, category: "Educational", slug: "creative-building-blocks", quantity: 30, review_count: 89 },
  { id: 3, title: "Cuddly Teddy Bear", price: 599, rating: 4.9, category: "Soft Toys", slug: "cuddly-teddy-bear", quantity: 20, review_count: 256 },
  { id: 4, title: "Watercolor Painting Kit", price: 449, rating: 4.5, category: "Arts & Crafts", slug: "watercolor-painting-kit", quantity: 50, review_count: 67 },
  { id: 5, title: "Remote Control Car Turbo", price: 1899, rating: 4.7, category: "Trending", slug: "rc-car-turbo", quantity: 8, review_count: 198 },
  { id: 6, title: "Magnetic Learning Board", price: 749, rating: 4.4, category: "Educational", slug: "magnetic-learning-board", quantity: 25, review_count: 45 },
  { id: 7, title: "Dinosaur Adventure Set", price: 999, rating: 4.6, category: "Trending", slug: "dinosaur-adventure-set", quantity: 12, review_count: 152 },
  { id: 8, title: "Musical Rainbow Xylophone", price: 349, rating: 4.3, category: "Educational", slug: "musical-rainbow-xylophone", quantity: 40, review_count: 73 },
];

interface ProductsState {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: ProductsState = {
  items: mockProducts,
  status: "idle",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
});

export default productsSlice.reducer;
