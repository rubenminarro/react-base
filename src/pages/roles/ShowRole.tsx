import { useState, useEffect } from 'react';
import { Navbar, Container, Form, Row, Col, Button, Toast, Badge, Spinner } from "react-bootstrap";
import { Link, useParams } from 'react-router-dom';
import { useRole } from "../../hooks/roles/useRole";
import { useUpdateRole } from "../../hooks/roles/useUpdateRole";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { MdOutlineAddModerator } from "react-icons/md";


interface PermissionItem {
    id: number;
    name: string;
}

interface PermissionGroup {
    module: string;
    list: PermissionItem[];
}

const ShowRole = () => {
  
	const { roleId } = useParams();
	
	const { role, permissions, isLoading } = useRole(roleId);
    
	const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
	
	const [formData, setFormData] = useState({
        name: '',
        description: '',
        guard_name: '',
        permissions: [] as number[]
    });

	const updateMutation = useUpdateRole();
	const { isPending, error } = updateMutation;
	
	const serverErrors = (error as any)?.response?.data?.errors || {};

	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastVariant, setToastVariant] = useState<"success" | "danger">("success");

	useEffect(() => {
        if (role && role.permissions) {
            setFormData({
                name: role.name || '',
                description: role.description || '',
                guard_name: role.guard_name || '',
                permissions: role.permissions || []
            });
            setSelectedPermissions(role.permissions);
        }
    }, [role]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		
		const { name, value } = e.target;

		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

  	const handlePermissionChange = (permissionId: number) => {

		setSelectedPermissions(prev =>
			prev.includes(permissionId)
			? prev.filter(id => id !== permissionId)
			: [...prev, permissionId]
		);
	};

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const allPermissionsFlat = permissions.flatMap((group: PermissionGroup) => group.list);

		const selectedPermissionNames = allPermissionsFlat
			.filter((permission: PermissionItem) => selectedPermissions.includes(permission.id))
			.map((permission: PermissionItem) => permission.name);

		const payload: any = {
			name: formData.name,
			description: formData.description,
			guard_name: formData.guard_name,
			permissions: selectedPermissionNames
		};

		updateMutation.mutate({
			id: roleId,
			data: payload
		});
	};

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
						Datos del role
					</Navbar.Brand>

					<Navbar.Toggle aria-controls="basic-navbar-nav" />

					<Navbar.Collapse className="justify-content-end">

						<Link to="/role/add" className="btn btn-light ms-2">
							<MdOutlineAddModerator />
						</Link>

						<Link to="/roles" className="btn btn-light ms-2">
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
							<Form.Label className={serverErrors.name ? 'text-danger' : ''}>Rol</Form.Label>
							<Form.Control 
								type="text"
								name="name"
								placeholder="Rol" 
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
					<Row className="mb-3">
						<Col>
							<Form.Label className={serverErrors.description ? 'text-danger' : ''}>Descripción</Form.Label>
							<Form.Control 
								as="textarea"
                				rows={2}
								name="description"
								placeholder="Descripción" 
								value={formData.description}
								onChange={(p: any) => { handleChange(p) }}
								isInvalid={!!serverErrors.description}
								disabled={updateMutation.isPending}
							/>
							<Form.Control.Feedback type="invalid">
                                {serverErrors.description?.[0]}
                            </Form.Control.Feedback>
						</Col>
					</Row>
					<Row className="mb-3">
						<Col>
							<div className="mb-3 d-flex justify-content-between align-items-center border-bottom pb-2">
								<div>
									<h5 className="mb-0 fw-bold">Permisos</h5>
									<small className="text-muted">Seleccioná los permisos que tendrá este rol</small>
								</div>
								<Badge pill bg="primary" style={{ fontSize: '0.9rem' }}>
									{selectedPermissions.length} seleccionados
								</Badge>
                        	</div>

							<div className="mt-4">
								<Row>
								{permissions.map((group: PermissionGroup) => (
									
										<Col xs={4} key={group.module}>
											<div key={group.module} className="mb-4 ps-2 border-start border-3 border-primary-subtle">
												<div className="d-flex justify-content-between align-items-center mb-3">
													<div>
														<h6 className="text-uppercase fw-bold mb-0 text-primary" style={{ letterSpacing: '1px' }}>{group.module}</h6>
													</div>
													<Badge bg="primary" pill>
														{group.list.filter(p => selectedPermissions.includes(p.id)).length} / {group.list.length}
													</Badge>
												</div>

												<Row>
													{group.list.map((permission) => (
														<Col xs={12} key={permission.id} className="py-2 border-bottom border-light">
															<div className="d-flex justify-content-between align-items-center">
																<Form.Check 
																	type="checkbox"
																	id={`perm-${permission.id}`}
																	label={<span className="ms-2">{permission.name}</span>}
																	checked={selectedPermissions.includes(permission.id)}
																	onChange={() => handlePermissionChange(permission.id)}
																	className="fw-medium"
																	disabled={updateMutation.isPending}
																/>
															</div>
														</Col>
													))}
												</Row>
											</div>
										</Col>
									))}
								</Row>
                        	</div>	
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

export default ShowRole;