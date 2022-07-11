import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import SessionsService from '@components/sessions/sessions.service';
import PresetsService from '@components/presets/presets.service';
import { Types } from 'mongoose';
import PresetEntity from '@components/presets/entity/preset.entity';
import MessageDto from './dto/message.dto';
import ModeDto from './dto/mode.dto';
import JoinDto from './dto/join.dto';
import SavePresetDto from './dto/preset.dto';
import RemovePresetDto from './dto/remove-preset.dto';
import ChangeCursorsDto from './dto/change-cursors.dto';
import LoadPresetDto from './dto/load-preset.dto';

@WebSocketGateway({ transports: ['websocket', 'polling'], allowEIO3: true })
export default class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() wss: Server = new Server();

    constructor(
        private readonly sessionsService: SessionsService,
        private readonly presetsService: PresetsService,
    ) {}

    coders: any = {};

    private logger: Logger = new Logger('AppGateway');

    afterInit() {
      this.logger.log('Initialized!');
    }

    handleConnection(client: Socket) {
      return this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
      Object.keys(this.coders).forEach((key) => {
        if (this.coders[key][client.id]) {
          delete this.coders[key][client.id];

          this.wss.to(key).emit('leftRoom', { coders: this.coders[key], id: client.id });
        }
      });

      return this.logger.log(`Client disconnect: ${client.id}`);
    }

    @UsePipes(new ValidationPipe())
    @SubscribeMessage('chatToServer')
    handleMessage(client: Socket, @MessageBody() message: MessageDto) {
      this.wss.to(message.room).emit('chatToClient', message);

      this.sessionsService.updateCode(message.room, message.code);
    }

    @UsePipes(new ValidationPipe())
    @SubscribeMessage('changeMode')
    changeMode(client: Socket, @MessageBody() message: ModeDto) {
      this.sessionsService.updateMode(message.room, message.mode);
    }

    @SubscribeMessage('joinRoom')
    async handleRoomJoin(client: Socket, data: JoinDto) {
      client.join(data.room);

      this.coders[data.room] = this.coders[data.room] || {};
      this.coders[data.room][client.id] = { name: data.name };

      const code: string | undefined = await this.sessionsService.getCode(data.room);

      this.wss.to(data.room).emit('joinedRoom', { coders: this.coders[data.room], code, id: client.id });
    }

    @SubscribeMessage('loadPreset')
    async handleLoadPreset(
      client: Socket,
      data: LoadPresetDto,
    ): Promise<WsResponse<any> | undefined> {
      const preset: PresetEntity | null = await this.presetsService.getPreset(data.presetId);

      return {
        event: 'loadedPreset',
        data: {
          code: preset?.code,
        },
      };
    }

    @SubscribeMessage('savePreset')
    async handleSavingPreset(
      client: Socket,
      data: SavePresetDto,
    ): Promise<WsResponse<any> | undefined> {
      if (!data.ownerId) return undefined;

      const preset: PresetEntity = await this.presetsService.create({
        name: data.name,
        code: data.code,
        ownerId: new Types.ObjectId(data.ownerId),
      });

      return {
        event: 'savedPreset',
        data: {
          name: preset.name,
          code: preset.code,
          _id: preset._id,
        },
      };
    }

    @SubscribeMessage('removePreset')
    handleRemovingPreset(client: Socket, data: RemovePresetDto) {
      this.presetsService.removePreset(data.ownerId, data._id);
    }

    @SubscribeMessage('changeCursors')
    handleChangeCursor(client: Socket, data: ChangeCursorsDto) {
      this.wss.to(data.room).emit('changedCursors', {
        sender: data.sender,
        selections: data.selections,
      });
    }
}
