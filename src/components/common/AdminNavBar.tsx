import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';

const AdminNavBar = () => {

    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);
    const logoutStore = useAuthStore((state) => state.logout);
    const hasRole = useAuthStore((state) => state.hasRole);

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
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="#home">Mi Panel Seintos</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        {/* Ejemplo: Solo mostrar este link si es Administrador */}
                        {hasRole('Administrador') && (
                            <Nav.Link href="#admin-settings">Configuración</Nav.Link>
                        )}

                        <NavDropdown title={user?.name || "Usuario"} id="basic-nav-dropdown">
                            <NavDropdown.Item href="#perfil">Perfil</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>
                                Cerrar sesión
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AdminNavBar;