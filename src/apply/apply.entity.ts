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

  @Column()
  applyType: number;

  @Column({ default: 1 })
  applyStatus: number;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'timestamp' })
  time: Date;
}
