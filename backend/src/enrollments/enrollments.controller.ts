import { Controller, Post, Req, Body, Request, Get, Delete } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthRequest } from 'src/types/auth-request.type';
import { UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UnauthorizedException } from '@nestjs/common';

@Controller('enrollments')
@UseGuards(AuthGuard, RolesGuard)

export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) {}
    
    @Roles('student')
    @Post()
     
    enroll(@Request() req: AuthRequest, @Body('course_id') course_id: string) {
        if (!req.user) throw new UnauthorizedException
        const studentId = req.user.id;
        return this.enrollmentsService.enrollStudent(studentId, course_id);
    }
    @Roles('student')
    @Get()
    list(@Request() req: AuthRequest){
        if (!req.user) throw new UnauthorizedException
        const studentId = req.user.id;
        return this.enrollmentsService.ListMyEnrollments(studentId)
    }
    @Roles('instructor', 'student')
    @Delete()
    unenroll(@Request() req: AuthRequest, @Body('course_id') course_id: string, @Body('student_id') student_id: string){
        
        if (!req.user) throw new UnauthorizedException('no user found')
        

        const userId = req.user.id
        const userRole = req.user.role
        if(userRole === 'student') student_id=userId
        return this.enrollmentsService.unenroll(userRole, student_id, course_id, userId)
    }




}
