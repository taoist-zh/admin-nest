import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
//申请表实体类
@Entity('apply')
export class ApplyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  deviceId: number;

  //1.使用 2。维修 3报废
  @Column()
  applyType: number;

  @Column({ default: 1 })
  applyStatus: number;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'timestamp' })
  time: Date;
}
