import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';

const AdminLayout = () => {

    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);
    const logoutStore = useAuthStore((state) => state.logout);

    //const hasRole = useAuthStore((state) => state.hasRole);
    {/* Ejemplo: Solo mostrar este link si es Administrador 
                        {hasRole('Administrador') && (
                            <Nav.Link href="#admin-settings">Configuración</Nav.Link>
                        )}*/}

    const handleLogout = async () => {
    
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("Error al obtener CSRF cookie", error);
        } finally {
            logoutStore();
            navigate('/login');
        }
    
    };

    return (
        <div className="vh-100 d-flex flex-column">
        
            <Container fluid className="flex-grow-1">
                <Row className="h-100">
                    <Col md={2} className="bg-light border-end p-3">
                        <Nav defaultActiveKey="/dashboard" className="flex-column">
                            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                            <Nav.Link as={Link} to="/users">Usuarios</Nav.Link>
                            <Nav.Link as={Link} to="/permissions">Permisos</Nav.Link>
                            <Nav.Link href="#" onClick={handleLogout}>Cerrar sesión</Nav.Link>
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