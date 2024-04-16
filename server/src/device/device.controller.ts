import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Device } from 'src/entities/device.entity';
import { DeviceService } from './device.service';
import { FloorService } from '../floor/floor.service';

@Controller('device')
export class DeviceController {
  constructor(
    private deviceService: DeviceService,
    private floorService: FloorService,
  ) {}

  @Get('list')
  async getDeviceList(@Query() query?: Device) {
    const data = this.deviceService.getDeviceList(query);
    return { code: 200, data };
  }

  @Post('create')
  async updateFloorList(@Body() body: Device[]) {
    const [floorList] = await this.floorService.getFloorList();
    console.log(floorList)

    const list = body.map((item) => {
      return {
        ...item,
        floor: floorList.find((floor) => floor.level === item.level),
      };
    });
    console.log(list)
    const data = await this.deviceService.createDevice(list);
    return { code: 200, data };
  }

  @Post('delete')
  async deleteFloor(@Body() body: Device) {
    const data = await this.deviceService.deleteDevice(body);
    return { code: 200, data };
  }
}
