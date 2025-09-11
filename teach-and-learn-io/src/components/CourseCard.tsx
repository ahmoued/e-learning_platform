import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen } from "lucide-react";
import { Course } from "@/context/AppContext";

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  isOwned?: boolean;
  onEnroll?: (courseId: string) => void;
  onView?: (courseId: string) => void;
  onRemove?: (courseId: string) => void;
  onUnenroll?: (courseId: string) =>void;
}

export const CourseCard = ({ 
  course, 
  isEnrolled, 
  isOwned, 
  onEnroll, 
  onView, 
  onRemove,
  onUnenroll
}: CourseCardProps) => {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 shadow-course-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
            {course.title}
          </CardTitle>
          {isEnrolled && (
            <Badge variant="secondary" className="text-xs">
              Enrolled
            </Badge>
          )}
          {isOwned && (
            <Badge variant="default" className="text-xs">
              Your Course
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {course.description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{course.enrolled}/{course.maxStudents}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onView?.(course.id)}
          >
            View Details
          </Button>
          
          {!isOwned && !isEnrolled && (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onEnroll?.(course.id)}
              disabled={course.enrolled >= course.maxStudents}
            >
              {course.enrolled >= course.maxStudents ? 'Full' : 'Enroll'}
            </Button>
          )}
          {isEnrolled && onUnenroll &&(
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => onUnenroll(course.id)}
              >
                Unenroll
              </Button>
          )}
          
          {isOwned && onRemove && (
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={() => onRemove(course.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};