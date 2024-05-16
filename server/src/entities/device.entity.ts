import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Floor } from './floor.entity';

@Entity('device')
@Index(['deviceId', 'ip'], { unique: true })
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room: string;

  @Column()
  ip: string;

  @Column()
  deviceId: string;

  @Column({ nullable: true })
  remark: string;

  @Column() // 这个列用来存储关联的楼层ID
  level: number;

  @ManyToOne(() => Floor, (floor) => floor.deviceId)
  @JoinColumn({ name: 'level' })
  floor: Floor;

  @Column({ default: false })
  isDelete: boolean;

  @Column({ default: false })
  online: boolean;

  @Column({ comment: '设备状态反馈', default: '' })
  31001: string;

  @Column({ comment: '风机速度反馈', default: '' })
  31002: string;

  @Column({ comment: '实际温度反馈', default: '' })
  31003: string;

  @Column({ comment: '目标温度反馈', default: '' })
  31004: string;

  @Column({ comment: '门磁状态反馈', default: '' })
  31011: string;

  @Column({ comment: '制冷、制热模式', default: '' })
  40001: string;

  @Column({ comment: '温度修正', default: '' })
  40005: string;

  @Column({ comment: '制热节能模式下限值', default: '' })
  40011: string;

  @Column({ comment: '制冷节能模式上限值', default: '' })
  40012: string;

  @Column({ comment: '门磁功能', default: '' })
  40038: string;

  @Column({ comment: '设备状态设定', default: '' })
  40101: string;

  @Column({ comment: '风机速度设定', default: '' })
  40102: string;

  @Column({ comment: '目标温度设定', default: '' })
  40103: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
