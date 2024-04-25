import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sensor')
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  ip: string;

  @Index()
  @Column()
  deviceId: string;

  @Index()
  @Column()
  attr: string;

  @Column()
  val: string;

  @Column()
  timestamp: number;

  @CreateDateColumn()
  createAt: Date;
}
