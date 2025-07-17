export interface Product {
  Index: number;
  Name: string;
  Description: string;
  Brand: string;
  Category: string;
  Price: number;
  Currency: string;
  Stock: number;
  EAN: number;
  Color: string;
  Size: string;
  Availability: string;
  ShortDescription: string;
  Image: string;
  'Internal ID': string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}