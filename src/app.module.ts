import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { tmpdir } from 'os';
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

function getDatabasePath(): string {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }

  const isVercel = Boolean(process.env.VERCEL);
  if (isVercel) {
    const tmpDbPath = join(tmpdir(), 'hotel-bacaro.sqlite');
    const sourceDbPath = join(process.cwd(), 'data', 'hotel-bacaro.sqlite');
    if (!existsSync(tmpDbPath) && existsSync(sourceDbPath)) {
      try {
        copyFileSync(sourceDbPath, tmpDbPath);
      } catch (err) {
        console.warn('Could not copy template sqlite database to tmp:', err);
      }
    }
    return tmpDbPath;
  }

  const localDataDir = join(process.cwd(), 'data');
  if (!existsSync(localDataDir)) {
    try {
      mkdirSync(localDataDir, { recursive: true });
    } catch {
      // Ignorar si ya existe
    }
  }
  return join(localDataDir, 'hotel-bacaro.sqlite');
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: getDatabasePath(),
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
