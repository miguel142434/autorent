import { Body, Controller, Patch, Post, Param, Get } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';

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

  @Get(':id')
async findOne(@Param('id') id: string) {
  const vehicle = await this.vehiclesService.findOne(id);
  return vehicle;
}
  
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    const vehicle = await this.vehiclesService.update(id, dto);
    return {
      message: 'Vehículo actualizado con éxito',
      vehicle,
    };
  }
  
}
