import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [ OrderModule ],
  providers: [ CartService, ConfigService ],
  controllers: [ CartController ]
})
export class CartModule {}
