import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from 'src/entities/device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
  ) {}

  getDeviceList(params: Device) {
    return this.deviceRepository.findAndCountBy({
      id: params.id,
    });
  }
}
