import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class EnrollmentsService {
    constructor(private readonly supabaseService: SupabaseService){}
    async enrollStudent(studentId: string, courseId: string){
        const supabase = await this.supabaseService.getclient();
        const {data, error} = await supabase
        .from('enrollments')
        .insert({
            course_id: courseId,
            student_id: studentId
        })
        .select();
        if (error) throw new Error(error.message);
        const {data: course, error: courseError} = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single()
        if(courseError) throw new Error(courseError.message)
        
        return course;
    }

    async ListMyEnrollments(studentId: string){
        const supabase = await this.supabaseService.getclient();
        const {data, error} = await supabase
        .from('enrollments')
        .select('*')
        .eq('student_id', studentId);
        if (error) throw new Error(error.message);
        return data;
        
    }


  async unenroll(userRole: string, studentId: string, courseId: string, userId: string) {
  const supabase = await this.supabaseService.getclient();
  
  if (userRole === 'instructor')
    {

  // 1. Check if the course exists and belongs to the instructor
  
  const { data: courseData, error: courseError } = await supabase
    .from("courses")
    .select("instructor_id")
    .eq("id", courseId)
    .single();

  if (courseError) throw new Error(courseError.message);
  if (!courseData) throw new Error("Course not found");

  if (courseData.instructor_id !== userId) {
    throw new Error("Forbidden: you do not own this course");
  }
    } else if (userRole === 'student'){
      //checking that the student is trying to unenroll himself
      if (userId !== studentId) throw new UnauthorizedException("you can only unenroll yourself")
    }

  // 2. Delete enrollment
  const { data, error } = await supabase
    .from("enrollments")
    .delete()
    .eq("course_id", courseId)
    .eq("student_id", studentId)
    .select("*"); // <-- ensures deleted row is returned

  if (error) throw new Error(error.message);

  if (!data || data.length === 0) {
    throw new Error("Enrollment not found");
  }

  return data[0]; // deleted row
}

}
