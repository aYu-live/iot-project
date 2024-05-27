import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeviceController } from './device.controller';
import { Floor } from 'src/entities/floor.entity';
import { Device } from 'src/entities/device.entity';
import { DeviceService } from './device.service';
import { FloorService } from 'src/floor/floor.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Floor, Device]), HttpModule],
  controllers: [DeviceController],
  providers: [DeviceService, FloorService],
})
export class DeviceModule {}
