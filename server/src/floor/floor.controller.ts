import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
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

  @Get('menu/list')
  async getMenuList() {
    const [list, total] = await this.floorService.getMenuList();
    return { code: 200, data: { list, total } };
  }
  @Get('info')
  async getFloor(@Query() query?: { level: number }) {
    const data = await this.floorService.getFloor({
      level: Number(query?.level),
    });

    return { code: 200, data };
  }

  @Get('ip/list')
  async getIpList(@Query() query?: Floor) {
    const data = await this.floorService.getIpList(query);
    return { code: 200, data };
  }

  @Post('create')
  async updateFloorList(@Body() body: Floor[]) {
    const data = await this.floorService.createFloor(body);
    return { code: 200, data };
  }

  @Post('delete')
  async deleteFloor(@Body() body: Floor | number[]) {
    const data = await this.floorService.deleteFloor(body);
    return { code: 200, data };
  }

  @Put('rename')
  async renameFloor(@Body() body: Floor) {
    const data = await this.floorService.renameFloor(body);
    return { code: 200, data };
  }
}
