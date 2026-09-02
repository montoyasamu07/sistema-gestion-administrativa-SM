import { Module } from '@nestjs/common';
import { MovimientosController } from './movimientos.controller';
import { LayoutService } from '../../common/layout.service';
import { IngresosModule } from '../ingresos/ingresos.module';
import { GastosModule } from '../gastos/gastos.module';

@Module({
  imports: [IngresosModule, GastosModule],
  controllers: [MovimientosController],
  providers: [LayoutService],
})
export class MovimientosModule {}
