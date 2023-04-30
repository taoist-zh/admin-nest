import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
//维修记录
@Entity('unableUse')
export class UnableUseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  deviceId: number;

  @Column({ type: 'timestamp', default: null })
  time: Date;
}
