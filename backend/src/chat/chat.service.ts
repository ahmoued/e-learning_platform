import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class ChatService {
    constructor(private readonly supabaseService: SupabaseService){}

    async canAccess(userId, courseId){
        const supabase = await this.supabaseService.getclient()
        const {data, error} = await supabase
        .from('courses')
        .select('instructor_id')
        .eq('id', courseId)
        .single()
        if(data?.instructor_id === userId) return true

        const {data: enr, error: enrerror} = await supabase
        .from('enrollments')
        .select('student_id')
        .eq('student_id', userId)
        .eq('course_id', courseId)
        .limit(1)
        return !!(enr && enr.length>0)
    }

    async saveMessage(payload: {
        courseId: string;
    senderId: string;
    senderName?: string;
    content: string;
    content_type?: string;
    }){
        const supabase = await this.supabaseService.getclient()
        const {data, error} = await supabase
        .from('messages')
        .insert({
        course_id: payload.courseId,
        sender_id: payload.senderId,
        sender_name: payload.senderName ?? null,
        content: payload.content,
        content_type: payload.content_type ?? 'text',
        })
        .select()
        .single()

        if (error) throw new Error(error.message)
        return data
    }

    async getRecentMessages(courseId: string, limit=200){
        const supabase = await this.supabaseService.getclient()
        const {data, error} = await supabase
        .from('messages')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', {ascending: false})
        .limit(limit)

        if (error) throw new Error(error.message)
        return data
    }

}
