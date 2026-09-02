import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { LayoutService } from '../../common/layout.service';

@Module({
  controllers: [CategoriasController],
  providers: [LayoutService],
})
export class CategoriasModule {}
