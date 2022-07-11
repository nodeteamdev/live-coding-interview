import PresetsService from '@components/presets/presets.service';
import IsLoggedGuard from '@guards/is-logged.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
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
import SuccessResponse from '@responses/success.response';
import CreateSessionsDto from './dto/sessions.create.dto';
import RemoveSessionsDto from './dto/sessions.remove.dto';
import SessionsService from './sessions.service';

@UseInterceptors(WrapResponseInterceptor)
@Controller('sessions')
export default class SessionsController {
  constructor(
        private readonly sessionsService: SessionsService,
        private readonly presetsService: PresetsService,
  ) {}

    @UseGuards(IsLoggedGuard)
    @Post('/create')
  async create(@Body() params: CreateSessionsDto, @Req() req: any) {
    const result = await this.sessionsService.create({
      userId: req.user?._id,
      title: params.title,
      mode: 'JavaScript',
      code: '// start coding!',
    });

    return new SuccessResponse(null, {
      url: `/sessions/${result._id}`,
    });
  }

    @UseGuards(IsLoggedGuard)
    @Post('/remove')
    async remove(@Body() params: RemoveSessionsDto) {
      const deleted = this.sessionsService.remove(params);

      return new SuccessResponse(null, deleted);
    }

    @UseGuards(IsLoggedGuard)
    @Render('editor')
    @Get('/:id')
    async editor(@Param() params: { id: string }, @Req() req: any) {
      const config = await this.sessionsService.getConfig();
      const code = await this.sessionsService.getCode(params.id);
      const presets = await this.presetsService.getPresetsByOwner(req.user._id);

      return new SuccessResponse(null, {
        ...config,
        code: code || '// function',
        name: req.user?.email,
        presets,
        userId: req.user?._id,
        appVersion: '1.0.0',
      });
    }
}
