import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'jeremy',
    description: 'Username for authentication',
  })
  username: string;

  @ApiProperty({
    example: '123456',
    description: 'Password for authentication',
  })
  password: string;
}
