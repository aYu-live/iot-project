import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Device } from 'src/entities/device.entity';
import { Brackets, Repository } from 'typeorm';

interface DeviceWithIPArray extends Omit<Device, 'ip'> {
  ip: string[];
}
@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    private httpService: HttpService,
  ) {}

  getDeviceList(params: DeviceWithIPArray) {
    const queryBuilder = this.deviceRepository
      .createQueryBuilder('device')
      .andWhere('device.isDelete = :isDelete', { isDelete: false });
    if (params?.ip?.length) {
      const ipConditions = params.ip.map(
        (ip) => `device.ip::text LIKE :ip${ip}`,
      );
      queryBuilder.andWhere(
        new Brackets((qb) => {
          ipConditions.forEach((condition, index) => {
            if (index === 0) {
              qb.where(condition, {
                [`ip${params.ip[index]}`]: `%${params.ip[index]}%`,
              });
            } else {
              qb.orWhere(condition, {
                [`ip${params.ip[index]}`]: `%${params.ip[index]}%`,
              });
            }
          });
        }),
      );
    }
    if (params?.level) {
      queryBuilder.andWhere('device.level = :level', { level: params.level });
    }
    queryBuilder.addOrderBy('device.id', 'ASC');
    return queryBuilder.getManyAndCount();
  }

  getDevice(params?: Partial<Device>) {
    return this.deviceRepository.findOne({
      relations: ['floor'],
      where: params,
    });
  }

  async upsertDevice(list: Device[]) {
    return this.deviceRepository.save(list);
  }

  deleteDevice(device: Device) {
    return this.deviceRepository.update(device.id, { isDelete: true });
  }

  async updateDevice(
    device: Device & { key: string; value: string },
  ): Promise<any> {
    const { ip, deviceId } = device;
    const ipStr = ip.split('.').join('/');
    const url = `http://${ip}/ctrlRequest`;
    const headersRequest = {
      accept: '*/*',
      'accept-language':
        'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6,be;q=0.5,ru;q=0.4,uk;q=0.3',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      pragma: 'no-cache',
    };

    const req =
      'requestData=' +
      encodeURIComponent(
        JSON.stringify({
          id: `${ipStr}-${deviceId}.${device.key}`,
          val: `${device.value}`,
        }),
      );
    try {
      const res = await lastValueFrom(
        this.httpService.post(url, req, {
          timeout: 10000,
          headers: headersRequest,
        }),
      );
      return res.data;
    } catch (err) {
      Logger.error(`写入接口报错: [url:${url}][err: ${err}]`);
    }
    return { result: false };
  }
}
