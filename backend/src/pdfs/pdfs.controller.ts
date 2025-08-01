import { Body, Controller,Param, Post, Get, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors, Delete } from '@nestjs/common';
import { PdfsService } from './pdfs.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthRequest } from 'src/types/auth-request.type';
import { MulterModule } from '@nestjs/platform-express';

@Controller('pdfs')
@UseGuards(AuthGuard, RolesGuard)
export class PdfsController {
    constructor(private readonly pdfsserive: PdfsService){}
    @Roles('instructor')
    @Delete(':id')
    async deletePdf(@Request() request: AuthRequest, @Param('id') pdfId: string){
        if (!request.user) throw new UnauthorizedException('Who are you');
        return this.pdfsserive.deletePdf(request.user.id, pdfId)
    }
    @Roles('instructor')
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadPdf(@UploadedFile() file : Express.Multer.File, @Body('course_id') courseId: string, @Request() request: AuthRequest ){
        if (!request.user) throw new UnauthorizedException(); 
        return this.pdfsserive.uploadPdf(file, request.user.id, courseId)
    }
    @Get(':id')
    async listPdfs(@Request() request: AuthRequest, @Param('id') id: string){
        if (!request.user) throw new UnauthorizedException()
        return this.pdfsserive.listPdfs(id);
    }
    
}
