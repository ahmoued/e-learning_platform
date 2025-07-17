import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
     constructor (private readonly supabaseService: SupabaseService){}
  async getUserById(supabaseId: string){
    const supabase= this.supabaseService.getclient()
    const {data, error} = await supabase
    .from('users')
    .select('*')
    .eq('id', supabaseId)
    .single();
    if (error || !data) return null;
    return data; 
  }
}


