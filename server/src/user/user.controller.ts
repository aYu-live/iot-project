import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

type PwdType = 'super' | 'normal';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('validate')
  async validate(@Body() body: { pwd: string; type: PwdType | PwdType[] }) {
    const user = await this.userService.validate(body);
    return {
      code: 200,
      data: { passed: !!user },
    };
  }

  @Put('updateNormal')
  async updateNormal(@Body() body: { pwd: string, type }) {
    await this.userService.updateNormal(body.pwd, body.type);
    return { code: 200, data: true };
  }

  @Get('checkHasSuperAdmin')
  async checkHasSuperAdmin() {
    const user = await this.userService.findSuperAdmin();
    return {
      code: 200,
      data: { has: !!user },
    };
  }
}
