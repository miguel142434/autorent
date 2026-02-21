import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { CreateRentDto } from "./dto/create-rent.dto";
import { AlquileresService } from "./rents.service";

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

}