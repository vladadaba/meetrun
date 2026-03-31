import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MeetupModule } from './meetup/meetup.module';
import { EmailModule } from './email/email.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    HealthModule,
    MeetupModule,
    EmailModule,
  ],
})
export class AppModule {}
