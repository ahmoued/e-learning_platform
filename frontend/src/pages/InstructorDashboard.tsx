import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import axios from 'axios';
import CourseCard from '../components/instructor/CourseCard';

type Course = {
  id: string;
  title: string;
  description: string;
};

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const access_token = sessionData.session?.access_token;
        if (!access_token) {
          setError('Not logged in');
          return;
        }

        const response = await axios.get('http://localhost:3000/courses/mycourses', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        setCourses(response.data);
      } catch (error: any) {
        setError(error.message || 'An error occurred while fetching the courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
   <div>
      <div className="container" style={{ minHeight: '100vh', backgroundColor: '#B0A5A5', padding: '2rem'}}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark">My Courses</h2>
          <button
            className="btn fw-semibold"
            style={{
              background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '30px',
            }}
            onClick={() => navigate('/courses/create')}
          >
            + Add New Course
          </button>
        </div>

        {loading && <p className="text-muted">Loading courses...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div  className="row">
          {courses.map((course) => (
            <div className="col-md-6 col-lg-4" key={course.id}>
              <CourseCard
                title={course.title}
                description={course.description}
                onView={() => navigate(`/courses/${course.id}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
