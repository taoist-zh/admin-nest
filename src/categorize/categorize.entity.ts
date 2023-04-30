import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
//设备分类实体
@Entity('categorize')
export class CategorizeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
