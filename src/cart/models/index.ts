export type Product = {
  id: string,
  title: string,
  description: string,
  price: number,
};


export type CartItem = {
  product: Product,
  count: number,
}

export type Cart = {
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  status: string;
  cart_id: string;
  product_id: string;
  count: number;

}
