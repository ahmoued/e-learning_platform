import { Get, Injectable, Post } from '@nestjs/common';
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
        return data;
    }
    //get some instructor's courses
    
    async findByInstructorId(instructorId: string){
        const supabase = await this.supabaseService.getclient();
        const {data, error} = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', instructorId);
        if (error) throw new Error(error.message);
        return data;
      

        

    }
    // create a new course (instructors only)
    
    async create(title: string, instructorId: string){
        const supabase =await this.supabaseService.getclient();
        const {data, error} = await supabase
        .from('courses')
        .insert({title:title, instructor_id: instructorId})
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
        return data?.[0]
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
}
