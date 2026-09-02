import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { GastosService } from './gastos.service';
import { LayoutService } from '../../common/layout.service';
import { GastoDto } from './gasto.dto';
import { validateForm } from '../../common/validate-form';
import { CATEGORIAS_GASTO } from '../../common/constants';
import { todayISO } from '../../common/format';

@Controller('gastos')
export class GastosController {
  constructor(
    private readonly gastosService: GastosService,
    private readonly layout: LayoutService,
  ) {}

  @Get()
  @Render('gastos/index')
  async index(@Query('mensaje') mensaje?: string) {
    const gastos = await this.gastosService.findAll();
    return this.layout.context('/gastos', {
      title: 'Gastos',
      mensaje,
      gastos,
    });
  }

  @Get('nuevo')
  @Render('gastos/form')
  nuevo() {
    return this.layout.context('/gastos', {
      title: 'Registrar gasto',
      action: '/gastos',
      values: { fecha: todayISO() },
      categorias: CATEGORIAS_GASTO,
      errors: {},
    });
  }

  @Post()
  async crear(@Body() body: Record<string, unknown>, @Res() res: Response) {
    const { dto, errors } = await validateForm(GastoDto, body);
    if (Object.keys(errors).length) {
      return res.status(400).render(
        'gastos/form',
        this.layout.context('/gastos', {
          title: 'Registrar gasto',
          action: '/gastos',
          values: body,
          categorias: CATEGORIAS_GASTO,
          errors,
        }),
      );
    }
    await this.gastosService.create(dto);
    return res.redirect('/gastos?mensaje=Gasto registrado correctamente.');
  }

  @Get(':id/editar')
  async editar(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const gasto = await this.gastosService.findOne(id);
    if (!gasto) {
      return res.redirect('/gastos?mensaje=El gasto no existe.');
    }
    return res.render(
      'gastos/form',
      this.layout.context('/gastos', {
        title: 'Editar gasto',
        action: `/gastos/${id}`,
        values: gasto,
        categorias: CATEGORIAS_GASTO,
        errors: {},
      }),
    );
  }

  @Post(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ) {
    const { dto, errors } = await validateForm(GastoDto, body);
    if (Object.keys(errors).length) {
      return res.status(400).render(
        'gastos/form',
        this.layout.context('/gastos', {
          title: 'Editar gasto',
          action: `/gastos/${id}`,
          values: { ...body, id },
          categorias: CATEGORIAS_GASTO,
          errors,
        }),
      );
    }
    const updated = await this.gastosService.update(id, dto);
    if (!updated) {
      return res.redirect('/gastos?mensaje=El gasto no existe.');
    }
    return res.redirect('/gastos?mensaje=Gasto actualizado correctamente.');
  }

  @Post(':id/eliminar')
  async eliminar(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.gastosService.remove(id);
    return res.redirect('/gastos?mensaje=Gasto eliminado.');
  }
}
