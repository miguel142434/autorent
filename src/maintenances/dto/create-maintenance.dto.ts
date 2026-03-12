import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { MaintenanceType } from '../schemas/maintenance.schema';
 
export class CreateMaintenanceDto {
  @IsEnum(MaintenanceType, {
    message: 'tipo debe ser "preventivo" o "correctivo"',
  })
  tipo: MaintenanceType;
 
  @IsString()
  descripcion: string;
 
  @IsDateString()
  fecha: string;
 
  @IsOptional()
  @IsNumber()
  @Min(0)
  costo?: number;
}