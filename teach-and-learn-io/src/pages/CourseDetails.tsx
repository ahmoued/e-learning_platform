import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Users, BookOpen, Download, Upload, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import axios from "axios";
import ChatBox from "@/components/ChatBox";
/* Mock student data
const mockStudents = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', enrolledAt: '2024-01-15' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', enrolledAt: '2024-01-18' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', enrolledAt: '2024-01-20' },
];

// Mock PDF data
const mockPDFs = [
  { id: '1', name: 'Introduction to React.pdf', url: '#', uploadedAt: '2024-01-10' },
  { id: '2', name: 'React Components Guide.pdf', url: '#', uploadedAt: '2024-01-12' },
  { id: '3', name: 'State Management.pdf', url: '#', uploadedAt: '2024-01-15' },
];*/



const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //const { courses, userRole, enrolledCourses } = useApp();
  const [course, setCourse] = useState<Course>()
  const [totalstudents, setTotalstudents] = useState()
  const [students, setStudents] = useState([])
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState()
  const [userRole, setUserRole] = useState()
  const [enrolled, setEnrolled] = useState(false)
  const [showChat, setShowChat] = useState(false)


type Course = {

  id: string,
  created_at: string,
  title: string,
  instructor_id: string,
  description: string,
  maxStudents: number,
  enrolledCount: number,
  isEnrolled: boolean,
  instructor_name: string
}

  
  

  useEffect(()=>{
  const fetchData = async()=>{
    setLoading(true)
    try{
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;

        const userRes = await axios.get(`http://localhost:3000/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
        });
        setUserRole(userRes.data.role);
        setUserId(userRes.data.id);
        const isInstructor = userRole ==='instructor'; 
        const isStudent = userRole ==='student'; 

        const res = await axios.get(`http://localhost:3000/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setCourse(res.data)
        setStudents(res.data.students)
        if (isInstructor) setStudents(res.data.students)
        
        setTotalstudents(res.data.enrolled)

        const pdfRes = await axios.get(`http://localhost:3000/pdfs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setPdfs(pdfRes.data)

      } catch (error){
        throw new Error('error fetching course')
      }finally{
        setLoading(false)
      }
    }; fetchData()
  }, [])


  



  
  //const [students] = useState(mockStudents);
  //const [pdfs] = useState(mockPDFs);

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Course not found</h1>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }
    //const course = courses.find(c => c.id === id);
  const isEnrolled = userRole === 'student' && course.isEnrolled
  const isOwned = course.instructor_id === userId && userRole === 'instructor'; 

  const handleRemoveStudent = async (studentId: string) => {
    try{
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const res = await axios.delete('http://localhost:3000/enrollments', {
      headers:{
        Authorization: `Bearer ${token}`
      },
      data:{
        student_id: studentId,
        course_id: id
      }
    })
    if (res.status === 200 || res.status ===204){
    setStudents(s => s.filter(student => student.id !== studentId)) } else {
      console.error("failed to remove student from the db")
    }
  }catch(error){
    console.error("failed to remove student", error)
  }
};

  const handleDownloadPDF = async (courseId: string, file_url: string) => {
  try{
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const res = await axios.get(`http://localhost:3000/download/${courseId}?file_url=${encodeURIComponent(file_url)}`, {
      headers:{
        Authorization: `Bearer ${token}`
      },

    })
   
    const signed_url = res.data.signedUrl
    if(!signed_url) throw new Error("failed to generate signed url")
    window.open(signed_url, "_blank")
  }catch(error){
    console.error("failed to remove student", error) 
  }
  }

  const handleUploadPDF = async (file: File) => {
    if (!file) {
      alert('no file selected')
      return;
    }
    try{
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const formData = new FormData()
    formData.append("file", file)
    formData.append("course_id", id!)
    formData.append("name", file.name)
    const res = await axios.post('http://localhost:3000/pdfs/upload', formData, {
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
      
    })
    if (res.status === 200 || res.status ===201){
    setPdfs(prev => [prev, res.data])
    alert('PDF uploaded successfully')} else {
      console.error("Upload failed with status:", res.status);
      alert("PDF upload failed. Please try again.");    }
  }catch(error){
    console.error("failed to remove pdf", error)
    alert(error.response?.data?.message || "An error occurred during PDF upload");
  }
    
  };

  const handleDeletePDF = async (pdfId: string) => {
    try{
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const res = await axios.delete(`http://localhost:3000/pdfs/${pdfId}`, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status === 200 || res.status ===204){
    setPdfs(s => s.filter(pdf => pdf.id !== pdfId)) } else {
      console.error("failed to remove pdf from the db")
    }
  }catch(error){
    console.error("failed to remove pdf", error)
  }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
              <p className="text-muted-foreground mt-2">{course.description}</p>
            </div>
            <div className="flex gap-2">
              {isEnrolled && (
                <Badge variant="secondary">Enrolled</Badge>
              )}
              {isOwned && (
                <Badge variant="default">Your Course</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Instructor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-medium">{course.instructor_name}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center"> 
                <Users className="h-5 w-5 mr-2" />
                Enrollment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-medium">
                {course.enrolledCount} / {course.maxStudents} students
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={course.enrolledCount >= course.maxStudents ? "destructive" : "default"}>
                {course.enrolledCount >= course.maxStudents ? "Full" : "Open"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Materials (PDFs) */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Course Materials
                </CardTitle>
                {isOwned && (
                  <div className="flex items-center gap-2">
                    <input type ='file' accept = 'application/pdf' onChange={e=>{
                      if(e.target.files){
                        handleUploadPDF(e.target.files[0]);
                      }
                    }}
                    className="hidden" id='pdf-upload'>
                    </input>
                    <label htmlFor="pdf-upload">
                      <Button asChild size="sm">
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload PDF
                        </span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {pdfs.length > 0 ? (
                <div className="space-y-3">
                  {pdfs.map((pdf, index) => (
                    <div key={pdf.id}>
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{pdf.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded {new Date(pdf.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {(isEnrolled || isOwned) && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownloadPDF(id, pdf.file_url)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          {isOwned && (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeletePDF(pdf.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {index < pdfs.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No materials uploaded yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enrolled Students (Instructor only) */}
          {isOwned && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Enrolled Students ({students.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {students.length > 0 ? (
                  <div className="space-y-3">
                    {students.map((student, index) => (
                      <div key={student.id}>
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{student.full_name}</p>
                            <p className="text-sm text-muted-foreground">{student.id}</p>
                            <p className="text-xs text-muted-foreground">
                              Enrolled {new Date(student.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRemoveStudent(student.id)}
                          >
                            Remove
                          </Button> 
                        </div>
                        {index < students.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No students enrolled yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {/* Floating Chat Button */}
      <button
      onClick={() => setShowChat(true)}
      className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark"
      >
  💬
      </button>
      {showChat && (
      <div className="fixed bottom-6 right-6 z-50">
      <ChatBox courseId={course.id} />
  </div>
)}

    </div>
  );
};

export default CourseDetails;