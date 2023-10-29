import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  createUser(@Body() user: User) {
    return this.userService.createUser(user);
  }

  @Get('/all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('/:email')
  getUser(@Param('email') email: string) {
    return this.userService.getUser(email);
  }

  @Put('/update/:email')
  updateUser(@Param('email') email: string, @Body() user: User) {
    return this.userService.updateUser(email, user);
  }

  @Delete('/delete/:email')
  deleteUser(@Param('email') email: string) {
    return this.userService.deleteUser(email);
  }
}
