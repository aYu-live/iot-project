import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Device } from './device.entity';

@Entity('floor')
export class Floor {
  @PrimaryColumn()
  level: number;

  @Column('text', { array: true })
  ip: string[];

  @OneToMany(() => Device, (device) => device.floor)
  deviceId: Device[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({ default: false })
  isDelete: boolean;
}
