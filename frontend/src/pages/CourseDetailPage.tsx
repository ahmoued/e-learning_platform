import { useParams } from "react-router-dom";

function CourseDetailPage() {
    const {id} = useParams<{ id: string }>();
    return (
        <div>
            <h2>Course Detail Page</h2>
        </div>
    );
}
export default CourseDetailPage;