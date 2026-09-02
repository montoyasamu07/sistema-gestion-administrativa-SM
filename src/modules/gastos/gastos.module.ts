import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gasto } from './gasto.entity';
import { GastosService } from './gastos.service';
import { GastosController } from './gastos.controller';
import { LayoutService } from '../../common/layout.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gasto])],
  controllers: [GastosController],
  providers: [GastosService, LayoutService],
  exports: [GastosService],
})
export class GastosModule {}
