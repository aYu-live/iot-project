import { Controller, Get, Query } from '@nestjs/common';
import { Device } from 'src/entities/device.entity';
import { DeviceService } from './device.service';

@Controller('device')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Get('list')
  async getFloorList(@Query() query?: Device) {
    const data = this.deviceService.getDeviceList(query);
    return { code: 200, data };
  }
}
