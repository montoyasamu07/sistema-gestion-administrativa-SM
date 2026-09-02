import { Controller, Get, Query, Render } from '@nestjs/common';
import { LayoutService } from '../../common/layout.service';
import { IngresosService } from '../ingresos/ingresos.service';
import { GastosService } from '../gastos/gastos.service';
import {
  firstDayOfMonthISO,
  lastDayOfMonthISO,
} from '../../common/format';

@Controller('reportes')
export class ReportesController {
  constructor(
    private readonly layout: LayoutService,
    private readonly ingresosService: IngresosService,
    private readonly gastosService: GastosService,
  ) {}

  @Get()
  @Render('reportes/index')
  async index(
    @Query('desde') desdeQuery?: string,
    @Query('hasta') hastaQuery?: string,
  ) {
    const desde = desdeQuery || firstDayOfMonthISO();
    const hasta = hastaQuery || lastDayOfMonthISO();
    const filtroInvalido = Boolean(desde && hasta && desde > hasta);

    const totalIngresos = filtroInvalido
      ? 0
      : await this.ingresosService.total(desde, hasta);
    const totalGastos = filtroInvalido
      ? 0
      : await this.gastosService.total(desde, hasta);
    const porCategoria = filtroInvalido
      ? []
      : await this.gastosService.totalesPorCategoria(desde, hasta);

    return this.layout.context('/reportes', {
      title: 'Reportes',
      desde,
      hasta,
      filtroInvalido,
      totalIngresos,
      totalGastos,
      balance: totalIngresos - totalGastos,
      porCategoria,
    });
  }
}
