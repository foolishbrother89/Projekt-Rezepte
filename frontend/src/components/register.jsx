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
        const password2 = e.target.elements.password2.value;

        // Passwortvalidierung
        // Stimmen Die Passwörter überein? 
        if (password !== password2) {
            setMessage('Passwörter stimmen nicht überein');
            e.target.elements.password.value = '';
            e.target.elements.password2.value = '';
            return;
        }
        // Ist das Passwort lang genug?
        if (password.length < 8) {
            setMessage('Passwort muss mindestens 6 Zeichen lang sein');
            e.target.elements.password.value = '';
            e.target.elements.password2.value = '';
            return;
        }

        if (!(hatZahl(password) && hatSonderzeichen(password) && hatGrossbuchstaben(password))){
            setMessage('Passwort muss ein Sonderzeichen und eine Zahl enthalten');
            e.target.elements.password.value = '';
            e.target.elements.password2.value = '';
            return;
        }

        function hatZahl(ps) {
            const zahlen = "0123456789";
            for (let zeichen of ps) {
                if (zahlen.includes(zeichen)) {
                    return true; // Zahl gefunden
                }
            }
            return false; // Keine Zahl gefunden
        }

        function hatSonderzeichen(ps) {
          const sonderzeichen = "!@#$%^&*()_+-=[]{}|;:,.<>?";
          for (let zeichen of ps) {
            if (sonderzeichen.includes(zeichen)) {
              return true; // Sonderzeichen gefunden
            }
          }
          return false; // Kein Sonderzeichen
        }

        function hatGrossbuchstaben(ps) {
          const grossbuchstaben = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          for (let zeichen of ps) {
            if (grossbuchstaben.includes(zeichen)) {
              return true;// Großbuchstabe gefunden
            }
          }
          return false;// Kein Großbuchstaben gefunden
        }

        //hier schicke ich die werte an /api/register per POST anfrage 
        try {
            const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/register`, {
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
                placeholder="Benutzernamen eingeben"
                required
                minLength={3}/>

              <Form.Text className="text-muted">
                Damit loggen Sie sich später ein. 
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text"
                name="name"
                placeholder="namen eingeben" 
                required
                minLength={3}/>
            </Form.Group>


            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                placeholder="Enter email" 
                required/>

              <Form.Text className="text-muted">
                Wir werden niemals Ihre E-Mail teilen
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password"
                name="password"
                placeholder="Password" 
                required/>

              <Form.Text className="text-muted">
                Passwort muss mindestens eine längere von 6 haben, 
                eine Zahl und ein Sonderzeichen enthalten
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password bestätigen</Form.Label>
              <Form.Control 
                type="password"
                name="password2"
                placeholder="Password" 
                required/>

            </Form.Group>

            <Button variant="primary" type="submit">
                Registrieren
            </Button>
        </Form>
    </div>
    );
}

export default Register;