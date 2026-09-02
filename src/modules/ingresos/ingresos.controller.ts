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
import { IngresosService } from './ingresos.service';
import { LayoutService } from '../../common/layout.service';
import { MovimientoDto } from './ingreso.dto';
import { validateForm } from '../../common/validate-form';
import { todayISO } from '../../common/format';

@Controller('ingresos')
export class IngresosController {
  constructor(
    private readonly ingresosService: IngresosService,
    private readonly layout: LayoutService,
  ) {}

  @Get()
  @Render('ingresos/index')
  async index(@Query('mensaje') mensaje?: string) {
    const ingresos = await this.ingresosService.findAll();
    return this.layout.context('/ingresos', {
      title: 'Ingresos',
      mensaje,
      ingresos,
    });
  }

  @Get('nuevo')
  @Render('ingresos/form')
  nuevo() {
    return this.layout.context('/ingresos', {
      title: 'Registrar ingreso',
      action: '/ingresos',
      values: { fecha: todayISO() },
      errors: {},
    });
  }

  @Post()
  async crear(@Body() body: Record<string, unknown>, @Res() res: Response) {
    const { dto, errors } = await validateForm(MovimientoDto, body);
    if (Object.keys(errors).length) {
      return res.status(400).render(
        'ingresos/form',
        this.layout.context('/ingresos', {
          title: 'Registrar ingreso',
          action: '/ingresos',
          values: body,
          errors,
        }),
      );
    }
    await this.ingresosService.create(dto);
    return res.redirect('/ingresos?mensaje=Ingreso registrado correctamente.');
  }

  @Get(':id/editar')
  async editar(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const ingreso = await this.ingresosService.findOne(id);
    if (!ingreso) {
      return res.redirect('/ingresos?mensaje=El ingreso no existe.');
    }
    return res.render(
      'ingresos/form',
      this.layout.context('/ingresos', {
        title: 'Editar ingreso',
        action: `/ingresos/${id}`,
        values: ingreso,
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
    const { dto, errors } = await validateForm(MovimientoDto, body);
    if (Object.keys(errors).length) {
      return res.status(400).render(
        'ingresos/form',
        this.layout.context('/ingresos', {
          title: 'Editar ingreso',
          action: `/ingresos/${id}`,
          values: { ...body, id },
          errors,
        }),
      );
    }
    const updated = await this.ingresosService.update(id, dto);
    if (!updated) {
      return res.redirect('/ingresos?mensaje=El ingreso no existe.');
    }
    return res.redirect('/ingresos?mensaje=Ingreso actualizado correctamente.');
  }

  @Post(':id/eliminar')
  async eliminar(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.ingresosService.remove(id);
    return res.redirect('/ingresos?mensaje=Ingreso eliminado.');
  }
}
