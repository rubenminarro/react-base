import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Spinner, Navbar, Form, Col,  Row, Button, Toast } from 'react-bootstrap';
import { usePermission } from '../../hooks/permissions/usePermission';
import { useUpdatePermission } from "../../hooks/permissions/useUpdatePermission";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { MdOutlineAddModerator } from "react-icons/md";

const ShowPermission = () => {

	const { permissionId } = useParams();

	const { permission, isLoading } = usePermission(permissionId);

	const [formData, setFormData] = useState({
		name: '',
		guard_name: '',
	});

	const updateMutation = useUpdatePermission();
	const { isPending, error } = updateMutation;

	const serverErrors = (error as any)?.response?.data?.errors || {};

	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastVariant, setToastVariant] = useState<"success" | "danger">("success");

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

		updateMutation.reset(); 
   	 	setShowToast(false);

		const payload: any = {
			name: formData.name,
			guard_name: formData.guard_name
		};
		
		updateMutation.mutate({
			id: permissionId!,
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

			<Navbar className="mb-3 p-2" expand="lg" bg="secondary" data-bs-theme="light">
				
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
							<Form.Label className={serverErrors.name ? 'text-danger' : ''}>Permiso</Form.Label>
							<Form.Control 
								type="text"
								name="name"
								placeholder="Permiso" 
								value={formData.name}
								onChange={(p: any) => { handleChange(p) }}
								isInvalid={!!serverErrors.name}
								disabled={updateMutation.isPending}
							/>
							<Form.Control.Feedback type="invalid">
                                {serverErrors.name?.[0]}
                            </Form.Control.Feedback>
						</Col>
						<Col>
							<Form.Label className={serverErrors.guard_name ? 'text-danger' : ''}>Entorno de programación</Form.Label>
							<Form.Select
								name="guard_name"
								value={formData.guard_name}
								onChange={handleChange}
								isInvalid={!!serverErrors.guard_name}
								disabled={updateMutation.isPending}
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
