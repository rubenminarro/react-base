import { Table, Spinner, Navbar, Form, Button, Container, Collapse, Badge, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LuUserRoundPlus } from "react-icons/lu";
import { BiSearchAlt } from "react-icons/bi";
import { useSearchStore } from "../../store/useSearchStore";
import { useUsers } from "../../hooks/useUsers";
import { useState, useEffect } from 'react';

interface Usuario {
	id: number;
	name: string;
	email: string;
	active: string;
	roles: Role[];
}

interface Role {
	id: number;
	name: string;
}

const Usuarios = () => {

  	const { search, setSearch, showSearch, toggleSearch } = useSearchStore();
	const [inputValue, setInputValue] = useState(search);
	const [currentPage, setCurrentPage] = useState(1);
 	
	useEffect(() => {
		
		const timer = setTimeout(() => {
			setSearch(inputValue);
			setCurrentPage(1);
		}, 400); // espera 400ms

		return () => clearTimeout(timer);
		
	}, [inputValue, setSearch]);

	const { data, isLoading, isFetching } = useUsers(search, currentPage);

	const usuarios = data?.data || [];
    const meta = data?.meta?.pagination;

	const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

	if (isLoading && !data) {
        return <Spinner animation="border" variant="secondary" className="d-block mx-auto mt-5" />;
    }

  	return (
		<div>

			<Navbar className="mb-3" expand="lg" bg="secondary" data-bs-theme="light">
				<Container>

					<Navbar.Brand className="text-white font-weight-bold">
						Usuarios
					</Navbar.Brand>

					<Navbar.Toggle aria-controls="basic-navbar-nav" />

					<Navbar.Collapse className="justify-content-end">

						<Collapse in={showSearch}>
							<div>
								<Form.Control
								type="text"
								placeholder="Buscar usuarios..."
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

						<Link to="/usuarios/nuevo" className="btn btn-light ms-2">
							<LuUserRoundPlus />
						</Link>

					</Navbar.Collapse>
				</Container>
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
							backgroundColor: 'rgba(255, 255, 255, 0.4)', // Fondo semitransparente
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
							<th>Usuario</th>
							<th>Email</th>
							<th className="text-center">Estado</th>
							<th className="text-center">Roles</th>
						</tr>
						</thead>

						<tbody>
						{usuarios?.map((u: Usuario) => (
							<tr key={u.id}>
							<td>{u.name}</td>
							<td>{u.email}</td>
							<td className="text-center">
								{u.active == '1' ? 'Activo' : 'Inactivo'}
							</td>
							<td>
								{u.roles.map((role) => (
								<Badge bg="primary" className="me-1" key={role.id}>
									{role.name}
								</Badge>
								))}
							</td>
							</tr>
						))}
						</tbody>
					</Table>

					{/* --- CONTROLES DE PAGINACIÓN --- */}
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

export default Usuarios;
