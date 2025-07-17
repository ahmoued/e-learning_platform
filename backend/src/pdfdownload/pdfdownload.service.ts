import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class PdfdownloadService {
    constructor(private readonly supabaseService: SupabaseService){}
     async isStudentEnrolled(userId: string, courseId: string){
    const supabase = await this.supabaseService.getclient()
    const {data, error} = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', userId)
    .eq('course_id', courseId)
    if (!data) return false
        return data.length>0
   }
   
   async isInstructorOfCourse(userId: string, courseId: string){
    const supabase = await this.supabaseService.getclient()
    const {data, error} = await supabase
    .from('courses')
    .select('id')
    .eq('id', courseId)
    .eq('instructor_id', userId)
    if (error) throw new Error(error.message)
        return data.length>0
   }
   async generateSignedUrl(userId: string, courseId: string, fileUrl: string){
       const isEnrolled = await this.isStudentEnrolled(userId, courseId)
        const isInstructor = await this. isInstructorOfCourse(userId, courseId)
        if (!isEnrolled && !isInstructor) throw new UnauthorizedException('you  dont have access to this course')
        const supabase = await this.supabaseService.getclient()
        const {data, error} = await supabase.storage
        .from('pdfs')
        .createSignedUrl(fileUrl, 60*60)
        if (error) throw new Error(error.message)
            return data
   }
   
}

