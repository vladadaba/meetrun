import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { ReviewMeetupDto, ReviewAction } from './dto/review-meetup.dto';
import { MeetupStatus, MeetupCategory } from '@generated/prisma/client';

@Injectable()
export class MeetupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateMeetupDto) {
    return this.prisma.meetup.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
    });
  }

  async findApproved(category?: string) {
    return this.prisma.meetup.findMany({
      where: {
        status: MeetupStatus.APPROVED,
        date: { gte: new Date() },
        ...(category && { category: category as MeetupCategory }),
      },
      orderBy: { date: 'asc' },
    });
  }

  async findPending() {
    return this.prisma.meetup.findMany({
      where: { status: MeetupStatus.PENDING_REVIEW },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const meetup = await this.prisma.meetup.findUnique({ where: { id } });
    if (!meetup) throw new NotFoundException('Meetup not found');
    return meetup;
  }

  async review(id: string, dto: ReviewMeetupDto) {
    const meetup = await this.findOne(id);

    const status = dto.action === ReviewAction.APPROVE
      ? MeetupStatus.APPROVED
      : MeetupStatus.REJECTED;

    const updated = await this.prisma.meetup.update({
      where: { id },
      data: {
        status,
        reviewNote: dto.note,
        reviewedAt: new Date(),
      },
    });

    if (status === MeetupStatus.APPROVED) {
      await this.emailService.sendMeetupApproved(
        meetup.submitterEmail,
        meetup.submitterName,
        meetup.title,
      );
    }

    return updated;
  }
}
