import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Cart } from '../models';
import {
  Client,
  ClientConfig
} from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CartService {
  config: ClientConfig;
  client: Client;

  constructor(private configService: ConfigService) {
    this.config = {
      user: this.configService.get('PG_USERNAME'),
      password: this.configService.get('PG_PASSWORD'),
      host: this.configService.get('PG_HOST'),
      database: this.configService.get('PG_DATABASE'),
      port: this.configService.get('PG_PORT'),
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 5000
    };
    this.initClient();
  }

  async findByUserId(userId: string): Promise<Cart> {
    const { rows: carts } = await this.client.query(`
      SELECT * FROM carts, cart_item 
      WHERE carts.id = cart_item.cart_id
      AND carts.user_id = '${userId}'`)
    const [cart] = carts;
    return cart;
  }

  async createByUserId(): Promise<Cart> {
    const id = uuidv4();
    const product_id = uuidv4();
    const userId = uuidv4();

    await this.client.query(`
    insert into carts (id, user_id, created_at, updated_at, status) values
    ('${id}', '${userId}', '2020-01-01','2021-01-01', 'OPEN')
    `)
    await this.client.query(`
   insert into cart_item (cart_id, product_id, count) values
   ('${id}', '${product_id}', '10')
    `)
    const { rows: carts } = await this.client.query(`
      SELECT * FROM carts, cart_item 
      WHERE carts.id = cart_item.cart_id
      AND carts.id = '${id}'`)
    const [cart] = carts;
    return cart;
  }

  async findOrCreateByUserId(userId?: string): Promise<Cart> {
    if (!userId) {
      return this.createByUserId();
    }
    return await this.findByUserId(userId);
  }

  // updateByUserId(userId: string, { items }: Cart): Cart {
  //   const { id, ...rest } = this.findOrCreateByUserId(userId);
  //
  //   const updatedCart = {
  //     id,
  //     ...rest,
  //     items: [ ...items ],
  //   }
  //
  //   this.userCarts[ userId ] = { ...updatedCart };
  //
  //   return { ...updatedCart };
  // }
  //
  // removeByUserId(userId): void {
  //   this.userCarts[ userId ] = null;
  // }

  private async initClient(): Promise<void> {
    this.client = new Client(this.config);
    await this.client.connect();
  }
}
