import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Render,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { TareasService } from './tareas.service';
import { LayoutService } from '../../common/layout.service';
import { TareaDto } from './tarea.dto';
import { validateForm } from '../../common/validate-form';
import { EstadoTarea, PrioridadTarea } from '../../common/constants';
import { todayISO } from '../../common/format';

@Controller('tareas')
export class TareasController {
  constructor(
    private readonly tareasService: TareasService,
    private readonly layout: LayoutService,
  ) {}

  @Get()
  @Render('tareas/index')
  async index(@Query('mensaje') mensaje?: string) {
    const tareas = await this.tareasService.findAll();
    return this.layout.context('/tareas', {
      title: 'Tareas',
      mensaje,
      tareas,
    });
  }

  @Get('nueva')
  @Render('tareas/form')
  nueva() {
    return this.layout.context('/tareas', {
      title: 'Nueva tarea',
      action: '/tareas',
      values: {
        fechaRegistro: todayISO(),
        estado: EstadoTarea.PENDIENTE,
      },
      prioridades: Object.values(PrioridadTarea),
      estados: Object.values(EstadoTarea),
      errors: {},
    });
  }

  @Post()
  async crear(@Body() body: Record<string, unknown>, @Res() res: Response) {
    const { dto, errors } = await validateForm(TareaDto, body);
    if (Object.keys(errors).length || this.fechaInvalida(dto, errors)) {
      return res.status(400).render(
        'tareas/form',
        this.layout.context('/tareas', {
          title: 'Nueva tarea',
          action: '/tareas',
          values: body,
          prioridades: Object.values(PrioridadTarea),
          estados: Object.values(EstadoTarea),
          errors,
        }),
      );
    }
    await this.tareasService.create(dto);
    return res.redirect('/tareas?mensaje=Tarea registrada correctamente.');
  }

  @Get(':id/editar')
  async editar(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const tarea = await this.tareasService.findOne(id);
    if (!tarea) {
      return res.redirect('/tareas?mensaje=La tarea no existe.');
    }
    return res.render(
      'tareas/form',
      this.layout.context('/tareas', {
        title: 'Editar tarea',
        action: `/tareas/${id}`,
        values: tarea,
        prioridades: Object.values(PrioridadTarea),
        estados: Object.values(EstadoTarea),
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
    const { dto, errors } = await validateForm(TareaDto, body);
    if (Object.keys(errors).length || this.fechaInvalida(dto, errors)) {
      return res.status(400).render(
        'tareas/form',
        this.layout.context('/tareas', {
          title: 'Editar tarea',
          action: `/tareas/${id}`,
          values: { ...body, id },
          prioridades: Object.values(PrioridadTarea),
          estados: Object.values(EstadoTarea),
          errors,
        }),
      );
    }
    const updated = await this.tareasService.update(id, dto);
    if (!updated) {
      return res.redirect('/tareas?mensaje=La tarea no existe.');
    }
    return res.redirect('/tareas?mensaje=Tarea actualizada correctamente.');
  }

  @Post(':id/estado')
  async estado(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.tareasService.cambiarEstado(id);
    return res.redirect('/tareas?mensaje=Estado de la tarea actualizado.');
  }

  @Post(':id/eliminar')
  async eliminar(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.tareasService.remove(id);
    return res.redirect('/tareas?mensaje=Tarea eliminada.');
  }

  private fechaInvalida(dto: TareaDto, errors: Record<string, string>) {
    if (dto.fechaRegistro && dto.fechaLimite && dto.fechaLimite < dto.fechaRegistro) {
      errors.fechaLimite =
        'La fecha límite no puede ser anterior a la fecha de registro.';
      return true;
    }
    return false;
  }
}
