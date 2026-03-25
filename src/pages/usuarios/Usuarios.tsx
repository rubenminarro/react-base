import { useEffect, useState } from 'react';
import { Table, Spinner, Navbar, Form, Row, Col, Button, Container, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { LuUserRoundPlus } from "react-icons/lu";
import { BiSearchAlt } from "react-icons/bi";

interface Usuario {
  id: number;
  name: string;
  email: string;
  active: string;
}

const Usuarios = () => {

	const [usuarios, setUsuarios] = useState<Usuario[]>([]);
	const [cargando, setCargando] = useState(true);
	const [showSearch, setShowSearch] = useState(false);

	useEffect(() => {

		api.get('api/admin/users')
		.then(function (response) {
			console.log(response);
			setUsuarios(response.data.data);
			setCargando(false);
		})
		.catch(function (error) {
			console.log(error);
			setCargando(false);
		});

	}, []);

	if (cargando) {
    	return <Spinner animation="border" variant="secondary" className="d-block mx-auto mt-5" />;
	};

	return(
		<div>

			<Navbar className="mb-3" expand="lg" bg="secondary" data-bs-theme="light">
				
				<Container>
					
					<Navbar.Brand className="text-white font-weight-bold">Usuarios</Navbar.Brand>
					
					<Navbar.Toggle aria-controls="basic-navbar-nav" />

					<Navbar.Collapse className="justify-content-end">

						<Collapse in={showSearch}>
							<div>
								<Form.Control
								type="text"
								placeholder="Buscar usuarios..."
								autoFocus
								/>
							</div>
						</Collapse>
					
						<Button 
							variant="light" 
							className='ms-2'
							onClick={() => setShowSearch(!showSearch)}
						>
							<BiSearchAlt />
						</Button>

						<Link to="/usuarios/nuevo" className="btn btn-light ms-2"><LuUserRoundPlus /></Link>

					</Navbar.Collapse>

				</Container>
			</Navbar>
			
			<Table striped bordered hover responsive>
				<thead className="table-dark">
					<tr>
						<th className="text-center">ID</th>
						<th>Nombre</th>
						<th>Email</th>
						<th className="text-center">Activo</th>
					</tr>
				</thead>
				<tbody>
				{usuarios.map((u) => (
					<tr key={u.id}>
						<td className="text-center">{u.id}</td>
						<td>{u.name}</td>
						<td>{u.email}</td>
						<td className="text-center">{u.active == '1' ? 'Sí' : 'No'}</td>
					</tr>
				))}
				</tbody>
			</Table>
		</div>
	);
    
}

export default Usuarios;
