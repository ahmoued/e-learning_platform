import { Module } from '@nestjs/common';
import { PdfsController } from './pdfs.controller';
import { PdfsService } from './pdfs.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UsersService } from 'src/users/users.service';

@Module({
    controllers: [PdfsController],
    providers:[PdfsService, SupabaseService, UsersService]
})
export class PdfsModule {}
