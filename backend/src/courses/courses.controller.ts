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
    @Get('me')
    @Roles('student')
    async getmyCourses(@Request() request: AuthRequest){
         if (!request.user) throw new UnauthorizedException
         const id = request.user.id;
         return this.coursesService.getMyCourses(id)
    }
    
    
    //add a new course (instructors only)
    @Post()
    @Roles('instructor')
    async create(@Request() request: AuthRequest, @Body('title') title: string, @Body('description') description: string, @Body('maxStudents') maxStudents: string){
        if (!request.user) throw new UnauthorizedException
        return this.coursesService.create(title, request.user.id, description, maxStudents)
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
    /*@Get('/:id')
    @Roles('instructor')
    async getCourseDetails(@Request() request: AuthRequest, @Param('id') id: string){
        if (!request.user) throw new UnauthorizedException
        return this.coursesService.getCourseDetails(request.user.id, id)
    }*/

    @Get('/:id')
    @Roles('student', 'instructor')
    async CourseDetails(@Request() request: AuthRequest, @Param('id') id: string){
        if (!request.user) throw new UnauthorizedException
        return this.coursesService.getCourseDetails(request.user.id, id, request.user.role)
    }
    


}
