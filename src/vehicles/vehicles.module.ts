import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiclesService } from './vehicles.service';
import { Vehicle, VehicleSchema } from './schemas/vehicle.schema';
import { VehiclesController } from './vehicles.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
