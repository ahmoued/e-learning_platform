import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Controller('test')
export class TestController {
    constructor(private readonly supabaseService: SupabaseService){}
    @Get('users')
    async getUsers(){
        const {data, error} = await this.supabaseService.getclient()
        .from('users')
        .select('*');
        if (error) return {error}
        return {data};
    }
}
