import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { EstadoTarea, PrioridadTarea } from '../../common/constants';

export class TareaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(120, { message: 'El nombre no puede superar 120 caracteres.' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MaxLength(1000, { message: 'La descripción no puede superar 1000 caracteres.' })
  descripcion: string;

  @IsDateString({}, { message: 'La fecha de registro no es válida.' })
  fechaRegistro: string;

  @IsDateString({}, { message: 'La fecha límite no es válida.' })
  fechaLimite: string;

  @IsEnum(PrioridadTarea, { message: 'Seleccione una prioridad válida.' })
  prioridad: PrioridadTarea;

  @IsOptional()
  @IsEnum(EstadoTarea, { message: 'Seleccione un estado válido.' })
  estado?: EstadoTarea;
}
