import type { ApiProduct } from './products';

export type ProductCardUi = {
  id: string;
  name: string;
  description: string;
  price: string;
  accent: 'rose' | 'lavender' | 'mint' | 'peach' | 'beige';
};

function accentFromSeed(seed: string): ProductCardUi['accent'] {
  const accents: ProductCardUi['accent'][] = [
    'rose',
    'lavender',
    'mint',
    'peach',
    'beige',
  ];

  const hash = [...seed].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return accents[hash % accents.length] as ProductCardUi['accent'];
}

export function toProductCardUi(product: ApiProduct): ProductCardUi {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: `€${product.price}`,
    accent: accentFromSeed(product.category?.slug ?? product.id),
  };
}