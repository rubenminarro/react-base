import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';
import AdminNavBar from '../components/common/AdminNavBar';

const AdminLayout = () => {
  return (
    <div className="vh-100 d-flex flex-column">
      
        <AdminNavBar />
      
        <Container fluid className="flex-grow-1">
            <Row className="h-100">
                <Col md={2} className="bg-light border-end p-3">
                    <Nav defaultActiveKey="/dashboard" className="flex-column">
                        <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link as={Link} to="/users">Usuarios</Nav.Link>
                    </Nav>
                </Col>
                <Col md={10} className="p-4 overflow-auto">
                    <Outlet /> 
                </Col>
            </Row>
        </Container>
    </div>
  );
};

export default AdminLayout;