import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  providers: [ChatService, ChatGateway],
  imports: [SupabaseModule],
  exports: [ChatService]
})
export class ChatModule {}
