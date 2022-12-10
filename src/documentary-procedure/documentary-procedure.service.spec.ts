import { Test, TestingModule } from '@nestjs/testing';
import { DocumentaryProcedureService } from './documentary-procedure.service';

describe('DocumentaryProcedureService', () => {
  let service: DocumentaryProcedureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentaryProcedureService],
    }).compile();

    service = module.get<DocumentaryProcedureService>(DocumentaryProcedureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
