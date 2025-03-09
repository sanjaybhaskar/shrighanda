
export type ProductType = 'business' | 'nonbusiness';

export interface Product {
    id: number;
    name: string;
    price: string;
    images: { src: string }[];
    price_html: string;
  }
  
export interface CartItem {
  product: Product;
  quantity: number;
  type: 'adult' | 'child';
}
  