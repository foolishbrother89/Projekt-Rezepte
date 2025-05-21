import { useState } from "react";
import { Form, Button, Alert } from 'react-bootstrap';

function Login({isLoggedIn, setIsLoggedIn}){
    const [messageLogin, setMessage] = useState('');

    // Erstmal Fakeanmeldung 
    const handleSubmit = (e) =>{
        setIsLoggedIn(true);
        setMessage(e.target.elements.username.value);
    }
    return(
        <div className="mt-4">
        <h3>{isLoggedIn ? 'Willkommen zurück!' : 'Bitte einloggen'}</h3>
        {messageLogin && <Alert variant="success">{messageLogin}</Alert>}
 
        {!isLoggedIn && (
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                <Form.Label>Benutzername</Form.Label>
                <Form.Control
                    type="text"
                    name="username"
                    placeholder="Benutzernamen eingeben"
                    required
                />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Passwort</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    placeholder="Passwort eingeben"
                    required
                />
                </Form.Group>
                <Button variant="primary" type="submit">
                Anmelden
                </Button>
            </Form>
        )}
        </div>
    )
}

export default Login;