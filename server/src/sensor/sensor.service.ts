// currency-rate.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Device } from 'src/entities/device.entity';
import { Floor } from 'src/entities/floor.entity';
import { SensorGateway } from './sensor.gateway';

const apiUrl = (ip: string) => `http://${ip}/API/V2/real`;

@Injectable()
export class SensorService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Sensor)
    private sensorRepository: Repository<Sensor>,

    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,

    @InjectRepository(Floor)
    private floorRepository: Repository<Floor>,

    private sensorGateway: SensorGateway,
  ) {}

  // 每半分钟执行一次的定时任务
  @Cron(CronExpression.EVERY_SECOND)
  async handleCron() {
    const list = await this.floorRepository.find({
      where: {
        isDelete: false,
      },
    });
    if (!list?.length) return;
    const allIps = list.map((item) => item.ip).flat();
    if (!allIps?.length) return;
    const uniqueIps = [...new Set(allIps)];
    if (!uniqueIps?.length) return;
    uniqueIps.forEach(async (item) => {
      const data = await this.requestData(item);
      if (!data?.length) return;
      const newData = [];
      for (const item of data) {
        const { ip, attr, deviceId, val } = item;
        const device = await this.deviceRepository.findOneBy({
          ip,
          deviceId,
        });
        if (device?.id && (device[attr] !== val || !device.online)) {
          await this.deviceRepository.save({
            ...device,
            [attr]: val,
            online: true,
          });
        }
        const sensor = await this.sensorRepository.find({
          where: {
            ip,
            attr,
            deviceId,
          },
          order: {
            createAt: 'DESC',
          },
        });

        if (sensor?.[0]?.val !== val) {
          newData.push({
            ...item,
          });
        }
      }
      if (newData?.length) {
        this.sensorGateway.broadcastMessage('updateDevices', newData);
        await this.sensorRepository.save(newData);
      }
    });
  }

  // 请求实时数据
  private async requestData(ip: string): Promise<Sensor[]> {
    let data = [];
    try {
      const response = await lastValueFrom(
        this.httpService.get(apiUrl(ip), { timeout: 3000 }),
      );
      data = response?.data?.val || [];
    } catch (err) {
      // Logger.error(`请求接口报错: [url:${apiUrl(ip)}][err: ${err}]`);
    }
    if (!data?.length) return [];
    const res = [];
    for (let i = 0; i < data.length; i++) {
      const { id, status, timestamp, val } = data[i];
      if (status === 'Good') {
        try {
          const [ipWithSlashes, rest] = id?.split?.('-');
          if (!ipWithSlashes) continue;
          const ip = ipWithSlashes.replace(/\//g, '.');
          if (!rest) continue;
          const [deviceId, attr] = rest?.split?.('.');
          if (!(deviceId && attr)) continue;
          res.push({
            ip,
            deviceId,
            attr,
            val,
            timestamp,
          });
        } catch (err) {
          Logger.error('遍历数据报错' + err);
          continue;
        }
      }
    }
    return res;
  }

  async getSensor(query: Partial<Sensor>) {
    const { ip, deviceId, attr } = query;
    return this.sensorRepository.find({
      where: {
        ip,
        deviceId,
        attr,
      },
      order: {
        createAt: 'DESC',
      },
    });
  }
}
