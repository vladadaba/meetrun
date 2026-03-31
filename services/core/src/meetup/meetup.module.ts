import { Module } from '@nestjs/common';
import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [MeetupController],
  providers: [MeetupService],
  exports: [MeetupService],
})
export class MeetupModule {}
