import { JwtAuthGuard } from './../common/guards/jwt-auth.guard';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from '../common/guards/role.guard';
import { GetUser, Roles } from '../common/decorators';
import { Account, AccountType } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto, UserPaginationDto } from './dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from './types';
import { BaseController } from 'src/common/base/base.controller';

@Controller('users')
@ApiTags('USERS')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AccountType.ROOT, AccountType.ADMIN)
export class UsersController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Post()
  create(@User() admin: UserType, @Body() createUserDto: CreateUserDto) {
    const event = this.actionQueue.createEvent(() =>
      this.usersService.create(admin, createUserDto),
    );
    this.actionQueue.push(event);
    return this.actionQueue.wait(event.rqid);
  }

  @Patch(':staffCode')
  update(
    @User() admin: UserType,
    @Param('staffCode') userStaffCode: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(admin, userStaffCode, updateUserDto);
  }

  @Get()
  async getUsers(
    @GetUser('username') username: string,
    @User() admin: UserType,
    @Query() dto: UserPaginationDto,
  ) {
    return this.usersService.selectMany(username, admin, dto);
  }

  @Get(':staffCode')
  async getUser(
    @Param('staffCode') staffCode: string,
    @User() user: Partial<Account>,
  ) {
    return this.usersService.selectOne(staffCode, user);
  }

  @Delete(':staffCode')
  async disabledUser(
    @User() admin: UserType,
    @Param('staffCode') userStaffCode: string,
  ) {
    return this.usersService.disable(admin, userStaffCode);
  }
}
