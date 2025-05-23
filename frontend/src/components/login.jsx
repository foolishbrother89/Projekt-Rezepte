import { useState } from "react";
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Login({isLoggedIn, setIsLoggedIn}){
    const [messageLogin, setMessage] = useState('');

    // useNavigate() kann nicht direkt in Event-Handlern oder 
    // anderen verschachtelten Funktionen aufrufen.
    // useNavigate() ist ein Hook, diese dürfen nur auf der obersten Ebene einer Komponente 
    // (nicht in Schleifen, Bedingungen oder verschachtelten Funktionen) aufgerufen werden.
    const navigate = useNavigate();

    const handleSubmit = async(e) =>{
        e.preventDefault();
        
        const username = e.target.elements.username.value;
        const password = e.target.elements.password.value;
        //Jetzt muss ich die backend fragen, ob es diesen benutzer kennt
        try {
            const response = await fetch(`http://aiserver.mshome.net:3001/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            //Hier kommt die Antwort
            const data = await response.json();

            if (response.ok) {
                setIsLoggedIn(true);
                localStorage.setItem('token', data.token); // Speichert das Token
                //userId ist schon in der Payload ich schicke es auch nicht mehr seperat mit,
                //ich werde die id bei Bedarf decodieren
                //localStorage.setItem('userId', data.userId);  // userId speichern
                setMessage('Erfolgreich eingeloggt!');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setMessage(data.message || 'Login fehlgeschlagen');
            }
        } catch (error) {
            console.error("Fehler beim Login:", error);
            setMessage("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        }
        e.target.reset();
    }

    return (
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