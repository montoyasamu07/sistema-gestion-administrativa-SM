import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Gasto } from './gasto.entity';
import { GastoDto } from './gasto.dto';
import { CATEGORIAS_GASTO } from '../../common/constants';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private readonly repo: Repository<Gasto>,
  ) {}

  findAll(): Promise<Gasto[]> {
    return this.repo.find({ order: { fecha: 'DESC', id: 'DESC' } });
  }

  findOne(id: number): Promise<Gasto | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByFechas(desde: string, hasta: string): Promise<Gasto[]> {
    return this.repo.find({
      where: { fecha: Between(desde, hasta) },
      order: { fecha: 'DESC', id: 'DESC' },
    });
  }

  create(dto: GastoDto): Promise<Gasto> {
    return this.repo.save(
      this.repo.create({
        ...dto,
        observacion: dto.observacion ?? '',
      }),
    );
  }

  async update(id: number, dto: GastoDto): Promise<Gasto | null> {
    const gasto = await this.findOne(id);
    if (!gasto) {
      return null;
    }
    Object.assign(gasto, dto, {
      observacion: dto.observacion ?? '',
    });
    return this.repo.save(gasto);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async total(desde?: string, hasta?: string): Promise<number> {
    const items =
      desde && hasta ? await this.findByFechas(desde, hasta) : await this.findAll();
    return items.reduce((sum, item) => sum + Number(item.valor), 0);
  }

  async totalesPorCategoria(desde: string, hasta: string) {
    const gastos = await this.findByFechas(desde, hasta);
    return CATEGORIAS_GASTO.map((categoria) => {
      const items = gastos.filter((g) => g.categoria === categoria);
      return {
        categoria,
        cantidad: items.length,
        total: items.reduce((sum, item) => sum + Number(item.valor), 0),
      };
    });
  }
}
