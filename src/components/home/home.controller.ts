import {
  Controller,
  Get,
  UseGuards,
  Render,
  Res,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import {
  Response as ExpressResponse,
} from 'express';

import IsLoggedGuard from '@guards/is-logged.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import SuccessResponse from '@responses/success.response';
import UserEntity from '@components/users/entities/user.entity';
import SessionsService from '@components/sessions/sessions.service';
import { ISessionsRender } from '@components/sessions/sesssions.interfaces';

@UseInterceptors(WrapResponseInterceptor)
@Controller('Home')
export default class HomeController {
  constructor(private readonly sessionsService: SessionsService) {}

  @UseGuards(IsLoggedGuard)
  @Get('/')
  @Render('home')
  async getHome(
    @Req() req: any,
    @Res() res: ExpressResponse,
  ): Promise<SuccessResponse> {
    const sessions = await this.sessionsService.find(req.user._id);

    return new SuccessResponse(null, {
      user: req.user,
      sessions,
    } as { user: UserEntity, sessions: ISessionsRender[]});
  }
}
