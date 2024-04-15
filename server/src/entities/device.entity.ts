import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Floor } from './floor.entity';

@Entity('device')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  temperature: string;

  @ManyToOne(() => Floor, (floor) => floor.level)
  floorLevel: number;
}
