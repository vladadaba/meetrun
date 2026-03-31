import { IsString, IsDateString, IsEnum, IsOptional, IsInt, IsEmail, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MeetupCategory } from '@generated/prisma/client';

export class CreateMeetupDto {
  @ApiProperty({ example: 'Saturday Morning 5K - Ada Ciganlija' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Join us for a casual 5K around the lake!' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2024-04-06T09:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Ada Ciganlija, Belgrade' })
  @IsString()
  location: string;

  @ApiProperty({ enum: MeetupCategory, example: 'FIVE_K' })
  @IsEnum(MeetupCategory)
  category: MeetupCategory;

  @ApiProperty({ example: 'Marko Petrovic' })
  @IsString()
  submitterName: string;

  @ApiProperty({ example: 'marko@example.com' })
  @IsEmail()
  submitterEmail: string;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxParticipants?: number;
}
