import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { 
  Container,
  Nav,
  Alert,
  Button,
  Form 
} from 'react-bootstrap';

function RezeptErstellen(){

    // hier habe ich wie bei der registrierung ein inputformular in welchen ich ein Rezept erstelle
    // Sobald ich die inputs habe schicke ich an die Backend per POST an /api/rezepte die Werte
    // Aber irgendwie muss ich die user id mitschicken, weil dieser als fremdschlüssel in die recepie tabelle mit rein muss
        //Das heist ich sollte erst die authentifizierung zu ende machen, damit RezepteErstellen() die user id aus dem localstorage mitkrigt
        
    // oder aus localstorage? 

    // Token aus dem LocalStorage holen
    const token = localStorage.getItem('token');

    // Token decodieren
    const entschlüsselterToken = jwtDecode(token);
    const userId = entschlüsselterToken.id;

    const [titel, setTitel] = useState('')
    //weiß noch nicht wie ich die zutaten und zubereitung in der datenbank speichere 
    //aber ich kann erstmal ein array ins backend schicken
    const [zutaten, setZutaten] = useState([]) 
    const [zubereitung, setZubereitung] = useState([])
    const [bild, setBild] = useState(null)

    //alle inputs packe ich dan in eine formData und schicke es zum backend
    //dann muss ich schauen wie ich die Daten in Tabellen speichere -> späteres problem
    // Das ganze schicke ich dann als ein Objekt

    function rezeptObjectErstellen(){
        const formData = new FormData();
        formData.append('titel', titel);
        formData.append('zutaten', zutaten);
        formData.append('zubereitung', zubereitung);
        if (bild) {
            formData.append('bild', bild);
        }
        formData.append('user_id', userId);
        
        return formData;
    }



    return(
        <div>

            <div>
                <h1>Hier erstelle ich ein Rezept</h1>
                <h3>Id des Users : {userId}</h3>
            </div>

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Titel</Form.Label>
                    <Form.Control
                        type="text"
                        name="titel"
                        placeholder="Titel eingeben"
                        value={titel}
                        onChange={(e) => setTitel(e.target.value)}
                        required
                    />
                </Form.Group>
            </Form>

        </div>
    );
}

export default RezeptErstellen;