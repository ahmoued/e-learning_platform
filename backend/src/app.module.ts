import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseService } from './supabase/supabase.service';
import { SupabaseModule } from './supabase/supabase.module';
import { TestController } from './test/test.controller';
import { ProfileController } from './profile/profile.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { CoursesModule } from './courses/courses.module';
import { PdfsService } from './pdfs/pdfs.service';
import { PdfsController } from './pdfs/pdfs.controller';
import { PdfsModule } from './pdfs/pdfs.module';
import { MulterModule } from '@nestjs/platform-express';
import { PdfdownloadService } from './pdfdownload/pdfdownload.service';
import { PdfdownloadController } from './pdfdownload/pdfdownload.controller';
import { PdfdownloadModule } from './pdfdownload/pdfdownload.module';
import { EnrollmentsService } from './enrollments/enrollments.service';
import { EnrollmentsController } from './enrollments/enrollments.controller';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [SupabaseModule, UsersModule, CoursesModule, PdfsModule, MulterModule, PdfdownloadModule, EnrollmentsModule, ChatModule],
  controllers: [AppController, TestController, ProfileController, PdfsController, PdfdownloadController, EnrollmentsController],
  providers: [AppService, UsersService, PdfsService, PdfdownloadService, EnrollmentsService],
})
export class AppModule {}
