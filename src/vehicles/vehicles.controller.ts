import { Body, Controller, Post } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehiclesService } from './vehicles.service';
import { Get } from '@nestjs/common';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  async create(@Body() dto: CreateVehicleDto) {
    const vehicle = await this.vehiclesService.create(dto);
    return {
      message: 'Vehículo creado con éxito',
      vehicle,
    };
  }
  
  @Get()
findAll() {
  return this.vehiclesService.findAll();
}
}
