import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

export let service: AuthService;
export let mockPrismaService: PrismaService;
export let mockJwtService: JwtService;

export const setupTestModule = async () => {
  mockPrismaService = {
    account: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  } as any;

  // mocking the jwtService
  mockJwtService = {
    signAsync: jest.fn().mockImplementation(() => 'mocked.token'),
    verify: jest.fn(),
  } as any;

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AuthService,
      { provide: PrismaService, useValue: mockPrismaService },
      { provide: JwtService, useValue: mockJwtService },
      ConfigService,
    ],
  }).compile();

  service = module.get<AuthService>(AuthService);
};