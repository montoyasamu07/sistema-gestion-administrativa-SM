import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingreso } from './ingreso.entity';
import { IngresosService } from './ingresos.service';
import { IngresosController } from './ingresos.controller';
import { LayoutService } from '../../common/layout.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ingreso])],
  controllers: [IngresosController],
  providers: [IngresosService, LayoutService],
  exports: [IngresosService],
})
export class IngresosModule {}
