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
// Zutaten Begin
//###########################################################################################################################
    // zutaten 
    const [zutaten, setZutaten] = useState([{ 
        zutat: '',
        menge: '', 
        einheit: ''  
    }]);
    // So sollen Zutaten aussehen:
    // zutaten = {{zutat:Eier, menge:3, einheit: Anzahl},{zutat:Mehl, menge:300, einheit: Gramm}}

    // Einheiten für Dropdown
    const einheiten = ['Gramm', 'Kilogramm', 'Liter', 'Milliliter', 'Teelöffel', 'Esslöffel', 'Tasse', 'Anzahl', 'Prise'];
    
    // Hilfsfunktion: Einheiten-Optionen erstellen 
    function erstelleEinheitenOptionen() {
        const optionen = [];
        for (let i = 0; i < einheiten.length; i++) {
            optionen.push(
                <option key={einheiten[i]} value={einheiten[i]}>
                    {einheiten[i]}
                </option>
            );
        }
        return optionen;
    }

    // Zutat hinzufügen modern
    const addZutat = () => {
        setZutaten([...zutaten, { zutat: '', menge: '', einheit: 'Gramm' }]);
    };


    // Zutat aktualisieren modern
    const updateZutat = (index, feld, wert) => {
        const neueZutaten = [...zutaten];
        neueZutaten[index] = { ...neueZutaten[index], [feld]: wert };
        setZutaten(neueZutaten);
    };

    // Zutat entfernen nodern
    const removeZutat = (index) => {
        if (zutaten.length > 1) {
            setZutaten(zutaten.filter((_, i) => i !== index));
        }
    };

    // Hilfsfunktion: Zutaten-Felder erstellen
    function erstelleZutatenFelder() {
        return zutaten.map((zutat, index) => (
            <Form.Group key={index} className="mb-3">
                <div className="d-flex align-items-center gap-2">
                    {/* Zutatenname */}
                    <Form.Control
                        className="flex-grow-1"
                        placeholder={`Zutat ${index + 1}`}
                        value={zutat.zutat} 
                        onChange={(e) => updateZutat(index, 'zutat', e.target.value)}
                    />

                    {/* Menge */}
                    <Form.Control
                        className="flex-shrink-1"
                        style={{ width: '25%' }}
                        placeholder="Menge"
                        value={zutat.menge} 
                        onChange={(e) => updateZutat(index, 'menge', e.target.value)}
                    />

                    {/* Einheit */}
                    <Form.Select
                        className="flex-shrink-1"
                        style={{ width: '30%' }}
                        value={zutat.einheit} 
                        onChange={(e) => updateZutat(index, 'einheit', e.target.value)}
                    >
                        {erstelleEinheitenOptionen()}
                    </Form.Select>

                    {/* Löschen-Button */}
                    <Button 
                        className="flex-shrink-0"
                        variant="outline-danger" 
                        size="sm"
                        style={{ width: '80px' }}
                        onClick={() => removeZutat(index)}
                        disabled={zutaten.length === 1}
                    >
                        Löschen
                    </Button>
                </div>
            </Form.Group>
        ));
    }
// Zutaten Ende
//###########################################################################################################################

// Zubereitung Ende
//###########################################################################################################################
    
    // Zubereitung als Array von Schritten
    const [zubereitung, setZubereitung] = useState(['']);

     // Zubereitungsschritt hinzufügen modern
    const addZubereitungsschritt = () => {
        setZubereitung([...zubereitung, '']);
    };

    // Zubereitungsschritt aktualisieren modern
    const updateZubereitungsschritt = (index, wert) => {
        const neueZubereitung = [...zubereitung];
        neueZubereitung[index] = wert;
        setZubereitung(neueZubereitung);
    };

    // Zubereitungsschritt entfernen modern
    const removeZubereitungsschritt = (index) => {
        if (zubereitung.length > 1) {
            setZubereitung(zubereitung.filter((_, i) => i !== index));
        }
    };

    // Zubereitungsschritte-Felder erstellen
    const erstelleZubereitungsFelder = () => (
        zubereitung.map((schritt, index) => (
            <Form.Group key={index} className="mb-3">
                <div className="d-flex align-items-start gap-2">
                    <Form.Label className="pt-2" style={{ minWidth: '60px' }}>
                        {index + 1}.
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        className="flex-grow-1"
                        placeholder={`Zubereitungsschritt ${index + 1}`}
                        value={schritt}
                        onChange={(e) => updateZubereitungsschritt(index, e.target.value)}
                        required
                    />
                    <Button 
                        className="flex-shrink-0"
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => removeZubereitungsschritt(index)}
                        disabled={zubereitung.length === 1}
                    >
                        Löschen
                    </Button>
                </div>
            </Form.Group>
        ))
    );
// Zubereitung Ende
//###########################################################################################################################
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

                {/* Zutaten */}
                <Form.Group className="mb-3">
                    <Form.Label>Zutaten *</Form.Label>
                    {erstelleZutatenFelder()}
                    <Button onClick={addZutat} variant="outline-primary" size="sm">
                        Zutat hinzufügen
                    </Button>
                </Form.Group>

                {/* Zubereitung */}
                <Form.Group className="mb-4">
                    <Form.Label>Zubereitung *</Form.Label>
                    {erstelleZubereitungsFelder()}
                    <Button onClick={addZubereitungsschritt} variant="outline-primary" size="sm">
                        + Zubereitungsschritt hinzufügen
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