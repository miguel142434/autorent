import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiclesModule } from './vehicles/vehicles.module';
import { Client } from './clients/schemas/clients.schema';
import { ClientsModule } from './clients/clients.module';
import { AlquileresModule } from './rents/rents.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AuthModule,
    VehiclesModule,
    ClientsModule,
    AlquileresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
