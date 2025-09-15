import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SupabaseService } from 'src/supabase/supabase.service';
let us: any;

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private readonly chatService: ChatService,
    private readonly supabaseService: SupabaseService
  ){}
  
    // Validate token on connection and attach user to socket
async handleConnection(client: Socket) {
  const supabase = await this.supabaseService.getclient();

  console.log('Handshake auth:', client.handshake.auth);

  const token = client.handshake.auth?.token;
  console.log('Token received by server:', token);
  const { data, error } = await supabase.auth.getUser(token);
  console.log('Supabase user:', data, error);
  console.log("WS token received:", token);

  if (!token) {
    client.emit('error', 'no auth token');
    client.disconnect(true);
    return;
  } 

  try {
    const { data, error } = await supabase.auth.getUser(token);
    console.log("Supabase getUser result:", { data, error });

    if (error || !data?.user) {
      client.emit('error', 'Unauthorized no user');
      client.disconnect(true);
      return;
    }

    (client as any).user = data.user;
    us = data.user
    console.log('<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>', data.user)
    console.log("User attached to socket:", (client as any).user);
  } catch (err) {
    client.emit('error', 'Auth check failed');
    client.disconnect(true);
    console.error("Auth exception:", err);
  }
}
  
  handleDisconnect(client: Socket) {}

  //join course room
  @SubscribeMessage('joinCourse')
  async onJoinCourse(@MessageBody() payload: {courseId: string}, @ConnectedSocket() client: Socket){
    const user = us
    if(!user){
      client.emit('error', 'Unauthorized brother psps')
      return;
    }
    const allowed = await this.chatService.canAccess(user.id, payload.courseId);
    if(!allowed){
      client.emit('error', 'Forbidden')
      return;
    }
    client.join(payload.courseId)
    
    //send chat history

    const history = await this.chatService.getRecentMessages(payload.courseId)
    client.emit('history', history)

    //notify room

    this.server.to(payload.courseId).emit('user joined', {userId: user.id, name: user.user_metadata?.full_name ?? user.email})
  }

  //handle new message
  @SubscribeMessage('sendMessage')
  async onSendMessage(@MessageBody() payload: {courseId: string, content: string}, @ConnectedSocket() client: Socket)
  {
    const user = (client as any).user;
    if(!user){
      client.emit('error', 'Unauthorized azaz');
      return;
    }
    if(!payload?.courseId || !payload?.content){
      client.emit('error', 'invalid payload');
      return;
    }
    const allowed = await this.chatService.canAccess(user.id, payload.courseId)
    if(!allowed){
      client.emit('error','forbidden')
      return;
    }

    //save to db

    const saved = await this.chatService.saveMessage({
      courseId: payload.courseId,
      senderId: user.id,
      senderName: user.user_metadata.full_name?? user.email,
      content: payload.content
    })
    console.log("📤 Emitting newMessage to room:", payload.courseId, "with message:", saved); // 👈 ADD THIS


    //broadcast to room

    this.server.to(payload.courseId).emit('newMessage', saved)
  }
    
  
}

 