import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import {Express} from 'express';
import { MulterModule } from '@nestjs/platform-express';
import { AuthRequest } from 'src/types/auth-request.type';

@Injectable()
export class PdfsService {
    constructor(private readonly supabaseService: SupabaseService){}
    async uploadPdf(file: Express.Multer.File, instructorId, courseId){
        const supabase = this.supabaseService.getclient()
        //check if the instructor and course match
        const {data: course} = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', instructorId)
        .eq('id', courseId)
        .single();
        if (!course) throw new UnauthorizedException('You do not own this course')
        
            //prepare filename path
        const filename = `${courseId}/${file.originalname}`

        // upload to storage
        const {error: uploadError} =await supabase.storage
        .from('pdfs')
        .upload(filename, file.buffer, {contentType: file.mimetype})
        if (uploadError) throw new Error(uploadError.message)

        const {data, error: insertError} = await supabase
        .from('pdfs')
        .insert({
            course_id: courseId,
            uploaded_by: instructorId,
            file_url: filename
        })
        .select()
        .single();
        if (insertError) throw new Error(insertError.message)
        return data;
    }

    /*async listPdfs(@Request() request: AuthRequest, @Param('course_id') courseId: string){
        if (!request.user) throw new UnauthorizedException()

    }*/
  
   
   async listPdfs(courseId: string){
    const supabase = await this.supabaseService.getclient()
    const {data, error} = await supabase
    .from('pdfs')
    .select('*')
    .eq('course_id', courseId)
    .maybeSingle()
    if (error) throw new Error(error.message) 
    return data
   }
}
