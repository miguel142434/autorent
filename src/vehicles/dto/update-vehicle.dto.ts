    import { IsInt, IsString, Max, Min, IsOptional } from 'class-validator';

    export class UpdateVehicleDto {
        @IsOptional()
        @IsString()
        plate?: string;

        @IsOptional()
        @IsString()
        brand?: string;

        @IsOptional()
        @IsString()
        model?: string;

        @IsOptional()
        @IsInt({ message: 'Solo debe contener enteros' })
        @Min(1950, { message: 'Año inválido' })
        @Max(2100, { message: 'Año inválido' })
        year?: number
    }