import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function PublicRezepte({ setRezeptID }) {
    // Debug code an oder ausmachen!
    const debug = true;

    // State für öffentliche Rezepte
    const [publicRezepte, setPublicRezepte] = useState([]);
   
    
    // Error State
    const [error, setError] = useState(null);

    // Navigation
    const navigate = useNavigate();

    // Öffentliche Rezepte beim Laden der Komponente holen
    useEffect(() => {
        fetchPublicRezepte();
    }, []);

    // Öffentliche Rezepte vom Backend holen (ohne Token)
    const fetchPublicRezepte = async () => {
        try {
            
            const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/PublicRezepte`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Kein Authorization Header - öffentliche Daten
            });

            const data = await response.json();
            
            // Debug Ausgabe
            if (debug) {
                console.log("API Response Public Rezepte:", data);
            }

            if (response.ok) {
                setPublicRezepte(data || []);
            } else {
                setError(data.message || 'Fehler beim Laden der öffentlichen Rezepte.');
            }
        } catch (error) {
            console.error('Fehler beim Laden der öffentlichen Rezepte:', error);
            setError('Netzwerkfehler beim Laden der öffentlichen Rezepte.');
        }
    };

    // Details anzeigen - Navigation zur Detailansicht
    const handleShowDetails = (rezeptID) => {
        setRezeptID(rezeptID);
        navigate('/deteilansicht');
    };
  return (
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h3 mb-0">Öffentliche Rezepte</h1>
            </div>
          </Col>
        </Row>

            {/* Error Alert */}
            {error && (
                <Row className="mb-3">
                    <Col>
                        <Alert variant="danger" dismissible onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    </Col>
                </Row>
            )}

        

            {publicRezepte.length === 0 ? (
                <Row>
                    <Col className="text-center py-5">
                        <p className="text-muted">Es gibt noch keine publice Rezepte.</p>
                    </Col>
                </Row>
            ) : (
                <Row >
                    {publicRezepte.map((rezept) => (
                        <Col key={rezept.id} xs={12} sm={6} md={4} lg={3} xl={2} className="mb-4">
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
                                </div>

                                <Card.Body className="d-flex flex-column">
                                    {/* Titel */}
                                    <Card.Title className="recipe-title text-truncate" title={rezept.titel}>
                                        {rezept.titel}
                                    </Card.Title>

                                    {/* Action Knöpfe */}
                                    <div className="mt-auto">
                                        <div className="d-grid gap-1">
                                            {/* Details Knopf onClick -> braucht die rezept ID ändert den state von receptID */}
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm"
                                                className="mb-1"
                                                onClick={() => handleShowDetails(rezept.id)}
                                              >
                                              Details
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>

  );
}
                

export default PublicRezepte;