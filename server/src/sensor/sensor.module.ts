import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SensorService } from './sensor.service';
import { HttpModule } from '@nestjs/axios';
import { Sensor } from 'src/entities/sensor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorController } from './sensor.controller';
import { Device } from 'src/entities/device.entity';
import { Floor } from 'src/entities/floor.entity';
import { SensorGateway } from './sensor.gateway';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Sensor, Device, Floor]),
    HttpModule,
  ],
  controllers: [SensorController],
  providers: [SensorService, SensorGateway],
})
export class SensorModule {}
