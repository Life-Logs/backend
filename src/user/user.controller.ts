import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserDto } from './user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '유저 생성' })
  @ApiOkResponse({ description: '유저 생성 성공', type: User })
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Get()
  @ApiOperation({ summary: '모든 유저 조회' })
  @ApiOkResponse({ description: '모든 유저 조회 성공', type: [UserDto] })
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('/:id')
  @ApiOperation({ summary: '유저 조회' })
  @ApiParam({ name: 'id', required: true })
  getUser(@Param('id') id: number) {
    return this.userService.getUser(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: '유저 업데이트' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: '유저 업데이트 성공', type: [UpdateUserDto] })
  updateUser(@Param('id') id: number, @Body() user: UpdateUserDto) {
    return this.userService.updateUser(id, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '유저 삭제' })
  @ApiParam({ name: 'id', required: true })
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
