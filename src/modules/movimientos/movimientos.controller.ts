import { Controller, Get, Query, Render } from '@nestjs/common';
import { LayoutService } from '../../common/layout.service';
import { IngresosService } from '../ingresos/ingresos.service';
import { GastosService } from '../gastos/gastos.service';
import {
  firstDayOfMonthISO,
  lastDayOfMonthISO,
} from '../../common/format';

@Controller('movimientos')
export class MovimientosController {
  constructor(
    private readonly layout: LayoutService,
    private readonly ingresosService: IngresosService,
    private readonly gastosService: GastosService,
  ) {}

  @Get()
  @Render('movimientos/index')
  async index(
    @Query('desde') desdeQuery?: string,
    @Query('hasta') hastaQuery?: string,
  ) {
    const desde = desdeQuery || firstDayOfMonthISO();
    const hasta = hastaQuery || lastDayOfMonthISO();
    const filtroInvalido = Boolean(desde && hasta && desde > hasta);

    const ingresos = filtroInvalido
      ? []
      : await this.ingresosService.findByFechas(desde, hasta);
    const gastos = filtroInvalido
      ? []
      : await this.gastosService.findByFechas(desde, hasta);

    const movimientos = [
      ...ingresos.map((item) => ({
        ...item,
        tipo: 'Ingreso',
      })),
      ...gastos.map((item) => ({
        ...item,
        tipo: 'Gasto',
      })),
    ].sort((a, b) => {
      if (a.fecha === b.fecha) {
        return b.id - a.id;
      }
      return a.fecha < b.fecha ? 1 : -1;
    });

    const totalIngresos = ingresos.reduce((sum, i) => sum + Number(i.valor), 0);
    const totalGastos = gastos.reduce((sum, g) => sum + Number(g.valor), 0);

    return this.layout.context('/movimientos', {
      title: 'Movimientos',
      desde,
      hasta,
      filtroInvalido,
      movimientos,
      totalIngresos,
      totalGastos,
      balance: totalIngresos - totalGastos,
    });
  }
}
