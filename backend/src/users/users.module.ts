import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  controllers: [],
  providers: [UsersService],
  imports: [SupabaseModule]
})
export class UsersModule {}
