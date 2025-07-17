import { Controller, Get, Req, UseGuards} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/types/auth-request.type';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
    @Get()
    getProfile(@Req() request: AuthRequest){
        return request.user
    }
}
