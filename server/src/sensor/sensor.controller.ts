import { Controller, Get, Query } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller('sensor')
export class SensorController {
  constructor(private sensorService: SensorService) {}

  @Get('list')
  async getSensorList(@Query() query?: any) {
    const data = await this.sensorService.getSensor(query);
    return { code: 200, data };
  }
}
