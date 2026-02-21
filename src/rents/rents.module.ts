import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Client, ClientSchema } from "src/clients/schemas/clients.schema";
import { Vehicle, VehicleSchema } from "src/vehicles/schemas/vehicle.schema";
import { AlquileresController } from "./rents.controller";
import { AlquileresService } from "./rents.service";
import { Rent, RentSchema } from "./schemas/rent.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rent.name, schema: RentSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
  ],
  controllers: [AlquileresController],
  providers: [AlquileresService],
})
export class AlquileresModule {}
