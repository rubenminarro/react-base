import { useEffect, useState } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "axios";

interface Usuario {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const Usuarios = () => {

	const [usuarios, setUsuarios] = useState<Usuario[]>([]);
	const [cargando, setCargando] = useState(true);

	useEffect(() => {
			
		axios
		.get("https://jsonplaceholder.typicode.com/users", {
			/*params: {
				ID: 12345,
			},*/
		})
		.then(function (response) {
			console.log(response);
			setUsuarios(response.data);
			setCargando(false);
		})
		.catch(function (error) {
			console.log(error);
			setCargando(false);
		})
		}, []);

		if (cargando) {
    	return <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />;
  	}

	return(
		<div>
      <h2 className="mb-4">Lista de Usuarios</h2>


			<Link to="/usuarios/nuevo" className="btn btn-success mb-4">
				Agregar Usuario
			</Link>
      
			<Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
	);
    
}

export default Usuarios;
