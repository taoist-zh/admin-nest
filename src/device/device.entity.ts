import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
//设备实体
@Entity('device')
export class DeviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  deviceNumber: string;

  @Column({ default: '' })
  imgUrl: string;

  @Column({ default: '0' })
  status: string;

  @Column({ default: null })
  categorizeId: number;

  @Column({ default: '' })
  description: string;

  @Column({ default: '{}' })
  attr: string;
}
