import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spinner, Navbar, Form, Col,  Row, Button, Toast, Badge } from 'react-bootstrap';
import { useRoles } from "../../hooks/users/useAddUser";
import { useStoreUser } from "../../hooks/users/useStoreUser";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";

interface Role {
	id: number;
	name: string;
	checked: boolean;
}

const AddUser = () => {

	const { roles, isLoading } = useRoles();

	const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

	const [formData, setFormData] = useState({
		name: '',
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		password_confirmation: ''
	});

  	const storeMutation = useStoreUser();
	const { isPending, error } = storeMutation;
	
	const serverErrors = (error as any)?.response?.data?.errors || {};

	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastVariant, setToastVariant] = useState<"success" | "danger">("success");

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

		const payload = {
			...formData,
			role: selectedRoleNames
		};
		
		storeMutation.mutate(payload);

    };

	useEffect(() => {

		if (storeMutation.isSuccess) {

			const successMsg = storeMutation.data?.message;
			
			setToastMessage(successMsg);
			setToastVariant("success");
			setShowToast(true);

			setFormData({
				name: '',
				first_name: '',
				last_name: '',
				email: '',
				password: '',
				password_confirmation: ''
			});

			setSelectedRoles([]);
		}
		
		if (storeMutation.isError) {

			const errorData = (storeMutation.error as any)?.response?.data;
        	const errorMsg = errorData?.message;

			setToastMessage(errorMsg);
			setToastVariant("danger");
			setShowToast(true);
		}
	
	}, [storeMutation.isSuccess, storeMutation.isError]);
	
	if (isLoading) {
        return <Spinner animation="border" variant="secondary" className="d-block mx-auto mt-5" />;
    }

	return (
		<div>

			<Navbar className="mb-3 p-2" expand="lg" bg="secondary" data-bs-theme="light">

				<Navbar.Brand className="text-white font-weight-bold">
					Agregar nuevo usuario
				</Navbar.Brand>

				<Navbar.Toggle aria-controls="basic-navbar-nav" />

				<Navbar.Collapse className="justify-content-end">

					<Link to="/users" className="btn btn-light ms-2">
						<FaRegArrowAltCircleLeft />
					</Link>

				</Navbar.Collapse>

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
								disabled={storeMutation.isPending}
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
								disabled={storeMutation.isPending}
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
								disabled={storeMutation.isPending}
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
								disabled={storeMutation.isPending}
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
								disabled={storeMutation.isPending}
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
								disabled={storeMutation.isPending}
							/>
							<Form.Control.Feedback type="invalid">
                                {serverErrors.password_confirmation?.[0]}
                            </Form.Control.Feedback>
						</Col>
					</Row>
					<Row className="mb-3">
						<Col>
							<div className="mb-3 d-flex justify-content-between align-items-center border-bottom pb-2">
								<div>
									<h5 className={`mb-0 fw-bold ${serverErrors.role ? 'text-danger' : ''}`}>Roles</h5>
									<small className="text-muted">Seleccioná los roles que tendrá este usuario</small>
								</div>
								<Badge pill bg={serverErrors.role ? 'danger' : 'primary'} style={{ fontSize: '0.9rem' }}>
									{selectedRoles.length} seleccionados
								</Badge>
                        	</div>

							<div className={`mb-4 ps-2 border-start border-3 ${serverErrors.role ? 'border-danger-subtle' : 'border-primary-subtle'}`}>
								<Row>	
									<Col xs={12} className="py-2 border-bottom border-light">
										{roles.map((role: Role) => (
											<Form.Check
												key={role.id}
												label={role.name}
												checked={selectedRoles.includes(role.id)}
												onChange={() => handleRoleChange(role.id)}
												disabled={storeMutation.isPending}
											/>
										))}
										{serverErrors.role && (
											<small className="text-danger d-block">{serverErrors.role[0]}</small>
										)}
									</Col>
								</Row>
							</div>
						</Col>
					</Row>
					
					<Button variant="primary" type="submit" disabled={isPending}>
						{isPending ? 'Guardando...' : 'Guardar'}
           			</Button>

				</Form>
			
			</div>
		</div>
	);
};

export default AddUser;
