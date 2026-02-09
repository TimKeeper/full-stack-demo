import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false }) // Don't return password by default
  password: string;

  @Column({ nullable: true })
  nickname: string;

  @CreateDateColumn()
  created_at: Date;
}
