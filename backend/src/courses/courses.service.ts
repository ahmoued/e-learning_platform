import { Get, Injectable, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class CoursesService {
    constructor (private readonly supabaseService: SupabaseService){}
    //get all courses
    async findAll(){
        const supabase = await this.supabaseService.getclient()
        const {data, error}= await supabase
        .from('courses')
        .select('*');
        if (error) throw new Error(error.message);
        const courseswithcount = await Promise.all(
    (data ?? []).map(async (course) => ({
        ...course,
        enrolled: await this.getEnrolledCount(course.id)
    }))
);
return courseswithcount; 
    }
    async getMyCourses(studentId: string){
        const supabase = await this.supabaseService.getclient();
        const {data: enr, error: er} = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', studentId)
        if (er) throw new Error(er.message)
        if(!enr || enr.length ===0) return []
        const courseIds = enr.map(e=>e.course_id)
        
        const {data, error} = await supabase
        .from('courses')
        .select('*')
        .in('id', courseIds)
        if(error) throw new Error(error.message)
            const coursesWithCount = await Promise.all(
        (data ?? []).map(async (course) => ({
            ...course,
            enrolled: await this.getEnrolledCount(course.id)
        })))
        return coursesWithCount
    }
    



    //get some instructor's courses
    
    async findByInstructorId(instructorId: string){
        const supabase = await this.supabaseService.getclient();
        const {data, error} = await supabase
        .from('courses')
        .select('*') 
        .eq('instructor_id', instructorId);
        if (error) throw new Error(error.message);
        const IDs = data.map(course => course.id)
        const {data: enrollments, error: enrollmentsError} = await supabase
        .from('enrollments')
        .select('student_id')
        .in('course_id', IDs);
        if (enrollmentsError) throw new Error(enrollmentsError.message)
        const reducesIds = [...new Set((enrollments ?? []).map(e => e.student_id))];

        const courseswithcount = await Promise.all(
        (data ?? []).map(async (course) => ({
        ...course,
        enrolled: await this.getEnrolledCount(course.id)
        }))
        );
        console.log(IDs)

        return {
            courses: courseswithcount,
            total_students: reducesIds.length};
        
      
 
        

    }
    // create a new course (instructors only)
    
    async create(title: string, instructorId: string, description: string, maxStudents: string){
        const supabase =await this.supabaseService.getclient();
        const {data, error} = await supabase
        .from('courses')
        .insert({title:title, instructor_id: instructorId, description: description, maxStudents: maxStudents})
        .select();
        if(error) throw new Error(error.message);
        return data[0]
    }
    //update a course
    async update(instructorId: string, courseId: string, title: string){
        const supabase=await this.supabaseService.getclient()
        const {data, error} = await supabase
        .from('courses')
        .update({title:title})
        .eq('instructor_id', instructorId)
        .eq('id', courseId)
        .select();
        if (error) throw new Error(error.message);
const courseswithcount = await Promise.all(
    (data ?? []).map(async (course) => ({
        ...course,
        enrolled: await this.getEnrolledCount(course.id)
    }))
);
return courseswithcount;
    }
    //delete a course
    async delete(instructorId: string, courseId: string){
        const supabase=await this.supabaseService.getclient()
        const {data, error} = await supabase
        .from('courses')
        .delete()
        .eq('instructor_id', instructorId)
        .eq('id', courseId)
        if (error) throw new Error(error.message)
    }
    
    async getEnrolledCount(courseId: string ){
        const supabase = await this.supabaseService.getclient();
        const {data, error} = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', courseId)
        if (error) throw new Error(error.message)
        return data?.length ?? 0;
        }
    /*async getCourseDetails(instructorId: string, courseId: string){ 
        const supabase = await this.supabaseService.getclient();
        const {data: coursedata, error: dataerror} = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId) 
        .single();
        
        if (dataerror) throw new Error(dataerror.message)
        if (!coursedata) throw new NotFoundException('course not found')
        
        if (coursedata.instructor_id !== instructorId) throw new UnauthorizedException()
        
        const {data: enroldata, error: enrolerror} = await supabase
        .from('enrollments')
        .select('student_id')
        .eq('course_id', courseId)
        if (enrolerror) throw new Error(enrolerror.message) 
        if (!enroldata || enroldata.length === 0) return { ...coursedata, students: [] };
        const IDS = enroldata.map(student =>student.student_id)
        

        const {data: studentdata, error: studenterror} = await supabase
        .from('users')
        .select('id, name')
        .in('id', IDS)
        if (studenterror) throw new Error(studenterror.message)
        

        
        const enrollments =(studentdata ?? []).map(student=> student.name)
        return {...coursedata, students: enrollments}
        
    }*/
   async getCourseDetails(userId: string, courseId: string, userRole: string) {
    const supabase = await this.supabaseService.getclient();

    // 1. Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    if (courseError) throw new Error(courseError.message);
    if (!course) throw new NotFoundException('Course not found');
    const instructor = course.instructor_id

    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('student_id')
      .eq('course_id', courseId);
      if (enrollmentsError) throw new Error(enrollmentsError.message);

    const { data: instructorofcourse, error: nameError } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', instructor)
    .single();
    if(nameError) throw new Error(nameError.message)
    const instructor_name = instructorofcourse.full_name
    
    
    // 4. Get student details
    const studentIds = (enrollments ?? []).map(e => e.student_id);
    if (userRole === 'student'){
    
    const isEnrolled = studentIds.some(id => id===userId)
        return {
            ...course,
            instructor_name: instructor_name,
            enrolledCount: studentIds.length,
            isEnrolled,
        }
    }
    let students: { full_name: any }[] = [];
    if (studentIds.length > 0) {
      const { data: studentData, error: studentError } = await supabase
        .from('users')
        .select('full_name, id, created_at')
        .in('id', studentIds);
      if (studentError) throw new Error(studentError.message);
      students = studentData ?? [];
      //if (students.length !== 0){
        //students = students.map(student => student.full_name)
      //} 
    }

    // 5. Return course details with students
    return {
      ...course,
      instructor_name: instructor_name,
      students,
      enrolledCount: studentIds.length,
    };
  }

/*async CourseDetails(instructorId: string, courseId: string) {
    const supabase = await this.supabaseService.getclient();

    // 1. Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    if (courseError) throw new Error(courseError.message);
    if (!course) throw new NotFoundException('Course not found');

    // 2. Check instructor ownership
    //if (course.instructor_id !== instructorId) throw new UnauthorizedException();

    // 3. Get enrollments for this course


        const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('student_id')
      .eq('course_id', courseId);
      if (enrollmentsError) throw new Error(enrollmentsError.message);
      const en = enrollments.map(e=>e.student_id)
      const enrol = [...new Set(enrollments)]

    // 5. Return course details with students
    return {
      ...course,
      
      enrolledCount: enrol.length,
    };
  }
*/
}
