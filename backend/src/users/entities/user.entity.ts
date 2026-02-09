import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'jeremy', description: 'The username' })
  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @ApiProperty({
    example: 'Jeremy Sun',
    description: 'The nickname',
    required: false,
  })
  @Column({ nullable: true })
  nickname: string;

  @ApiProperty({
    example: '2024-02-09T12:00:00Z',
    description: 'Creation timestamp',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
