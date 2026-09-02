import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ingresos')
export class Ingreso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: string;

  @Column()
  descripcion: string;

  @Column()
  categoria: string;

  @Column('real')
  valor: number;

  @Column('text', { default: '' })
  observacion: string;
}
