import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty({ message: 'Campo obligatorio' })
  plate: string;

  @IsString()
  @IsNotEmpty({ message: 'Campo obligatorio' })
  brand: string;

  @IsString()
  @IsNotEmpty({ message: 'Campo obligatorio' })
  model: string;

  @IsInt({ message: 'Campo obligatorio' })
  @Min(1950, { message: 'Año inválido' })
  @Max(2100, { message: 'Año inválido' })
  year: number;
}
