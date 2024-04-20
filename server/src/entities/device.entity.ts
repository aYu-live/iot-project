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

  @Column()
  DADR: string;

  @Column()
  localAddress: string;

  @Column({ nullable: true })
  remark: string;

  @Column() // 这个列用来存储关联的楼层ID
  level: number;

  @ManyToOne(() => Floor, (floor) => floor.deviceId)
  @JoinColumn({ name: 'level' })
  floor: Floor;

  @Column({ default: false })
  isDelete: boolean;

  @Column({ nullable: true })
  temperature: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
