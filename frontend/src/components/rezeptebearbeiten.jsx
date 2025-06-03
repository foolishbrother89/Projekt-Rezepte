import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container,
  Alert,
  Button,
  Form,
  Row,
  Col
} from 'react-bootstrap';
/*
  rezeptID={rezeptID} 
  eigeneRezepte={eigeneRezepte}
  setEigeneRezepte={setEigeneRezepte}
  Hier brauche ich die rezepte ID und den Token
  ich übergebe die rezeptID und eigeneRezepte über App.jsx
  wenn ich dann Speicheren drücke soll die backend die Datenbank updaten
  mit den neuen bearbeitung
  und eigeneRezepte sollten auch geupdated werden mit setEigeneRezepte? notwendig? 
  Zutaten-Funktionen 
 */
function RezepteBearbeiten({rezeptID, eigeneRezepte, setEigeneRezepte}){
    
    const navigate = useNavigate();
    const [rezept, setRezept] = useState(null);
    const [error, setError] = useState(false);

    const [loading, setLoading] = useState(true);

    // Form States - wie in RezeptErstellen
    const [titel, setTitel] = useState('');
    const [zutaten, setZutaten] = useState([{ 
        zutat: '',
        menge: '', 
        einheit: ''  
    }]);
    const [zubereitung, setZubereitung] = useState(['']);
    const [bild, setBild] = useState({
        dataURL: null,
        fileName: null,
    });

    // Einheiten für Dropdown
    const einheiten = ['Gramm', 'Kilogramm', 'Liter', 'Milliliter', 'Teelöffel', 'Esslöffel', 'Tasse', 'Anzahl', 'Prise'];

    // Rezept laden und Form mit Daten füllen
    useEffect(() => {
        if (!eigeneRezepte || eigeneRezepte.length === 0) {
            setError('Keine Rezepte verfügbar');
            setLoading(false);
            return;
        } 

        // Finde das richtige Rezept
        function findRightRecepie(eigeneRezepte, rezeptID){
            for(const item of eigeneRezepte){
                if(item.id == rezeptID){
                    return item;
                }
            }
            return null;
        }

        const foundRezept = findRightRecepie(eigeneRezepte, rezeptID);
        
        if (foundRezept) {
            setRezept(foundRezept);
            
            // Form mit existierenden Daten füllen
            setTitel(foundRezept.titel || '');
            setZutaten(foundRezept.zutaten || [{ zutat: '', menge: '', einheit: '' }]);
            setZubereitung(foundRezept.zubereitung || ['']);
            
            // Wenn ein Bild vorhanden ist, zeige es an
            if (foundRezept.bildUrl) {
                setBild({
                    dataURL: foundRezept.bildUrl,
                    fileName: 'Aktuelles Bild',
                });
            }
            
            setLoading(false);
        } else {
            setError('Rezept nicht gefunden');
            setLoading(false);
        }
    }, [eigeneRezepte, rezeptID]);

    // zurück navigieren
    const handleGoBack = () => {
      navigate(-1);
    };

    // Bildhandling - wie in RezeptErstellen
    function fileHandler(event){
        const file = event.target.files[0];
        
        if (!file) {
            // Wenn kein neues Bild gewählt wird, behalte das alte
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            alert('Bitte nur Bilddateien (JPG/PNG/GIF) auswählen!');
            event.target.value = null;
            return;
        }

        const fileLeser = new FileReader();
        fileLeser.onload = (e) => {
            setBild({
                dataURL: e.target.result,
                fileName: file.name,
            });
        };
        fileLeser.readAsDataURL(file);
    }

   
    const addZutat = () => {
        setZutaten([...zutaten, { zutat: '', menge: '', einheit: 'Gramm' }]);
    };

    const updateZutat = (index, feld, wert) => {
        const neueZutaten = [...zutaten];
        neueZutaten[index] = { ...neueZutaten[index], [feld]: wert };
        setZutaten(neueZutaten);
    };

    const removeZutat = (index) => {
        if (zutaten.length > 1) {
            setZutaten(zutaten.filter((_, i) => i !== index));
        }
    };

    const addZubereitungsschritt = () => {
        setZubereitung([...zubereitung, '']);
    };

    const updateZubereitungsschritt = (index, wert) => {
        const neueZubereitung = [...zubereitung];
        neueZubereitung[index] = wert;
        setZubereitung(neueZubereitung);
    };

    const removeZubereitungsschritt = (index) => {
        if (zubereitung.length > 1) {
            setZubereitung(zubereitung.filter((_, i) => i !== index));
        }
    };

    // Hilfsfunktionen für Rendering
    function erstelleEinheitenOptionen() {
        return einheiten.map(einheit => (
            <option key={einheit} value={einheit}>
                {einheit}
            </option>
        ));
    }

    function erstelleZutatenFelder() {
        return zutaten.map((zutat, index) => (
            <Form.Group key={index} className="mb-3">
                <div className="d-flex align-items-center gap-2">
                    <Form.Control
                        className="flex-grow-1"
                        placeholder={`Zutat ${index + 1}`}
                        value={zutat.zutat}
                        onChange={(e) => updateZutat(index, 'zutat', e.target.value)}
                    />
                    <Form.Control
                        className="flex-shrink-1"
                        style={{ width: '25%' }}
                        placeholder="Menge"
                        value={zutat.menge}
                        onChange={(e) => updateZutat(index, 'menge', e.target.value)}
                    />
                    <Form.Select
                        className="flex-shrink-1"
                        style={{ width: '30%' }}
                        value={zutat.einheit}
                        onChange={(e) => updateZutat(index, 'einheit', e.target.value)}
                    >
                        {erstelleEinheitenOptionen()}
                    </Form.Select>
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

    // Rezept aktualisieren
    const handleUpdateRecepie = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        const formData = new FormData();
        
        formData.append('titel', titel);
        formData.append('zutaten', JSON.stringify(zutaten));
        formData.append('zubereitung', JSON.stringify(zubereitung));
        
        // Nur neues Bild anhängen, wenn eins ausgewählt wurde
        if (bild.file) {
            formData.append('bild', bild.file);
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/RezeptBearbeiten`, {
                method: 'PUT', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert('Rezept erfolgreich aktualisiert!');
                
                // Lokale Rezeptliste aktualisieren
                if (setEigeneRezepte) {
                    setEigeneRezepte(prevRezepte => 
                        prevRezepte.map(r => 
                            r.id === rezeptID ? { ...r, titel, zutaten, zubereitung } : r
                        )
                    );
                }
                
                // Zurück navigieren
                navigate(-1);
            } else {
                setError(data.message || 'Fehler beim Aktualisieren des Rezepts.');
            }
        } catch (error) {
            setError('Netzwerkfehler beim Aktualisieren.');
        }
    };

    // Loading State
    if (loading) {
        return (
            <div>
                <h1>Rezept wird geladen...</h1>
            </div>
        );
    }

    // Error State
    if (error && !rezept) {
        return (
            <div>
                <h1>Fehler beim Laden des Rezepts</h1>
                <Alert variant="danger">{error}</Alert>
                <Button variant="outline-secondary" onClick={handleGoBack}>
                    Zurück
                </Button>
            </div>
        );
    }

    return(
        <div>
            {/* Seiten Titel */}
            <div>
                <h1>Rezept bearbeiten: {rezept?.titel}</h1>
            </div>

            {/* Header mit Zurück-Button */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex align-items-center gap-3">
                        <Button 
                            variant="outline-secondary" 
                            onClick={handleGoBack}
                        >
                            Zurück
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Error Anzeige */}
            {error && (
                <Alert variant="danger" className="mb-3">
                    {error}
                </Alert>
            )}

            <Form onSubmit={handleUpdateRecepie}>
                {/* Titel */}
                <Form.Group className="mb-3">
                    <Form.Label>Titel *</Form.Label>
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
                        Zubereitungsschritt hinzufügen
                    </Button>
                </Form.Group>

                {/* Bild */}
                <div>
                    <p>Bild (optional - leer lassen um aktuelles Bild zu behalten)</p>
                </div>
                <div>
                    <input 
                        type="file"
                        onChange={fileHandler} 
                        accept="image/*"
                    />
                    
                    {/* Bildvorschau */}
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
                            {bild.fileName && (
                                <p style={{ marginTop: '0.5rem', color: '#666' }}>
                                    {bild.fileName}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <br />
                <div>
                    <Button variant="primary" type="submit" size="m">
                        Rezept aktualisieren
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default RezepteBearbeiten;