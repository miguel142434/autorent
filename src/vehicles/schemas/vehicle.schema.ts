import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  plate: string;

  @Prop({ required: true, trim: true })
  brand: string;

  @Prop({ required: true, trim: true })
  model: string;

  @Prop({ required: true, min: 1950, max: 2100 })
  year: number;

  @Prop({ default: 'AVAILABLE' })
  status: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

// índice único
VehicleSchema.index({ plate: 1 }, { unique: true });

