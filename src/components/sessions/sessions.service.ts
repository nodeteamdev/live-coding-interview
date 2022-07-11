import { Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import SessionsDto from './dto/sessions.dto';
import RemoveSessionsDto from './dto/sessions.remove.dto';
import SessionEntity from './entities/sessions.entites';
import sessionsConstants from './sessions.constants';
import { IConfig, ISessionsRender } from './sesssions.interfaces';

@Injectable()
export default class SessionsService {
  constructor(
        @InjectModel(sessionsConstants.models.sessions)
        private readonly usersRepository: Model<SessionEntity>,
  ) {}

  create(data: SessionsDto) {
    return this.usersRepository.create(data);
  }

  remove(data: RemoveSessionsDto): Promise<any | undefined> {
    const _ids: Types.ObjectId[] = data.ids.map((id) => new Types.ObjectId(id));

    return this.usersRepository.deleteMany({
      _id: {
        $in: _ids,
      },
    }).exec();
  }

  private format(sessions: SessionEntity[]): ISessionsRender[] {
    const map = sessions.map((session) => ({
      _id: session._id,
      title: session.title,
      mode: session.mode,
      code: session.code,
      date: new Date(session.createdAt).toLocaleDateString(),
    }));

    return map;
  }

  async find(userId: string): Promise<ISessionsRender[]> {
    const sessions = await this.usersRepository.find({
      userId,
    }).exec();

    return this.format(sessions);
  }

  async getCode(sessionId: string): Promise<string | undefined> {
    const session = await this.usersRepository.findOne({
      _id: new Types.ObjectId(sessionId),
    }).exec();

    return session?.code;
  }

  async updateCode(sessionId: string, code: string): Promise<any | undefined> {
    return this.usersRepository.updateOne({
      _id: new Types.ObjectId(sessionId),
    }, {
      $set: {
        code,
      },
    }).exec();
  }

  async updateMode(sessionId: string, mode: string): Promise<any | undefined> {
    return this.usersRepository.updateOne({
      _id: new Types.ObjectId(sessionId),
    }, {
      $set: {
        mode,
      },
    }).exec();
  }

  async getConfig(): Promise<IConfig> {
    return {
      themes: sessionsConstants.themes,
      language: sessionsConstants.languages,
    };
  }
}
