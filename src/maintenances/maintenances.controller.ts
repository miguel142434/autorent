import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { MaintenancesService } from './maintenances.service';
 
@Controller()
@UseGuards(JwtAuthGuard)
export class MaintenancesController {
  constructor(private readonly maintenancesService: MaintenancesService) {}
 
  // POST /vehiculos/:id/mantenimientos
  @Post(['vehiculos/:id/mantenimientos', 'vehicles/:id/mantenimientos'])
  create(@Param('id') vehicleId: string, @Body() dto: CreateMaintenanceDto) {
    return this.maintenancesService.create(vehicleId, dto);
  }
 
  // GET /vehiculos/:id/mantenimientos
  @Get(['vehiculos/:id/mantenimientos', 'vehicles/:id/mantenimientos'])
  findByVehicle(@Param('id') vehicleId: string) {
    return this.maintenancesService.findByVehicle(vehicleId);
  }
 
  // GET /mantenimientos/:id
  @Get(['mantenimientos/:id', 'maintenances/:id'])
  findOne(@Param('id') id: string) {
    return this.maintenancesService.findOne(id);
  }
}