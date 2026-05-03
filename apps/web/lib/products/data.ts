/**
 * Server-only mock “API”. Option B: async fetch + artificial delay so
 * `app/products/loading.tsx` is visible during dev.
 */
export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  /** drives soft accent stripe on ProductCard */
  accent: "rose" | "lavender" | "mint" | "peach" | "beige";
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Cloud Tee",
    description: "Organic cotton, garment-dyed in mist grey.",
    price: "€24.00",
    accent: "lavender",
  },
  {
    id: "2",
    name: "Pastel Tote",
    description: "Roomy canvas bag with inner pocket.",
    price: "€18.50",
    accent: "mint",
  },
  {
    id: "3",
    name: "Morning Mug",
    description: "Matte glaze, microwave-safe.",
    price: "€12.00",
    accent: "peach",
  },
  {
    id: "4",
    name: "Linen Napkins (set)",
    description: "Pre-washed oatmeal linen.",
    price: "€22.00",
    accent: "rose",
  },
  {
    id: "5",
    name: "Water Bottle",
    description: "1L stainless steel water bottle.",
    price: "€28.00",
    accent: "beige",
  },
];

export type FetchProductsOptions = {
  /** Set true or open `/products?fail=1` to see `error.tsx` */
  simulateFail?: boolean;
};

export async function fetchProducts(
  opts: FetchProductsOptions = {},
): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 500));

  if (opts.simulateFail) {
    throw new Error("Could not load products (demo failure).");
  }

  return MOCK_PRODUCTS;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
}
