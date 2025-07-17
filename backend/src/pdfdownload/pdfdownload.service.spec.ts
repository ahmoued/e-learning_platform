import { Test, TestingModule } from '@nestjs/testing';
import { PdfdownloadService } from './pdfdownload.service';

describe('PdfdownloadService', () => {
  let service: PdfdownloadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfdownloadService],
    }).compile();

    service = module.get<PdfdownloadService>(PdfdownloadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
