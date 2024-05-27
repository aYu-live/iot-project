import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FloorController } from './floor.controller';
import { FloorService } from './floor.service';
import { DeviceService } from '../device/device.service';
import { Floor } from 'src/entities/floor.entity';
import { Device } from 'src/entities/device.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Floor, Device]), HttpModule],
  controllers: [FloorController],
  providers: [FloorService, DeviceService],
})
export class FloorModule {}
