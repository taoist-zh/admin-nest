import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
//使用记录
@Entity('use')
export class UseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  deviceId: number;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', default: null })
  endTime: Date;
}
