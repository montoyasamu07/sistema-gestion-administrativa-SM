import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EstadoTarea, PrioridadTarea } from '../../common/constants';

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('text')
  descripcion: string;

  @Column()
  fechaRegistro: string;

  @Column()
  fechaLimite: string;

  @Column()
  prioridad: PrioridadTarea;

  @Column()
  estado: EstadoTarea;
}
