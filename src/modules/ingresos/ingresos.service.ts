import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Ingreso } from './ingreso.entity';
import { MovimientoDto } from './ingreso.dto';

@Injectable()
export class IngresosService {
  constructor(
    @InjectRepository(Ingreso)
    private readonly repo: Repository<Ingreso>,
  ) {}

  findAll(): Promise<Ingreso[]> {
    return this.repo.find({ order: { fecha: 'DESC', id: 'DESC' } });
  }

  findOne(id: number): Promise<Ingreso | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByFechas(desde: string, hasta: string): Promise<Ingreso[]> {
    return this.repo.find({
      where: { fecha: Between(desde, hasta) },
      order: { fecha: 'DESC', id: 'DESC' },
    });
  }

  create(dto: MovimientoDto): Promise<Ingreso> {
    return this.repo.save(
      this.repo.create({
        ...dto,
        observacion: dto.observacion ?? '',
      }),
    );
  }

  async update(id: number, dto: MovimientoDto): Promise<Ingreso | null> {
    const ingreso = await this.findOne(id);
    if (!ingreso) {
      return null;
    }
    Object.assign(ingreso, dto, {
      observacion: dto.observacion ?? '',
    });
    return this.repo.save(ingreso);
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
}
