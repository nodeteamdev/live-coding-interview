import {
  Body,
  Controller,
  Post,
  Get,
  Render,
  Req,
  UseGuards,
  UseInterceptors,
  Res,
  Param,
} from '@nestjs/common';
import SessionsService from '@components/sessions/sessions.service';
import SuccessResponse from '@responses/success.response';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';

@UseInterceptors(WrapResponseInterceptor)
@Controller('shared')
export default class SharedController {
  constructor(private readonly sessionsService: SessionsService) {}

    @Render('shared')
    @Get('/:id')
  async editor(@Param() params: { id: string }) {
    const config = await this.sessionsService.getConfig();
    const code = await this.sessionsService.getCode(params.id);

    return new SuccessResponse(null, {
      ...config,
      code: code || '// function',
      appVersion: '1.0.0',
    });
  }
}
