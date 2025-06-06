import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';

function Deteilansicht({ eigeneRezepte, rezeptID, publicRezepte }) {
  const navigate = useNavigate();
  const [rezept, setRezept] = useState(null);
  const [error, setError] = useState(false);

  // Der Effekt wird nur dann erneut ausgeführt, wenn sich mindestens eine der Abhängigkeiten geändert hat:
  //  }, [eigeneRezepte, rezeptID]);
  useEffect(() => {
    //Finde den richtigen Rezept
    function findRightRecepie(eigeneRezepte, rezeptID){
        for(const item of eigeneRezepte){
            if(item.id == rezeptID){
                return item;
            }
        }
    }
    // Suche nach dem Rezept mit passender ID
    let foundRezept = findRightRecepie(eigeneRezepte, rezeptID)
    // Falls nicht gefunden, in öffentlichen Rezepten suchen
    if (!foundRezept && (publicRezepte.length > 0)) {
      foundRezept = findRightRecepie(publicRezepte,rezeptID);
    }

    if (foundRezept) {
      setRezept(foundRezept);
    } else {
      setError(true);
    }
  }, [eigeneRezepte,publicRezepte, rezeptID]);



  // zurück navigieren
  const handleGoBack = () => {
    navigate(-1);
  };

  // wenn error
  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          <Alert.Heading>Rezept nicht gefunden</Alert.Heading>
          <p>Das angeforderte Rezept konnte nicht gefunden werden.</p>
          <Button variant="outline-secondary" onClick={handleGoBack}>
            Zurück
          </Button>
        </Alert>
      </Container>
    );
  }
  // Rezept noch nicht geladen - wie teste ich das?
  if (!rezept) {
    return (
      <Container className="py-4 text-center">
        <p>Lade Rezeptdaten...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3">
            <Button 
              variant="outline-secondary" 
              onClick={handleGoBack}
            >
              Zurück
            </Button>
            <h1 className="h2 mb-0">{rezept.titel}</h1>
            <Badge bg={rezept.public ? 'success' : 'secondary'}>
              {rezept.public ? '📍 Öffentlich' : '🔒 Privat'}
            </Badge>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Bild */}
        <Col md={6} className="mb-4">
          <Card>
            {rezept.bild_url ? (
              <Card.Img 
                variant="top" 
                src={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${rezept.bild_url}`}
                alt={rezept.titel}
                style={{ height: '400px', objectFit: 'cover' }}
              />
            ) : (
              <div 
                className="d-flex align-items-center justify-content-center bg-light"
                style={{ height: '400px' }}
              >
                <span className="text-muted fs-4">Kein Bild verfügbar</span>
              </div>
            )}
          </Card>
        </Col>

        {/* Zutaten */}
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h3 className="h4 mb-0"> Zutaten</h3>
            </Card.Header>
            <Card.Body>
              {rezept.zutaten && rezept.zutaten.length > 0 ? (
                <ul className="list-unstyled">
                  {rezept.zutaten.map((zutat, index) => (
                    <li key={index} className="mb-2 d-flex align-items-center">
                      <span className="me-2">•</span>
                      <strong>{zutat.menge}</strong>
                      <span className="mx-1">{zutat.einheit}</span>
                      <span>{zutat.zutat}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Keine Zutaten angegeben.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        {/* Zubereitung */}
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h3 className="h4 mb-0"> Zubereitung</h3>
            </Card.Header>
              <Card.Body>
                  {rezept.zubereitung?.length > 1 ? (
                    <ul className="list-unstyled">
                      {rezept.zubereitung.map((zub, index) => (
                        <li key={index} className="mb-2 d-flex align-items-center">
                          <span className="me-2">•</span>
                          <span>{zub}</span>
                        </li>
                      ))}
                    </ul>
                  ) : rezept.zubereitung?.length === 1 ? (
                    <ul className="list-unstyled">
                      <li className="mb-2 d-flex align-items-center">
                        <span className="me-2"></span>
                        <span>{rezept.zubereitung[0]}</span>
                      </li>
                    </ul>
                  ) : (
                    <p className="text-muted">
                      Keine Zubereitung angegeben.
                    </p>
                  )}
              </Card.Body>
          </Card>
        </Col>
         
      </Row>

    </Container>
  );
}

export default Deteilansicht;