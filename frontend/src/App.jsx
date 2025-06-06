import { useState, useEffect } from 'react'

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import './App.css'

import Home from './components/home';
import Register from './components/register';
import Login from './components/login';
import EigeneRezepte from './components/eigenerezepte';
import RezeptErstellen from './components/rezepterstellen';
import Deteilansicht from './components/deteilansicht';
import PublicRezepte from './components/publicrezepte';
import RezepteBearbeiten from './components/rezeptebearbeiten';





function App() {
  const [count, setCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem('token'))
  );
  
  // ich brauch die userId nicht -> die backend holt sich das in auth.js aus dem token
  const [userId, setUserId] = useState(
    localStorage.getItem('userId') || null
  );

  const navigate = useNavigate();

  // State für eigene Rezepte
  const [eigeneRezepte, setEigeneRezepte] = useState([]);

  // State für öffentliche Rezepte
  const [publicRezepte, setPublicRezepte] = useState([]);

  // Feld für den Aktuel angeklickten Rezept ID für die deteilansicht.jsx
  // Der Knopf Deteils befindet sich in eigenerezepte.jsx dort schicke ich den setter mit 
  const [rezeptID, setRezeptID] = useState(null);

  /* 
    Wenn die Seite neu geladen wird, verlieren wir den React-State 
    (isLoggedIn und userId werden zurückgesetzt).
    Der Local Storage behält zwar token und userId, aber deine App weiß nichts davon, 
    weil der State neu initialisiert wird.
    Deswegen brauchen wir diesen useEffect Hook
    Prüfen, ob ein Token und userId im Local Storage vorhanden ist
    Wenn ja aktualisiert isLoggedIn und userId
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');

    if (token && storedUserId) {
        setIsLoggedIn(true);
        setUserId(storedUserId);
    }
  },[navigate]);
  */

  // Logout löscht localStorage werte und setzt die reaktive Variable isLoggedIn 
  // zu false und navigiert zur startseite
  const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setUserId(null);
        navigate('/');
  };

  return (
    <>
      {/* Navigation mit React-Bootstrap Navbar */}
      <Navbar expand="lg" className="bg-body-tertiary fixed-top">
        <Container>
          {/* Brand-Logo/Link zur Startseite */}
          <Navbar.Brand as={Link} to="/">Wilkommen</Navbar.Brand>
          
          {/* Burger-Menü für mobile Ansicht */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          {/* Navigationslinks */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" activeKey={location.pathname}>
           
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              {/*Öffentliche Rezepte*/}
              <Nav.Link as={Link} to="/publicrezepte">Rezepte</Nav.Link>

              {/*Regestrieren*/}
              <Nav.Link as={Link} to="/register">Registrieren</Nav.Link>

              {/* 
                Wennn du eingelogt bist zeige link zu logout(ist aber nur ein Knopf der dich auslogt)
                wenn nicht: zeige link zu login
              */}
              {isLoggedIn ?
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                :
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              }
              {/* Wenn man eingeloggt ist soll in der Navleiste eigene Rezepte sichtbar werden */}
              {isLoggedIn && <Nav.Link as={Link} to="/eigenerezepte">Eigene Rezepte</Nav.Link>}

              {/*Erstellen*/}
              {isLoggedIn &&<Nav.Link as={Link} to="/rezepterstellen">Rezept Erstellen</Nav.Link>}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hauptinhalt der App */}
      <div className="app">
        <main>
          {/* React Router Konfiguration */}
          <Routes>
            {/* Route für die Startseite */}
            <Route path="/" 
                   element={
                   <Home count={count} 
                         setCount={setCount}
                   />} />
            
            {/* Route Registrieren */}
            <Route path="/register" 
                   element={<Register />} />

            {/* Route Login */}
            <Route path="/login" 
                   element={<Login
                      isLoggedIn={isLoggedIn} 
                      setIsLoggedIn={setIsLoggedIn}  />} />
            
            {/* Route eigeneRezepte */}
            <Route path="/eigenerezepte" 
                   element={<EigeneRezepte 
                      eigeneRezepte={eigeneRezepte}
                      setEigeneRezepte={setEigeneRezepte}
                      setRezeptID={setRezeptID}
                   />} />

            {/* Route Rezept erstellen */}
            <Route path="/rezepterstellen" 
                   element={<RezeptErstellen 
                   />} />

            {/* Route Deteilansicht - nicht sichtbar im Navlink */}
            <Route path="/deteilansicht" 
                   element={<Deteilansicht 
                      rezeptID={rezeptID}
                      eigeneRezepte={eigeneRezepte}
                      publicRezepte={publicRezepte}
                   />} />
            
            {/* Route Öffentliche Rezepte */}
            <Route path="/publicrezepte" 
                   element={<PublicRezepte 
                    setRezeptID={setRezeptID}
                    publicRezepte={publicRezepte}
                    setPublicRezepte={setPublicRezepte}
                   />} />
            
            {/* Route Rezepte bearbeiten -> nicht sichtber im Navlink 
                aber rezeptebearbeiten.jsx sollte diese route beinflussen können
                wie mach ich das?
            */}
            <Route path="/rezeptebearbeiten" 
                   element={<RezepteBearbeiten
                    rezeptID={rezeptID} 
                    eigeneRezepte={eigeneRezepte}
                    setEigeneRezepte={setEigeneRezepte}/>} />

          </Routes>
        </main>
                  
       
      </div>

    </>
  )
}

export default App
