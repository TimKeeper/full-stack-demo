import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      username: createUserDto.username,
      nickname: createUserDto.nickname,
    });
    user.password = String(hashedPassword);
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'nickname', 'createdAt'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateData = { ...updateUserDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return this.usersRepository.update(id, updateData);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
