import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { existsSync } from 'fs';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { LegalDocument, Vehicle } from './schemas/vehicle.schema';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { UploadVehicleDocumentDto } from './dto/upload-vehicle-document.dto';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

type UploadedFile = {
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
};

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
  ) {}

  async create(dto: CreateVehicleDto) {
    const plate = dto.plate.trim().toUpperCase();

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

  async findOne(id: string) {
    const vehicle = await this.vehicleModel.findById(id);
    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }
    return vehicle;
  }

  async update(id: string, dto: UpdateVehicleDto) {
    const vehicle = await this.vehicleModel.findByIdAndUpdate(
      id,
      { $set: dto },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    return vehicle;
  }

  async uploadDocument(
    vehicleId: string,
    dto: UploadVehicleDocumentDto,
    file: UploadedFile,
  ) {
    this.validateObjectId(vehicleId, 'Vehículo no encontrado');

    if (!file) {
      throw new BadRequestException('Debe adjuntar un archivo');
    }

    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    const expiresAt = new Date(dto.expiresAt);
    const newDocument: LegalDocument = {
      type: dto.type,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      storagePath: file.path,
      expiresAt,
      uploadedAt: new Date(),
    };

    vehicle.documents.push(newDocument);
    await vehicle.save();

    const savedDocument = vehicle.documents[vehicle.documents.length - 1];

    return {
      message: 'Documento cargado con éxito',
      document: this.toDocumentResponse(savedDocument),
    };
  }

  async listDocuments(vehicleId: string) {
    this.validateObjectId(vehicleId, 'Vehículo no encontrado');

    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    return vehicle.documents.map((document) =>
      this.toDocumentResponse(document),
    );
  }

  async getDocument(vehicleId: string, docId: string) {
    this.validateObjectId(vehicleId, 'Vehículo no encontrado');
    this.validateObjectId(docId, 'Documento no encontrado');

    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    const document = vehicle.documents.find(
      (item: any) => item._id.toString() === docId,
    );
    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    return this.toDocumentResponse(document);
  }

  async getDocumentFile(vehicleId: string, docId: string) {
    this.validateObjectId(vehicleId, 'Vehículo no encontrado');
    this.validateObjectId(docId, 'Documento no encontrado');

    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    const document = vehicle.documents.find(
      (item: any) => item._id.toString() === docId,
    );
    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    if (!existsSync(document.storagePath)) {
      throw new NotFoundException('Archivo no encontrado en disco');
    }

    return {
      storagePath: document.storagePath,
      originalName: document.originalName,
      mimeType: document.mimeType,
    };
  }

  private validateObjectId(value: string, message: string) {
    if (!isValidObjectId(value)) {
      throw new NotFoundException(message);
    }
  }

  private toDocumentResponse(document: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiresAt = new Date(document.expiresAt);
    const expiresAtDate = new Date(expiresAt);
    expiresAtDate.setHours(0, 0, 0, 0);

    const status = expiresAtDate < today ? 'VENCIDO' : 'VIGENTE';

    return {
      id: document._id.toString(),
      type: document.type,
      originalName: document.originalName,
      mimeType: document.mimeType,
      size: document.size,
      storagePath: document.storagePath,
      expiresAt: document.expiresAt,
      uploadedAt: document.uploadedAt,
      status,
    };
  }
}
