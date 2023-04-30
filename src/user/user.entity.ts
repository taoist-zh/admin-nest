import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { IsEmail, IsPhoneNumber } from 'class-validator';
//加密算法
import * as argon2 from 'argon2';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ default: '' })
  // @IsEmail()
  email: string;

  @Column({ default: '' })
  avatar: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  // @IsPhoneNumber()
  phone: number;

  @Column({ default: '' })
  remember_token: string;

  @Column({ default: 'student' })
  role: string;
  user: any;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
