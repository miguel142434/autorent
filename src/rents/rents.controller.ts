import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateRentDto } from './dto/create-rent.dto';
import { AlquileresService } from './rents.service';
import { FinalizeRentDto } from './dto/finalize-rent.dto';

@Controller('alquileres')
export class AlquileresController {
  constructor(private readonly service: AlquileresService) {}

  @Post()
  create(@Body() dto: CreateRentDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id/finalizar')
  finalize(@Param('id') id: string, @Body() dto: FinalizeRentDto) {
    return this.service.finalize(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
