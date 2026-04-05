import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Spinner, Navbar, Form, Button, Collapse, Pagination, Toast } from 'react-bootstrap';
import { usePermissionSearchStore } from "../../store/usePermissionSearchStore";
import { usePermissions } from "../../hooks/usePermissions";
import { useActivatePermission } from "../../hooks/useActivatePermission";
import { BiSearchAlt } from "react-icons/bi";
import { FaToggleOff } from "react-icons/fa6";
import { FaToggleOn } from "react-icons/fa";
import { MdOutlineRemoveModerator } from "react-icons/md";
import { MdOutlineAddModerator } from "react-icons/md";
import { TiEdit } from "react-icons/ti";


interface Permission {
	id: number;
	name: string;
	created_at: string;
	updated_at: string;
	active: number;
}

const Permissions = () => {

  	const { search, setSearch, showSearch, toggleSearch } = usePermissionSearchStore();
	const [inputValue, setInputValue] = useState(search);
	const [currentPage, setCurrentPage] = useState(1);
	const activateMutation = useActivatePermission();
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastVariant, setToastVariant] = useState<"success" | "danger">("success");
	
 	useEffect(() => {
		
		const timer = setTimeout(() => {
			setSearch(inputValue);
			setCurrentPage(1);
		}, 400);

		return () => clearTimeout(timer);
		
	}, [inputValue, setSearch]);

	useEffect(() => {
		if (search === "") {
			setInputValue("");
		}
	}, [search]);

	const { data, isLoading, isFetching } = usePermissions(search, currentPage);

	const permissions = data?.data || [];
    const meta = data?.meta?.pagination;

	const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

	const activatePermission = async (permissionId: number) => {
		activateMutation.mutate(permissionId);
	}

	useEffect(() => {
		if (activateMutation.isSuccess) {
			setToastMessage("Permiso actualizado correctamente");
			setToastVariant("success");
			setShowToast(true);
		}

		if (activateMutation.isError) {
			setToastMessage("Error al actualizar el permiso");
			setToastVariant("danger");
			setShowToast(true);
		}
	}, [activateMutation.isSuccess, activateMutation.isError]);

	if (isLoading && !data) {
        return <Spinner animation="border" variant="secondary" className="d-block mx-auto mt-5" />;
    }

	return (
		<div>

			{showToast && (
				
				<Toast className="text-white mb-3" bg={toastVariant} show={showToast} onClose={() => setShowToast(false)} animation={true} delay={4000} autohide>
					<Toast.Header>
						<strong className="me-auto">Atención!</strong>
					</Toast.Header>
					<Toast.Body>{toastMessage}</Toast.Body>
				</Toast>
			)}

			<Navbar className="mb-3 p-2" expand="lg" bg="secondary" data-bs-theme="light">
				
				<Navbar.Brand className="text-white font-weight-bold">
					Listado de permisos
				</Navbar.Brand>

				<Navbar.Toggle aria-controls="basic-navbar-nav" />

					<Navbar.Collapse className="justify-content-end">

						<Collapse in={showSearch}>
							<div>
								<Form.Control
								type="text"
								placeholder="Buscar permisos..."
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								autoFocus
								/>
							</div>
						</Collapse>

						<Button
							variant="light"
							className="ms-2"
							onClick={toggleSearch}
							>
							<BiSearchAlt />
						</Button>

						<Link to="/permission/add" className="btn btn-light ms-2">
							<MdOutlineAddModerator />
						</Link>

					</Navbar.Collapse>
				
			</Navbar>

			<div style={{ position: 'relative', minHeight: '200px' }}>
			
				{isFetching && (
					<div 
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'rgba(255, 255, 255, 0.4)',
							zIndex: 5,
						}}
					>
						<Spinner animation="border" variant="secondary" />
					</div>
				)}

				<div style={{ opacity: isFetching ? 0.5 : 1, transition: 'opacity 0.2s' }}>

					<Table striped bordered hover responsive>
						<thead className="table-dark">
						<tr>
							<th>Permiso</th>
							<th>Creado en</th>
							<th>Actualizado en</th>
							<th className="text-center"></th>
						</tr>
						</thead>

						<tbody>
						{permissions?.map((p: Permission) => (
							
							<tr key={p.id}>
								<td>{p.name}</td>
								<td>{p.created_at}</td>
								<td>{p.updated_at}</td>
								<td className="text-center">
									<Link to={`/permission/show/${p.id}`} className="btn btn-sm btn-outline-secondary ms-2">
										<TiEdit />
									</Link>
									<Button
										className="ms-2"
										size="sm"
										variant="outline-secondary"
										disabled={activateMutation.isPending}
										onClick={() => activatePermission(p.id)}
									>
										{activateMutation.isPending && activateMutation.variables === p.id ? (
											<Spinner
												as="span"
												animation="border"
												size="sm"
												role="status"
												aria-hidden="true"
											/>
										) : (
											p.active === 1 ? <FaToggleOn /> : <FaToggleOff />
										)}
									</Button>
									<Button
										className="ms-2"
										size="sm"
										variant="outline-secondary"
									>	
										<MdOutlineRemoveModerator />
									</Button>
								</td>
							</tr>
						))}
						</tbody>
					</Table>

					<div className="d-flex justify-content-center mt-3">
						<Pagination>
							{/* Ir a la primera página */}
							<Pagination.First 
								onClick={() => handlePageChange(1)} 
								disabled={currentPage === 1 || meta?.lastPage <= 1} 
							/>
							
							{/* Página anterior */}
							<Pagination.Prev 
								onClick={() => handlePageChange(currentPage - 1)} 
								disabled={currentPage === 1 || meta?.lastPage <= 1} 
							/>

							{/* Números de página */}
							{meta && [...Array(meta.lastPage)].map((_, idx) => {
								const pageNumber = idx + 1;
								return (
									<Pagination.Item
										key={pageNumber}
										active={pageNumber === currentPage}
										onClick={() => handlePageChange(pageNumber)}
										disabled={meta.lastPage <= 1} // Deshabilitado si solo hay 1 página
									>
										{pageNumber}
									</Pagination.Item>
								);
							})}

							{/* Página siguiente */}
							<Pagination.Next 
								onClick={() => handlePageChange(currentPage + 1)} 
								disabled={currentPage === meta?.lastPage || meta?.lastPage <= 1} 
							/>

							{/* Ir a la última página */}
							<Pagination.Last 
								onClick={() => handlePageChange(meta?.lastPage)} 
								disabled={currentPage === meta?.lastPage || meta?.lastPage <= 1} 
							/>
						</Pagination>
					</div>
				</div>
			</div>
			

	</div>
	);
};

export default Permissions;
