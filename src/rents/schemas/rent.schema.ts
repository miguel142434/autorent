import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class Rent {
  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  cliente: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehiculo: Types.ObjectId;

  @Prop({ required: true })
  fechaInicio: Date;

  @Prop({ required: true })
  fechaFin: Date;

  @Prop({ enum: ['ACTIVO', 'FINALIZADO', 'CANCELADO'], default: 'ACTIVO' })
  estado: string;
}

export const RentSchema = SchemaFactory.createForClass(Rent);