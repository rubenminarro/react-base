import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Spinner, Navbar, Container, Form, Col,  Row, Button } from 'react-bootstrap';
import { useUserWithRoles } from "../../hooks/useUser";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { LuUserRoundPlus } from 'react-icons/lu';

interface User {
	id: number;
	name: string;
	email: string;
	active: number;
	roles: number[];
}

interface Role {
	id: number;
	name: string;
	checked: boolean;
}

const ShowUser = () => {

	const { userId } = useParams();

	const { user, roles, isLoading } = useUserWithRoles(userId);

	const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

	useEffect(() => {
		if (user) {
			setSelectedRoles(user.roles);
		}
	}, [user]);

	const handleRoleChange = (roleId: number) => {
		setSelectedRoles(prev =>
			prev.includes(roleId)
			? prev.filter(id => id !== roleId)
			: [...prev, roleId]
		);
		
	};

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
  		e.preventDefault();
		// Aquí puedes agregar la lógica para enviar los datos actualizados al backend
	}
	
	if (isLoading) {
        return <Spinner animation="border" variant="secondary" className="d-block mx-auto mt-5" />;
    }

	return (
		<div>

			<Navbar className="mb-3" expand="lg" bg="secondary" data-bs-theme="light">
				<Container>

					<Navbar.Brand className="text-white font-weight-bold">
						Editar Usuario
					</Navbar.Brand>

					<Navbar.Toggle aria-controls="basic-navbar-nav" />

					<Navbar.Collapse className="justify-content-end">

						<Link to="/usuarios/nuevo" className="btn btn-light ms-2">
							<LuUserRoundPlus />
						</Link>

						<Link to="/users" className="btn btn-light ms-2">
							<FaRegArrowAltCircleLeft />
						</Link>

					</Navbar.Collapse>
				</Container>
			</Navbar>

			<div style={{ position: 'relative', minHeight: '200px' }}>
			
				<Form onSubmit={handleSubmit}>
					<Row className="mb-3">
						<Col>
							<Form.Control 
								type='text'
								placeholder="Usuario" 
								value={user.name}
							/>
						</Col>
						<Col>
							<Form.Control 
								type="email" 
								placeholder="Email" 
								value={user.email}
							/>
						</Col>
					</Row>
					<Row className="mb-3">
						<Col>
							<Form.Control type="password" placeholder="Nueva Contraseña" />
						</Col>
						<Col>
							<Form.Control type="password" placeholder="Confirmar Contraseña" />
						</Col>
					</Row>
					<Row className="mb-3">
						<Col>
							<Form.Label>Roles</Form.Label>
							{roles.map((role: Role) => (
								<Form.Check
									key={role.id}
									label={role.name}
									checked={selectedRoles.includes(role.id)}
									onChange={() => handleRoleChange(role.id)}
								/>
							))}
						</Col>
						
					</Row>
					<Button variant="primary" type="submit">
						Actualizar
					</Button>
				</Form>
			
			</div>
		</div>
	);
};

export default ShowUser;
