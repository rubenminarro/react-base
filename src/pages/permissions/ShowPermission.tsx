import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Spinner, Navbar, Container, Form, Col,  Row, Button, Alert } from 'react-bootstrap';
import { usePermission } from '../../hooks/usePermission';
import { useUpdatePermission } from "../../hooks/useUpdatePermission";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { MdOutlineAddModerator } from "react-icons/md";

const ShowPermission = () => {

	const { permissionId } = useParams();

	const { permission, isLoading } = usePermission(permissionId);

	const [formData, setFormData] = useState({
		name: '',
		guard_name: '',
	});

	const { mutate, isPending, isSuccess, isError, error } = useUpdatePermission();

	const serverErrors = (error as any)?.response?.data?.errors || {};

	useEffect(() => {
		if (permission) {
			setFormData({
				name: permission.name || '',
				guard_name: permission.guard_name || ''
			});
		}
	}, [permission]);

	const handleChange = (p: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		
		const { name, value } = p.target;

		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (p: React.SubmitEvent<HTMLFormElement>) => {
  		
		p.preventDefault();

		const payload: any = {
			name: formData.name,
			guard_name: formData.guard_name
		};
		
		mutate({
			id: permissionId!,
			data: payload
		});

	}
	
	if (isLoading) {
        return <Spinner animation="border" variant="secondary" className="d-block mx-auto mt-5" />;
    }

	return (
		<div>

			<Navbar className="mb-3" expand="lg" bg="secondary" data-bs-theme="light">
				<Container>

					<Navbar.Brand className="text-white font-weight-bold">
						Datos del permiso
					</Navbar.Brand>

					<Navbar.Toggle aria-controls="basic-navbar-nav" />

					<Navbar.Collapse className="justify-content-end">

						<Link to="/permission/add" className="btn btn-light ms-2">
							<MdOutlineAddModerator />
						</Link>

						<Link to="/permissions" className="btn btn-light ms-2">
							<FaRegArrowAltCircleLeft />
						</Link>

					</Navbar.Collapse>
				</Container>
			</Navbar>

			<div style={{ position: 'relative', minHeight: '200px' }}>

				{isSuccess && (
                    <Alert variant="success" className="mt-2">Permiso actualizado correctamente</Alert>
                )}

				{isError && (
                    <Alert variant="danger" className="mt-2">Hubo un problema al validar los datos.</Alert>
                )}
			
				<Form onSubmit={handleSubmit}>
					<Row className="mb-3">
						<Col>
							<Form.Label>Permiso</Form.Label>
							<Form.Control 
								type="text"
								name="name"
								placeholder="Permiso" 
								value={formData.name}
								onChange={(p: any) => { handleChange(p) }}
								isInvalid={!!serverErrors.name}
							/>
							<Form.Control.Feedback type="invalid">
                                {serverErrors.name?.[0]}
                            </Form.Control.Feedback>
						</Col>
						<Col>
							<Form.Label>Entorno de programación</Form.Label>
							
							<Form.Select
								name="guard_name"
								value={formData.guard_name}
								onChange={handleChange}
								>
									<option value="">Seleccione una opción</option>
									<option value="web">Web</option>
									<option value="api">API</option>
								</Form.Select>

							<Form.Control.Feedback type="invalid">
								{serverErrors.guard_name?.[0]}
							</Form.Control.Feedback>
							</Col>
					</Row>
					<Button variant="primary" type="submit" disabled={isPending}>
						{isPending ? 'Actualizando...' : 'Actualizar'}
					</Button>

				</Form>
			
			</div>
		</div>
	);
};

export default ShowPermission;
