import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UsersService } from 'src/users/users.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  providers: [CoursesService, SupabaseService, UsersService],
  controllers: [CoursesController],
  imports: [SupabaseModule]
})
export class CoursesModule {}
