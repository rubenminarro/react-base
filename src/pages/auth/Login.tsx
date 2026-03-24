import { useNavigate } from 'react-router-dom';
import { Form, Button, Image, Alert, Spinner } from "react-bootstrap";
import { useState } from 'react';
import { api } from '../../lib/api';
import logo from '../../assets/user-sign-in.png';
import { useAuthStore } from '../../store/useAuthStore';

const Login = () => {

    const setAuth = useAuthStore((state) => state.setAuth);

    interface LoginErrorResponse {
        success: boolean;
        status: number;
        message: string;
        errors: {
            email?: string[];
            password?: string[];
        };
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [serverErrors, setServerErrors] = useState<LoginErrorResponse['errors']>({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        
        e.preventDefault();

        setLoading(true);
        setServerErrors({});

        await api.get('/sanctum/csrf-cookie', { withCredentials: true });

        try {

            await api.get('/sanctum/csrf-cookie');
            
            const response = await api.post('/login', {
                email,
                password    
            });

            if (response.data.success) {
                
                const { user, token } = response.data.data;
                
                setAuth(user, token);

                navigate('/dashboard');
            }

        } catch (err: any) {
            
            const errorData: LoginErrorResponse = err.response?.data;

            if (errorData) {
                setServerErrors(errorData.errors);
            }
        } finally {
            setLoading(false);
        }

    };

    return (
        <div>
            
            <Image className="img-fluid mx-auto d-block mb-3" style={{ maxWidth: '180px', height: 'auto' }} src={logo} rounded />
            
            <h2 className="text-center mb-4">Por favor inicie sesión</h2>

            {Object.keys(serverErrors).length > 0 && <Alert variant="danger" className="py-2 small"><Alert.Heading className="text-center">Atención!</Alert.Heading></Alert>}
            
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                        required
                        type="email" 
                        placeholder="Ingrese su correo electrónico" 
                        value={email}
                        isInvalid={!!serverErrors.email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (serverErrors) setServerErrors({});
                        }}
                    />
                    <Form.Control.Feedback type="invalid">
                        {serverErrors.email && serverErrors.email[0]}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        required
                        type="password" 
                        placeholder="Ingrese su contraseña" 
                        value={password}
                        isInvalid={!!serverErrors.password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (serverErrors) setServerErrors({});
                        }}
                    />
                    <Form.Control.Feedback type="invalid">
                        {serverErrors.password && serverErrors.password[0]}
                    </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100" 
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                            />
                            Cargando...
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </Button>
                </div>
            </Form>
            
            <div className="text-center mt-3">
                <a href="#forgot" className="text-muted">Forgot password?</a>
            </div>
        </div>
    );

}

export default Login;