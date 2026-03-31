import { Injectable, OnModuleInit, UnauthorizedException, ForbiddenException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const adminEmail = this.config.get<string>('ADMIN_EMAIL');
    const adminPassword = this.config.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) return;

    const count = await this.prisma.admin.count();
    if (count > 0) return;

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await this.prisma.admin.create({
      data: {
        email: adminEmail,
        name: 'Admin',
        hashedPassword,
        role: 'SUPERADMIN',
        mustChangePassword: true,
      },
    });
    this.logger.log(`Created initial superadmin: ${adminEmail}`);
  }

  async login(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, admin.hashedPassword);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    return {
      accessToken: token,
      mustChangePassword: admin.mustChangePassword,
      role: admin.role,
    };
  }

  async changePassword(adminId: string, currentPassword: string, newPassword: string) {
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) throw new UnauthorizedException('Admin not found');

    const valid = await bcrypt.compare(currentPassword, admin.hashedPassword);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.admin.update({
      where: { id: adminId },
      data: { hashedPassword, mustChangePassword: false },
    });

    return { message: 'Password changed successfully' };
  }

  async createAdmin(creatorRole: string, email: string, name: string, password: string) {
    if (creatorRole !== 'SUPERADMIN') {
      throw new ForbiddenException('Only superadmins can create admins');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await this.prisma.admin.create({
      data: { email, name, hashedPassword, mustChangePassword: true },
    });

    return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
  }
}
