import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'jeremy', description: 'The username of the user' })
  username: string;

  @ApiProperty({
    example: '123456',
    description: 'The password of the user',
    required: false,
  })
  password?: string;

  @ApiProperty({
    example: 'Jeremy Sun',
    description: 'The nickname of the user',
    required: false,
  })
  nickname?: string;
}
