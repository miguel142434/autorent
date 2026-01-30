import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Vehicle } from './schemas/vehicle.schema';

@Injectable()
export class VehiclesService {
  constructor(@InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>) {}

  async create(dto: CreateVehicleDto) {
    const plate = dto.plate.trim().toUpperCase();

    // Validación previa (mejor mensaje)
    const exists = await this.vehicleModel.exists({ plate });
    if (exists) {
      throw new BadRequestException('La placa ya existe');
    }

    return this.vehicleModel.create({
      ...dto,
      plate,
      status: 'AVAILABLE',
    });
  }
  async findAll() {
  return this.vehicleModel.find().sort({ createdAt: -1 });
}
}
