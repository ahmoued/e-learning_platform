import { Test, TestingModule } from '@nestjs/testing';
import { PdfdownloadController } from './pdfdownload.controller';

describe('PdfdownloadController', () => {
  let controller: PdfdownloadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfdownloadController],
    }).compile();

    controller = module.get<PdfdownloadController>(PdfdownloadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
