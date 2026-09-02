import { Controller, Get, Render } from '@nestjs/common';
import { LayoutService } from '../../common/layout.service';
import { TareasService } from '../tareas/tareas.service';
import { IngresosService } from '../ingresos/ingresos.service';
import { GastosService } from '../gastos/gastos.service';
import {
  firstDayOfMonthISO,
  lastDayOfMonthISO,
} from '../../common/format';

@Controller()
export class InicioController {
  constructor(
    private readonly layout: LayoutService,
    private readonly tareasService: TareasService,
    private readonly ingresosService: IngresosService,
    private readonly gastosService: GastosService,
  ) {}

  @Get()
  @Render('inicio/index')
  async index() {
    const desde = firstDayOfMonthISO();
    const hasta = lastDayOfMonthISO();
    const tareas = await this.tareasService.resumen();
    const totalIngresos = await this.ingresosService.total(desde, hasta);
    const totalGastos = await this.gastosService.total(desde, hasta);

    return this.layout.context('/', {
      title: 'Inicio',
      tareas,
      totalIngresos,
      totalGastos,
      balance: totalIngresos - totalGastos,
      periodo: { desde, hasta },
    });
  }
}
