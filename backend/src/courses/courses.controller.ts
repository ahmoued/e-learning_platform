import { Body, Controller, Delete, Get, Param, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CoursesService } from './courses.service';
import { AuthRequest } from 'src/types/auth-request.type';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('courses')
@UseGuards(AuthGuard, RolesGuard)
export class CoursesController {
      constructor(private readonly coursesService: CoursesService) {}

    //get all courses
    @Get()
    @Roles('student')
    async getCourses(@Request() request: AuthRequest){
        return this.coursesService.findAll();
    }
    
    
    //add a new course (instructors only)
    @Post()
    @Roles('instructor')
    async create(@Request() request: AuthRequest, @Body() title: string){
        if (!request.user) throw new UnauthorizedException
        return this.coursesService.create(title, request.user.id)
    }
    @Put(':id')
    @Roles('instructor')
    async update(@Request() request: AuthRequest, @Body() title: string, @Param('id') id: string){
        if (!request.user) throw new UnauthorizedException
        return this.coursesService.update(request.user.id, id, title)
    }
    @Delete(':id')
    @Roles('instructor')
    async delete(@Request() request: AuthRequest, @Param('id') id: string){
        if (!request.user) throw new UnauthorizedException
        return this.coursesService.delete(request.user.id, id)

    }
    @Get('mycourses')
    @Roles('instructor')
    async getInstrctorCourses(@Request() request: AuthRequest){
        if (!request.user) throw new UnauthorizedException()
        const myId = request.user.id
        return this.coursesService.findByInstructorId(myId)
    }


}
