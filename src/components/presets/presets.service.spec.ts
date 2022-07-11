import { Test, TestingModule } from '@nestjs/testing';
import PresetsService from './presets.service';

describe('PresetsService', () => {
  let service: PresetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PresetsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PresetsService>(PresetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
