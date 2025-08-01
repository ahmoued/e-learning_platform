import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

type CourseCardProps = {
  title: string;
  description: string;
  image?: string;
  onView?: () => void;
};

function CourseCard({ title, description, image, onView }: CourseCardProps) {
  return (
    <Card
      className="shadow-lg border-0 rounded-4 mb-4"
      style={{
        background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)',
      }}
    >
      <Card.Img
        variant="top"
        src={image || '/CourseCard.jpg'}
        style={{
          height: '200px',
          objectFit: 'cover',
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '1rem',
        }}
      />
      <Card.Body>
        <Card.Title style={{color: 'black'}} className="fw-bold">{title}</Card.Title>
        <Card.Text style={{ minHeight: '60px', color: '#ffffffff' }}>{description}</Card.Text>
        <Button
          variant="light"
          onClick={onView}
          className="w-100 rounded-pill fw-semibold"
          style={{ color: '#b44593' }}
        >
          View Course
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CourseCard;
