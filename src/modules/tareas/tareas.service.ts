import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './tarea.entity';
import { TareaDto } from './tarea.dto';
import { EstadoTarea } from '../../common/constants';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly repo: Repository<Tarea>,
  ) {}

  findAll(): Promise<Tarea[]> {
    return this.repo.find({ order: { fechaLimite: 'ASC', id: 'DESC' } });
  }

  findOne(id: number): Promise<Tarea | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(dto: TareaDto): Promise<Tarea> {
    const tarea = this.repo.create({
      ...dto,
      estado: dto.estado ?? EstadoTarea.PENDIENTE,
    });
    return this.repo.save(tarea);
  }

  async update(id: number, dto: TareaDto): Promise<Tarea | null> {
    const tarea = await this.findOne(id);
    if (!tarea) {
      return null;
    }
    Object.assign(tarea, dto, {
      estado: dto.estado ?? tarea.estado,
    });
    return this.repo.save(tarea);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async cambiarEstado(id: number): Promise<Tarea | null> {
    const tarea = await this.findOne(id);
    if (!tarea) {
      return null;
    }
    tarea.estado =
      tarea.estado === EstadoTarea.PENDIENTE
        ? EstadoTarea.COMPLETADA
        : EstadoTarea.PENDIENTE;
    return this.repo.save(tarea);
  }

  async resumen() {
    const tareas = await this.findAll();
    const pendientes = tareas.filter((t) => t.estado === EstadoTarea.PENDIENTE);
    return {
      total: tareas.length,
      pendientes: pendientes.length,
      completadas: tareas.length - pendientes.length,
    };
  }
}
