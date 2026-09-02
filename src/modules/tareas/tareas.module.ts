import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarea } from './tarea.entity';
import { TareasService } from './tareas.service';
import { TareasController } from './tareas.controller';
import { LayoutService } from '../../common/layout.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea])],
  controllers: [TareasController],
  providers: [TareasService, LayoutService],
  exports: [TareasService],
})
export class TareasModule {}
