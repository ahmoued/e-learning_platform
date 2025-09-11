import { Controller, Param, UseGuards, Get, UnauthorizedException, Request, Query } from '@nestjs/common';
import { PdfdownloadService } from './pdfdownload.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/types/auth-request.type';

@Controller('download')
@UseGuards(AuthGuard)
export class PdfdownloadController {
    constructor(private readonly pdfdownloadService: PdfdownloadService){}
    @Get(':courseId')
    async getSignedUrl( @Request() request: AuthRequest, @Param('courseId') courseId: string, @Query('file_url') file_url: string,){
        //const fileUrl = `${courseId}/${filename}`
        if (!request.user) throw new UnauthorizedException
        return this.pdfdownloadService.generateSignedUrl(request.user.id, courseId, file_url)
    }

}
