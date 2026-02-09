import { ApiProperty } from '@nestjs/swagger';

export class UserInfo {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'Admin User', required: false })
  nickname?: string;

  @ApiProperty({ example: '2026-02-09T08:00:00.000Z' })
  createdAt: Date;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({ type: UserInfo })
  user: UserInfo;
}
