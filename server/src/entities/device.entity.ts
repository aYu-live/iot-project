import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Floor } from './floor.entity';

@Entity('device')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room: string;

  @Column()
  DADR: string;

  @Column()
  localAddress: string;

  @Column({ nullable: true })
  remark: string;

  @Column() // 这个列用来存储关联的用户ID
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
