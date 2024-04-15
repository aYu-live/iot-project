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

  @Column()
  ip: string;

  @OneToMany(() => Device, (device) => device.id)
  deviceId: number[];

  @Column()
  remark: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({ default: false })
  isDelete: boolean;
}
