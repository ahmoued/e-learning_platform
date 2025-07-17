import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor( private readonly supabaseService: SupabaseService,
                private readonly usersService: UsersService
  ){}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token=authHeader.split(' ')[1];
    const supabase=this.supabaseService.getclient();
    const {data, error} = await supabase.auth.getUser(token)

    if (error || !data?.user) throw new UnauthorizedException("invalid or expired token");

    const dbuser=  await this.usersService.getUserById(data.user.id)
    if (!dbuser) return false

    request.user = {
      id: data.user.id,
      email: data.user.email,
      role: dbuser.role
    }
    return true;

  }
}
