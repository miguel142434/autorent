import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateRentDto {
  @IsNotEmpty()
  cliente: string;

  @IsNotEmpty()
  vehiculo: string;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;
}