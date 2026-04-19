import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRentDto } from './dto/create-rent.dto';
import { AlquileresService } from './rents.service';

@Controller('alquileres')
@UseGuards(JwtAuthGuard)
export class AlquileresController {
  constructor(private readonly service: AlquileresService) {}

  @Post()
  create(@Body() dto: CreateRentDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
