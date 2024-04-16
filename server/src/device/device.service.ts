import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from 'src/entities/device.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
  ) {}

  getDeviceList(params: Device) {
    return this.deviceRepository.findAndCount({
      relations: ['floor'],
      where: {
        id: params.id,
        level: params.level,
        isDelete: Not(true),
      },
      order: {
        id: 'ASC',
      },
    });
  }
  createDevice(list: Device[]) {
    return this.deviceRepository.save(list);
  }

  deleteDevice(device: Device) {
    return this.deviceRepository.update(device.id, { isDelete: true });
  }
}
