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

    // Token decodieren - ich brauche die userId als Fremdschlüssel
    const entschlüsselterToken = jwtDecode(token);
    const userId = entschlüsselterToken.id;

    const [titel, setTitel] = useState('')

    //zutaten 
    const [zutaten, setZutaten] = useState([{ 
        zutat: '',
        menge: '', 
        einheit: '' 
    }]);

    const [zubereitung, setZubereitung] = useState([''])

    //bild
    const [bild, setBild] = useState({
        dataURL: null,
        fileName: null
    });
    //Bildvorschau
    function fileHandler(event){
        // über das Event Objekt greifen wir auf die Datei zu
        // files ist ein FileList-Array, 
        // auch wenn nur eine Datei ausgewählt wird
        const file = event.target.files[0];
        //kein file da
        if (!file) {
            setBild({ 
                dataURL: null,
                fileName: null 
            });
            return;
        }
        //dateityp passend?
        if (!file.type.startsWith('image/')) {
            alert('Bitte nur Bilddateien (JPG/PNG/GIF) auswählen!');
            // Reset
            event.target.value = null;
            setBild({ 
                dataURL: null,
                fileName: null 
            });
            return;
        }

        //Wenn bid existent und format acceptierbar
        //Filereader Instanz / Teil des Browsers
        const fileLeser = new FileReader();

        //Ich brauche die dataURL ->
        //Wird ausgelöst, wenn die Datei vollständig geladen ist
        fileLeser.onload = (e) => {
            // e.target.result enthält die DataURL als Base64-String
            // Format: "data:image/png;base64,iVBORw0KGgo..."
            setBild({
                dataURL: e.target.result,
                fileName: file.name
            });
        };

        //Lesen starten
        fileLeser.readAsDataURL(file);

    }

    //alle inputs packe ich dan in eine formData und schicke es zum backend
    //dann muss ich schauen wie ich die Daten in Tabellen speichere -> späteres problem
    // Das ganze schicke ich dann als ein Objekt

    /*  
        Problem:
        FormData unterstützt keine Arrays direkt, weil es sich an einfachen Formulardaten orientiert
        Wenn wir versuchen, ein Array als Wert einzufügen, wird es in einen String umgewandelt
        Lösung:
        formData.append("data", JSON.stringify(array);
    */

    function rezeptObjectErstellen(){
        const formData = new FormData();
        formData.append('titel', titel);
        formData.append('zutaten', JSON.stringify(zutaten));
        formData.append('zubereitung', JSON.stringify(zubereitung));
        if (bild) {
            formData.append('bild', bild);
        }
        formData.append('user_id', userId);

        return formData;
    }
  
    //zutaten = {{zutat:Eier, menge:3, einheit: Anzahl},{zutat:Mehl, menge:300, einheit: Gramm}}


    const [neueZutat, setNeueZutat] = useState({ zutat: '', menge: '', einheit: '' });

    const addZutat = () => {
        if (neueZutat.zutat.trim() === '' || neueZutat.menge.trim() === '') {
            alert("Bitte alle Felder für die Zutat ausfüllen.");
            return;
        }
        setZutaten([...zutaten, neueZutat]);
        setNeueZutat({ zutat: '', menge: '', einheit: '' });
    };
   
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

                <Form.Group className="mb-3">
                  <Form.Label>Neue Zutat hinzufügen</Form.Label>
                    <div className="d-flex mb-2">
                        <Form.Control
                            placeholder="Zutat"
                            value={neueZutat.zutat}
                            onChange={(e) => setNeueZutat({ ...neueZutat, zutat: e.target.value })}
                        />
                        <Form.Control
                            placeholder="Menge"
                            value={neueZutat.menge}
                            onChange={(e) => setNeueZutat({ ...neueZutat, menge: e.target.value })}
                        />
                        <Form.Control
                            placeholder="Einheit"
                            value={neueZutat.einheit}
                            onChange={(e) => setNeueZutat({ ...neueZutat, einheit: e.target.value })}
                        />
                    </div>

                  {/* Button zum Hinzufügen einer neuen Zutat */}
                  <Button onClick={addZutat} variant="secondary">
                    Zutat hinzufügen
                  </Button>
                </Form.Group>

                <div>
                  <h5>Bisherige Zutaten:</h5>
                  <ul>
                    {zutaten.map((z, idx) => (
                      <li key={idx}>
                        {z.menge} {z.einheit} {z.zutat}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Bild hinzufügen */}
                <div>
                    <input 
                        type="file"
                        onChange={fileHandler} 
                        accept="image/*"
                    />

                {bild.dataURL && (
                    <div style={{ marginTop: '1rem' }}>
                        <h4>Bildvorschau:</h4>
                        <img 
                            src={bild.dataURL} 
                            alt="Ausgewähltes Bild"
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '300px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />

                        {/* Dateiname anzeigen */}
                        {bild.fileName && (
                            <p style={{ marginTop: '0.5rem', color: '#666' }}>
                                Dateiname: {bild.fileName}
                            </p>
                        )}

                        

                    </div>
                )}
                </div>


               

            </Form>

        </div>
    );
}

export default RezeptErstellen;