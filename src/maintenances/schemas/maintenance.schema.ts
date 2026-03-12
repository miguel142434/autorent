import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
 
export type MaintenanceDocument = HydratedDocument<Maintenance>;
 
export enum MaintenanceType {
  PREVENTIVO = 'preventivo',
  CORRECTIVO = 'correctivo',
}
 
@Schema({ timestamps: true, collection: 'mantenimientos' })
export class Maintenance {
  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true, index: true })
  vehiculo_id: Types.ObjectId;
 
  @Prop({ required: true, enum: MaintenanceType })
  tipo: MaintenanceType;
 
  @Prop({ required: true, trim: true })
  descripcion: string;
 
  @Prop({ required: true })
  fecha: Date;
 
  @Prop({ min: 0, default: 0 })
  costo: number;
}
 
export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);