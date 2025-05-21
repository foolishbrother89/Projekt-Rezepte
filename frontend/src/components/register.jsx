import { Form, Button, Alert} from 'react-bootstrap';
import { useState } from 'react';

function Register() {

    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        //Hier Sende ich die Registrierungsform zum backend
        //Ich Teste aber erst ob was ankommen wird

        //Fragen: Schicke ich alles ins Backend?
        //1.Schritt: Werte aus der Form rauslesen (Die, die eingegeben wurden in den Inputfeldern)
        const username = e.target.elements.username.value;
        const name = e.target.elements.name.value;
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;

        //Hier kommt die Validierung der Werte

        //hier schicke ich die werte an /api/register per POST anfrage 
        //die adresse gibts noch nicht!
        try {
            const response = await fetch(`http://aiserver.mshome.net:3001/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, name, email, password }),
        });
        // Hier erwarte ich eine Antwort als String -> wandle es in JSON um und speichere das Objekt in data
        const data = await response.json();

        if (response.ok) {
            //reaktive Variable aktualisieren
            setMessage(data.message || 'Erfolgreich registriert!');
            //Ich schick die Daten zum testen erstmal zurück und schau ob diese ankommen
            console.log(data); 
        } else {
            //hmm was kann den noch schief laufen?
            console.log('Fehler bei der verbindung')
            //wird hier der index message ins data reingehangen? ich verstehe das noch nicht
            setMessage(data.message || 'Registrierung fehlgeschlagen');
        }
        } catch (error) {
            console.error("Fehler beim Regestrieren:", error);
            //reaktive Variable aktualisieren
            setMessage(data.message || `Fehler: ${response.status}`);
        }
        // Formular leeren
        e.target.reset(); 
    }


    return (
    <div>
        <div>
            <h1>Hier können Sie sich Registrieren</h1>
            {message && <Alert variant="success">{message}</Alert>}
        </div>


        <Form onSubmit={handleRegister}>

            <Form.Group className="mb-3" >
              <Form.Label>Benutzername</Form.Label>
              <Form.Control 
                type="text"
                name="username" 
                placeholder="Benutzernamen eingeben" />

              <Form.Text className="text-muted">
                Damit loggen Sie sich später ein. //Muss mindestens len 3 haben 
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text"
                name="name"
                placeholder="namen eingeben" />
            </Form.Group>


            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                placeholder="Enter email" />

              <Form.Text className="text-muted">
                Wir werden niemals Ihre E-Mail teilen
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password"
                name="password"
                placeholder="Password" />

              <Form.Text className="text-muted">
                Passwort muss mindestens eine längere von 3 haben // noch nicht gecodet
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password bestätigen</Form.Label>
              <Form.Control 
                type="password"
                name="password2"
                placeholder="Password" />

              <Form.Text className="text-muted">
                Passwort vergleich muss noch gecodet werden^^ aber wo?
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
                Registrieren
            </Button>
        </Form>
    </div>
    );
}

export default Register;