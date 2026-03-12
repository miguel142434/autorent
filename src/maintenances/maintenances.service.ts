import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Vehicle, VehicleDocument } from '../vehicles/schemas/vehicle.schema';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { Maintenance, MaintenanceDocument } from './schemas/maintenance.schema';
 
@Injectable()
export class MaintenancesService {
  constructor(
    @InjectModel(Maintenance.name)
    private readonly maintenanceModel: Model<MaintenanceDocument>,
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<VehicleDocument>,
  ) {}
 
  private validateId(id: string, label = 'ID') {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`${label} inválido`);
    }
  }
 
  // POST /vehiculos/:id/mantenimientos
  async create(vehicleId: string, dto: CreateMaintenanceDto) {
    this.validateId(vehicleId, 'Vehículo');
 
    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');
 
    const maintenance = await this.maintenanceModel.create({
      vehiculo_id: vehicleId,
      tipo: dto.tipo,
      descripcion: dto.descripcion,
      fecha: new Date(dto.fecha),
      costo: dto.costo ?? 0,
    });
 
    return {
      message: 'Mantenimiento registrado con éxito',
      mantenimiento: maintenance,
    };
  }
 
  // GET /vehiculos/:id/mantenimientos
  async findByVehicle(vehicleId: string) {
    this.validateId(vehicleId, 'Vehículo');
 
    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');
 
    const mantenimientos = await this.maintenanceModel
      .find({ vehiculo_id: vehicleId })
      .sort({ fecha: -1 })
      .lean();
 
    return {
      vehicleId,
      total: mantenimientos.length,
      mantenimientos,
    };
  }
 
  // GET /mantenimientos/:id
  async findOne(id: string) {
    this.validateId(id, 'Mantenimiento');
 
    const maintenance = await this.maintenanceModel.findById(id).lean();
    if (!maintenance) throw new NotFoundException('Mantenimiento no encontrado');
 
    return maintenance;
  }
}