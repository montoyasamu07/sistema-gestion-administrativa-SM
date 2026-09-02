import { Controller, Get, Render } from '@nestjs/common';
import { LayoutService } from '../../common/layout.service';
import { CATEGORIAS_GASTO_DETALLE } from '../../common/constants';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly layout: LayoutService) {}

  @Get()
  @Render('categorias/index')
  index() {
    return this.layout.context('/categorias', {
      title: 'Categorías de gastos',
      categorias: CATEGORIAS_GASTO_DETALLE,
    });
  }
}
