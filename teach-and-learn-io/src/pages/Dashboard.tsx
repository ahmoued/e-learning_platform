import { useApp } from "@/context/AppContext";
import { InstructorDashboard } from "@/components/InstructorDashboard";
import { StudentDashboard } from "@/components/StudentDashboard";
import { Navbar } from "@/components/Navbar";

const Dashboard = () => {
  const { userRole } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === 'instructor' ? <InstructorDashboard /> : <StudentDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;