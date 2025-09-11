import { Button } from "@/components/ui/button";
import { BookOpen, Users, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

const Index = () => {
  const navigate = useNavigate();
  const { setUserRole } = useApp();

  const handleRoleSelect = (role: 'instructor' | 'student') => {
    setUserRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary-light/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-primary/10 rounded-full">
                <BookOpen className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Welcome to <span className="text-primary">EduLearn</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              A modern e-learning platform connecting instructors and students. 
              Create, share, and learn with our intuitive course management system.
            </p>

            {/* Role Selection */}
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div 
                className="group p-8 bg-white rounded-xl border-2 border-transparent hover:border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleRoleSelect('instructor')}
              >
                <div className="text-center">
                  <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-8 w-8 text-primary mx-auto mt-1" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">I'm an Instructor</h3>
                  <p className="text-muted-foreground mb-6">
                    Create courses, upload materials, and manage your students
                  </p>
                  <Button className="w-full group-hover:shadow-md transition-shadow">
                    Get Started <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>

              <div 
                className="group p-8 bg-white rounded-xl border-2 border-transparent hover:border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleRoleSelect('student')}
              >
                <div className="text-center">
                  <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-8 w-8 text-primary mx-auto mt-1" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">I'm a Student</h3>
                  <p className="text-muted-foreground mb-6">
                    Browse courses, enroll in classes, and access learning materials
                  </p>
                  <Button className="w-full group-hover:shadow-md transition-shadow">
                    Start Learning <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-20 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-12 h-12 mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-primary mx-auto mt-1" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Course Management</h4>
                <p className="text-sm text-muted-foreground">
                  Easy-to-use tools for creating and organizing courses
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-12 h-12 mx-auto mb-4">
                  <FileText className="h-6 w-6 text-primary mx-auto mt-1" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">PDF Resources</h4>
                <p className="text-sm text-muted-foreground">
                  Upload and share course materials seamlessly
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-12 h-12 mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary mx-auto mt-1" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Student Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor enrollment and manage student progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
