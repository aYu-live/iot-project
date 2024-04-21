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
  async getDeviceList(@Query() query) {
    const [list, total] = await this.deviceService.getDeviceList(query);
    return { code: 200, data: { list, total } };
  }

  @Post('create')
  async updateFloorList(@Body() body: Device[]) {
    const list = [];
    for (const data of body) {
      const found = await this.deviceService.getDevice({
        ip: data.ip,
        deviceId: data.deviceId,
        isDelete: false,
      });
      if (found) {
        // 如果找到IP和deviceId匹配的现存记录, 更新它
        await this.deviceService.upsertDevice([{ ...found, ...data }]);
      } else {
        // 否则创建新记录，并可能需要关联 floor 实体
        const floor = await this.floorService.getFloor({
          level: data.level,
        });
        if (floor) {
          data.floor = floor;
        }
        list.push(await this.deviceService.upsertDevice([data]));
      }
    }
    return { code: 200, data: list };
  }

  @Post('delete')
  async deleteFloor(@Body() body: Device) {
    const data = await this.deviceService.deleteDevice(body);
    return { code: 200, data };
  }
}
