import { Module } from '@nestjs/common';
import { ReportesController } from './reportes.controller';
import { LayoutService } from '../../common/layout.service';
import { IngresosModule } from '../ingresos/ingresos.module';
import { GastosModule } from '../gastos/gastos.module';

@Module({
  imports: [IngresosModule, GastosModule],
  controllers: [ReportesController],
  providers: [LayoutService],
})
export class ReportesModule {}
