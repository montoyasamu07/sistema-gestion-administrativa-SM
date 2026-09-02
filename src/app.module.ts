import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Tarea } from './modules/tareas/tarea.entity';
import { Ingreso } from './modules/ingresos/ingreso.entity';
import { Gasto } from './modules/gastos/gasto.entity';
import { TareasModule } from './modules/tareas/tareas.module';
import { IngresosModule } from './modules/ingresos/ingresos.module';
import { GastosModule } from './modules/gastos/gastos.module';
import { InicioModule } from './modules/inicio/inicio.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { MovimientosModule } from './modules/movimientos/movimientos.module';
import { ReportesModule } from './modules/reportes/reportes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', 'data', 'hotel-bacaro.sqlite'),
      entities: [Tarea, Ingreso, Gasto],
      synchronize: true,
    }),
    TareasModule,
    IngresosModule,
    GastosModule,
    InicioModule,
    CategoriasModule,
    MovimientosModule,
    ReportesModule,
  ],
})
export class AppModule {}
