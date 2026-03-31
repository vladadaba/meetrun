import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MeetupService } from './meetup.service';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { ReviewMeetupDto } from './dto/review-meetup.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('meetups')
@Controller('meetups')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new meetup (no auth required)' })
  create(@Body() dto: CreateMeetupDto) {
    return this.meetupService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List approved meetups (public)' })
  findApproved(@Query('category') category?: string) {
    return this.meetupService.findApproved(category);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List pending meetups (admin only)' })
  findPending() {
    return this.meetupService.findPending();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meetup by ID' })
  findOne(@Param('id') id: string) {
    return this.meetupService.findOne(id);
  }

  @Patch(':id/review')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve or reject a meetup (admin only)' })
  review(@Param('id') id: string, @Body() dto: ReviewMeetupDto) {
    return this.meetupService.review(id, dto);
  }
}
