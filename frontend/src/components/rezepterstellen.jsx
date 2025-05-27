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
    const [zutaten, setZutaten] = useState(['']) 
    const [zubereitung, setZubereitung] = useState([''])
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
    //Überlegung wie zutaten in der Datenbank gespeichert werden soll:
    //zutaten = {{zut:eier, men:3},{zut:mehl, men: 20g}}
    
    //Oder So?:
    //zutaten = {{eier: 3}, {mehl: 20mg}}


    //Problem: 
    // Wie schreibe ich die Form für zutaten, so das man nach beliben mehrere eingeben kann?
    
    
    // Wie speichere ich ein Array in eine reaktive Variable?

    const addZutat = () => {
      const neueZutaten = [];
      for (let i = 0; i < zutaten.length; i++) {
        neueZutaten.push(zutaten[i]);
      }
      neueZutaten.push('');
      setZutaten(neueZutaten);
    };

    // Eine bestehende Zutat aktualisieren
    const updateZutat = (index, neueZutat, neueMenge) => {
      const neueZutaten = [];
      const eineZutat = {};
      
      eineZutat.neueZutat = neueMenge;


      for (let i = 0; i < zutaten.length; i++) {
        if (i === index) {
          neueZutaten.push(eineZutat); // Aktualisierten Wert einfügen
        } else {
          neueZutaten.push(zutaten[i]); // da keine neuen zutaten da sind geben wir die zutaten zurück die es im zutatenObject schon gibt
        }
      }
      setZutaten(neueZutaten);
    };
    //testen 
    console.log(zutaten);

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
                  <Form.Label>Zutaten</Form.Label>

                  {/* Dynamisch alle Zutaten anzeigen */}
                  {(() => {
                    const felder = [];
                    for (let i = 0; i < zutaten.length; i++) {
                      felder.push(
                        <div key={i} className="d-flex mb-2">
                          <Form.Control
                            value={zutaten[i]}
                            //onChange={(e) => updateZutat(i, e.target.value)}
                            placeholder={`Zutat ${i + 1}`}
                          />
                          <Form.Control
                            value={zutaten[i]}
                            //onChange={(e) => updateZutat(i, e.target.value)}
                            placeholder={`Zutat ${i + 1}`}
                          />
                        </div>
                      );
                    }
                    return felder;
                  })()}

                  {/* Button zum Hinzufügen einer neuen Zutat */}
                  <Button onClick={addZutat} variant="secondary">
                    + Zutat hinzufügen
                  </Button>
                </Form.Group>
                <div>
                    <h1>test</h1>
                    <h3>zutaten : {zutaten}</h3>
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