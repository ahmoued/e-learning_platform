import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';


config()
@Injectable()
export class SupabaseService {
    private readonly supabaseUrl: string;
    private readonly supabaseKey: string;
    constructor(){
        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!SUPABASE_URL) throw new Error("supabase url missing");
        if (!SUPABASE_KEY) throw new Error("supabase key missing");
        this.supabaseUrl = SUPABASE_URL;
        this.supabaseKey = SUPABASE_KEY;

    }
    
    
    getclient(){
        return createClient(this.supabaseUrl, this.supabaseKey);
    }
}
