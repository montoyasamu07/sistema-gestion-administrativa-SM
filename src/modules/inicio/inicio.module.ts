import { Module } from '@nestjs/common';
import { InicioController } from './inicio.controller';
import { LayoutService } from '../../common/layout.service';
import { TareasModule } from '../tareas/tareas.module';
import { IngresosModule } from '../ingresos/ingresos.module';
import { GastosModule } from '../gastos/gastos.module';

@Module({
  imports: [TareasModule, IngresosModule, GastosModule],
  controllers: [InicioController],
  providers: [LayoutService],
})
export class InicioModule {}
