import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Client } from 'src/clients/schemas/clients.schema';
import { Vehicle } from 'src/vehicles/schemas/vehicle.schema';
import { CreateRentDto } from './dto/create-rent.dto';
import { Rent } from './schemas/rent.schema';

@Injectable()
export class AlquileresService {
  constructor(
    @InjectModel(Rent.name) private readonly rentModel: Model<Rent>,
    @InjectModel(Vehicle.name) private readonly vehicleModel: Model<Vehicle>,
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
  ) {}

  async create(dto: CreateRentDto) {
    const { cliente, vehiculo, fechaInicio, fechaFin } = dto;

    if (!isValidObjectId(cliente) || !isValidObjectId(vehiculo)) {
      throw new BadRequestException('ID invalido');
    }

    const inicio = this.parseDateToStartOfDay(fechaInicio);
    const fin = this.parseDateToStartOfDay(fechaFin);

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
      throw new BadRequestException('Fechas invalidas');
    }

    if (fin <= inicio) {
      throw new BadRequestException(
        'La fecha fin debe ser mayor a la fecha inicio',
      );
    }

    const clientExists = await this.clientModel.exists({ _id: cliente });
    if (!clientExists) {
      throw new NotFoundException('Cliente no encontrado');
    }

    const vehicle = await this.vehicleModel.findById(vehiculo);
    if (!vehicle) {
      throw new NotFoundException('Vehiculo no encontrado');
    }

    if (vehicle.status !== 'DISPONIBLE') {
      throw new BadRequestException('El vehiculo no esta disponible');
    }

    const overlappingRent = await this.rentModel.findOne({
      vehiculo,
      estado: 'ACTIVO',
      fechaInicio: { $lte: fin },
      fechaFin: { $gte: inicio },
    });

    if (overlappingRent) {
      throw new BadRequestException(
        'El vehiculo ya tiene una renta en las fechas seleccionadas',
      );
    }

    try {
      const rent = await this.rentModel.create({
        cliente,
        vehiculo,
        fechaInicio: inicio,
        fechaFin: fin,
        estado: 'ACTIVO',
      });

      await this.vehicleModel.findByIdAndUpdate(vehiculo, {
        $set: { status: 'ALQUILADO' },
      });

      return {
        message: 'Renta creada con exito',
        alquiler: rent,
      };
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new BadRequestException('El vehiculo ya tiene una renta activa');
      }

      throw error;
    }
  }

  async findAll() {
    return this.rentModel
      .find()
      .populate('cliente')
      .populate('vehiculo')
      .sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    this.validateObjectId(id);

    const rent = await this.rentModel
      .findById(id)
      .populate('cliente')
      .populate('vehiculo');

    if (!rent) {
      throw new NotFoundException('Alquiler no encontrado');
    }

    return rent;
  }

  private validateObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Alquiler no encontrado');
    }
  }

  private parseDateToStartOfDay(value: string) {
    const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (dateOnlyRegex.test(value)) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day, 0, 0, 0, 0);
    }

    const parsedDate = new Date(value);
    parsedDate.setHours(0, 0, 0, 0);
    return parsedDate;
  }
}
