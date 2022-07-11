import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import CreatePrsetDto from './dto/create-preset.dto';
import PresetEntity from './entity/preset.entity';
import presetsConstants from './presets.constants';

@Injectable()
export default class PresetsService {
  constructor(
        @InjectModel(presetsConstants.models.presets)
        private readonly presetsRepository: Model<PresetEntity>,
  ) {}

  async create(presetDto: CreatePrsetDto): Promise<PresetEntity> {
    return this.presetsRepository.create(presetDto);
  }

  async getPreset(id: string): Promise<PresetEntity | null> {
    return this.presetsRepository.findOne({ _id: new Types.ObjectId(id) }).exec();
  }

  async getPresetsByOwner(ownerId: Types.ObjectId): Promise<PresetEntity[]> {
    return this.presetsRepository.find({
      ownerId,
    }).exec();
  }

  async removePreset(ownerId: string, presetId: string) {
    return this.presetsRepository.deleteOne({
      ownerId: new Types.ObjectId(ownerId),
      _id: new Types.ObjectId(presetId),
    });
  }
}
