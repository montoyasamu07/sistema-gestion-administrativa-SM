import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CategoriaGasto } from '../../common/constants';

@Entity('gastos')
export class Gasto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: string;

  @Column()
  descripcion: string;

  @Column()
  categoria: CategoriaGasto;

  @Column('real')
  valor: number;

  @Column('text', { default: '' })
  observacion: string;
}
