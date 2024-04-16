import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Floor } from 'src/entities/floor.entity';
import { FloorService } from './floor.service';

@Controller('floor')
export class FloorController {
  constructor(private floorService: FloorService) {}

  @Get('list')
  async getFloorList(@Query() query?: Floor) {
    const [list, total] = await this.floorService.getFloorList(query);
    return { code: 200, data: { list, total } };
  }
  @Post('create')
  async updateFloorList(@Body() body: Floor[]) {
    const data = await this.floorService.createFloor(body);
    return { code: 200, data };
  }

  @Post('delete')
  async deleteFloor(@Body() body: Floor) {
    const data = await this.floorService.deleteFloor(body);
    return { code: 200, data };
  }
}
