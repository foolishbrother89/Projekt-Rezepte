import { Form, Button} from 'react-bootstrap';

function Register() {

    const handleRegister = async (e) => {
        e.preventDefault();
        //Hier Sende ich die Registrierungsform zum backend
        //Ich Teste aber erst ob was ankommen wird
    }


    return (
        <Form onSubmit={handleRegister}>

            <Form.Group className="mb-3" >
              <Form.Label>Benutzername</Form.Label>
              <Form.Control 
                type="text"
                name="benutzername" 
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
    );
}

export default Register;