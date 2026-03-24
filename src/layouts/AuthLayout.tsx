import { Outlet } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AuthLayout = () => {
    return (
        <Container className="mt-5" >
            <Row className="justify-content-md-center">
                <Col xs={12} md={6} lg={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Outlet /> 
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AuthLayout;