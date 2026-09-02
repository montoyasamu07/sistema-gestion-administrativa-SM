import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { toNumber } from '../../common/format';

export class MovimientoDto {
  @IsDateString({}, { message: 'La fecha no es válida.' })
  fecha: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MaxLength(200, { message: 'La descripción no puede superar 200 caracteres.' })
  descripcion: string;

  @IsString()
  @IsNotEmpty({ message: 'La categoría es obligatoria.' })
  @MaxLength(80, { message: 'La categoría no puede superar 80 caracteres.' })
  categoria: string;

  @Transform(({ value }) => toNumber(value))
  @IsNumber({}, { message: 'El valor debe ser numérico.' })
  @Min(1, { message: 'El valor debe ser mayor que cero.' })
  valor: number;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La observación no puede superar 500 caracteres.' })
  observacion?: string;
}
