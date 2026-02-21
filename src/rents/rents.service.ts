import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";
import { Client } from "src/clients/schemas/clients.schema";
import { Vehicle } from "src/vehicles/schemas/vehicle.schema";
import { Rent } from "./schemas/rent.schema";
import { CreateRentDto } from "./dto/create-rent.dto";

@Injectable()
export class AlquileresService {
  constructor(
    @InjectModel(Rent.name) private rentModel: Model<Rent>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
    @InjectModel(Client.name) private clientModel: Model<Client>,
  ) {};

  async create(dto: CreateRentDto) {
  const { cliente, vehiculo, fechaInicio, fechaFin } = dto;

  if (!isValidObjectId(cliente) || !isValidObjectId(vehiculo)) {
    throw new BadRequestException('ID inválido');
  }

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  if (fin <= inicio) {
    throw new BadRequestException(
      'La fecha fin debe ser mayor a la fecha inicio',
    );
  }

  // 1. Validar cliente
  const clientExists = await this.clientModel.findById(cliente);
  if (!clientExists) {
    throw new NotFoundException('Cliente no encontrado');
  }

  // 2. Validar vehículo
  const vehicle = await this.vehicleModel.findById(vehiculo);
  if (!vehicle) {
    throw new NotFoundException('Vehículo no encontrado');
  }

  if (vehicle.status !== 'AVAILABLE') {
    throw new BadRequestException('Vehículo no disponible');
  }

  // 3. Validar solapamiento
  const overlapping = await this.rentModel.findOne({
    vehiculo,
    estado: 'ACTIVO',
    fechaInicio: { $lte: fin },
    fechaFin: { $gte: inicio },
  });

  if (overlapping) {
    throw new BadRequestException(
      'Vehículo no disponible en las fechas seleccionadas',
    );
  }

  // 4. Crear alquiler
  const rent = await this.rentModel.create({
    cliente,
    vehiculo,
    fechaInicio: inicio,
    fechaFin: fin,
    estado: 'ACTIVO',
  });

  // 5. Cambiar estado vehículo
  vehicle.status = 'RENTED';
  await vehicle.save();

  return rent;
}

async findOne(id: string) {
  const rent = await this.rentModel
    .findById(id)
    .populate('cliente')
    .populate('vehiculo');

  if (!rent) {
    throw new NotFoundException('Alquiler no encontrado');
  }

  return rent;
}

async findAll() {
  return this.rentModel
    .find()
    .populate("cliente")
    .populate("vehiculo")
    .sort({ createdAt: -1 });
}

}
