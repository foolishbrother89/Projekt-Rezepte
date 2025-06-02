import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



function EigeneRezepte({eigeneRezepte, setEigeneRezepte, setRezeptID }){

    // Hier sollen die eigenen Rezepte angezeigt werden 
    // Also frage ich die backend: hole mir alle rezepte von diesem user
    // dann zeige ich diese

    // Erstellen Knopf verlinkt zu rezepteerstellen.jsx?
    
    // Jedes Element in der Liste hat -> Die Liste wird später zu Karten gemacht
            // eine Detailansicht Knopf  -> Verlinkung zu deteilansicht.jsx
            // einen Veröfentlichen Knopf -> noch keine idee wie das funktionieren soll - Die veröffentlichten Rezepte haben nur ein Deteilansicht Knopf
            // einen Lösch Knopf -> DELETE anfrage an die Backend user id muss mitgeschickt werden
            // einen Bearbeiten Knopf -> wiederverwendung von der erstellen form?

    //Debug code an oder ausmachen!
    const debug = true;

    // Rezepte werden geladen
    const [loading, setLoading] = useState(true);


// Rezepte anfragen an die backend
//########################################################################################################################################################
    
    // Feld für Error
    const [error, setError] = useState(null);

    // Rezepte beim Laden der Komponente holen
    useEffect(() => {
      fetchEigeneRezepte();
    }, []);

    // Rezepte vom Backend holen
    const fetchEigeneRezepte = async () => {
      try {
        // User eingelogt?
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Sie müssen eingeloggt sein, um Ihre Rezepte zu sehen.');
          return;
        }

        // 
        const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/eigene-rezepte`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        // Was kommt an?
        if(debug){
            console.log("API Response:", data);
        }
        /*
        Beispiel was in data ankommt

        */ 

        
        if (response.ok) {
            setEigeneRezepte(data || []);
        } else {
          setError(data.message || 'Fehler beim Laden der Rezepte.'); //Der Fallback || wenn es kein data.message gibt dann nutze den string
        }
      } catch (error) {
        setError('Netzwerkfehler beim Laden der Rezepte.');
      }
    };

// Rezepte anfragen Ende
//########################################################################################################################################################

// Deteilseite Verlinkung
//########################################################################################################################################################  
    const navigate = useNavigate();
    // Plan: ich verlagere die reaktive Variable eigeneRezepte nach App.jsx
    // und noch eine rezeptId, welche ich beide an diese Komponente mit settern mitsende
    const handleShowDetails = (rezeptID) =>{
        // Setze die reaktive Variable const [rezeptID, setRezeptID] = useState(null);
        setRezeptID(rezeptID);
        // Jetzt nutze ich useNavigate um zu deteilansicht.jsx zu kommen 
        // Wie mache ich das rooting, so das es uber App.jsx genutzt wird
        navigate('/deteilansicht')
    }
// Deteilseite Ende
//########################################################################################################################################################
    
    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="h3 mb-0">Meine Rezepte</h1>
                        {/* Button  Neues Rezept erstellen variant="success" 
                        braucht noch einen onClick Verlinkung zu rezepterstellen.jsx über App.jsx*/}
                        <Button variant="success" size="sm">
                            + Neues Rezept erstellen
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Error */}
            {error && (
                <Row className="mb-3">
                    <Col>
                        <Alert variant="danger" dismissible onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    </Col>
                </Row>
            )}

            {/* Wenn es Rezepte gibt, dann Erstelle die Karten, 
            wenn nicht Text: Sie haben noch keine Rezepte erstellt. */}
            {eigeneRezepte.length === 0 ? (
                <Row>
                    <Col className="text-center py-5">
                        <p className="text-muted">Sie haben noch keine Rezepte erstellt.</p>
                        <Button variant="primary">Erstes Rezept erstellen</Button>
                    </Col>
                </Row>
            ) : (
                <Row>
                    {eigeneRezepte.map((rezept) => (
                        <Col key={rezept.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                            <Card className="h-100 shadow-sm recipe-card">
                                {/* Rezept Bild */}
                                <div className="recipe-image-container">
                                    {rezept.bild_url ? (
                                        <Card.Img 
                                            variant="top" 
                                            src={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${rezept.bild_url}`}
                                            alt={rezept.titel}
                                            className="recipe-image"
                                        />
                                    ) : (
                                        <div className="recipe-placeholder d-flex align-items-center justify-content-center">
                                            <span className="text-muted">Kein Bild</span>
                                        </div>
                                    )}
                                    
                                    {/* Status Badge im custom CSS absolute Position oben Rechts*/}
                                    <div className="recipe-status-badge">
                                        <Badge 
                                            bg={rezept.public ? 'success' : 'secondary'}
                                            className="small"
                                        >
                                            {rezept.public ? '📍 Öffentlich' : '🔒 Privat'}
                                        </Badge>
                                    </div>
                                </div>

                                <Card.Body className="d-flex flex-column">
                                    {/* Titel */}
                                    <Card.Title className="recipe-title text-truncate" title={rezept.titel}>
                                        {rezept.titel}
                                    </Card.Title>

                                    {/* Action Knöpfe */}
                                    <div className="mt-auto">
                                        <div className="d-grid gap-1">
                                            {/* Details Knopf onClick -> braucht die rezept ID ändert den state von receptID in App.jsx (muss ich noch implementieren)
                                              ruft eine neue componente deteilansicht.jsx (muss ich auch noch machen)
                                            */}
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm"
                                                className="mb-1"
                                                onClick={() => handleShowDetails(rezept.id)}
                                              >
                                              Details
                                            </Button>

                                            {/* Bearbeiten Knopf onClick -> 
                                            wieder je nach rezept ID verlinkung zu rezeptbearbeiten.jsx verlinkt
                                            mach ich das so? muss ich noch überlegen */}
                                            <Button 
                                                variant="outline-secondary" 
                                                size="sm"
                                                className="mb-1"
                                              >
                                              Bearbeiten
                                            </Button>
                                        
                                            {/* Veröffentlichn Knopf macht eine Backend anfrage der soll mal den wert in public zu 1 setzen*/}
                                            <Button 
                                                variant={rezept.public ? "outline-warning" : "outline-success"}
                                                size="sm"
                                                className="mb-1"
                                                onClick={() => handleTogglePublic(rezept.id, rezept.public)}
                                              >
                                              {rezept.public ? 'Verstecken' : 'Veröffentlichen'}
                                            </Button>
                                          
                                            {/* Lösch knopf an die Backend -> der Soll mal bitte das Rezept in der datenbank Löschen */}
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDelete(rezept.id)}
                                            >
                                                🗑️ Löschen
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Custom CSS Styles */}
            <style jsx>{`
                .recipe-card {
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                    border: 1px solid #e0e0e0;
                }
                
                .recipe-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                }
                
                .recipe-image-container {
                    position: relative;
                    height: 180px;
                    overflow: hidden;
                }
                
                .recipe-image {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
                
                .recipe-card:hover .recipe-image {
                    transform: scale(1.05);
                }
                
                .recipe-placeholder {
                    width: 100%;
                    height: 180px;
                    background-color: #f8f9fa;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .recipe-status-badge {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    z-index: 1;
                }
                
                .recipe-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 0.5rem;
                    line-height: 1.3;
                }
                
                .recipe-meta {
                    border-bottom: 1px solid #f0f0f0;
                    padding-bottom: 0.5rem;
                }
                
                @media (max-width: 576px) {
                    .recipe-image-container {
                        height: 150px;
                    }
                    
                    .recipe-image {
                        height: 150px;
                    }
                    
                    .recipe-placeholder {
                        height: 150px;
                    }
                }
            `}</style>
        </Container>
    );
}

export default EigeneRezepte;