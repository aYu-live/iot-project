import { Body, Controller, Post, Put } from '@nestjs/common';
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
      data: { passed: user?.id !== undefined && user?.id !== null },
    };
  }

  @Put('updateNormal')
  async updateNormal(@Body() body: { pwd: string }) {
    await this.userService.updateNormal(body.pwd);
    return { code: 200, data: true };
  }
}
