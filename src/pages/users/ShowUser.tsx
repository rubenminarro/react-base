import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Spinner, Navbar, Container, Form, Col,  Row, Button, Toast } from 'react-bootstrap';
import { useUserWithRoles } from "../../hooks/users/useUser";
import { useUpdateUser } from "../../hooks/users/useUpdateUser";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { LuUserRoundPlus } from 'react-icons/lu';

interface Role {
	id: number;
	name: string;
	checked: boolean;
}

const ShowUser = () => {

	const { userId } = useParams();

	const { user, roles, isLoading } = useUserWithRoles(userId);

	const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

	const [formData, setFormData] = useState({
		name: '',
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		password_confirmation: ''
	});

	const updateMutation = useUpdateUser();
	const { isPending, error } = updateMutation;
	
	const serverErrors = (error as any)?.response?.data?.errors || {};

	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastVariant, setToastVariant] = useState<"success" | "danger">("success");

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				first_name: user.first_name || '',
				last_name: user.last_name || '',
				email: user.email || '',
				password: '',
				password_confirmation: ''
			});

			setSelectedRoles(user.roles || []);
		}
	}, [user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		
		const { name, value } = e.target;

		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleRoleChange = (roleId: number) => {
		setSelectedRoles(prev =>
			prev.includes(roleId)
			? prev.filter(id => id !== roleId)
			: [...prev, roleId]
		);
		
	};

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
  		
		e.preventDefault();

		const selectedRoleNames = roles
			.filter((role: Role) => selectedRoles.includes(role.id))
			.map((role: Role) => role.name);

		const payload: any = {
			name: formData.name,
			email: formData.email,
			first_name: formData.first_name,
			last_name: formData.last_name,
			role: selectedRoleNames
		};

		if (formData.password) {
			payload.password = formData.password;
			payload.password_confirmation = formData.password_confirmation;
		}

		updateMutation.mutate({
			id: userId,
			data: payload
		});

	}

	useEffect(() => {

		if (updateMutation.isSuccess) {

			const successMsg = updateMutation.data?.message;
			
			setToastMessage(successMsg);
			setToastVariant("success");
			setShowToast(true);
		}
		
		if (updateMutation.isError) {

			const errorData = (updateMutation.error as any)?.response?.data;
        	const errorMsg = errorData?.message;

			setToastMessage(errorMsg);
			setToastVariant("danger");
			setShowToast(true);
		}
	
	}, [updateMutation.isSuccess, updateMutation.isError]);
	
	if (isLoading) {
        return <Spinner animation="border" variant="secondary" className="d-block mx-auto mt-5" />;
    }

	return (
		<div>

			<Navbar className="mb-3" expand="lg" bg="secondary" data-bs-theme="light">
				<Container>

					<Navbar.Brand className="text-white font-weight-bold">
						Datos del usuario
					</Navbar.Brand>

					<Navbar.Toggle aria-controls="basic-navbar-nav" />

					<Navbar.Collapse className="justify-content-end">

						<Link to="/user/add" className="btn btn-light ms-2">
							<LuUserRoundPlus />
						</Link>

						<Link to="/users" className="btn btn-light ms-2">
							<FaRegArrowAltCircleLeft />
						</Link>

					</Navbar.Collapse>
				</Container>
			</Navbar>

			<div style={{ position: 'relative', minHeight: '200px' }}>

				{showToast && (
				
					<Toast className="text-white mb-3" bg={toastVariant} show={showToast} onClose={() => setShowToast(false)} animation={true} delay={4000} autohide>
						<Toast.Header>
							<strong className="me-auto">Atención!</strong>
						</Toast.Header>
						<Toast.Body>{toastMessage}</Toast.Body>
					</Toast>
				)}
			
				<Form onSubmit={handleSubmit}>
					<Row className="mb-3">
						<Col>
							<Form.Label className={serverErrors.name ? 'text-danger' : ''}>Usuario</Form.Label>
							<Form.Control 
								type="text"
								name="name"
								placeholder="Usuario" 
								value={formData.name}
								onChange={handleChange}
								isInvalid={!!serverErrors.name}
								disabled={updateMutation.isPending}
							/>
							<Form.Control.Feedback type="invalid">
                                {serverErrors.name?.[0]}
                            </Form.Control.Feedback>
						</Col>
						<Col>
							<Form.Label className={serverErrors.email ? 'text-danger' : ''}>Email</Form.Label>
							<Form.Control 
								type="email"
								name="email"
								placeholder="Email" 
								value={formData.email}
								onChange={handleChange}
								isInvalid={!!serverErrors.email}
								disabled={updateMutation.isPending}
							/>
							<Form.Control.Feedback type="invalid">
                                {serverErrors.email?.[0]}
                            </Form.Control.Feedback>
						</Col>
					</Row>
					<Row className="mb-3">
						<Col>
							<Form.Label className={serverErrors.first_name ? 'text-danger' : ''}>Nombre</Form.Label>
							<Form.Control 
								type="text"
								name="first_name"
								placeholder="Nombre" 
								value={formData.first_name}
								onChange={handleChange}
								isInvalid={!!serverErrors.first_name}
								disabled={updateMutation.isPending}
							/>
							<Form.Control.Feedback type="invalid">
                                {serverErrors.first_name?.[0]}
                            </Form.Control.Feedback>
						</Col>
						<Col>
							<Form.Label className={serverErrors.last_name ? 'text-danger' : ''}>Apellido</Form.Label>
							<Form.Control 
								type="text"
								name="last_name"
								placeholder="Apellido" 
								value={formData.last_name}
								onChange={handleChange}
								isInvalid={!!serverErrors.last_name}
								disabled={updateMutation.isPending}
							/>
							<Form.Control.Feedback type="invalid">
                                {serverErrors.last_name?.[0]}
                            </Form.Control.Feedback>
						</Col>
					</Row>
					<Row className="mb-3">
						<Col>
							<Form.Label className={serverErrors.password ? 'text-danger' : ''}>Nueva Contraseña</Form.Label>
							<Form.Control
								type="password"
								name="password"
								placeholder="Nueva Contraseña"
								value={formData.password}
								onChange={handleChange}
								isInvalid={!!serverErrors.password}
								disabled={updateMutation.isPending}
							/>
							<Form.Control.Feedback type="invalid">
								{serverErrors.password?.[0]}
							</Form.Control.Feedback>
						</Col>
						<Col>
							<Form.Label className={serverErrors.password_confirmation ? 'text-danger' : ''}>Confirmar Contraseña</Form.Label>
							 <Form.Control
								type="password"
								name="password_confirmation"
								placeholder="Confirmar Contraseña"
								value={formData.password_confirmation}
								onChange={handleChange}
								isInvalid={!!serverErrors.password_confirmation}
								disabled={updateMutation.isPending}
							 />
							<Form.Control.Feedback type="invalid">
								{serverErrors.password_confirmation?.[0]}
							</Form.Control.Feedback>
						</Col>
					</Row>
					<Row className="mb-3">
						<Col>
							<Form.Label className={serverErrors.role ? 'text-danger' : ''}>Roles</Form.Label>
							{roles.map((role: Role) => (
								<Form.Check
									key={role.id}
									label={role.name}
									checked={selectedRoles.includes(role.id)}
									onChange={() => handleRoleChange(role.id)}
									disabled={updateMutation.isPending}
								/>
							))}
							{serverErrors.role && (
                                <small className="text-danger d-block">{serverErrors.role[0]}</small>
                            )}
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

export default ShowUser;
